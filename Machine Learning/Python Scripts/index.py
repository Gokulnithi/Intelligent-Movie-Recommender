import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Read the dataset
df = pd.read_csv('Final_data.csv')
df['genres'] = df['genres'].str.replace(' ', '')

# Initialize TF-IDF Vectorizer
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(df['genres'])

TMDB_API_KEY = '42ef72f608c1ec1efcf17368ae166783'
TMDB_BASE_URL = 'https://api.themoviedb.org/3'

def get_tmdb_movie_id(movie_title):
    search_url = f"{TMDB_BASE_URL}/search/movie?api_key={TMDB_API_KEY}&query={movie_title}"
    response = requests.get(search_url)
    if response.status_code == 200:
        data = response.json()
        if data['results']:
            return data['results'][0]['id']
    return None

def get_tmdb_poster(movie_id):
    images_url = f"{TMDB_BASE_URL}/movie/{movie_id}/images?api_key={TMDB_API_KEY}"
    response = requests.get(images_url)
    if response.status_code == 200:
        data = response.json()
        if 'posters' in data and data['posters']:
            poster_path = data['posters'][0].get('file_path')
            if poster_path:
                return f"https://image.tmdb.org/t/p/w500{poster_path}"
    return None

def get_recommendations(input_value, df, tfidf, tfidf_matrix, page=1, per_page=10):
    if input_value in df['title'].values:
        idx = df[df['title'] == input_value].index[0]
        genre = df.at[idx, 'genres']
        tfidf_genre = tfidf.transform([genre])
        cosine_sim_genre = cosine_similarity(tfidf_genre, tfidf_matrix).flatten()
    elif input_value.replace(' ', '').isdigit():
        input_value = float(input_value)
        genre_movies = df[df['vote_average'] >= input_value]
        genre_indices = genre_movies.index.tolist()
        cosine_sim_genre = cosine_similarity(tfidf_matrix[genre_indices], tfidf_matrix).flatten()
    else:
        genre = input_value.replace(' ', '')
        tfidf_genre = tfidf.transform([genre])
        cosine_sim_genre = cosine_similarity(tfidf_genre, tfidf_matrix).flatten()

    sim_scores = list(enumerate(cosine_sim_genre))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    top_movie_indices = [i[0] for i in sim_scores]
    start = (page - 1) * per_page
    end = start + per_page
    recommended_movies = df.iloc[top_movie_indices[start:end]][['title', 'vote_average']]
    
    movies_with_posters = []
    for _, movie in recommended_movies.iterrows():
        title = movie['title']
        movie_id = get_tmdb_movie_id(title)
        if movie_id:
            poster_url = get_tmdb_poster(movie_id)
            movies_with_posters.append({
                'title': title,
                'vote_average': movie['vote_average'],
                'poster_url': poster_url,
                'movie_id': movie_id  # Add movie_id to the response
            })
    
    return pd.DataFrame(movies_with_posters)

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    input_value = data['input']
    page = data.get('page', 1)
    per_page = data.get('per_page', 10)
    recommendations = get_recommendations(input_value, df, tfidf, tfidf_matrix, page, per_page)
    return jsonify(recommendations.to_dict('records'))

if __name__ == '__main__':
    app.run(debug=True)
