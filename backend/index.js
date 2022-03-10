import { WebSocketServer } from 'ws';
import { exec } from 'child_process';
import fs from 'fs';

const wss = new WebSocketServer({ port: 1337 });

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    console.log('received: %s', data);

    const response = JSON.parse(data)
    console.log(response)

    if (response.lang === 'c') {
      console.log('kód je v céčku')
      fs.writeFile("tmp_c/code.c", response.code, function (err) {
        if (err) {
          return console.log(err);
        }
        console.log("Soubor ulozen!");
        exec('avr-gcc -Os -DF_CPU=16000000UL -mmcu=atmega328p -c -o tmp_c/code.o tmp_c/code.c && avr-gcc -mmcu=atmega328p tmp_c/code.o -o tmp_c/code && avr-objcopy -O ihex -R .eeprom tmp_c/code tmp_c/code.hex && avrdude -F -V -c arduino -p ATMEGA328P -P /dev/ttyUSB0 -b 115200 -U flash:w:tmp_c/code.hex', (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
          }
          ws.send(JSON.stringify({ type: 'log', stderr }))
        });
        });
    }
    else if (response.lang === 'wiring') {
      console.log('kód je ve wiringu')
      fs.writeFile("../programy-wiring/code/code.ino", response.code, function (err) {
        if (err) {
          return console.log(err);
        }
        console.log("Soubor ulozen!");
        exec('export ARDUINO_DIR=../arduino-1.8.16 && export export ARDMK_DIR=./Makefile && export AVR_TOOLS_DIR=/usr/include && ARDUINO_DIR="../arduino-1.8.16" ARDMK_DIR="./Makefile"  AVR_TOOLS_DIR="/usr/include" make && avrdude -F -V -c arduino -p ATMEGA328P -P /dev/ttyUSB0 -b 115200 -U flash:w:build-uno/code.hex', { cwd: '../programy-wiring/code/' }, (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
          }
          ws.send(JSON.stringify({ type: 'log', stdout, stderr }))
        });
      });
    }
  });
});