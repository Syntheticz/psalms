from flask import Flask, abort, jsonify, request
from waitress import serve
from flask_cors import CORS, cross_origin
import requests
import os
from werkzeug.utils import secure_filename

import pymupdf
from multi_column import column_boxes # this file is necessary to add in the same directory
import re

from thefuzz import fuzz as fuzzer
from thefuzz import process

# Scaling of Credentials
import json
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize
from sentence_transformers import SentenceTransformer, util
import nltk

# fuzzy logic
import numpy as np
import skfuzzy as fuzz
from skfuzzy import control as ctrl

# Download required resources for nltk
nltk.download('punkt')
nltk.download('wordnet')
nltk.download('omw-1.4')
nltk.download('punkt_tab')



# selected job (Im using ID here for selecting the job)
JOB_ID = None

# Initialize variables for storing crips values
EDUCATION = None
SKILLS = None
CERTIFICATES = None
EXPERIENCE = None


lemmatizer = WordNetLemmatizer()
model = SentenceTransformer('all-MiniLM-L6-v2')

def text_extraction(file_path):
    doc = pymupdf.open(file_path)

    text_lines = []
    column_text = []
    temp = []

    for page in doc:
        bboxes = column_boxes(page, footer_margin=50, no_image_text=True)
        for rect in bboxes:
            # print(page.get_text(clip=rect, sort=True))
            column_text.append(page.get_text(clip=rect, sort=True))
        # print("-" * 80)

    # Iterate over each item in the original list
    for item in column_text:
        # Split the item by new line
        separated_items = item.split('\n')
        # Extend the new list with the separated items
        text_lines.extend(separated_items)
    
    for line in text_lines:
        line = re.sub(r'\s+', ' ', line)
        line = re.sub(r'^\s{1,}', "", line)
        temp.append(line)
    
    text_lines = temp
    return text_lines

def clean_extracted_text(extracted_text):
    """
    Processes extracted text to handle multi-line and incomplete sentence issues.
    """
    # List of words that may indicate an incomplete sentence
    incomplete_words = {
        "and", "in", "for", "with", "to", "on", "at", "but",
        "or", "by", "of", "as", "the", "an", "a", "is", "are",
        "was", "were", "be", "been", "being", "about", "between",
        "among", "into", "through", "during", "after", "before",
        "over", "under", "since", "without", "within", "against",
        "upon", "while", "where", "when", "who", "which", "that",
        "if", "because", "although", "though", "until", "unless",
        "whether", "also", "either", "neither", "nor", "yet",
        "so", "such", "than", "even", "like", "about", "down",
        "up", "out", "around", "next", "near", "towards", "behind",
        "across", "beside", "along", "since", "beyond", "despite",
        "via", "besides", "except", "concerning", "whereas", "amongst",
        "more", "less", "many", "few", "some", "any", "each", "every",
        "either", "neither", "several", "both", "from"
    }

    processed_data = []  # List to store cleaned and merged sentences
    temp_string = ""

    for line in extracted_text:
        data_entry = line.strip()

        # Skip empty lines
        if not data_entry:
            continue

        # Check if temp_string ends with an incomplete word or append based on conditions
        if temp_string and temp_string.split()[-1].lower() in incomplete_words:
            # Append the current line to the temp_string
            temp_string += " " + data_entry
        elif data_entry.startswith("") or data_entry[0].isupper() or data_entry.startswith("•"):
            # Start a new entry
            if temp_string:
                processed_data.append(temp_string.strip())
            temp_string = data_entry
        else:
            # Append lines starting with lowercase letters
            if temp_string:
                temp_string += " " + data_entry
            else:
                temp_string = data_entry

    # Append the final temp_string
    if temp_string:
        processed_data.append(temp_string.strip())

    processed_data = [item.lower() for item in processed_data]
    return processed_data

def fuzzy_matching(input_data, cleanData):
    threshold = 70

    if input_data['education']:
        for item in input_data['education']:
            if not input_data['education'] or all(item == '' for item in input_data['education']): break

            matched = process.extractOne(item.lower(), cleanData, scorer=fuzzer.partial_token_sort_ratio)
            if matched[1] < threshold:
                return False
    if input_data['skills']:
        for item in input_data['skills']:
            if not input_data['skills'] or all(item == '' for item in input_data['skills']): break
            matched = process.extractOne(item.lower(), cleanData, scorer=fuzzer.partial_token_sort_ratio)
            if matched[1] < threshold:
                print("Input data in skills not found the file document!")
                return False
    if input_data['experience']:

        for item in input_data['experience']:
            if not input_data['experience'] or all(item == '' for item in input_data['experience']): break

            matched = process.extractOne(item.lower(), cleanData, scorer=fuzzer.partial_token_sort_ratio)

            if matched[1] < threshold:
                print("Input data in experience not found the file document!")
                return False
    if input_data['certificates']:
        for item in input_data['certificates']:
            if not input_data['certificates'] or all(item == '' for item in input_data['certificates']): break

            matched = process.extractOne(item.lower(), cleanData, scorer=fuzzer.partial_token_sort_ratio)
            if matched[1] < threshold:
                print("Input data in certificates not found the file document!")
                return False
    return True


# Function to lemmatize a sentence
def lemmatize_text(text):
    tokens = word_tokenize(text)  # Tokenize the sentence
    lemmatized_tokens = [lemmatizer.lemmatize(token.lower()) for token in tokens]
    return " ".join(lemmatized_tokens)



# Function to evaluate a specific category
def evaluate_category(qualifications, applicant_values):
    best_score = 0.0
    best_qualification = None
    best_match_credential = None
    priority_score = None
    matched_applicant_value = None

    for qualification in qualifications:
        requirement = qualification["requirement"]
        possible_credentials = qualification.get("possible_credentials", [])

        if not possible_credentials:
            possible_credentials = [requirement]  # Use requirement if no possible credentials provided

        # Lemmatize and encode possible credentials
        lemmatized_requirements = [lemmatize_text(cred) for cred in possible_credentials]
        job_role_embeddings = model.encode(lemmatized_requirements, convert_to_tensor=True)

        # Evaluate each applicant value
        for applicant_value in applicant_values:
            lemmatized_applicant_value = lemmatize_text(applicant_value)
            applicant_embedding = model.encode(lemmatized_applicant_value, convert_to_tensor=True)
            similarities = util.cos_sim(applicant_embedding, job_role_embeddings)
            current_score = similarities.max().item()

            # If priority is present, set priority_score
            if qualification.get("priority", False):
                if priority_score is None or current_score > priority_score:
                    priority_score = current_score
                    best_qualification = qualification
                    best_match_credential = possible_credentials[similarities.argmax().item()]
                    matched_applicant_value = applicant_value

            # Track the best score (non-priority) as fallback
            if current_score > best_score:
                best_score = current_score
                best_qualification = qualification
                best_match_credential = possible_credentials[similarities.argmax().item()]
                matched_applicant_value = applicant_value

    # Return priority score if available, otherwise return best score
    final_score = priority_score if priority_score is not None else best_score
    return final_score, best_qualification, best_match_credential, matched_applicant_value


# Function to evaluate a specific job by its ID
def evaluate_job_by_id(job, applicant_data):
    evaluated_scores = []
    global SKILLS
    global EDUCATION
    global CERTIFICATES
    global EXPERIENCE

    qualifications = job["qualifications"]
    category_scores = {}


    job_categories = {qual["categories"][0].lower() for qual in qualifications}
    applicant_categories = {key.lower() for key in applicant_data.keys()}
    all_categories = job_categories.union(applicant_categories)

    for category in all_categories:
        # Filter qualifications by category (case-insensitive match)
        category_qualifications = [
            qual for qual in qualifications if qual["categories"][0].lower() == category
        ]
        applicant_values = applicant_data.get(category, [])

        if category_qualifications and applicant_values:
            # Evaluate category if both job and applicant have data
            score, best_qualification, best_match, matched_applicant_value = evaluate_category(
                category_qualifications, applicant_values
            )
        elif applicant_values and not category_qualifications :
            score = 10
        else:
            # Assign score of 0 if category data is missing
            score, best_qualification, best_match, matched_applicant_value = 0.0, None, None, None

        category_scores[category] = score

        
        score = score * 10
        if score > 8.5:
            score = 10

        
        evaluated_scores.append({category.capitalize(): round(score, 1)})


    
    # Extract values from the list of dictionaries
    for item in evaluated_scores:
        if 'Skills' in item:
            SKILLS = item['Skills']
        elif 'Certificates' in item:
            CERTIFICATES = item['Certificates']
        elif 'Education' in item:
            EDUCATION = item['Education']
        elif 'Experience' in item:
            EXPERIENCE = item['Experience']



# Define the fuzzy variables
skills = ctrl.Antecedent(np.arange(0, 11, 1), 'skills')
certifications = ctrl.Antecedent(np.arange(0, 11, 1), 'certifications')
education = ctrl.Antecedent(np.arange(0, 11, 1), 'education')
experience = ctrl.Antecedent(np.arange(0, 11, 1), 'experience')
suitability = ctrl.Consequent(np.arange(0, 101, 1), 'suitability')

# Define membership functions
skills['poor'] = fuzz.trapmf(skills.universe, [0, 0, 2, 4])
skills['average'] = fuzz.trapmf(skills.universe, [2, 4, 6, 8])
skills['good'] = fuzz.trapmf(skills.universe, [6, 8, 10, 10])

certifications['few'] = fuzz.trapmf(certifications.universe, [0, 0, 2, 4])
certifications['moderate'] = fuzz.trapmf(certifications.universe, [2, 4, 6, 8])
certifications['many'] = fuzz.trapmf(certifications.universe, [6, 8, 10, 10])

education['below'] = fuzz.trapmf(education.universe, [0, 0, 2, 4])
education['meets'] = fuzz.trapmf(education.universe, [2, 4, 6, 8])
education['exceeds'] = fuzz.trapmf(education.universe, [6, 8, 10, 10])

experience['inadequate'] = fuzz.trapmf(experience.universe, [0, 0, 2, 4])
experience['adequate'] = fuzz.trapmf(experience.universe, [2, 4, 6, 8])
experience['extensive'] = fuzz.trapmf(experience.universe, [6, 8, 10, 10])

suitability['low'] = fuzz.trapmf(suitability.universe, [0, 0, 20, 40])
suitability['medium'] = fuzz.trapmf(suitability.universe, [20, 40, 60, 80])
suitability['high'] = fuzz.trapmf(suitability.universe, [60, 80, 100, 100])




# Evaluation function
def evaluate_applicant(skill_level, certification_count, education_level, experience_years, priors=None):
    
    # Define fuzzy rules
    rules = [
        ctrl.Rule(skills['good'] & certifications['many'] & education['exceeds'] & experience['extensive'], suitability['high']),
        ctrl.Rule(skills['average'] & certifications['moderate'] & education['meets'] & experience['adequate'], suitability['medium']),
        ctrl.Rule(skills['poor'] | certifications['few'] | education['below'] | experience['inadequate'], suitability['low']),
        ctrl.Rule(skills['good'] & education['exceeds'], suitability['high']),
        ctrl.Rule(certifications['many'] & experience['extensive'], suitability['high']),
        ctrl.Rule(skills['average'] & certifications['few'], suitability['medium']),
        ctrl.Rule(education['meets'] & experience['adequate'], suitability['medium']),
        ctrl.Rule(skills['poor'] & certifications['few'], suitability['low']),
        ctrl.Rule(experience['inadequate'], suitability['low']),
        ctrl.Rule(experience['adequate'], suitability['low']),
        ctrl.Rule(experience['extensive'], suitability['high']),
    ]
    
    if priors['education'] == True:
        rules.append(ctrl.Rule(education['exceeds'], suitability['high']))
        rules.append(ctrl.Rule(education['below'], suitability['low']))
        rules.append(ctrl.Rule(education['meets'], suitability['low']))
    if priors['skills'] == True:
        rules.append(ctrl.Rule(skills['good'], suitability['high']))
        rules.append(ctrl.Rule(skills['poor'], suitability['low']))
        rules.append(ctrl.Rule(skills['average'], suitability['low']))
    if priors['certificates'] == True:
        rules.append(ctrl.Rule(certifications['many'], suitability['high']))
        rules.append(ctrl.Rule(certifications['few'], suitability['low']))
        rules.append(ctrl.Rule(certifications['moderate'], suitability['low']))
    if priors['experience'] == True:
        rules.append(ctrl.Rule(experience['extensive'], suitability['high']))
        rules.append(ctrl.Rule(experience['inadequate'], suitability['low']))
        rules.append(ctrl.Rule(experience['adequate'], suitability['low']))


    suitability_ctrl = ctrl.ControlSystem(rules)
    suitability_evaluation = ctrl.ControlSystemSimulation(suitability_ctrl)

    # Input values for the fuzzy logic system
    suitability_evaluation.input['skills'] = skill_level
    suitability_evaluation.input['certifications'] = certification_count
    suitability_evaluation.input['education'] = education_level
    suitability_evaluation.input['experience'] = experience_years
    
    # Perform fuzzy computation
    suitability_evaluation.compute()

    # Return the computed suitability score
    return suitability_evaluation.output['suitability']


app = Flask(__name__)
cors = CORS(app)
app.config["CORS_HEADERS"] = 'Content-type'

@app.route('/api', methods=['GET'])
@cross_origin()
def make_predict():
    param_dict = request.args.to_dict()
    

    nextjs_api_url = "http://localhost:3000/api/job?jobId=" + param_dict["jobId"] + "&applicantId=" + param_dict["applicantId"]   # Next.js API endpoint

    try:

        response = requests.get(nextjs_api_url)  # Send a GET request to Next.js API
        response.raise_for_status()  # Raise an error for bad status codes
        data = response.json()  # Parse JSON from Next.js API response
        job = data["job"]
        applicant_data = data["finalApplicant"]
        categories = job["priority_categories"]
        prior_category = {key: False for key in ['education', 'skills', 'certificates', 'experience']}

        for category in categories:
            if category in prior_category:
                prior_category[category] = True


        evaluate_job_by_id(job, applicant_data)

  
        suitability_score = evaluate_applicant(SKILLS, CERTIFICATES, EDUCATION, EXPERIENCE, priors=prior_category)

        print("Done")
        return jsonify({"score" : suitability_score, "id" : job["id"]})  # Return the data as Flask API response
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500  # Handle errors
    
def allowed_file(filename):
    allowed_extensions = {"pdf", "png", "jpg", "jpeg"}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions
    
UPLOAD_FOLDER = "./uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
@app.route('/api/verify', methods=['POST'])
@cross_origin()
def verify():
    param_dict = request.args.to_dict()
    nextjs_api_url = "http://localhost:3000/api/userinput?applicantId=" + param_dict["applicantId"]   # Next.js API endpoint

    response = requests.get(nextjs_api_url)  # Send a GET request to Next.js API
    response.raise_for_status()  # Raise an error for bad status codes
    data = response.json()  # Parse JSON from Next.js API response
    print(data)
    input_data = data["applicant"]

    
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    # Create the upload directory if it doesn't exist
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
    
    # Validate file type (optional)
    if not allowed_file(file.filename):
        return jsonify({"error": "File type not allowed"}), 400

    # Save the file
    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(file_path)

    extracted_text = text_extraction(file_path)
    cleaned_data = clean_extracted_text(extracted_text)
    result = fuzzy_matching(input_data, cleaned_data)
    if result:
        print("All data has been verified")
        return jsonify({
            "message": f"File {filename} uploaded and processed successfully",
            "success" : True,
        }), 200
    else:
        print("There wre some error.")
        return jsonify({
            "message": f"File {filename} uploaded and processed successfully",
            "success" : False,
        }), 400



if __name__ == '__main__':
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    serve(app, port=5000, host="localhost")
    
    