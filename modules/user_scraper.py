import requests
from bs4 import BeautifulSoup
import os
import json

def scrape_a_user(user_id):
    path_data = f"./data/users/"
    
    if os.path.exists(path_data + f"{user_id}.json"):
        print("This user has been scraped")
        
        with open(path_data + f"{user_id}.json", "r", encoding="utf-8") as f:
            data = json.load(f)
        return data
    
    r = requests.get(f"https://www.imdb.com/user/{user_id}/?ref_=tt_urv")
    
    soup = BeautifulSoup(r.text)
    obj_user = {}
    
    
    obj_user["id"] = user_id
    

    try:
        obj_user["name"] = soup.find("h1").getText(strip=True)
    except:
        obj_user["name"] = None
        
    try:
        obj_user["member_since"] = soup.find("div", {"class": "timestamp"}).getText(strip=True)
    except:
        obj_user["member_since"] = None

    obj_user["badges"] = []
    try:
        badge_tags = soup.find("div", {"class": "badges"}).find_all("div", {"badge-frame"})
        
        for tag in badge_tags:
            badge_obj = {}
            
            try:
                badge_obj["name"] = tag.find("div", {"class": "name"}).getText(strip=True)
            except:
                badge_obj["name"] = None
                
            try:
                badge_obj["value"] = tag.find("div", {"class": "value"}).getText(strip=True)
            except:
                badge_obj["value"] = None
            
            obj_user["badges"].append(badge_obj)
            
    except:
        pass

    obj_user["ratings_distribution"] = []

    try:
        analysis_tags = soup.find("div", {"class": "histogram overall"}).find("div", {"class": "histogram-horizontal"}).find_all("a")
        
        for tag in analysis_tags:
            obj_user["ratings_distribution"].append(tag["title"])
    except:
        pass

    obj_user["ratings_per_year"] = []

    try:
        analysis_tags = soup.find("div", {"class": "histogram byYear"}).find("div", {"class": "histogram-horizontal"}).find_all("a")
        
        for tag in analysis_tags:
            obj_user["ratings_per_year"].append(tag["title"])
    except:
        pass
        

    obj_user["top_ratings_movies"] = []
    try:
        top_tags = soup.find("div", {"class": "title-list"}).find_all("div", {'class': "item"})
        
        for tag in top_tags:
            obj_ratings_movie = {}
            
            try:
                obj_ratings_movie["movie_id"] = tag.find("a")["href"].split("/")[-2]
            except:
                obj_ratings_movie["movie_id"] = None
            
            try:
                obj_ratings_movie["ratings"] = tag.find("div", {"class": "sub-item"}).getText(strip=True)
            except:
                obj_ratings_movie["ratings"] = None
                
            obj_user["top_ratings_movies"].append(obj_ratings_movie)
    except:
        pass

    obj_user["top_reviews_movies"] = []
    try:
        reviews_tags = soup.find("div", {"class": "reviews"}).find_all("div", {"class": "toggle-overflow"})
        
        for tag in reviews_tags:
            obj_review = {}
            
            try:
                obj_review["movie_id"] = tag.find("a")["href"].split("/")[-2]
            except:
                obj_review["movie_id"] = None
            
            try:
                obj_review["review_title"] = tag.find("h4").getText(strip=True)
            except:
                obj_review["review_title"] = None
            
            try:
                obj_review["review_header"] = tag.find("div", {"class": "details"}).getText(strip=True)
            except:
                obj_review["review_header"] = None
            
            try:
                obj_review["review_description"] = tag.find("p").getText(strip=True)
            except:
                obj_review["review_description"] = None
                
            obj_user["top_reviews_movies"].append(obj_review)
    except Exception as e:
        pass

        
    with open(path_data + f"{user_id}.json", "w", encoding="utf-8") as f:
        json.dump(obj_user, f, indent=3)
    
    print("Scrape user success", path_data + f"{user_id}.json")
    return obj_user