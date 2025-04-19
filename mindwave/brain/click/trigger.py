# brain/click/trigger.py
import requests
import pyautogui

BACKEND_URL = "http://localhost:8000/click"

def trigger_backend_click():
    """Send a click signal to FastAPI backend."""
    try:
        response = requests.post(BACKEND_URL)
        print("Click sent to backend:", response.status_code)
    except Exception as e:
        print("Failed to send click to backend:", e)

def trigger_local_mouse_click():
    """Optionally simulate a mouse click on local machine."""
    print("Local mouse click triggered.")
    pyautogui.click()
