import os
import re
import sqlite3
import datetime
import requests
import pytz
import mimetypes

from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from flask_xcaptcha import XCaptcha
from flask_compress import Compress
from flask_mailman import Mail, EmailMessage

# ✅ Načtení proměnných z .env souboru
load_dotenv()

# ✅ Inicializace Flask aplikace
app = Flask(__name__, static_folder='static')

# ✅ Komprese a CORS
Compress(app)
CORS(app)

mimetypes.add_type("image/webp", ".webp")

# ✅ Konfigurace reCAPTCHA
app.config.update(
    XCAPTCHA_SITE_KEY=os.getenv("RECAPTCHA_SITE_KEY"),
    XCAPTCHA_SECRET_KEY=os.getenv("RECAPTCHA_SECRET_KEY")
)
xcaptcha = XCaptcha(app)

# ✅ Konfigurace Google Places API
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
PLACE_ID = os.getenv("PLACE_ID")

# ✅ Konfigurace Flask-Mail (Gmail SMTP)
app.config.update({
    "MAIL_SERVER": os.getenv("MAIL_SERVER"),
    "MAIL_PORT": int(os.getenv("MAIL_PORT", 587)),
    "MAIL_USE_TLS": os.getenv("MAIL_USE_TLS", "True") == "True",
    "MAIL_USERNAME": os.getenv("MAIL_USERNAME"),
    "MAIL_PASSWORD": os.getenv("MAIL_PASSWORD"),
    "MAIL_DEFAULT_SENDER": os.getenv("MAIL_DEFAULT_SENDER"),
})

mail = Mail(app)

# ✅ Inicializace databáze
def init_db():
    try:
        with sqlite3.connect("contacts.db") as conn:
            conn.execute('''CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )''')
    except sqlite3.Error as e:
        print(f"❌ Chyba při inicializaci databáze: {e}")

init_db()

# ✅ Validace vstupu
def is_valid_email(email):
    return bool(re.fullmatch(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", email))

def is_valid_phone(phone):
    return bool(re.fullmatch(r"^\+420\d{9}$|^\d{9}$", phone))

# ✅ Pomocné funkce pro odpovědi
def success_response(message):
    return jsonify({"success": "success", "message": message}), 200

def error_response(message, status_code=400):
    return jsonify({"success": "error", "error": message}), status_code

@app.route('/submit_form', methods=['POST'])
def submit_form():
    try:
        data = request.form
        name, email, phone, message = map(str.strip, [
            data.get('name', ''),
            data.get('email', ''),
            data.get('phone', ''),
            data.get('message', '')
        ])

        if not all([name, email, phone, message]):
            return error_response("Všechna pole jsou povinná!")

        if not is_valid_email(email):
            return error_response("Neplatná e-mailová adresa!")
        if not is_valid_phone(phone):
            return error_response("Neplatné telefonní číslo!")

        # ✅ Ověření reCAPTCHA
        recaptcha_token = data.get('g-recaptcha-response')
        if not recaptcha_token:
            return error_response("Chybí reCAPTCHA token.")

        recaptcha_result = requests.post(
            'https://www.google.com/recaptcha/api/siteverify',
            data={
                'secret': os.getenv("RECAPTCHA_SECRET_KEY"),
                'response': recaptcha_token
            }
        ).json()

        if not recaptcha_result.get("success"):
            return error_response("Ověření reCAPTCHA selhalo!")

        # ✅ Uložení do DB
        with sqlite3.connect("contacts.db") as conn:
            conn.execute(
                "INSERT INTO messages (name, email, phone, message) VALUES (?, ?, ?, ?)",
                (name, email, phone, message)
            )

        # ✅ Odeslání e-mailu přes Flask-Mailman
        try:
            sender_addr = email or app.config["MAIL_DEFAULT_SENDER"]
            email_msg = EmailMessage(
                subject="Nová zpráva z kontaktního formuláře",
                body=(
                    f"Jméno: {name}\n"
                    f"E-mail: {email}\n"
                    f"Telefon: {phone}\n\n"
                    f"Zpráva:\n{message}"
                ),
                to=[app.config["MAIL_USERNAME"]],
                from_email=sender_addr
            )
            email_msg.send()
        except Exception as mail_error:
            return error_response(
                f"Zpráva byla uložena, ale e-mail se nepodařilo odeslat: {mail_error}",
                500
            )

        return success_response({})

    except Exception as e:
        return error_response(f"Chyba serveru: {e}", 500)

# 🌟 Získání recenzí z Google Places API
@app.route('/reviews', methods=['GET'])
def get_reviews():
    if not GOOGLE_API_KEY or not PLACE_ID:
        return error_response("Chybí API klíč nebo PLACE ID", 500)

    url = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={PLACE_ID}&fields=name,reviews,rating&key={GOOGLE_API_KEY}&language=cs"

    try:
        response = requests.get(url)
        data = response.json()

        if response.status_code != 200:
            return error_response("Chyba při načítání dat z Google Places API", response.status_code)

        reviews = [
            {
                "author": r["author_name"],
                "text": r["text"],
                "rating": r["rating"],
                "date": datetime.datetime.fromtimestamp(r.get("time", 0), tz=pytz.utc).strftime('%Y-%m-%d %H:%M:%S')
            }
            for r in data.get("result", {}).get("reviews", [])
        ]
        return jsonify(reviews) if reviews else error_response("Žádné recenze nebyly nalezeny", 404)

    except requests.exceptions.RequestException as e:
        return error_response(f"Chyba sítě: {e}", 500)


# ✅ Hlavní stránka
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/services')
def services():
    return render_template('services.html')

@app.route('/review')
def review():
    return render_template('review.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/rodinnedomy')
def rodinnedomy():
    return render_template('rodinnedomy.html')

@app.route('/bytovedomy')
def bytovedomy():
    return render_template('bytovedomy.html')

@app.route('/firmy')
def firmy():
    return render_template('firmy.html')

# ✅ Spuštění aplikace
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
