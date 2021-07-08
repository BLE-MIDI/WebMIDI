/** Global variables */
var   dataList                    = document.querySelector('#midi-data ul')
const MIDI_SERVICE_UID            = '03B80E5A-EDE8-4B33-A751-6CE34EC4C700'.toLowerCase();
const MIDI_IO_CHARACTERISTIC_UID  = '7772E5DB-3868-4112-A1A9-F2669D106BF3'.toLowerCase();


/** Get variable from URL
 * Use: ?bleDevice=BLE_MIDI_Service
 */
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value;
  });
  return vars;
}

/** Console function
 * Only present on RX-page. */
function printToConsole(content) {
  var newItem = document.createElement('li');
  newItem.appendChild(document.createTextNode(content));
  dataList.appendChild(newItem);
}

if (!navigator.bluetooth) {
  printToConsole('Browser does not support web Bluetooth!');
  console.log('Web Bluetooth API is not available in browser.');
}

