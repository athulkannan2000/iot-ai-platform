"""Code Generator Service - Converts Blockly XML to executable code"""

import re
import xml.etree.ElementTree as ET
from typing import List, Tuple, Optional


class CodeGenerator:
    """Generates code from Blockly workspace XML"""

    def __init__(self, language: str = "python", target_device: Optional[str] = None):
        self.language = language
        self.target_device = target_device
        self.variables = set()
        self.functions = []
        self.imports = set()

    def generate(self, blocks_xml: str) -> Tuple[str, List[str]]:
        """Generate code from Blockly XML"""
        warnings = []
        
        if not blocks_xml or blocks_xml.strip() == "":
            return self._get_empty_template(), []
        
        try:
            # Parse the Blockly XML
            root = ET.fromstring(blocks_xml)
        except ET.ParseError:
            warnings.append("Invalid XML format, using empty template")
            return self._get_empty_template(), warnings
        
        code_lines = []
        
        # Process each block
        for block in root.findall(".//block"):
            block_type = block.get("type", "")
            block_code = self._process_block(block)
            if block_code:
                code_lines.append(block_code)
        
        # Build final code
        code = self._build_code(code_lines)
        
        return code, warnings

    def _process_block(self, block: ET.Element) -> str:
        """Process a single block and return code"""
        block_type = block.get("type", "")
        
        # Map Blockly block types to code generation methods
        generators = {
            # Logic
            "controls_if": self._gen_if,
            "logic_compare": self._gen_compare,
            "logic_operation": self._gen_logic_op,
            "logic_boolean": self._gen_boolean,
            
            # Loops
            "controls_repeat_ext": self._gen_repeat,
            "controls_whileUntil": self._gen_while,
            "controls_for": self._gen_for,
            
            # Math
            "math_number": self._gen_number,
            "math_arithmetic": self._gen_arithmetic,
            
            # Text
            "text": self._gen_text,
            "text_print": self._gen_print,
            
            # IoT
            "iot_digital_read": self._gen_digital_read,
            "iot_digital_write": self._gen_digital_write,
            "iot_analog_read": self._gen_analog_read,
            "iot_led_set": self._gen_led_set,
            "iot_read_temperature": self._gen_read_temp,
            
            # AI
            "ai_image_classify": self._gen_ai_classify,
            "ai_text_to_speech": self._gen_tts,
            
            # Events
            "event_on_start": self._gen_on_start,
            "time_delay": self._gen_delay,
        }
        
        generator = generators.get(block_type)
        if generator:
            return generator(block)
        
        return ""

    def _gen_if(self, block: ET.Element) -> str:
        if self.language == "python":
            return "if condition:\n    pass"
        return "if (condition) {\n}"

    def _gen_compare(self, block: ET.Element) -> str:
        return "a == b"

    def _gen_logic_op(self, block: ET.Element) -> str:
        if self.language == "python":
            return "a and b"
        return "a && b"

    def _gen_boolean(self, block: ET.Element) -> str:
        if self.language == "python":
            return "True"
        return "true"

    def _gen_repeat(self, block: ET.Element) -> str:
        if self.language == "python":
            return "for i in range(10):\n    pass"
        return "for (int i = 0; i < 10; i++) {\n}"

    def _gen_while(self, block: ET.Element) -> str:
        if self.language == "python":
            return "while condition:\n    pass"
        return "while (condition) {\n}"

    def _gen_for(self, block: ET.Element) -> str:
        if self.language == "python":
            return "for i in range(1, 11):\n    pass"
        return "for (int i = 1; i <= 10; i++) {\n}"

    def _gen_number(self, block: ET.Element) -> str:
        field = block.find("field[@name='NUM']")
        return field.text if field is not None else "0"

    def _gen_arithmetic(self, block: ET.Element) -> str:
        return "a + b"

    def _gen_text(self, block: ET.Element) -> str:
        field = block.find("field[@name='TEXT']")
        text = field.text if field is not None else ""
        return f'"{text}"'

    def _gen_print(self, block: ET.Element) -> str:
        if self.language == "python":
            self.imports.add("# Print function")
            return 'print("Hello World")'
        return 'Serial.println("Hello World");'

    def _gen_digital_read(self, block: ET.Element) -> str:
        field = block.find("field[@name='PIN']")
        pin = field.text if field is not None else "2"
        if self.language == "python":
            return f"digital_read({pin})"
        return f"digitalRead({pin})"

    def _gen_digital_write(self, block: ET.Element) -> str:
        pin_field = block.find("field[@name='PIN']")
        value_field = block.find("field[@name='VALUE']")
        pin = pin_field.text if pin_field is not None else "2"
        value = value_field.text if value_field is not None else "HIGH"
        
        if self.language == "python":
            return f'digital_write({pin}, "{value}")'
        return f"digitalWrite({pin}, {value});"

    def _gen_analog_read(self, block: ET.Element) -> str:
        field = block.find("field[@name='PIN']")
        pin = field.text if field is not None else "0"
        if self.language == "python":
            return f"analog_read({pin})"
        return f"analogRead(A{pin})"

    def _gen_led_set(self, block: ET.Element) -> str:
        pin_field = block.find("field[@name='PIN']")
        state_field = block.find("field[@name='STATE']")
        pin = pin_field.text if pin_field is not None else "13"
        state = state_field.text if state_field is not None else "ON"
        
        if self.language == "python":
            return f'led_set({pin}, "{state}")'
        value = "HIGH" if state == "ON" else "LOW"
        return f"digitalWrite({pin}, {value});"

    def _gen_read_temp(self, block: ET.Element) -> str:
        sensor_field = block.find("field[@name='SENSOR']")
        pin_field = block.find("field[@name='PIN']")
        sensor = sensor_field.text if sensor_field is not None else "DHT11"
        pin = pin_field.text if pin_field is not None else "4"
        
        if self.language == "python":
            return f'read_temperature("{sensor}", {pin})'
        return f'readTemperature({pin})'

    def _gen_ai_classify(self, block: ET.Element) -> str:
        model_field = block.find("field[@name='MODEL']")
        model = model_field.text if model_field is not None else "mobilenet"
        
        if self.language == "python":
            return f'ai_classify_image("{model}")'
        return f'classifyImage("{model}")'

    def _gen_tts(self, block: ET.Element) -> str:
        if self.language == "python":
            return 'ai_text_to_speech("Hello")'
        return 'textToSpeech("Hello");'

    def _gen_on_start(self, block: ET.Element) -> str:
        if self.language == "python":
            return "def on_start():\n    pass\n\non_start()"
        return "void setup() {\n}"

    def _gen_delay(self, block: ET.Element) -> str:
        field = block.find("field[@name='MS']")
        ms = field.text if field is not None else "1000"
        if self.language == "python":
            self.imports.add("import time")
            return f"time.sleep({int(ms) / 1000})"
        return f"delay({ms});"

    def _get_empty_template(self) -> str:
        """Return an empty code template"""
        if self.language == "python":
            return '''# IoT & AI Visual Platform
# Generated Python Code

from iot_platform import *

def setup():
    """Initialize your project here"""
    pass

def loop():
    """Main program loop"""
    pass

if __name__ == "__main__":
    setup()
    while True:
        loop()
'''
        elif self.language == "cpp":
            return '''// IoT & AI Visual Platform
// Generated Arduino C++ Code

void setup() {
    // Initialize your project here
    Serial.begin(9600);
}

void loop() {
    // Main program loop
}
'''
        else:  # javascript
            return '''// IoT & AI Visual Platform
// Generated JavaScript Code

const { setup, loop } = require('./iot-platform');

async function main() {
    await setup();
    
    while (true) {
        await loop();
    }
}

main().catch(console.error);
'''

    def _build_code(self, code_lines: List[str]) -> str:
        """Build the final code from collected lines"""
        if not code_lines:
            return self._get_empty_template()
        
        if self.language == "python":
            header = "# IoT & AI Visual Platform\n# Generated Python Code\n\n"
            imports = "\n".join(sorted(self.imports)) + "\n\n" if self.imports else ""
            body = "\n".join(code_lines)
            return header + imports + body
        
        elif self.language == "cpp":
            header = "// IoT & AI Visual Platform\n// Generated Arduino C++ Code\n\n"
            body = "\n".join(code_lines)
            return header + body
        
        else:
            header = "// IoT & AI Visual Platform\n// Generated JavaScript Code\n\n"
            body = "\n".join(code_lines)
            return header + body

    def validate(self, code: str) -> bool:
        """Basic code validation"""
        if self.language == "python":
            try:
                compile(code, "<string>", "exec")
                return True
            except SyntaxError:
                return False
        # For other languages, just check it's not empty
        return len(code.strip()) > 0
