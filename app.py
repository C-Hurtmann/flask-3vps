import os
import requests

from celery import Celery
from flask import Flask, render_template, redirect, request, flash, jsonify, url_for


app = Flask(__name__)
app.config['UPLOAD_DIRECTORY'] = 'uploads/'
app.config['SECRET_KEY'] = 'your_secret_key_here'
app.config['CELERY_BROKER_URL'] = 'redis://redis:6379/0'

celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
celery.conf.update(app.config)

@celery.task
def upload_file(url):
    response = requests.get(url)
    if response.status_code == 200:
        file_path = os.path.join(
            app.config['UPLOAD_DIRECTORY'],
            os.path.basename(url),
        )
        with open(file_path, 'wb') as f:
            f.write(response.content)
        return file_path

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    url = request.form['url']
    file_path = upload_file.apply_async(args=[url])
    return redirect(url_for('index'))


if __name__ =='__main__':
    app.run(debug=True, host='0.0.0.0')
