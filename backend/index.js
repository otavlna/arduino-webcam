import { WebSocketServer } from 'ws';
import { exec } from 'child_process';
import fs from 'fs';

const wss = new WebSocketServer({ port: 1337 });

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    console.log('received: %s', data);

    const response = JSON.parse(data)
    console.log(response)

    if(response.lang === 'c') {
      console.log('kód je v céčku')
      if(response.code) {
        fs.writeFile("tmp/code.c", response.code, function(err) {
          if(err) {
              return console.log(err);
          }
          console.log("Soubor ulozen!");
          exec('avr-gcc -Os -DF_CPU=16000000UL -mmcu=atmega328p -c -o tmp/code.o tmp/code.c && avr-gcc -mmcu=atmega328p tmp/code.o -o tmp/code && avr-objcopy -O ihex -R .eeprom tmp/code tmp/code.hex && avrdude -F -V -c arduino -p ATMEGA328P -P /dev/ttyUSB0 -b 115200 -U flash:w:tmp/code.hex', (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
          });
      }); 
      }
    }
  });

  ws.send('something');
});