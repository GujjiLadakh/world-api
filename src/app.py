from flask import Flask, jsonify
import json

app = Flask(__name__)

with open('countries.json') as f:
    countries = json.load(f)

@app.route('/<name>', methods=['GET'])
def get_country(name):
    data = countries.get(name.lower())
    if data:
        return jsonify(data)
    else:
        return jsonify({'error': 'Country not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)
