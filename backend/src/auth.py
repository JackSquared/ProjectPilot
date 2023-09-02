from flask import Blueprint, jsonify, request, redirect, url_for
from flask_login import login_user, logout_user, login_required
from .db import db
from .models.User import User

auth = Blueprint('auth', __name__)

@auth.route('/signup', methods=['POST'])
def signup_post():
    email = request.json.get('email')
    password = request.json.get('password')
    user = User.query.filter_by(email=email).first()

    if user:
        return jsonify({'message': 'Email address already exists'}), 400

    new_user = User(email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created'}), 201


@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()

    if user and user.check_password(data['password']):
        login_user(user)
        return jsonify({"message": "Logged in"}), 200
    else:
        return jsonify({"message": "Invalid email or password."}), 401


@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))