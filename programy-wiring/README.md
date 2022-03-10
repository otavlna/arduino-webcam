
# Jak zprovoznit

Zde uvedený příklad je pro program blink.

1. `export ARDUINO_DIR=../arduino-1.8.16`
2. `export ARDMK_DIR=./Makefile`
3. `export AVR_TOOLS_DIR=/usr/include`

avrdude -F -V -c arduino -p ATMEGA328P -P /dev/ttyUSB0 -b 115200 -U flash:w:build-uno/blink.hex