from flask import Flask, send_file, request
import csv
import os
import json

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

key_names = ['R1_6', 'R1_9', 'R2_6', 'R2_9']

def stats():
    """
    Total count of each kind
    Total revenue from each kind
    Same grouping each round
    Grand total revenue

    Use tree order
    """
    stat_data = {key: 0 for key in key_names}

    with open("submissions.csv", "r") as f:
        reader = csv.DictReader(f)
        for row in reader:
            for key in key_names:
                stat_data[key] += int(row.get(key, 0))

    return json.dumps(stat_data)



@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    print(data)
    expected_keys = ['timestamp'] + key_names
    need_header = os.path.exists("submissions.csv")
    with open("submissions.csv", "a") as f:
        writer = csv.writer(f)
        if not need_header:
            writer.writerow(expected_keys)
        
        writer.writerow([data.get(key, '') for key in expected_keys])

    return stats()


@app.route('/download')
def download():
    return send_file('submissions.csv', as_attachment=True)