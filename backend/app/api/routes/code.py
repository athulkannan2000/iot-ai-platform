"""Code generation routes"""

from fastapi import APIRouter, HTTPException
from app.schemas import CodeGenerationRequest, CodeGenerationResponse
from app.services.code_generator import CodeGenerator

router = APIRouter()


@router.post("/generate", response_model=CodeGenerationResponse)
async def generate_code(request: CodeGenerationRequest):
    """Generate code from Blockly XML"""
    try:
        generator = CodeGenerator(request.language, request.target_device)
        code, warnings = generator.generate(request.blocks)
        return CodeGenerationResponse(
            code=code,
            language=request.language,
            warnings=warnings,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Code generation failed: {str(e)}")


@router.post("/validate")
async def validate_code(request: CodeGenerationRequest):
    """Validate generated code"""
    try:
        generator = CodeGenerator(request.language, request.target_device)
        code, warnings = generator.generate(request.blocks)
        is_valid = generator.validate(code)
        return {
            "valid": is_valid,
            "warnings": warnings,
            "errors": [] if is_valid else ["Syntax error in generated code"],
        }
    except Exception as e:
        return {
            "valid": False,
            "warnings": [],
            "errors": [str(e)],
        }


@router.get("/templates/{template_name}")
async def get_code_template(template_name: str, language: str = "python"):
    """Get a code template for a specific project type"""
    templates = {
        "blink": {
            "python": """# LED Blink Example
import time
from iot_platform import digital_write, pin_mode

LED_PIN = 13

def setup():
    pin_mode(LED_PIN, "OUTPUT")

def loop():
    digital_write(LED_PIN, "HIGH")
    time.sleep(1)
    digital_write(LED_PIN, "LOW")
    time.sleep(1)

if __name__ == "__main__":
    setup()
    while True:
        loop()
""",
            "cpp": """// LED Blink Example
const int LED_PIN = 13;

void setup() {
    pinMode(LED_PIN, OUTPUT);
}

void loop() {
    digitalWrite(LED_PIN, HIGH);
    delay(1000);
    digitalWrite(LED_PIN, LOW);
    delay(1000);
}
""",
        },
        "temperature": {
            "python": """# Temperature Monitor Example
import time
from iot_platform import read_temperature

SENSOR_PIN = 4

def setup():
    print("Temperature Monitor Started")

def loop():
    temp = read_temperature("DHT11", SENSOR_PIN)
    print(f"Temperature: {temp}°C")
    time.sleep(2)

if __name__ == "__main__":
    setup()
    while True:
        loop()
""",
        },
        "ai_classify": {
            "python": """# AI Image Classification Example
from iot_platform import ai_capture_image, ai_classify_image

def main():
    # Capture image from camera
    ai_capture_image("camera")
    
    # Classify the image
    result = ai_classify_image("mobilenet")
    print(f"Classification: {result}")

if __name__ == "__main__":
    main()
""",
        },
    }

    if template_name not in templates:
        raise HTTPException(status_code=404, detail="Template not found")

    template_data = templates[template_name]
    if language not in template_data:
        raise HTTPException(
            status_code=400, detail=f"Template not available in {language}"
        )

    return {
        "template": template_name,
        "language": language,
        "code": template_data[language],
    }
