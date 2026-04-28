import json
import urllib.request
import urllib.error

url = 'https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyBoy6hsnKwuKLOBN97FLU43wLhx5CgsgSg'

try:
    with urllib.request.urlopen(url) as response:
        data = json.loads(response.read().decode('utf-8'))
        models = [m['name'] for m in data['models'] if 'generateContent' in m.get('supportedGenerationMethods', [])]
        print("Supported Models:")
        for m in models:
            print(m)
except Exception as e:
    print("Error:", str(e))
