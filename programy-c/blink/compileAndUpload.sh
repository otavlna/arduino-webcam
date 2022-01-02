#!/bin/bash

avr-gcc -Os -DF_CPU=16000000UL -mmcu=atmega328p -c -o blink.o blink.c
avr-gcc -mmcu=atmega328p blink.o -o blink
avr-objcopy -O ihex -R .eeprom blink blink.hex
avrdude -F -V -c arduino -p ATMEGA328P -P /dev/ttyUSB0 -b 115200 -U flash:w:blink.hex