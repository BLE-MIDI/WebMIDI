# WebMIDI Transport to BLE-MIDI
Receive and transmit BLE-MIDI through your browser.

**This repository**
This repository was developed in order to learn more about webMIDI, and was designed to be used for demonstration at a Maker Faire, but has lately been a simple and useful tool for debugging that requires no additional applications.
The web application is divided into 2 pages: Rx and Tx, both can be ran at the same time.

### MIDI Rx
Rx connects to an available BLE-MIDI device, messages received will be printed on the pages console. BLE-MIDI timestamps are converted to local time and a delay is calculated to synchronize incoming messages. The page uses the [webaudio-tinysynth](https://github.com/g200kg/webaudio-controls), by [g200kg](https://github.com/g200kg "g200kg"), to create audio feedback. 

### MIDI Tx
The Tx-based page will summon a keyboard upon connection, pressing the keys will send BLE-MIDI to the connected device. The keyboard used is from the [webaudio-controls](https://github.com/g200kg/webaudio-controls), by [g200kg](https://github.com/g200kg "g200kg").

The tool can be tested by going to [this page](https://ble-midi.github.io/WebMIDI/ "Github pages")

### Supported plattforms
Not all operating systems and browsers are supported, web Bluetooth is critical for using this application. [Check if your browser supports bluetooth here](https://caniuse.com/web-bluetooth "Can I use web bluetooth")


### Future work
Add support for MIDI devices connected through USB or an audio device.


### Disclaimer
This project was part of our first javascript experience, after working mostly with C, the code strongly reflects that... Be gentle.