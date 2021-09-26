from flask_wtf import FlaskForm
from wtforms import  SubmitField,StringField,PasswordField
from wtforms.validators import InputRequired,Length,EqualTo,Regexp


class LoginForm(FlaskForm):
    username = StringField("username",validators=[InputRequired()])
    password = PasswordField("Password",validators=[InputRequired()])
    submit = SubmitField("Submit")

class RegisterForm(FlaskForm):
    #regex for alphanumeric username from https://stackoverflow.com/a/342977
    username = StringField("Username",validators=[InputRequired(),Length(min=4,max=15),Regexp(regex='^\w+$',message="Alpha Numeric characters only (a-z,A-Z,0-9,_)")])
    password = PasswordField("Password",validators=[InputRequired(),Length(min=8,max=30)])
    password2 = PasswordField("Confirm password",validators=[InputRequired(),Length(min=8,max=30),EqualTo('password')])
    submit = SubmitField("Submit")