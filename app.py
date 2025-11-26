from flask import Flask, send_file, request
import csv
import os

app = Flask(__name__, static_folder='static')



@app.route('/')
def home():
    return send_file('frontend/index.html')


@app.route('/script.js')
def script():
    return send_file('frontend/index.js')

@app.route('/style.css')
def style():
    return send_file('frontend/index.css')


@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    print(data)
    expected_keys = ['timestamp', 'button_1', 'button_2', 'button_3']
    need_header = os.path.exists("submissions.csv")
    with open("submissions.csv", "a") as f:
        writer = csv.writer(f)
        if not need_header:
            writer.writerow(expected_keys)
        
        writer.writerow([data.get(key, '') for key in expected_keys])

    return 'Form submitted successfully!'


@app.route('/download')
def download():
    return send_file('submissions.csv', as_attachment=True)