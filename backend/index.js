import WebSocket, { WebSocketServer } from 'ws'
import { exec, spawn } from 'child_process'
import fs from 'fs'
import { promisify, inspect } from 'util'
import { randomUUID } from 'crypto'
const execPromise = promisify(exec)

const TIMEOUT_NORMAL = 30000
const TIMEOUT_ERROR = 10000

const wss = new WebSocketServer({ port: 1337 })
const queue = []
let currentRequest = null
let timeout = null
let timeoutStartTime = 0
let timeoutLength = 0
let isRunning = false
let device = ''

execPromise('ls /dev | grep ttyUSB').then(({ error, stdout, stderr }) => {
  if (stderr) {
    console.error(stderr)
  } else if (error) {
    console.error(error)
  }
  device = stdout.trim()
})

wss.on('connection', function connection (ws) {
  ws.id = randomUUID()
  sendQueueInfo()
  ws.on('message', async function message (data) {
    const request = JSON.parse(data)
    if (queue.find((r) => r.ws.id === ws.id) || (currentRequest && currentRequest.ws.id === ws.id)) {
      return
    }
    queue.push({ ...request, ws })
    sendQueueInfo()
    ws.send(JSON.stringify({ type: 'uploadSuccess' }))
    if (!timeout) {
      queueNext()
    }
  })
})

async function processC (request) {
  fs.writeFileSync('code-c/code.c', request.code)
  const command = `avr-gcc -Os -DF_CPU=16000000UL -mmcu=atmega328p -c -o code.o code.c && avr-gcc -mmcu=atmega328p code.o -o code && avr-objcopy -O ihex -R .eeprom code code.hex && avrdude -F -V -c arduino -p ATMEGA328P -P /dev/${device} -b 115200 -U flash:w:code.hex 2>&1`

  return new Promise((resolve) => {
    const process = spawn(command, { cwd: 'code-c', shell: true })

    process.stdout.on('data', (data) => {
      broadcast(wss, { type: 'log', stdout: data.toString('utf8') })
    })

    process.stderr.on('data', (data) => {
      broadcast(wss, { type: 'log', stderr: data.toString('utf8') })
    })

    process.on('close', (code) => {
      resolve(code)
    })

    process.on('error', (err) => {
      console.error(inspect(err))
    })
  })
}

async function processWiring (request) {
  fs.writeFileSync('code-wiring/code.ino', request.code)
  const command = `export ARDUINO_DIR=../../arduino-1.8.16 && export ARDMK_DIR=./Makefile && export AVR_TOOLS_DIR=/usr/include && make && avrdude -F -V -c arduino -p ATMEGA328P -P /dev/${device} -b 115200 -U flash:w:build-uno/code-wiring_.hex 2>&1`

  return new Promise((resolve) => {
    const process = spawn(command, { cwd: 'code-wiring', shell: true })

    process.stdout.on('data', (data) => {
      broadcast(wss, { type: 'log', stdout: data.toString('utf8') })
    })

    process.stderr.on('data', (data) => {
      broadcast(wss, { type: 'log', stderr: data.toString('utf8') })
    })

    process.on('close', (code) => {
      resolve(code)
    })

    process.on('error', (err) => {
      console.error(inspect(err))
    })
  })
}

async function queueNext () {
  if (currentRequest) {
    currentRequest.ws.send(JSON.stringify({ type: 'requestComplete' }))
  }
  currentRequest = queue[0]
  if (!currentRequest) {
    timeout = null
    isRunning = false
    sendQueueInfo()
    return
  }
  currentRequest.ws.send(JSON.stringify({ type: 'yourTurn' }))
  broadcast(wss, { type: 'currentCode', code: currentRequest.code, lang: currentRequest.lang })
  let exitCode = null
  if (currentRequest.lang === 'c') {
    exitCode = await processC(currentRequest)
  } else if (currentRequest.lang === 'wiring') {
    exitCode = await processWiring(currentRequest)
  }

  let waitTime
  if (exitCode === 0) {
    waitTime = TIMEOUT_NORMAL
  } else {
    waitTime = TIMEOUT_ERROR
  }
  timeout = setTimeout(queueNext, waitTime)
  timeoutStartTime = Date.now()
  timeoutLength = waitTime
  console.log('waiting for ' + waitTime * 0.001 + ' seconds')
  isRunning = true
  queue.shift()
  sendQueueInfo()
}

function broadcast (wss, message) {
  wss.clients.forEach(function each (client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message))
    }
  })
}

function queueBroadcastMessage () {
  return { type: 'queue', queueLength: queue.length, timeoutStartTime, timeoutLength, isRunning }
}

function sendQueuePositions () {
  for (let i = 0; i < queue.length; i++) {
    queue[i].ws.send(JSON.stringify({ type: 'queuePosition', position: i + 1 }))
  }
}

function sendQueueInfo () {
  broadcast(wss, queueBroadcastMessage())
  sendQueuePositions()
}
