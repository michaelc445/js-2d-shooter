from flask import Flask,session,render_template,redirect,url_for,g,request
from database import get_db, close_db
from flask_session import Session
from forms import RegisterForm,LoginForm
from werkzeug.security import generate_password_hash, check_password_hash
import json
from functools import wraps
app = Flask(__name__)
app.config["SECRET_KEY"]="This-is-my-secret-key"
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

@app.teardown_appcontext
def close_db_at_end_of_request(e=None):
    close_db(e)


@app.before_request
def load_logged_in_user():
    g.user = session.get("user_id",None)
    g.username = session.get("username",None)

def login_required(view):
    @wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for('login'))
        return view(**kwargs)
    return wrapped_view


@app.route("/",methods=["GET","POST"])
def home():

    return render_template("index.html")

@app.route("/register",methods=["GET","POST"])
def register():
    form = RegisterForm()
    db = get_db()
    if form.validate_on_submit():

        username = form.username.data.lower()
        
        password = form.password.data
        
        #check username does not exist
        result = db.execute("""SELECT * FROM users where username = ?""",(username,)).fetchone()

        if result:
            form.username.errors.append("Username already taken")
            return render_template("register.html",form=form)
        else:
            
            db.execute("""INSERT INTO users (username,password) VALUES (?,?)""",(username,generate_password_hash(password)))
            db.commit()
            return redirect(url_for('login'))
    
    return render_template("register.html",form=form)

@app.route("/login",methods=["GET","POST"])
def login():
    form = LoginForm()
    db = get_db()

    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data
        #check if username exists
        result = db.execute("""SELECT * FROM users where username = ?""",(username.lower(),)).fetchone()
        if result:
            if check_password_hash(result["password"],password):
                session.clear()
                session["user_id"] = result['user_id']
                session["username"] = result['username']

                return redirect(url_for('game'))
            else:
                form.password.errors.append("Incorrect password")
                return render_template("login.html",form=form)
        else:
            form.username.errors.append("Invalid username")
            return render_template("login.html",form=form)

    return render_template("login.html",form=form)

@app.route("/logout",methods=["GET","POST"])
@login_required
def logout():
    session.clear()
    return redirect(url_for('home'))

@app.route("/game",methods=["GET","POST"])
@login_required
def game():
    
    return render_template("game.html",username=session["username"])

@app.route("/leaderboard",methods=["GET","POST"])
def leaderboard():
    db = get_db()
    result = db.execute("""SELECT u1.username,s1.score FROM scores as s1 JOIN users as u1 on u1.user_id = s1.user_id order by s1.score desc""")
    return render_template("leaderboard.html",result=result)

@app.route("/post_score",methods=["POST"])
def post_score():
    db=get_db()
    data = json.loads(request.data)
    username = data["username"]
    score = data["score"]
    user_exist = db.execute("""select * from users where username = ?""",(username,)).fetchone()
    if user_exist:
        result = db.execute("""select * from scores where user_id =(select user_id from users where username = ?)""",(username,)).fetchone()
        if result:
            db.execute("""UPDATE scores set score = ? where user_id =(select user_id from users where username = ?) and score < ?""",(score,username,score))
        else:
            
            db.execute("""insert into scores(user_id,score) values (?,?)""",(user_exist["user_id"],score))
        db.commit()
    
    
    return "success",200

