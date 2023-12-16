from modules.movie_scraper import *

def main():
    for movie_id in top_250_movie_ids:
        scrape_a_movie(movie_id)
        
main()