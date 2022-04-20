module.exports = {
  apps : [{
    name: 'backend',
    script: 'index.js',
    cwd: 'arduino-webcam/backend'
  }, {
    name: 'tunnel',
    script: 'tunnel.sh',
    cwd: 'arduino-webcam/backend'
  }]
}
