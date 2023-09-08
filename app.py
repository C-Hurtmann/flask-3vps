from datetime import datetime
from time import sleep

import os
from werkzeug.utils import secure_filename

from celery import Celery
from flask import Flask, render_template, redirect, request, url_for, Response
from flask_sse import sse


app = Flask(__name__)

app.config['UPLOAD_DIRECTORY'] = 'uploads/'
app.config['SECRET_KEY'] = 'your_secret_key_here'
app.config['CELERY_BROKER_URL'] = 'redis://localhost:6379/0'


celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
celery.conf.update(app.config)

@celery.task
def upload_file(file_data, file_name):
    file_path = os.path.join(
        app.config['UPLOAD_DIRECTORY'],
        secure_filename(file_name),
    )
    with open(file_path, 'wb') as f:
        f.write(file_data)
    return file_path

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']
    if file:
        file_data = file.read()
        file_name = file.filename
        file_path = upload_file.apply_async(args=[file_data, file_name])
    return redirect(url_for('index'))


if __name__ =='__main__':
    app.run(debug=True, host='0.0.0.0')
