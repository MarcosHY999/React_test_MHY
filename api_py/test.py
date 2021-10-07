import requests
import time

BASE = "http://127.0.0.1:5000/"

response = requests.put(BASE + "subscription?id=5&subscription=1")
print(response.text)

time.sleep(5)

response = requests.get(BASE + "subscription?id=5")
print(response.text)
