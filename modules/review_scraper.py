from bs4 import BeautifulSoup
import requests
import os
import json

def parse_reviews(content, movie_id):
    soup = BeautifulSoup(content)

    content_tags = soup.find_all("div", {"class": "imdb-user-review"})
    data_reviews = []

    for tag in content_tags:
        obj_review = {}
        
        try:
            obj_review["id"] = tag["data-review-id"]
        except:
            obj_review["id"] = None
            
        try:
            obj_review["movie_id"] = movie_id
        except:
            obj_review["movie_id"] = None
        
        try:
            obj_review["ratings"] = tag.find("span", {"class": "rating-other-user-rating"}).find("span").getText()
        except:
            obj_review["ratings"] = None
        
        try:
            obj_review["title"] = tag.find("a").getText().strip()
        except:
            obj_review["title"] = None
        
        try:
            obj_review["user_review"] = tag.find("div", {"class": "display-name-date"}).find("a").getText()
        except:
            obj_review["user_review"] = None
            
        try:
            obj_review["user_id_review"] = tag.find("div", {"class": "display-name-date"}).find("a")["href"].split("/")[-2]
        except:
            obj_review["user_id_review"] = None
            
        try:
            obj_review["date_review"] = tag.find("div", {"class": "display-name-date"}).find("span", {"class": "review-date"}).getText()
        except:
            obj_review["date_review"] = None
            
        try:
            obj_review["total_agree"] = tag.find("div", {"class": "actions text-muted"}).getText(strip=True).split("found this helpful")[0].strip()
        except:
            obj_review["total_agree"] = None
        
        if "Warning: Spoilers" in tag.getText():
            obj_review["is_spoilers"] = True
        else:
            obj_review["is_spoilers"] = False
        
        try:
            obj_review["description"] = tag.find("div", {"class": "content"}).find("div", {"class": "text"}).getText("\n").strip()
        except:
            obj_review["description"] = None
        
        data_reviews.append(obj_review)
        
    try:
        next_key = soup.find("div", {"class": "load-more-data"})["data-key"]
    except:
        next_key = None
    
    return data_reviews, next_key


def scrape_reviews(movie_id):
    page = 0
    next_key = None
    path_data = f"./data/reviews/{movie_id}/"

    if os.path.exists(path_data):
        print("This movie reviews have been scraped", path_data)
        return
    
    else:
        os.makedirs(path_data)
        print("Start scraping", movie_id)
    
    while True:
        page += 1
        
        headers = {
            'referer': f'https://www.imdb.com/title/{movie_id}/reviews?ref_=login',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
        }

        if not next_key:
            params = {
                'ref_': 'undefined'
            }
        else:
            params = {
                'ref_': 'undefined',
                'paginationKey': next_key
            }
        
        response = requests.get(f'https://www.imdb.com/title/{movie_id}/reviews/_ajax', params=params, headers=headers)
        
        data_reviews, next_key = parse_reviews(response.text, movie_id)
        with open(path_data + f"{page}.json", "w") as f:
            json.dump(data_reviews, f, indent=3)
            
        print("Scrape review success", path_data + f"{page}.json", next_key)
        
        if not next_key:
            break