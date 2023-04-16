import os
import json
import http.client

def handler(event, context):
  print(event)
  return {
    "statusCode": 200,
    "body": json.dumps({
      "success": "true",
      "capturedEvent": event
    }),
    "headers": {
      "Content-Type": "application/json"
    }
  }
