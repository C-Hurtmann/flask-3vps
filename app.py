import os
import requests

from flask import Flask, render_template, redirect, request, flash


app = Flask(__name__)
app.config['UPLOAD_DIRECTORY'] = 'uploads/'
app.config['SECRET_KEY'] = 'your_secret_key_here'


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
    
    file_path = upload_file(url)
    if file_path:
        flash('File has been uploaded')
    else:
        flash('Error', category='error')
    
    return redirect('/')


if __name__ =='__main__':
    app.run(debug=True)
