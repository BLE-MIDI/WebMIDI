/** Global Variables */
var connectDevice = null;
var synth;
var bleDevice;

/** Function to run upon window load. */
window.onload=function(){
  let norurl;
  if (getUrlVars()["demo"] !== undefined) {
    norurl = "./no/multirxno.html?demo=" + getUrlVars()["demo"] + "&id=" + getUrlVars()["id"];
    console.log(norurl);
    document.getElementById("link").href = norurl;
    bleDevice = getUrlVars()["demo"] + " " + getUrlVars()["id"];
  }else{
    console.log("BLE Device: " + bleDevice);
  }
  
  /** Synth for Audio feedback */
  synth = new WebAudioTinySynth();
  synth.setTsMode(1);
  synth.setQuality(0);
  console.log('WebAudio Tinysynth is running...'); 
}

/** Connecting to given device. */
function rxConnect() {
  printToConsole('Searching for bluetooth devices...');
  console.log('Requesting Bluetooth Device with MIDI UUID...');
  console.log('Searching for ' + getUrlVars()["demo"] + getUrlVars()["id"] + "...");
  navigator.bluetooth.requestDevice({
    filters: [{
      services: [MIDI_SERVICE_UID],
      name: bleDevice
    }]
  })
  .then(device => {
    // Set up event listener for when device gets disconnected.
    console.log('Connecting to GATT server of ' + device.name);
    printToConsole('Connecting to bluetooth device '+ device.name + '...');
    device.addEventListener('gattserverdisconnected', onDisconnected);
    bleConnected();
    // Attempts to connect to remote GATT Server.
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
    return characteristic.startNotifications();
  })
  .then(characteristic => {
    // Set up event listener for when characteristic value changes.
    characteristic.addEventListener('characteristicvaluechanged',
                    handleMidiMessageRecieved);
    console.log('Notifications have been started.')
    printToConsole('Ready to test!');
  })
  .catch(error => { console.log('ERRORCODE: ' + error); });
}

function rxDisconnect() {
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

/** Incoming BLE MIDI */
function handleMidiMessageRecieved(event) {
  const {buffer}  = event.target.value;
  const eventData = new Uint8Array(buffer);

  bleMIDIrx(eventData);
}

function onDisconnected(event) {
  if (!connectDevice || !connectDevice.gatt.connected) return;
  connectDevice.gatt.disconnect();
  let device = event.target;
  printToConsole('Connection lost...');
  console.log('Device ' + device.name + ' is disconnected.');
  bleDisconnect();
}

function bleConnected() {
  document.getElementById('hide').style.display = 'none';
  document.getElementById('ibutton').innerHTML = 'Disconnect';
  document.getElementById('midi-data').style.height = '45vh';
  document.getElementById("ibutton").onclick = rxDisconnect;
  document.getElementById("info").style.fontSize = '1.5em';
  document.getElementById('midi-data').style.background = '#ECEFF1'
}

function bleDisconnect() {
  document.getElementById('ikeys').style.display = 'none';
  document.getElementById('hide').style.display = 'block';
  document.getElementById('ibutton').innerHTML = 'Connect';
  document.getElementById('midi-data').style.height = '10vh';
  document.getElementById("ibutton").onclick = rxConnect;
  document.getElementById("info").style.fontSize = '2em';
}
