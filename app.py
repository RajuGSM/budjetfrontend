from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  

@app.route('/bfhl', methods=['POST'])
def handle_post():
    try:
        data = request.json.get('data', [])
        
        numbers = []
        alphabets = []
        highest_lowercase_alphabet = None
    
        for item in data:
            if isinstance(item, str):  
                if item.isdigit():
                    numbers.append(item)
                elif item.isalpha():
                    alphabets.append(item)
                    if item.islower() and (highest_lowercase_alphabet is None or item > highest_lowercase_alphabet):
                        highest_lowercase_alphabet = item

        response = {
            "is_success": True,
            "user_id": "raju_gsm",  
            "email": "gsmraju2003@gmail.com",  
            "roll_number": "21bce5454",  
            "numbers": numbers,
            "alphabets": alphabets,
            "highest_lowercase_alphabet": [highest_lowercase_alphabet] if highest_lowercase_alphabet else []
        }
        
        return jsonify(response), 200
    
    except Exception as e:
        return jsonify({"is_success": False, "error": str(e)}), 500

@app.route('/bfhl', methods=['GET'])
def handle_get():
    return jsonify({"operation_code": 1}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)  
