import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore, storage
from datetime import datetime
import cloudscraper
from bs4 import BeautifulSoup
import json

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# 1. Initialize Firebase Admin SDK
if not firebase_admin._apps:
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred, {
        'storageBucket': 'dunu-dunu-nation.firebasestorage.app' 
    })

db = firestore.client()
bucket = storage.bucket()

# --- AUTH ---
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    try:
        data = request.json
        email = data.get('email') or data.get('username')
        password = data.get('password')
        
        # Add your email here
        ALLOWED_ADMINS = ["admin@dunu.com", "maliganadakalo7@gmail.com"]
        
        if email in ALLOWED_ADMINS and password == "firebase-verified":
            return jsonify({
                "success": True, 
                "token": "admin-bypass-token", 
                "username": email
            }), 200
        return jsonify({"success": False, "message": "Unauthorized"}), 401
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# --- SCRAPER ---
@app.route('/api/admin/scrape', methods=['POST'])
def scrape_metadata():
    try:
        data = request.json
        url = data.get('link')
        
        if not url:
            return jsonify({"success": False, "message": "No URL provided"}), 400

        # Cloudscraper to bypass protections
        scraper = cloudscraper.create_scraper(
            browser={'browser': 'chrome', 'platform': 'windows', 'desktop': True}
        )
        
        try:
            response = scraper.get(url, timeout=10)
            response.raise_for_status()
        except Exception as e:
            print(f"Request failed: {e}")
            return jsonify({"success": False, "message": "Site blocked the scraper"}), 500

        soup = BeautifulSoup(response.text, 'html.parser')

        # 1. Standard Metadata
        def get_meta(props):
            for prop in props:
                tag = soup.find("meta", property=prop) or soup.find("meta", attrs={"name": prop})
                if tag and tag.get("content"): return tag["content"]
            return ""

        title = get_meta(["og:title", "twitter:title", "title"]) or (soup.title.string if soup.title else "")
        description = get_meta(["og:description", "twitter:description", "description"])
        image = get_meta(["og:image", "twitter:image"])

        # 2. Advanced JSON-LD Parsing
        instructor = ""
        price = ""
        location = ""
        event_date = ""
        event_time = ""
        
        json_ld_scripts = soup.find_all('script', type='application/ld+json')
        for script in json_ld_scripts:
            try:
                if not script.string: continue
                content = json.loads(script.string)
                if not isinstance(content, list): content = [content]
                
                for item in content:
                    # Course Logic
                    if 'instructor' in item or 'author' in item:
                        person = item.get('instructor') or item.get('author')
                        if isinstance(person, list) and person: person = person[0]
                        if isinstance(person, dict): instructor = person.get('name', '')

                    if 'offers' in item:
                        offers = item['offers']
                        if isinstance(offers, list) and offers: offers = offers[0]
                        if isinstance(offers, dict):
                            p_val = offers.get('price', '')
                            if p_val: price = str(p_val)

                    # Event Logic
                    if 'Event' in item.get('@type', ''):
                        loc = item.get('location', {})
                        if isinstance(loc, dict):
                            location = loc.get('name') or loc.get('address', {}).get('streetAddress', '')
                        elif isinstance(loc, str):
                            location = loc
                        
                        start_date = item.get('startDate', '')
                        if start_date:
                            try:
                                dt = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
                                event_date = dt.strftime('%Y-%m-%d')
                                event_time = dt.strftime('%H:%M')
                            except: pass
            except: continue

        # Fallbacks
        if not instructor:
            udemy_instr = soup.find("div", class_="instructor--instructor-name--1K-02")
            if udemy_instr: instructor = udemy_instr.get_text(strip=True)

        return jsonify({
            "success": True, 
            "data": {
                "title": title.strip(),
                "description": description.strip(),
                "image": image.strip(),
                "instructor": instructor.strip(),
                "price": price.strip(),
                "location": location.strip(),
                "date": event_date,
                "time": event_time
            }
        }), 200

    except Exception as e:
        print(f"Scrape Error: {e}")
        return jsonify({"success": False, "message": "Could not auto-fetch data"}), 500

# --- MUSIC ROUTES ---
@app.route('/api/upload', methods=['POST'])
def upload_track():
    try:
        data = request.json
        submission_data = {
            "artistName": data.get('artistName'),
            "trackTitle": data.get('trackTitle'),
            "email": data.get('email'),
            "genre": data.get('genre'),
            "description": data.get('description'),
            "socialMedia": data.get('socialMedia', ''),
            "audioUrl": data.get('audioUrl'),
            "coverUrl": data.get('coverUrl', ''),
            "status": "pending",
            "submittedAt": datetime.utcnow().isoformat()
        }
        db.collection('submissions').add(submission_data)
        return jsonify({"success": True}), 201
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/admin/tracks', methods=['GET'])
def get_tracks():
    try:
        docs = db.collection('submissions').stream()
        tracks = [{"id": doc.id, **doc.to_dict()} for doc in docs]
        return jsonify({"tracks": tracks}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/tracks/<track_id>/<action>', methods=['POST'])
def update_track_status(track_id, action):
    try:
        status = "approved" if action == "approve" else "rejected"
        db.collection('submissions').document(track_id).update({"status": status})
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/tracks/<track_id>', methods=['DELETE'])
def delete_track(track_id):
    try:
        db.collection('submissions').document(track_id).delete()
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- ARTICLE ROUTES ---
@app.route('/api/admin/articles', methods=['POST'])
def create_article():
    try:
        data = request.json
        article = {
            "title": data.get('title'),
            "author": data.get('author'),
            "category": data.get('category', 'General'),
            "excerpt": data.get('excerpt', ''),
            "content": data.get('content'),
            "date": datetime.utcnow().isoformat()
        }
        db.collection('articles').add(article)
        return jsonify({"success": True}), 201
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/public/articles', methods=['GET'])
def get_articles():
    try:
        docs = db.collection('articles').stream()
        articles = [{"id": doc.id, **doc.to_dict()} for doc in docs]
        return jsonify({"articles": articles}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/articles/<article_id>', methods=['DELETE'])
def delete_article(article_id):
    try:
        db.collection('articles').document(article_id).delete()
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- EVENT ROUTES ---
@app.route('/api/admin/events', methods=['POST'])
def create_event():
    try:
        data = request.json
        event = {
            "title": data.get('title'),
            "date": data.get('date'),
            "time": data.get('time'),
            "location": data.get('location'),
            "type": data.get('type'),
            "description": data.get('description'),
            "link": data.get('link', ''),
            "image": data.get('image', '')
        }
        db.collection('events').add(event)
        return jsonify({"success": True}), 201
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/public/events', methods=['GET'])
def get_events():
    try:
        docs = db.collection('events').stream()
        events = [{"id": doc.id, **doc.to_dict()} for doc in docs]
        return jsonify({"events": events}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/events/<event_id>', methods=['DELETE'])
def delete_event(event_id):
    try:
        db.collection('events').document(event_id).delete()
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- COURSE ROUTES ---
@app.route('/api/admin/courses', methods=['POST'])
def create_course():
    try:
        data = request.json
        course = {
            "title": data.get('title'),
            "instructor": data.get('instructor'),
            "price": data.get('price'),
            "category": data.get('category'),
            "link": data.get('link', ''),
            "image": data.get('image', '')
        }
        db.collection('courses').add(course)
        return jsonify({"success": True}), 201
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/public/courses', methods=['GET'])
def get_courses():
    try:
        docs = db.collection('courses').stream()
        courses = [{"id": doc.id, **doc.to_dict()} for doc in docs]
        return jsonify({"courses": courses}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/courses/<course_id>', methods=['DELETE'])
def delete_course(course_id):
    try:
        db.collection('courses').document(course_id).delete()
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- MESSAGES ---
@app.route('/api/public/contact', methods=['POST'])
def contact_submit():
    try:
        data = request.json
        db.collection('messages').add({
            "name": data.get('name'), "email": data.get('email'),
            "subject": data.get('subject'), "message": data.get('message'),
            "status": "unread", "submittedAt": datetime.utcnow().isoformat()
        })
        return jsonify({"success": True}), 201
    except Exception as e: return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/admin/messages', methods=['GET'])
def get_messages():
    try:
        docs = db.collection('messages').stream()
        messages = [{"id": doc.id, **doc.to_dict()} for doc in docs]
        return jsonify({"messages": messages}), 200
    except Exception as e: return jsonify({"error": str(e)}), 500

@app.route('/api/admin/messages/<msg_id>/mark-read', methods=['PATCH'])
def mark_read(msg_id):
    try:
        db.collection('messages').document(msg_id).update({"status": "read"})
        return jsonify({"success": True}), 200
    except Exception as e: return jsonify({"error": str(e)}), 500

@app.route('/api/admin/messages/<msg_id>', methods=['DELETE'])
def delete_msg(msg_id):
    try:
        db.collection('messages').document(msg_id).delete()
        return jsonify({"success": True}), 200
    except Exception as e: return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)