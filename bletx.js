/** Global Variables */
var midi, data;
var synth;
var bluetoothDevice;
var bleDevice;
var readyBLEpacket = [];
var timer = setInterval(bleSend, 10);

/** Function to run upon window load. */
async function Init(){
  kb=document.getElementById("keyboard");
  kb.addEventListener("change",KeyIn);
}

/** Function for connecting to MIDIBLE Device */
function txConnect() {
  printToConsole('Searching for bluetooth devices...');
  console.log('Requesting Bluetooth Device with MIDI UUID...');
  bluetoothDevice = null;
  console.log('Searching for ' + getUrlVars()["demo"] + getUrlVars()["id"] + "...");

  navigator.bluetooth.requestDevice({
    filters: [{
      services: [MIDI_SERVICE_UID],
      name: bleDevice
    }]
  })
  .then(device =>{
    console.log('Connecting to GATT server of ' + device.name);
    printToConsole('Connecting to bluetooth device '+ device.name + '...');
    bluetoothDevice = device;
    return device.gatt.connect();
  })
  .then(server => {
    console.log('Getting Service...');
    return server.getPrimaryService(MIDI_SERVICE_UID);
  })
  .then(service => {
    console.log('Getting Characteristic...');
    return service.getCharacteristic(MIDI_IO_CHARACTERISTIC_UID);
  })
  .then(characteristic => {
    console.log('Found Characteristic...');
    printToConsole('Ready to rock!');
    bleConnected();
    midiChar = characteristic;
  })
  .catch(error => {
    printToConsole(error);
    console.log('Argh! ' + error);
  })
}

function txDisconnect() {
  if (!bluetoothDevice) {
    return;
  }
  console.log('Disconnecting from Bluetooth Device...');
  if (bluetoothDevice.gatt.connected) {
    bluetoothDevice.gatt.disconnect();
    bleDisconnect();
    printToConsole('Disconnecting from Bluetooth Device...');
  } else {
    console.log('> Bluetooth Device is already disconnected');
    printToConsole('Bluetooth Device is already disconnected.');
  }
}

function onDisconnected(event) {
  let device = event.target;

  console.log('Device ' + device.name + ' is disconnected.');
  printToConsole('Device ' + device.name + ' is disconnected.');

  bleDisconnect();
}

function midiEncoder(midiData) {
  let midiBLEmessage = [];
  let pos = 0;
  let len = midiData.length;

  console.log('Encoding: ' + midiData);

  midiBLEmessage.push(timestampGenerator()[0]);
  
  for (pos = 0; pos < len;pos++) {
    if ((midiData[pos] >>> 7) === 1) {
      midiBLEmessage.push(timestampGenerator()[1]);
    }
    midiBLEmessage.push(midiData[pos]);
  }

  console.log('Encoded: ' + midiBLEmessage);
  printToConsole('Encoded: ' + midiBLEmessage);
  return midiBLEmessage;
}

function timestampGenerator() {
  let localTime       = performance.now() & 8191;
  let timestamp       = [((localTime >> 7) | 0x80) & 0xBF,(localTime & 0x7F) | 0x80];
  return timestamp;
}

function KeyIn(e){
  let i = 0;
  midiMessage = [0x90,e.note[1],e.note[0]?100:0];
  let l = midiMessage.length; 
  printToConsole('MIDI-message: ' + midiMessage);

  for (i = 0; i < l; i++) {
    readyBLEpacket.push(midiMessage[i]);
  }
}

window.onload=function() {
  console.log('Service: ' + MIDI_SERVICE_UID);
  console.log('Char: ' + MIDI_IO_CHARACTERISTIC_UID);
  document.getElementById('ikeys').style.display = 'none';
  Init();

  let norurl;
  if (getUrlVars()["demo"] !== undefined && getUrlVars()["id"] !== undefined) {
    norurl = "./multitx.html?demo=" + getUrlVars()["demo"] + "&id=" + getUrlVars()["id"];
    console.log(norurl);
    document.getElementById("link").href = norurl;
    bleDevice = getUrlVars()["demo"] + " " + getUrlVars()["id"];
  }else{
    console.log("BLE Device: " + bleDevice);
  }
}

function bleConnected() {
  document.getElementById('ikeys').style.display = 'block';
  document.getElementById('hide').style.display = 'none';
  document.getElementById('ibutton').innerHTML = 'Disconnect';
  document.getElementById('midi-data').style.height = '45vh';
  document.getElementById("ibutton").onclick = txDisconnect;
  document.getElementById("info").style.fontSize = '1.5em';
  document.getElementById('midi-data').style.background = '#ECEFF1'
}

function bleSend(){
  let packet = [];
  if(readyBLEpacket.length > 0) {
    packet = new Uint8Array(midiEncoder(readyBLEpacket));
    console.log('BLE-packet sent: ' + packet);
    midiChar.writeValue(packet);
    readyBLEpacket = [];
  }
}

function bleDisconnect() {
  document.getElementById('ikeys').style.display = 'none';
  document.getElementById('hide').style.display = 'block';
  document.getElementById('ibutton').innerHTML = 'Connect';
  document.getElementById('midi-data').style.height = '10vh';
  document.getElementById("ibutton").onclick = txConnect;
  document.getElementById("info").style.fontSize = '2em';
}