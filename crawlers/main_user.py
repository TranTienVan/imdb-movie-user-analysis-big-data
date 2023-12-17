from modules.connectors.local_storage import *
import pandas as pd
from modules.user_scraper import scrape_a_user
from modules.movie_scraper import scrape_a_movie
from modules.review_scraper import scrape_reviews
import time
import random

def main():
    film_paths = list_folders("./data/reviews/")
    user_ids = []
    for path in film_paths:
        review_paths = list_files("./data/reviews/" + path + '/')
        
        
        for r_path in review_paths:
            with open("./data/reviews/" + path + '/' + r_path, "r") as f:
                data = json.load(f)
            
            user_ids.extend([d["user_id_review"] for d in data])
            
            del data
    print("Read data success")
    
    user_ids = list(set(user_ids))
    
    for user_id in user_ids:
        data_user = scrape_a_user(user_id)
        time.sleep(random.randint(5, 10))
        for d in data_user["top_ratings_movies"]:
            try:
                scrape_a_movie(d["movie_id"])
            except Exception as e:
                print("Error 1", e)
                time.sleep(10)
        
        for d in data_user["top_reviews_movies"]:
            try:
                scrape_a_movie(d["movie_id"])
            except Exception as e:
                print("Error 2", e)
                time.sleep(10)
            
main()

