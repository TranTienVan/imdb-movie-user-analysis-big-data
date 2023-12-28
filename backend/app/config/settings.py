from pydantic_settings import BaseSettings
import pandas as pd
from sklearn.preprocessing import LabelEncoder
import numpy as np
import tensorflow as tf
import nltk
import ast
from nltk.sentiment import SentimentIntensityAnalyzer
import spacy
import numpy as np

class Settings(BaseSettings):
    DEBUG: bool = False
    
    class Config:
        case_sensitive = True
        env_file = ".env"


SETTING = Settings()
###
# Function to safely apply ast.literal_eval and handle errors
def safe_literal_eval(x):
    try:
        return ast.literal_eval(x)
    except (ValueError, SyntaxError):
        return []

def get_names(x):
    results = ""
    
    for t in x:
        results += t["name"]
    
    return results


movies_df = pd.read_csv("./data/movies.csv")
movies_df = movies_df.rename(columns={'title': 'movie_title'})
movies_df['genre'] = movies_df['genre'].apply(safe_literal_eval)
movies_df['popularity_rank'] = pd.to_numeric(movies_df['popularity_rank'].replace(',', '', regex=True), errors='coerce', downcast='integer')
movies_df["published_year"] = movies_df["published_year"].astype(float)
movies_df["actors"] = movies_df["actors"].apply(safe_literal_eval)
movies_df["directors"] = movies_df["directors"].apply(safe_literal_eval)
movies_df["actor_names"] = movies_df["actors"].apply(get_names).str.lower()
movies_df["director_names"] = movies_df["directors"].apply(get_names).str.lower()
movies_df["number_of_ratings"] = movies_df["number_of_ratings"].astype(float)
movies_df["ratings_average"] = movies_df["ratings_average"].astype(float)
print("Loaded movies_df")

###
reviews_df = pd.read_csv("./data/reviews.csv")
reviews_df['date_review'] = pd.to_datetime(reviews_df['date_review'], format='%d %B %Y')
reviews_df['ratings'] = reviews_df['ratings'].apply(pd.to_numeric, errors='coerce')
reviews_df['year'] = reviews_df['date_review'].dt.year
print("Loaded reviews_df")

###
test_movies_df = movies_df.iloc[:50000]
test_reviews_df = reviews_df.iloc[:100000]
test_reviews_df = test_reviews_df[~test_reviews_df['ratings'].isna()]
reviews_movies_df = pd.merge(test_reviews_df, test_movies_df, how='inner', left_on='movie_id', right_on="id")
refined_dataset = reviews_movies_df.copy()
user_enc = LabelEncoder()
refined_dataset['user'] = user_enc.fit_transform(refined_dataset['user_id_review'].values)
n_users = refined_dataset['user'].nunique()
item_enc = LabelEncoder()
refined_dataset['movie'] = item_enc.fit_transform(refined_dataset['movie_title'].values)
refined_dataset['ratings'] = refined_dataset['ratings'].values.astype(np.float32)
min_rating = min(refined_dataset['ratings'])
max_rating = max(refined_dataset['ratings'])
print("Loaded refined_dataset")

###
users_df = pd.read_csv("./data/users.csv")
print("Loaded users_df")

###
nltk.download('vader_lexicon')
sia = SentimentIntensityAnalyzer()
recommend_model = tf.keras.models.load_model('./data/Recommend_System')
print("Loaded recommend_model")

###
# Load the pre-trained spaCy model with word vectors
nlp = spacy.load("en_core_web_md")
def semantic_search(movies_df, keyword, threshold=0.5, n_movies=10, min_number_of_ratings=None, min_average_ratings=None, min_published_year=None, actor_name=None, director_name=None):
    df = movies_df.copy()
    if min_number_of_ratings:
        df = df[df["number_of_ratings"] >= min_number_of_ratings]
    
    if min_average_ratings:
        df = df[df["ratings_average"] >= min_average_ratings]
    
    if min_published_year:
        df = df[df["published_year"] >= min_published_year]
    
    if actor_name:
        df = df[df["actor_names"].str.contains(actor_name.lower())]
    
    if director_name:
        df = df[df["director_names"].str.contains(director_name.lower())]
    
    text_list = df["movie_title"].tolist()
    query_embedding = nlp(keyword).vector

    results = []
    total_film = 0
    for i, text in enumerate(text_list):
        text_embedding = nlp(text).vector
        similarity = np.dot(query_embedding, text_embedding) / (np.linalg.norm(query_embedding) * np.linalg.norm(text_embedding))
        if similarity >= threshold:
            results.append((text, float(similarity)))
            total_film += 1
            if total_film > n_movies:
                break

    return results
