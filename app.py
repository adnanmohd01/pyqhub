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


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    message = (data.get("message") or "").strip().lower()

    if not message:
        return {"response": "Please type a message so I can help you!"}, 400

    if any(w in message for w in ["btech", "b.tech", "engineering"]):
        reply = (
            "You can access and download <strong>B.Tech question papers</strong> for all semesters on our "
            "<a href='/btech'>B.Tech PYQs page</a>. Papers include Engineering Mathematics, Physics, and more!"
        )
    elif any(w in message for w in ["resource", "note", "book", "material", "syllabus", "notes"]):
        reply = (
            "Looking for notes or syllabus? Visit our "
            "<a href='/study-resources'>Study Resources</a> section to find lecture notes, e-books, and exam syllabus."
        )
    elif any(w in message for w in ["contact", "email", "phone", "call", "helpdesk", "support", "address", "location"]):
        reply = (
            "You can reach us at <strong>adnanmohd739296@gmail.com</strong> or call <strong>+91 83170 34038</strong>. "
            "Our campus is located at <strong>Invertis University, Bareilly</strong>. You can also send a direct message on our <a href='/contact'>Contact page</a>."
        )
    elif any(w in message for w in ["course", "bba", "bca", "mba", "bsc"]):
        reply = (
            "We provide materials for <strong>B.Tech, BBA, BCA, MBA, and B.Sc</strong>. "
            "Explore them directly from the <a href='/home'>Home page</a> or check question papers under <a href='/btech'>B.Tech PYQs</a>."
        )
    elif any(w in message for w in ["about", "invertis", "placement"]):
        reply = (
            "Invertis University Bareilly offers world-class education with top placement packages up to ₹41 LPA! "
            "Learn more on our <a href='/about'>About Us</a> page."
        )
    elif any(w in message for w in ["hello", "hi", "hey", "namaste"]):
        reply = "Hello! 😊 How can I help you with your studies, past papers, or questions today?"
    elif any(w in message for w in ["thank", "thanks"]):
        reply = "You're very welcome! Feel free to ask whenever you need past exam papers or study materials. 🎓"
    else:
        reply = (
            "I can help you find <strong>Previous Year Question Papers (PYQs)</strong>, study notes, syllabus, and contact information. "
            "Try asking about: <br>• <em>B.Tech papers</em><br>• <em>Study notes</em><br>• <em>Contact details</em><br>• <em>Help & FAQs</em>"
        )

    return {"response": reply}


@app.errorhandler(404)
def page_not_found(e):
    return render_template("pyqhub.html"), 404


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
