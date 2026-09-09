from flask import Flask, render_template, request, redirect, url_for, flash

app = Flask(__name__)
app.secret_key = "invertis-pyqs-hub-secret-key"


@app.route("/")
@app.route("/home")
def home():
    return render_template("pyqhub.html")


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/btech")
def btech():
    return render_template("btech.html")


@app.route("/study-resources")
@app.route("/studyreso")
def study_resources():
    return render_template("studyreso.html")


@app.route("/contact", methods=["GET", "POST"])
def contact():
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        subject = request.form.get("subject")
        message = request.form.get("message")
        flash("Thank you for reaching out! Your message has been received.", "success")
        return render_template("contact.html", submitted=True, name=name)
    return render_template("contact.html")


@app.route("/help")
def help():
    return render_template("help.html")


@app.errorhandler(404)
def page_not_found(e):
    return render_template("pyqhub.html"), 404


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
