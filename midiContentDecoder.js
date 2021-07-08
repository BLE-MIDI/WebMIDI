/** This function is only used for printing messages out on the page- */
function mididecoder(midiMessage,timeStamp){
  let noteString = "";

  switch(midiMessage[0] >>> 4) {
    case 0b1000:  // Note off
      noteString = noteNamer(midiMessage[1]);
      printToConsole(noteString.trimRight(6) + ' Off. @ Velocity: ' + pad(midiMessage[2],3) + '..| Channel: ' + pad((1 + midiMessage[0]&0b00001111),2) + ' | Time: ' + pad(timeStamp,4));
      break;
    case 0b1001:  // Note on
      noteString = noteNamer(midiMessage[1]);
      printToConsole(noteString.trimRight(6) + ' On.. @ Velocity: ' + pad(midiMessage[2],3) + '..| Channel: ' + pad((1 + midiMessage[0]&0b00001111),2) + ' | Time: ' + pad(timeStamp,4));
      break;
    case 0b1010:  // Polyphonic Key Pressure (Aftertouch)
      printToConsole(noteString.trimRight(6) + 'Polyphonic Key Pressure: ' +  pad(midiMessage[2],3) + ' | Channel: ' + pad((1 + midiMessage[0]&0b00001111),2) + ' | Time: ' + pad(timeStamp,4));
      break;
    case 0b1011:  // Control Change
      switch(midiMessage[1]){
        case 0b01111000:  // All sound off
          printToConsole('All Sound Off................| Channel: ' + pad((1 + midiMessage[0]&0b00001111),2) + ' | Time: ' + pad(timeStamp,4));
          break;
        case 0b01111001:  // Reset all Controllers
          printToConsole('Reset All Controllers........| Channel: ' + pad((1 + midiMessage[0]&0b00001111),2) + ' | Time: ' + pad(timeStamp,4));
          break;
        case 0b01111010:  // Local Control off
          printToConsole('Local Control Off............| Channel: ' + pad((1 + midiMessage[0]&0b00001111),2) + ' | Time: ' + pad(timeStamp,4));
          break;
        case 0b01111011:  // All Notes off
          printToConsole('All Notes Off................| Channel: ' + pad((1 + midiMessage[0]&0b00001111),2) + ' | Time: ' + pad(timeStamp,4));
          break;
        case 0b01111100:  // Omni Mode off
          printToConsole('Omni Mode Off................| Channel: ' + pad((1 + midiMessage[0]&0b00001111),2) + ' | Time: ' + pad(timeStamp,4));
          break;
        case 0b01111101:  // Omni Mode on
          printToConsole('Omni Mode On.................| Channel: ' + pad((1 + midiMessage[0]&0b00001111),2) + ' | Time: ' + pad(timeStamp,4));
          break;
        case 0b01111110:  // Mono Mode
          printToConsole('Mono Mode....................| Channel: ' + pad((1 + midiMessage[0]&0b00001111),2) + ' | Time: ' + pad(timeStamp,4));
          break;
        case 0b01111111:  // Poly Mode
          printToConsole('Poly Mode....................| Channel: ' + pad((1 + midiMessage[0]&0b00001111),2) + ' | Time: ' + pad(timeStamp,4));
          break;
        default:
          printToConsole('Control ' + pad(midiMessage[1],3) + ' Changed to: ' + pad( midiMessage[2],3) +'..| Channel: ' + pad((1 + midiMessage[0]&0b00001111),2) + ' | Time: ' + pad(timeStamp,4));
          break;
      } // End Control Change
      break;
    case 0b1100: // Program Change
      printToConsole('Program Changed to: ' + pad(midiMessage[1],3) + '......| Channel: ' + pad((1 + midiMessage[0]&0b00001111),2) + ' | Time: ' + pad(timeStamp,4));
      break;
    case 0b1101: // Channel Pressure (After-touch)
      printToConsole('Channel Pressure: ' + pad(midiMessage[1],3) + '........| Channel: ' + pad((1 + midiMessage[0]&0b00001111),2) + ' | Time: ' + pad(timeStamp,4));
      break;
    case 0b1110: // Pitch Bend Change
      printToConsole('Bending pitch: ' + pad((((midiMessage[1] & 127) * 128) + (midiMessage[2] & 127)), 10) + '....| Channel: ' + pad((1 + midiMessage[0]&0b00001111),2) + ' | Time: ' + pad(timeStamp,4));
      break;
    case 0b1111: // System Messages
      switch (midiMessage[0]) {
        case 0b11110000: // SysEx
          printToConsole('System Exclusive message.....|.............| Time: ' + pad(timeStamp,4));
          break;
        case 0b11110001: // MIDI Time Code Quarter Frame
          //printToConsole('Time: ' + timeStamp + ' | MIDI Time Code Quarter Frame | Message: ' + (midiMessage[1] >>> 4) + ' | Values: ' + (midiMessage[1]&0b00001111));
          printToConsole('MIDI Time Code Quarter Frame |.............| Time: ' + pad(timeStamp,4));
          break;
        case 0b11110010: // Song Position Pointer
          printToConsole('Song Position to ' + pad((midiMessage[1]*128 + midiMessage[2]),10) + '..|.............| Time: ' + pad(timeStamp,4));
          break;
        case 0b11110011: // Song Select
          printToConsole('Song ' + pad(midiMessage[1],3) + ' selected...............|.............| Time: ' + pad(timeStamp,4));
          break;
        case 0b11110100: // Not defined
          printToConsole('.............................|.............| Time: ' + pad(timeStamp,4));
          break;
        case 0b11110101: // Not defined
          printToConsole('.............................|.............| Time: ' + pad(timeStamp,4));
          break;
        case 0b11110110: // Tune Request
          printToConsole('Tune Request.................|.............| Time: ' + pad(timeStamp,4));
          break;
        case 0b11110111: // End of Exclusive
          printToConsole('End of System Exclusive......|.............| Time: ' + pad(timeStamp,4));
          break;
        case 0b11111000: // Timing Clock
          printToConsole('Timing Clock.................|.............| Time: ' + pad(timeStamp,4));
          break;
        case 0b11111001: // Not defined
          printToConsole('.............................|.............| Time: ' + pad(timeStamp,4));
          break;
        case 0b11111010: // Start
          printToConsole('Start........................|.............| Time: ' + pad(timeStamp,4));
          break;
        case 0b11111011: // Continue
          printToConsole('Continue.....................|.............| Time: ' + pad(timeStamp,4));
          break;
        case 0b11111100: // Stop
          printToConsole('Stop.........................|.............| Time: ' + pad(timeStamp,4));
          break;
        case 0b11111101: // Not defined
          printToConsole('.............................|.............| Time: ' + pad(timeStamp,4));
          break;
        case 0b11111110: // Active Sensing
          printToConsole('Active Sensing...............|.............| Time: ' + pad(timeStamp,4));
          break;
        case 0b11111111: // Reset
          printToConsole('Reset........................|.............| Time: ' + pad(timeStamp,4));
          break;
        default:
          printToConsole('Unknown Message..............|.............| Time: ' + pad(timeStamp,4));
          console.log('Default error: ' + midiMessage);
          break;
      }; // End System Messages
  }; // End switch(firstNibble)
}; // End midiMessageParser function

function noteNamer(midiValue) {
  let noteNumber    = midiValue % 12;
  let octaveNumber  = ((midiValue - noteNumber) / 12) - 1;
  let noteString    = "";

  switch(noteNumber) {
    case 0:
      noteString = "C" + octaveNumber + "....";
      break;
    case 1:
      noteString = "C#/Db" + octaveNumber;
      break;
    case 2:
      noteString = "D" + octaveNumber + "....";
      break;
    case 3:
      noteString = "D#/Eb" + octaveNumber;
      break;
    case 4:
      noteString = "E" + octaveNumber + "....";
      break;
    case 5:
      noteString = "F" + octaveNumber + "....";
      break;
    case 6:
      noteString = "F#/Gb" + octaveNumber;
      break;
    case 7:
      noteString = "G" + octaveNumber + "....";
      break;
    case 8:
      noteString = "G#/Ab" + octaveNumber;
      break;
    case 9:
      noteString = "A" + octaveNumber + "....";
      break;
    case 10:
      noteString = "A#/Bb" + octaveNumber;
      break;
    case 11:
      noteString = "B" + octaveNumber + "....";
      break;
    default:
      break;
  }
  return noteString;
}

function pad(num, size) {
  var s = num+"";
  while (s.length < size) s = "0" + s;
  return s;
}