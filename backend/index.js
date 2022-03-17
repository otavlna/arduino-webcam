import { WebSocketServer } from 'ws';
import { exec } from 'child_process';
import fs from 'fs';
import { promisify } from 'util'
const execPromise = promisify(exec)

const wss = new WebSocketServer({ port: 1337 });

let device = ''

wss.on('connection', function connection(ws) {
  ws.on('message', async function message(data) {
    const request = JSON.parse(data)

    const { stdout, stderr } = await execPromise('ls /dev | grep ttyUSB')
    if (stderr) {
      console.error(stderr)
    }
    device = stdout.trim()

    if (request.lang === 'c') {
      processC(request, ws)
    }
    else if (request.lang === 'wiring') {
      processWiring(request, ws)
    }
  });
});

function processC(request, ws) {
  fs.writeFile("code-c/code.c", request.code, function (err) {
    if (err) {
      return console.log(err);
    }
    const command = `avr-gcc -Os -DF_CPU=16000000UL -mmcu=atmega328p -c -o code.o code.c && avr-gcc -mmcu=atmega328p code.o -o code && avr-objcopy -O ihex -R .eeprom code code.hex && avrdude -F -V -c arduino -p ATMEGA328P -P /dev/${device} -b 115200 -U flash:w:code.hex`
    exec(command, { cwd: 'code-c' }, (error, stdout, stderr) => {
      ws.send(JSON.stringify({ type: 'log', stderr }))
    });
  });
}

function processWiring(request, ws) {
  fs.writeFile("code-wiring/code.ino", request.code, function (err) {
    if (err) {
      return console.log(err);
    }
    const command = `export ARDUINO_DIR=../../arduino-1.8.16 && export ARDMK_DIR=./Makefile && export AVR_TOOLS_DIR=/usr/include && avrdude -F -V -c arduino -p ATMEGA328P -P /dev/${device} -b 115200 -U flash:w:build-uno/code-wiring.hex`
    exec(command, { cwd: 'code-wiring' }, (error, stdout, stderr) => {
      ws.send(JSON.stringify({ type: 'log', stdout, stderr }))
    });
  });
}