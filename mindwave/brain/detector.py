import time
import textwrap
from mindwavemobile.MindwaveDataPoints import EEGPowersDataPoint
from mindwavemobile.MindwaveDataPointReader import MindwaveDataPointReader

from click.trigger import trigger_backend_click  # ← using our modular function

THRESHOLD_VALUE = 500000
COOLDOWN = 2
last_click_time = 0

if __name__ == '__main__':
    mindwave = MindwaveDataPointReader()
    mindwave.start()
    if mindwave.isConnected():
        while True:
            dataPoint = mindwave.readNextDataPoint()
            if isinstance(dataPoint, EEGPowersDataPoint):
                theta = dataPoint.theta
                if theta and theta > THRESHOLD_VALUE:
                    if time.time() - last_click_time > COOLDOWN:
                        trigger_backend_click()
                        last_click_time = time.time()
    else:
        print(textwrap.dedent("""\
            Could not connect to the Mindwave Mobile device. Exiting...
        """))
