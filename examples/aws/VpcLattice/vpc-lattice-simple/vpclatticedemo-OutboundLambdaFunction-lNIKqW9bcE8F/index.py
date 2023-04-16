import os
import json
import http.client

def handler(event, context):
  conn = http.client.HTTPSConnection(os.environ["ENDPOINT"])

  conn.request("POST", "/", json.dumps(event), {
    "Content-Type": 'application/json'
  })
  res = conn.getresponse()
  data = res.read()

  print(data.decode("utf-8"))
