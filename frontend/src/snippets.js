export default {
  wiring: [
    {
      name: 'Default (empty)',
      code:
`void setup() {

}
void loop() {
  
}`
    },
    {
      name: 'Blink',
      code:
`constexpr int LED_PIN = 7;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
    digitalWrite(LED_PIN, HIGH);
    delay(1000);
    digitalWrite(LED_PIN, LOW);
    delay(1000);
}`
    },
    {
      name: 'Button Pull-Up',
      code:
`constexpr int BTN_PIN = 2;
constexpr int LED_PIN = 7;

void setup() {
    pinMode(BTN_PIN, INPUT_PULLUP);
    pinMode(LED_PIN, OUTPUT);
}
void loop() {
  int sensorVal = digitalRead(BTN_PIN);

  if (sensorVal == HIGH) {

    digitalWrite(LED_PIN, LOW);

  } else {

    digitalWrite(LED_PIN, HIGH);

  }
}`
    },
    {
      name: 'Traffic Lights',
      code:
`constexpr int RED_LED = 3;
constexpr int YELLOW_LED = 4;
constexpr int GREEN_LED = 5;

void setup() {
    pinMode(RED_LED, OUTPUT);
    pinMode(YELLOW_LED, OUTPUT);
    pinMode(GREEN_LED, OUTPUT);
}

void loop() {
  digitalWrite(RED_LED, HIGH);
  delay(3000);
  digitalWrite(YELLOW_LED, HIGH);
  delay(1000);
  digitalWrite(RED_LED, LOW);
  digitalWrite(YELLOW_LED, LOW);
  digitalWrite(GREEN_LED, HIGH);
  delay(3000);
  digitalWrite(GREEN_LED, LOW);
  digitalWrite(YELLOW_LED, HIGH);
  delay(1000);
  digitalWrite(YELLOW_LED, LOW);
}`
    },
    {
      name: 'RGB LED',
      code:
`constexpr int RED_LED = 9;
constexpr int GREEN_LED = 10;
constexpr int BLUE_LED = 11;

void setup() {
    pinMode(RED_LED, OUTPUT);
    pinMode(GREEN_LED, OUTPUT);
    pinMode(BLUE_LED, OUTPUT);
}

void loop() {
  for(int i = 0; i < 256; i++) {
      analogWrite(RED_LED, i);
      delay(4);
  }
  for(int i = 0; i < 256; i++) {
      analogWrite(GREEN_LED, i);
      delay(4);
  }
  for(int i = 0; i < 256; i++) {
      analogWrite(BLUE_LED, i);
      delay(4);
  }
  for(int i = 255; i >= 0; i--) {
      analogWrite(RED_LED, i);
      delay(4);
  }
  for(int i = 255; i >= 0; i--) {
      analogWrite(GREEN_LED, i);
      delay(4);
  }
  for(int i = 255; i >= 0; i--) {
      analogWrite(BLUE_LED, i);
      delay(4);
  }
}`
    },
    {
      name: 'Photoresistor',
      code:
`constexpr int LED_1 = 3;
constexpr int LED_2 = 4;
constexpr int LED_3 = 5;
constexpr int LED_4 = 6;
constexpr int LED_5 = 7;

void setup() {
    pinMode(LED_1, OUTPUT);
    pinMode(LED_2, OUTPUT);
    pinMode(LED_3, OUTPUT);
    pinMode(LED_4, OUTPUT);
    pinMode(LED_5, OUTPUT);
}

void loop() {
    digitalWrite(LED_1, LOW);
    digitalWrite(LED_2, LOW);
    digitalWrite(LED_3, LOW);
    digitalWrite(LED_4, LOW);
    digitalWrite(LED_5, LOW);
    
    int reading = analogRead(A0);
    
    if(reading > 50) {
      digitalWrite(LED_1, HIGH);
    }
    if(reading > 100) {
      digitalWrite(LED_2, HIGH);
    }
    if(reading > 200) {
      digitalWrite(LED_3, HIGH);
    }
    if(reading > 350) {
      digitalWrite(LED_4, HIGH);
    }
    if(reading > 600) {
      digitalWrite(LED_5, HIGH);
    }
}`
    }
  ],
  c: [
    {
      name: 'Default (empty)',
      code:
`#include <avr/io.h>

int main(void) {

}`
    },
    {
      name: 'Blink',
      code:
`#include <avr/io.h>
#include <util/delay.h>

#define MS_DELAY 200

int main(void)
{
  DDRD |= _BV(DDD7);

  while (1)
  {
    PORTD |= _BV(PORTD7);

    _delay_ms(MS_DELAY);

    PORTD &= ~_BV(PORTD7);

    _delay_ms(MS_DELAY);
  }
}`
    }
  ]
}
