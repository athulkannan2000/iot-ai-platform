import * as Blockly from 'blockly';
import { pythonGenerator, Order } from 'blockly/python';

export function initCustomBlocks() {
  // Initialize all custom block categories
  initIoTDigitalBlocks();
  initIoTAnalogBlocks();
  initIoTSensorBlocks();
  initIoTActuatorBlocks();
  initIoTDisplayBlocks();
  initIoTConnectivityBlocks();
  initAIVisionBlocks();
  initAISpeechBlocks();
  initAIPredictionBlocks();
  initAIModelBlocks();
  initEventBlocks();
  initTimeBlocks();
}

// ==================== IoT Digital Blocks ====================

function initIoTDigitalBlocks() {
  // Digital Read
  Blockly.Blocks['iot_digital_read'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('read digital pin')
        .appendField(new Blockly.FieldNumber(2, 0, 40), 'PIN');
      this.setOutput(true, 'Boolean');
      this.setColour('#0ea5e9');
      this.setTooltip('Read digital value from a pin (HIGH or LOW)');
    },
  };

  pythonGenerator.forBlock['iot_digital_read'] = function (block: Blockly.Block) {
    const pin = block.getFieldValue('PIN');
    return [`digital_read(${pin})`, Order.FUNCTION_CALL];
  };

  // Digital Write
  Blockly.Blocks['iot_digital_write'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('set digital pin')
        .appendField(new Blockly.FieldNumber(2, 0, 40), 'PIN')
        .appendField('to')
        .appendField(
          new Blockly.FieldDropdown([
            ['HIGH', 'HIGH'],
            ['LOW', 'LOW'],
          ]),
          'VALUE'
        );
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0ea5e9');
      this.setTooltip('Set digital pin to HIGH or LOW');
    },
  };

  pythonGenerator.forBlock['iot_digital_write'] = function (block: Blockly.Block) {
    const pin = block.getFieldValue('PIN');
    const value = block.getFieldValue('VALUE');
    return `digital_write(${pin}, ${value})\n`;
  };

  // Pin Mode
  Blockly.Blocks['iot_pin_mode'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('set pin')
        .appendField(new Blockly.FieldNumber(2, 0, 40), 'PIN')
        .appendField('as')
        .appendField(
          new Blockly.FieldDropdown([
            ['INPUT', 'INPUT'],
            ['OUTPUT', 'OUTPUT'],
            ['INPUT_PULLUP', 'INPUT_PULLUP'],
          ]),
          'MODE'
        );
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0ea5e9');
      this.setTooltip('Configure pin as input or output');
    },
  };

  pythonGenerator.forBlock['iot_pin_mode'] = function (block: Blockly.Block) {
    const pin = block.getFieldValue('PIN');
    const mode = block.getFieldValue('MODE');
    return `pin_mode(${pin}, ${mode})\n`;
  };
}

// ==================== IoT Analog Blocks ====================

function initIoTAnalogBlocks() {
  // Analog Read
  Blockly.Blocks['iot_analog_read'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('read analog pin')
        .appendField(new Blockly.FieldNumber(0, 0, 10), 'PIN');
      this.setOutput(true, 'Number');
      this.setColour('#06b6d4');
      this.setTooltip('Read analog value (0-1023) from a pin');
    },
  };

  pythonGenerator.forBlock['iot_analog_read'] = function (block: Blockly.Block) {
    const pin = block.getFieldValue('PIN');
    return [`analog_read(${pin})`, Order.FUNCTION_CALL];
  };

  // Analog Write (PWM)
  Blockly.Blocks['iot_analog_write'] = {
    init: function () {
      this.appendValueInput('VALUE')
        .setCheck('Number')
        .appendField('set PWM pin')
        .appendField(new Blockly.FieldNumber(3, 0, 40), 'PIN')
        .appendField('to');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#06b6d4');
      this.setTooltip('Set PWM value (0-255) on a pin');
    },
  };

  pythonGenerator.forBlock['iot_analog_write'] = function (block: Blockly.Block) {
    const pin = block.getFieldValue('PIN');
    const value = pythonGenerator.valueToCode(block, 'VALUE', Order.NONE) || '0';
    return `analog_write(${pin}, ${value})\n`;
  };
}

// ==================== IoT Sensor Blocks ====================

function initIoTSensorBlocks() {
  // Temperature Sensor
  Blockly.Blocks['iot_read_temperature'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('read temperature')
        .appendField(
          new Blockly.FieldDropdown([
            ['DHT11', 'DHT11'],
            ['DHT22', 'DHT22'],
            ['DS18B20', 'DS18B20'],
          ]),
          'SENSOR'
        )
        .appendField('pin')
        .appendField(new Blockly.FieldNumber(4, 0, 40), 'PIN');
      this.setOutput(true, 'Number');
      this.setColour('#14b8a6');
      this.setTooltip('Read temperature in Celsius');
    },
  };

  pythonGenerator.forBlock['iot_read_temperature'] = function (block: Blockly.Block) {
    const sensor = block.getFieldValue('SENSOR');
    const pin = block.getFieldValue('PIN');
    return [`read_temperature("${sensor}", ${pin})`, Order.FUNCTION_CALL];
  };

  // Humidity Sensor
  Blockly.Blocks['iot_read_humidity'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('read humidity')
        .appendField(
          new Blockly.FieldDropdown([
            ['DHT11', 'DHT11'],
            ['DHT22', 'DHT22'],
          ]),
          'SENSOR'
        )
        .appendField('pin')
        .appendField(new Blockly.FieldNumber(4, 0, 40), 'PIN');
      this.setOutput(true, 'Number');
      this.setColour('#14b8a6');
      this.setTooltip('Read humidity percentage');
    },
  };

  pythonGenerator.forBlock['iot_read_humidity'] = function (block: Blockly.Block) {
    const sensor = block.getFieldValue('SENSOR');
    const pin = block.getFieldValue('PIN');
    return [`read_humidity("${sensor}", ${pin})`, Order.FUNCTION_CALL];
  };

  // Distance Sensor (Ultrasonic)
  Blockly.Blocks['iot_read_distance'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('read distance')
        .appendField('trig pin')
        .appendField(new Blockly.FieldNumber(9, 0, 40), 'TRIG')
        .appendField('echo pin')
        .appendField(new Blockly.FieldNumber(10, 0, 40), 'ECHO');
      this.setOutput(true, 'Number');
      this.setColour('#14b8a6');
      this.setTooltip('Read distance in centimeters using ultrasonic sensor');
    },
  };

  pythonGenerator.forBlock['iot_read_distance'] = function (block: Blockly.Block) {
    const trig = block.getFieldValue('TRIG');
    const echo = block.getFieldValue('ECHO');
    return [`read_distance(${trig}, ${echo})`, Order.FUNCTION_CALL];
  };

  // Light Sensor
  Blockly.Blocks['iot_read_light'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('read light level pin')
        .appendField(new Blockly.FieldNumber(0, 0, 10), 'PIN');
      this.setOutput(true, 'Number');
      this.setColour('#14b8a6');
      this.setTooltip('Read light intensity (0-1023)');
    },
  };

  pythonGenerator.forBlock['iot_read_light'] = function (block: Blockly.Block) {
    const pin = block.getFieldValue('PIN');
    return [`read_light(${pin})`, Order.FUNCTION_CALL];
  };

  // Motion Sensor (PIR)
  Blockly.Blocks['iot_read_motion'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('motion detected pin')
        .appendField(new Blockly.FieldNumber(7, 0, 40), 'PIN');
      this.setOutput(true, 'Boolean');
      this.setColour('#14b8a6');
      this.setTooltip('Check if motion is detected');
    },
  };

  pythonGenerator.forBlock['iot_read_motion'] = function (block: Blockly.Block) {
    const pin = block.getFieldValue('PIN');
    return [`read_motion(${pin})`, Order.FUNCTION_CALL];
  };
}

// ==================== IoT Actuator Blocks ====================

function initIoTActuatorBlocks() {
  // LED Control
  Blockly.Blocks['iot_led_set'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('set LED pin')
        .appendField(new Blockly.FieldNumber(13, 0, 40), 'PIN')
        .appendField(
          new Blockly.FieldDropdown([
            ['ON', 'ON'],
            ['OFF', 'OFF'],
          ]),
          'STATE'
        );
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#10b981');
      this.setTooltip('Turn LED on or off');
    },
  };

  pythonGenerator.forBlock['iot_led_set'] = function (block: Blockly.Block) {
    const pin = block.getFieldValue('PIN');
    const state = block.getFieldValue('STATE');
    return `led_set(${pin}, "${state}")\n`;
  };

  // Servo Motor
  Blockly.Blocks['iot_servo_set'] = {
    init: function () {
      this.appendValueInput('ANGLE')
        .setCheck('Number')
        .appendField('set servo pin')
        .appendField(new Blockly.FieldNumber(9, 0, 40), 'PIN')
        .appendField('angle');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#10b981');
      this.setTooltip('Set servo motor angle (0-180 degrees)');
    },
  };

  pythonGenerator.forBlock['iot_servo_set'] = function (block: Blockly.Block) {
    const pin = block.getFieldValue('PIN');
    const angle = pythonGenerator.valueToCode(block, 'ANGLE', Order.NONE) || '90';
    return `servo_set(${pin}, ${angle})\n`;
  };

  // Buzzer
  Blockly.Blocks['iot_buzzer'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('buzzer pin')
        .appendField(new Blockly.FieldNumber(8, 0, 40), 'PIN')
        .appendField('frequency')
        .appendField(new Blockly.FieldNumber(1000, 0, 20000), 'FREQ')
        .appendField('Hz duration')
        .appendField(new Blockly.FieldNumber(500, 0, 10000), 'DURATION')
        .appendField('ms');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#10b981');
      this.setTooltip('Play tone on buzzer');
    },
  };

  pythonGenerator.forBlock['iot_buzzer'] = function (block: Blockly.Block) {
    const pin = block.getFieldValue('PIN');
    const freq = block.getFieldValue('FREQ');
    const duration = block.getFieldValue('DURATION');
    return `buzzer_tone(${pin}, ${freq}, ${duration})\n`;
  };

  // Motor Control
  Blockly.Blocks['iot_motor_control'] = {
    init: function () {
      this.appendValueInput('SPEED')
        .setCheck('Number')
        .appendField('motor')
        .appendField(
          new Blockly.FieldDropdown([
            ['A', 'A'],
            ['B', 'B'],
          ]),
          'MOTOR'
        )
        .appendField(
          new Blockly.FieldDropdown([
            ['forward', 'FORWARD'],
            ['backward', 'BACKWARD'],
            ['stop', 'STOP'],
          ]),
          'DIRECTION'
        )
        .appendField('speed');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#10b981');
      this.setTooltip('Control DC motor');
    },
  };

  pythonGenerator.forBlock['iot_motor_control'] = function (block: Blockly.Block) {
    const motor = block.getFieldValue('MOTOR');
    const direction = block.getFieldValue('DIRECTION');
    const speed = pythonGenerator.valueToCode(block, 'SPEED', Order.NONE) || '255';
    return `motor_control("${motor}", "${direction}", ${speed})\n`;
  };
}

// ==================== IoT Display Blocks ====================

function initIoTDisplayBlocks() {
  // LCD Print
  Blockly.Blocks['iot_lcd_print'] = {
    init: function () {
      this.appendValueInput('TEXT')
        .setCheck('String')
        .appendField('LCD print');
      this.appendDummyInput()
        .appendField('row')
        .appendField(new Blockly.FieldNumber(0, 0, 3), 'ROW')
        .appendField('col')
        .appendField(new Blockly.FieldNumber(0, 0, 19), 'COL');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#22c55e');
      this.setTooltip('Print text on LCD display');
    },
  };

  pythonGenerator.forBlock['iot_lcd_print'] = function (block: Blockly.Block) {
    const text = pythonGenerator.valueToCode(block, 'TEXT', Order.NONE) || '""';
    const row = block.getFieldValue('ROW');
    const col = block.getFieldValue('COL');
    return `lcd_print(${text}, ${row}, ${col})\n`;
  };

  // LCD Clear
  Blockly.Blocks['iot_lcd_clear'] = {
    init: function () {
      this.appendDummyInput().appendField('LCD clear');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#22c55e');
      this.setTooltip('Clear LCD display');
    },
  };

  pythonGenerator.forBlock['iot_lcd_clear'] = function () {
    return 'lcd_clear()\n';
  };

  // OLED Print
  Blockly.Blocks['iot_oled_print'] = {
    init: function () {
      this.appendValueInput('TEXT')
        .setCheck('String')
        .appendField('OLED print');
      this.appendDummyInput()
        .appendField('x')
        .appendField(new Blockly.FieldNumber(0, 0, 127), 'X')
        .appendField('y')
        .appendField(new Blockly.FieldNumber(0, 0, 63), 'Y');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#22c55e');
      this.setTooltip('Print text on OLED display');
    },
  };

  pythonGenerator.forBlock['iot_oled_print'] = function (block: Blockly.Block) {
    const text = pythonGenerator.valueToCode(block, 'TEXT', Order.NONE) || '""';
    const x = block.getFieldValue('X');
    const y = block.getFieldValue('Y');
    return `oled_print(${text}, ${x}, ${y})\n`;
  };
}

// ==================== IoT Connectivity Blocks ====================

function initIoTConnectivityBlocks() {
  // WiFi Connect
  Blockly.Blocks['iot_wifi_connect'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('connect WiFi')
        .appendField('SSID')
        .appendField(new Blockly.FieldTextInput('network'), 'SSID')
        .appendField('password')
        .appendField(new Blockly.FieldTextInput('password'), 'PASSWORD');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#84cc16');
      this.setTooltip('Connect to WiFi network');
    },
  };

  pythonGenerator.forBlock['iot_wifi_connect'] = function (block: Blockly.Block) {
    const ssid = block.getFieldValue('SSID');
    const password = block.getFieldValue('PASSWORD');
    return `wifi_connect("${ssid}", "${password}")\n`;
  };

  // MQTT Connect
  Blockly.Blocks['iot_mqtt_connect'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('connect MQTT broker')
        .appendField(new Blockly.FieldTextInput('broker.hivemq.com'), 'BROKER')
        .appendField('port')
        .appendField(new Blockly.FieldNumber(1883, 0, 65535), 'PORT');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#84cc16');
      this.setTooltip('Connect to MQTT broker');
    },
  };

  pythonGenerator.forBlock['iot_mqtt_connect'] = function (block: Blockly.Block) {
    const broker = block.getFieldValue('BROKER');
    const port = block.getFieldValue('PORT');
    return `mqtt_connect("${broker}", ${port})\n`;
  };

  // MQTT Publish
  Blockly.Blocks['iot_mqtt_publish'] = {
    init: function () {
      this.appendValueInput('MESSAGE')
        .setCheck('String')
        .appendField('MQTT publish to')
        .appendField(new Blockly.FieldTextInput('topic'), 'TOPIC')
        .appendField('message');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#84cc16');
      this.setTooltip('Publish message to MQTT topic');
    },
  };

  pythonGenerator.forBlock['iot_mqtt_publish'] = function (block: Blockly.Block) {
    const topic = block.getFieldValue('TOPIC');
    const message = pythonGenerator.valueToCode(block, 'MESSAGE', Order.NONE) || '""';
    return `mqtt_publish("${topic}", ${message})\n`;
  };

  // MQTT Subscribe
  Blockly.Blocks['iot_mqtt_subscribe'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('MQTT subscribe to')
        .appendField(new Blockly.FieldTextInput('topic'), 'TOPIC');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#84cc16');
      this.setTooltip('Subscribe to MQTT topic');
    },
  };

  pythonGenerator.forBlock['iot_mqtt_subscribe'] = function (block: Blockly.Block) {
    const topic = block.getFieldValue('TOPIC');
    return `mqtt_subscribe("${topic}")\n`;
  };

  // HTTP GET
  Blockly.Blocks['iot_http_get'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('HTTP GET')
        .appendField(new Blockly.FieldTextInput('https://api.example.com'), 'URL');
      this.setOutput(true, 'String');
      this.setColour('#84cc16');
      this.setTooltip('Make HTTP GET request');
    },
  };

  pythonGenerator.forBlock['iot_http_get'] = function (block: Blockly.Block) {
    const url = block.getFieldValue('URL');
    return [`http_get("${url}")`, Order.FUNCTION_CALL];
  };

  // HTTP POST
  Blockly.Blocks['iot_http_post'] = {
    init: function () {
      this.appendValueInput('DATA')
        .setCheck('String')
        .appendField('HTTP POST')
        .appendField(new Blockly.FieldTextInput('https://api.example.com'), 'URL')
        .appendField('data');
      this.setOutput(true, 'String');
      this.setColour('#84cc16');
      this.setTooltip('Make HTTP POST request');
    },
  };

  pythonGenerator.forBlock['iot_http_post'] = function (block: Blockly.Block) {
    const url = block.getFieldValue('URL');
    const data = pythonGenerator.valueToCode(block, 'DATA', Order.NONE) || '""';
    return [`http_post("${url}", ${data})`, Order.FUNCTION_CALL];
  };
}

// ==================== AI Vision Blocks ====================

function initAIVisionBlocks() {
  // Image Classification
  Blockly.Blocks['ai_image_classify'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('classify image')
        .appendField(
          new Blockly.FieldDropdown([
            ['MobileNet', 'mobilenet'],
            ['ResNet', 'resnet'],
            ['Custom', 'custom'],
          ]),
          'MODEL'
        );
      this.setOutput(true, 'String');
      this.setColour('#8b5cf6');
      this.setTooltip('Classify image and return label');
    },
  };

  pythonGenerator.forBlock['ai_image_classify'] = function (block: Blockly.Block) {
    const model = block.getFieldValue('MODEL');
    return [`ai_classify_image("${model}")`, Order.FUNCTION_CALL];
  };

  // Object Detection
  Blockly.Blocks['ai_object_detect'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('detect objects')
        .appendField(
          new Blockly.FieldDropdown([
            ['COCO-SSD', 'coco-ssd'],
            ['YOLO', 'yolo'],
          ]),
          'MODEL'
        );
      this.setOutput(true, 'Array');
      this.setColour('#8b5cf6');
      this.setTooltip('Detect objects in image');
    },
  };

  pythonGenerator.forBlock['ai_object_detect'] = function (block: Blockly.Block) {
    const model = block.getFieldValue('MODEL');
    return [`ai_detect_objects("${model}")`, Order.FUNCTION_CALL];
  };

  // Face Detection
  Blockly.Blocks['ai_face_detect'] = {
    init: function () {
      this.appendDummyInput().appendField('detect faces');
      this.setOutput(true, 'Array');
      this.setColour('#8b5cf6');
      this.setTooltip('Detect faces in image');
    },
  };

  pythonGenerator.forBlock['ai_face_detect'] = function () {
    return ['ai_detect_faces()', Order.FUNCTION_CALL];
  };

  // Capture Image
  Blockly.Blocks['ai_capture_image'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('capture image from')
        .appendField(
          new Blockly.FieldDropdown([
            ['Camera', 'camera'],
            ['Webcam', 'webcam'],
          ]),
          'SOURCE'
        );
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#8b5cf6');
      this.setTooltip('Capture image from camera');
    },
  };

  pythonGenerator.forBlock['ai_capture_image'] = function (block: Blockly.Block) {
    const source = block.getFieldValue('SOURCE');
    return `ai_capture_image("${source}")\n`;
  };
}

// ==================== AI Speech Blocks ====================

function initAISpeechBlocks() {
  // Speech to Text
  Blockly.Blocks['ai_speech_to_text'] = {
    init: function () {
      this.appendDummyInput().appendField('listen for speech');
      this.setOutput(true, 'String');
      this.setColour('#a855f7');
      this.setTooltip('Convert speech to text');
    },
  };

  pythonGenerator.forBlock['ai_speech_to_text'] = function () {
    return ['ai_speech_to_text()', Order.FUNCTION_CALL];
  };

  // Text to Speech
  Blockly.Blocks['ai_text_to_speech'] = {
    init: function () {
      this.appendValueInput('TEXT').setCheck('String').appendField('speak');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#a855f7');
      this.setTooltip('Convert text to speech');
    },
  };

  pythonGenerator.forBlock['ai_text_to_speech'] = function (block: Blockly.Block) {
    const text = pythonGenerator.valueToCode(block, 'TEXT', Order.NONE) || '""';
    return `ai_text_to_speech(${text})\n`;
  };

  // Voice Command
  Blockly.Blocks['ai_voice_command'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('wait for command')
        .appendField(new Blockly.FieldTextInput('turn on'), 'COMMAND');
      this.setOutput(true, 'Boolean');
      this.setColour('#a855f7');
      this.setTooltip('Wait for specific voice command');
    },
  };

  pythonGenerator.forBlock['ai_voice_command'] = function (block: Blockly.Block) {
    const command = block.getFieldValue('COMMAND');
    return [`ai_voice_command("${command}")`, Order.FUNCTION_CALL];
  };
}

// ==================== AI Prediction Blocks ====================

function initAIPredictionBlocks() {
  // Predict Value
  Blockly.Blocks['ai_predict_value'] = {
    init: function () {
      this.appendValueInput('DATA')
        .setCheck('Array')
        .appendField('predict from data');
      this.setOutput(true, 'Number');
      this.setColour('#d946ef');
      this.setTooltip('Predict value using time series model');
    },
  };

  pythonGenerator.forBlock['ai_predict_value'] = function (block: Blockly.Block) {
    const data = pythonGenerator.valueToCode(block, 'DATA', Order.NONE) || '[]';
    return [`ai_predict_value(${data})`, Order.FUNCTION_CALL];
  };

  // Classify Data
  Blockly.Blocks['ai_classify_data'] = {
    init: function () {
      this.appendValueInput('DATA')
        .setCheck('Array')
        .appendField('classify data');
      this.setOutput(true, 'String');
      this.setColour('#d946ef');
      this.setTooltip('Classify data using ML model');
    },
  };

  pythonGenerator.forBlock['ai_classify_data'] = function (block: Blockly.Block) {
    const data = pythonGenerator.valueToCode(block, 'DATA', Order.NONE) || '[]';
    return [`ai_classify_data(${data})`, Order.FUNCTION_CALL];
  };

  // Anomaly Detection
  Blockly.Blocks['ai_anomaly_detect'] = {
    init: function () {
      this.appendValueInput('VALUE')
        .setCheck('Number')
        .appendField('is anomaly');
      this.setOutput(true, 'Boolean');
      this.setColour('#d946ef');
      this.setTooltip('Detect if value is anomalous');
    },
  };

  pythonGenerator.forBlock['ai_anomaly_detect'] = function (block: Blockly.Block) {
    const value = pythonGenerator.valueToCode(block, 'VALUE', Order.NONE) || '0';
    return [`ai_anomaly_detect(${value})`, Order.FUNCTION_CALL];
  };
}

// ==================== AI Model Blocks ====================

function initAIModelBlocks() {
  // Load Model
  Blockly.Blocks['ai_load_model'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('load model')
        .appendField(new Blockly.FieldTextInput('model_name'), 'MODEL');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#ec4899');
      this.setTooltip('Load AI model');
    },
  };

  pythonGenerator.forBlock['ai_load_model'] = function (block: Blockly.Block) {
    const model = block.getFieldValue('MODEL');
    return `ai_load_model("${model}")\n`;
  };

  // Run Inference
  Blockly.Blocks['ai_run_inference'] = {
    init: function () {
      this.appendValueInput('INPUT').setCheck(null).appendField('run inference on');
      this.setOutput(true, null);
      this.setColour('#ec4899');
      this.setTooltip('Run model inference');
    },
  };

  pythonGenerator.forBlock['ai_run_inference'] = function (block: Blockly.Block) {
    const input = pythonGenerator.valueToCode(block, 'INPUT', Order.NONE) || 'None';
    return [`ai_run_inference(${input})`, Order.FUNCTION_CALL];
  };

  // Train Model
  Blockly.Blocks['ai_train_model'] = {
    init: function () {
      this.appendValueInput('DATA').setCheck('Array').appendField('train model with');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#ec4899');
      this.setTooltip('Train model with data');
    },
  };

  pythonGenerator.forBlock['ai_train_model'] = function (block: Blockly.Block) {
    const data = pythonGenerator.valueToCode(block, 'DATA', Order.NONE) || '[]';
    return `ai_train_model(${data})\n`;
  };
}

// ==================== Event Blocks ====================

function initEventBlocks() {
  // On Start
  Blockly.Blocks['event_on_start'] = {
    init: function () {
      this.appendDummyInput().appendField('⚡ when program starts');
      this.appendStatementInput('DO').setCheck(null);
      this.setColour('#f97316');
      this.setTooltip('Run when program starts');
    },
  };

  pythonGenerator.forBlock['event_on_start'] = function (block: Blockly.Block) {
    const statements = pythonGenerator.statementToCode(block, 'DO');
    return `# On Start\ndef on_start():\n${statements || '  pass\n'}\n\non_start()\n`;
  };

  // On Button Press
  Blockly.Blocks['event_on_button'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('⚡ when button')
        .appendField(
          new Blockly.FieldDropdown([
            ['A', 'A'],
            ['B', 'B'],
            ['any', 'ANY'],
          ]),
          'BUTTON'
        )
        .appendField('pressed');
      this.appendStatementInput('DO').setCheck(null);
      this.setColour('#f97316');
      this.setTooltip('Run when button is pressed');
    },
  };

  pythonGenerator.forBlock['event_on_button'] = function (block: Blockly.Block) {
    const button = block.getFieldValue('BUTTON');
    const statements = pythonGenerator.statementToCode(block, 'DO');
    return `# On Button ${button}\ndef on_button_${button.toLowerCase()}():\n${statements || '  pass\n'}\n\nregister_button_handler("${button}", on_button_${button.toLowerCase()})\n`;
  };

  // On Sensor Change
  Blockly.Blocks['event_on_sensor_change'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('⚡ when')
        .appendField(
          new Blockly.FieldDropdown([
            ['temperature', 'temperature'],
            ['humidity', 'humidity'],
            ['light', 'light'],
            ['motion', 'motion'],
          ]),
          'SENSOR'
        )
        .appendField('changes');
      this.appendStatementInput('DO').setCheck(null);
      this.setColour('#f97316');
      this.setTooltip('Run when sensor value changes');
    },
  };

  pythonGenerator.forBlock['event_on_sensor_change'] = function (block: Blockly.Block) {
    const sensor = block.getFieldValue('SENSOR');
    const statements = pythonGenerator.statementToCode(block, 'DO');
    return `# On ${sensor} change\ndef on_${sensor}_change(value):\n${statements || '  pass\n'}\n\nregister_sensor_handler("${sensor}", on_${sensor}_change)\n`;
  };

  // On Message
  Blockly.Blocks['event_on_message'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('⚡ when message received on')
        .appendField(new Blockly.FieldTextInput('topic'), 'TOPIC');
      this.appendStatementInput('DO').setCheck(null);
      this.setColour('#f97316');
      this.setTooltip('Run when MQTT message received');
    },
  };

  pythonGenerator.forBlock['event_on_message'] = function (block: Blockly.Block) {
    const topic = block.getFieldValue('TOPIC');
    const statements = pythonGenerator.statementToCode(block, 'DO');
    return `# On message from ${topic}\ndef on_message_${topic.replace(/[^a-zA-Z0-9]/g, '_')}(message):\n${statements || '  pass\n'}\n\nregister_message_handler("${topic}", on_message_${topic.replace(/[^a-zA-Z0-9]/g, '_')})\n`;
  };

  // Timer Event
  Blockly.Blocks['event_timer'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('⚡ every')
        .appendField(new Blockly.FieldNumber(1000, 1), 'INTERVAL')
        .appendField('ms');
      this.appendStatementInput('DO').setCheck(null);
      this.setColour('#f97316');
      this.setTooltip('Run code at regular intervals');
    },
  };

  pythonGenerator.forBlock['event_timer'] = function (block: Blockly.Block) {
    const interval = block.getFieldValue('INTERVAL');
    const statements = pythonGenerator.statementToCode(block, 'DO');
    return `# Timer every ${interval}ms\ndef timer_callback():\n${statements || '  pass\n'}\n\nset_timer(${interval}, timer_callback)\n`;
  };
}

// ==================== Time Blocks ====================

function initTimeBlocks() {
  // Delay
  Blockly.Blocks['time_delay'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('wait')
        .appendField(new Blockly.FieldNumber(1000, 0), 'MS')
        .appendField('ms');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#fb923c');
      this.setTooltip('Wait for specified milliseconds');
    },
  };

  pythonGenerator.forBlock['time_delay'] = function (block: Blockly.Block) {
    const ms = block.getFieldValue('MS');
    return `delay(${ms})\n`;
  };

  // Millis
  Blockly.Blocks['time_millis'] = {
    init: function () {
      this.appendDummyInput().appendField('milliseconds since start');
      this.setOutput(true, 'Number');
      this.setColour('#fb923c');
      this.setTooltip('Get milliseconds since program started');
    },
  };

  pythonGenerator.forBlock['time_millis'] = function () {
    return ['millis()', Order.FUNCTION_CALL];
  };

  // Current Time
  Blockly.Blocks['time_current'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('current')
        .appendField(
          new Blockly.FieldDropdown([
            ['hour', 'hour'],
            ['minute', 'minute'],
            ['second', 'second'],
            ['day', 'day'],
            ['month', 'month'],
            ['year', 'year'],
          ]),
          'UNIT'
        );
      this.setOutput(true, 'Number');
      this.setColour('#fb923c');
      this.setTooltip('Get current time component');
    },
  };

  pythonGenerator.forBlock['time_current'] = function (block: Blockly.Block) {
    const unit = block.getFieldValue('UNIT');
    return [`get_current_time("${unit}")`, Order.FUNCTION_CALL];
  };
}
