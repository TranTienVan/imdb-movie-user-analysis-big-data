from pydantic_settings import BaseSettings
import pandas as pd
from sklearn.preprocessing import LabelEncoder
import numpy as np
import tensorflow as tf
import nltk
import ast
from nltk.sentiment import SentimentIntensityAnalyzer
import spacy
from pymongo import MongoClient

def read_mongodb_collection(connection_string, database_name, collection_name):
    """
    Read data from a MongoDB collection into a Pandas DataFrame.

    Parameters:
    - connection_string (str): MongoDB connection string.
    - database_name (str): Name of the MongoDB database.
    - collection_name (str): Name of the MongoDB collection.

    Returns:
    - pd.DataFrame: Pandas DataFrame containing the collection data.
    """
    # Connect to the MongoDB server
    client = MongoClient(connection_string)

    # Access the specified database
    db = client[database_name]

    # Access the specified collection within the database
    collection = db[collection_name]

    # Query all documents from the collection
    cursor = collection.find({}, {'_id': 0})

    # Convert the cursor to a list of dictionaries
    data_list = list(cursor)

    # Close the MongoDB connection
    client.close()

    # Create a Pandas DataFrame from the list of dictionaries
    df = pd.DataFrame(data_list)

    return df


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


movies_df = pd.read_csv("./data/new_movies.csv")
movies_df = movies_df.rename(columns={'title': 'movie_title'})
# movies_df["published_date"] = movies_df["published_date"].astype(str)
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
reviews_df = read_mongodb_collection("mongodb://localhost:27017", "admin", "reviews")
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
users_df = read_mongodb_collection("mongodb://localhost:27017", "admin", "users")
print("Loaded users_df")

###
nltk.download('vader_lexicon')
sia = SentimentIntensityAnalyzer()
recommend_model = tf.keras.models.load_model('./data/Recommend_System')
print("Loaded recommend_model")

###
# Load the pre-trained spaCy model with word vectors
nlp = spacy.load("en_core_web_md")
def semantic_search(movies_df, keyword, threshold=0.5, n_movies=10, min_number_of_ratings=None, min_average_ratings=None, min_published_year=None, max_published_year=None, actor_names=None, director_names=None, categories=None,gender=None):
    df = movies_df.copy()
    if min_number_of_ratings:
        df = df[df["number_of_ratings"] >= min_number_of_ratings]
    
    if min_average_ratings:
        df = df[df["ratings_average"] >= min_average_ratings]
    
    if min_published_year:
        df = df[df["published_year"] >= min_published_year]
        
    if max_published_year:
        df = df[df["published_year"] <= max_published_year]
    
    if actor_names:
        df = df[df['actor_names'].apply(lambda x: any(actor.lower() in x for actor in actor_names))]
    
    if director_names:
        df = df[df['director_names'].apply(lambda x: any(director.lower() in x for director in director_names))]
    
    if categories:
        df = df[df['genre'].apply(lambda x: any(item in x for item in categories))]
    
    if gender:
        df = df[df["gender"] == gender]
    
    text_list = df["movie_title"].tolist()
    query_embedding = nlp(keyword).vector

    results = []
    total_film = 0
    
    if not keyword or keyword == "anything":
        for i, text in enumerate(text_list):
            results.append({"movie": text, "score": float(similarity)})
            total_film += 1
            if total_film > n_movies:
                break
    else:
        for i, text in enumerate(text_list):
            text_embedding = nlp(text).vector
            similarity = np.dot(query_embedding, text_embedding) / (np.linalg.norm(query_embedding) * np.linalg.norm(text_embedding))
            if similarity >= threshold:
                results.append({"movie": text, "score": float(similarity)})
                total_film += 1
                if total_film > n_movies:
                    break
    df_results = pd.DataFrame(results)
    df = df_results.merge(movies_df[["id", "movie_title"]], left_on="movie", right_on="movie_title", how="inner")
    return df