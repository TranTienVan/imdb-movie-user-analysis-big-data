from pydantic_settings import BaseSettings
import pandas as pd
from sklearn.preprocessing import LabelEncoder
import numpy as np
import tensorflow as tf
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
nltk.download('vader_lexicon')
sia = SentimentIntensityAnalyzer()

class Settings(BaseSettings):
    DEBUG: bool = False
    
    class Config:
        case_sensitive = True
        env_file = ".env"


SETTING = Settings()
###
movies_df = pd.read_csv("./data/movies.csv")
movies_df = movies_df.rename(columns={'title': 'movie_title'})
print("Loaded movies_df")

###
reviews_df = pd.read_csv("./data/reviews.csv")
reviews_df = reviews_df[~reviews_df['ratings'].isna()]
reviews_df['date_review'] = pd.to_datetime(reviews_df['date_review'], format='%d %B %Y')
reviews_df['ratings'] = reviews_df['ratings'].apply(pd.to_numeric, errors='coerce')
reviews_df['year'] = reviews_df['date_review'].dt.year
print("Loaded reviews_df")

###
test_movies_df = movies_df.iloc[:50000]
test_reviews_df = reviews_df.iloc[:100000]
reviews_movies_df = pd.merge(test_reviews_df, test_movies_df, how='inner', left_on='movie_id', right_on="id")
refined_dataset = reviews_movies_df.groupby(by=['user_id_review','movie_title'], as_index=False).agg({"ratings":"mean"})
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
recommend_model = tf.keras.models.load_model('./data/Recommend_System')
print("Loaded recommend_model")