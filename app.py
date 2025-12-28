from flask import Flask, send_file, request, redirect
import csv
import os
import json

app = Flask(__name__, static_folder='static')

data_file_name = "submissions.csv"


@app.route('/')
def home():
    return send_file('frontend/index.html')


@app.route('/script.js')
def script():
    return send_file('frontend/index.js')

@app.route('/style.css')
def style():
    return send_file('frontend/index.css')


def get_column_names():
    if not os.path.exists(data_file_name):
        return None
    with open(data_file_name, "r") as f:
        reader = csv.DictReader(f)
        return reader.fieldnames


def stats():
    """
    Total count of each kind
    Total revenue from each kind
    Same grouping each round
    Grand total revenue

    Use tree order
    """
    stat_data = {}
    for key_name in get_column_names():
        if key_name != "timestamp":
            stat_data[key_name] = 0
    try:
        print(stat_data)
        with open(data_file_name, "r") as f:
            reader = csv.DictReader(f)
            # next(reader)
            for row in reader:
                for key in stat_data.keys():
                    print(row, key)
                    stat_data[key] += int(row.get(key, 0))
        return json.dumps(stat_data)
    except (FileNotFoundError, StopIteration):
        return json.dumps(stat_data)


@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    print("data:", data)
    with open(data_file_name, "a") as f:
        writer = csv.DictWriter(f, get_column_names())
        writer.writerow(data)
    return stats()


@app.route('/download')
def download():
    return send_file(data_file_name, as_attachment=True)


@app.route('/stats')
def get_stats():
    return stats()

@app.route('/file_reset', methods=["POST"])
def ensure_log_ready():
    """
    This should be called only when wiping the file. It also sets up the columns for everything.
    """
    if os.path.exists(data_file_name):
        os.remove(data_file_name)
    data = request.get_json()
    with open(data_file_name, "w") as f:
        writer = csv.DictWriter(f, data)
        writer.writeheader()
    return stats()
        

