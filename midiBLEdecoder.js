parserMessage         = [];
let runningStatus;
let thirdByteFlag;

let prevReturnedTimestamp;
let prevReceivedTimestamp;
let connTimePrevious;
let firstMessageReceived = true;


function parseMidiByte(currentByte) {
  if ((currentByte >> 7) === 1) {
    /** Current byte is statusbyte */
		runningStatus = currentByte;
		thirdByteFlag = false;

    if (((currentByte >> 7) === 1) && ((currentByte >> 3) === 0b11111)) {
      /** System Real-Time Messages */
      parserMessage[0] = currentByte;
      return parserMessage;
    }

    /** Message with only one byte */
		if ((currentByte >> 2) === 0b111101) {
			if(currentByte === 0xF7) {
				/** End of exclusive, not supported. Discarded for now.  */
				return;
			}
      parserMessage[0] = currentByte;

			return parserMessage;
		}
		return false;
  }

  if (thirdByteFlag === true) {
		/** Expected third, and last, byte of message */
		thirdByteFlag = false;
		parserMessage[2] = currentByte;
		return parserMessage;
	}

  if (runningStatus === 0) {
		/** System Exclusive (SysEx) databytes, from 3rd byte until EoX, or
		 * orphaned databytes. */
		return;
	}

  /** Channel Voice Messages */
	switch (runningStatus >> 4) {
    case 0x8:
    case 0x9:
    case 0xA:
    case 0xB:
    case 0xE:
      thirdByteFlag = true;
      parserMessage[0] = runningStatus;
      parserMessage[1] = currentByte;
      return;
    case 0xC:
    case 0xD:
      parserMessage[0] = runningStatus;
      parserMessage[1] = currentByte;
      return parserMessage;
    }

    	/** System Common Message */
	switch (runningStatus) {
    case 0xF2:
      thirdByteFlag = true;
      parserMessage[0] = runningStatus;
      parserMessage[1] = currentByte;
      runningStatus = 0;
      return parserMessage;
    case 0xF1:
    case 0xF3:
      thirdByteFlag = false;
      parserMessage[0] = runningStatus;
      parserMessage[1] = currentByte;
      runningStatus = 0;
      return parserMessage;
    case 0xF0:
      break;
    }
  
    runningStatus = 0;
    return;
}


function convertTimestamp(timestampBLE, connTime) {
  if (firstMessageReceived) {
    firstMessageReceived = false;

    connTimePrevious      = connTime;
    prevReceivedTimestamp = timestampBLE;
    prevReturnedTimestamp = connTime;

    return 0;
  }

  let trueTSInterval  = (((timestampBLE - prevReceivedTimestamp) & 8191)
                      + Math.round((((connTime - connTimePrevious) 
                      - ((timestampBLE - prevReceivedTimestamp) & 8191))) 
                      / 8192)
                      * 8192);

  let addedDelay = (trueTSInterval - (connTime - prevReturnedTimestamp));
  if (addedDelay < 0) {
		addedDelay = 0;
	}

  connTimePrevious	    = connTime;
	prevReceivedTimestamp	= timestampBLE;
	prevReturnedTimestamp = performance.now() + addedDelay;

  return addedDelay;
}


function bleMIDIrx(blepacket) {
  console.log('BLE-in: ' + blepacket);

  midiMessage         = [];
  let connTime = performance.now();
  let currentByte;

  let nextIsNewTimestamp = false;

  let timestampBLE = (blepacket[1] & 0x7F) + (((blepacket[0] & 0x3F) << 7));
  let delay = convertTimestamp(timestampBLE, connTime);

  /** Check messages in package. */
  for (pos = 2; pos < blepacket.length; pos++) {
    currentByte = blepacket[pos];

    /** Check MSB and expectations to ID current byte as timestamp,
		 * statusbyte or databyte */
		if ((currentByte >> 7) && (nextIsNewTimestamp)) {
        /** New Timestamp means last message is complete */
        nextIsNewTimestamp  = false;

        if ((currentByte & 0x7F) < (timestampBLE & 0x7F)) {
          /** Timestamp overflow, increment Timestamp High */
          timestampBLE += 1 << 7;
        }
  
        /** Storing newest timestamp for later reference, and translating
         * timestamp to local time */
        timestampBLE =	((currentByte & 0x7F) + (timestampBLE & 0x1F80));
        delay = convertTimestamp(timestampBLE, connTime);
  
        if(midiMessage === undefined) {
          /** Previous message was not complete */
          console.log('Incomplete message: pos ' + pos);
        }

    } else {
        /** Statusbytes and databytes */
			  nextIsNewTimestamp  = true;

        midiMessage = parseMidiByte(currentByte)
        if (midiMessage) {
          /** Message completed */
          parserMessage         = [];
          playMIDImessage(midiMessage, delay);
        }
    }
  }
}

/** Sends MIDI-messages
 * There are some issues with an Uncaught RangeError, 
 * someone who actually knows what they're doing should look into this. */
function playMIDImessage(midiMessage, delay) {
    let timestamp = (performance.now()+delay);
    console.log('MIDI Message @' + (timestamp&8191) + ': ' + midiMessage);
    synth.send(midiMessage, timestamp);
    mididecoder(midiMessage, (timestamp&8191));
}