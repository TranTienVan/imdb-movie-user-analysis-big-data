from flask_openapi3 import APIBlueprint, Tag
from bson.json_util import dumps
from flask import request  # Import the 'request' object
from app.config.settings import movies_df, semantic_search

tag = Tag(name="movies", description="Movie Operation")

movies_route = APIBlueprint("movies", __name__, abp_tags=[tag], url_prefix="/api")

@movies_route.get("/movies")
def movies_job():
    # Get the values of page and per_page from the query parameters
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 1000))
    ids = request.args.get('ids')
    
    if ids:
        list_ids = ids.split(",")
        data = movies_df[movies_df["id"].isin(list_ids)].to_dict("records")
        
    else:

        # Calculate the start and end indices based on the page and per_page values
        start_index = (page - 1) * limit
        end_index = start_index + limit

        # Slice the dataframe based on the calculated indices
        paginated_df = movies_df.iloc[start_index:end_index]

        # Convert the paginated dataframe to a list of records
        data = paginated_df.to_dict("records")

    # Return the paginated data
    return dumps(data), 200


@movies_route.get("/movies/search")
def search_movies_job():
    # Get the values of page and per_page from the query parameters
    keyword = request.args.get('keyword') 
    n_movies = int(request.args.get('n_movies'))
    
    # Optional
    
    try:
        min_number_of_ratings = float(request.args.get("min_number_of_ratings"))
    except:
        min_number_of_ratings = None

    try:
        min_average_ratings = float(request.args.get("min_average_ratings"))
    except:
        min_average_ratings = None

    try:
        min_published_year = float(request.args.get("min_published_year"))
    except:
        min_published_year = None

    actor_name = request.args.get("actor_name")
    director_name = request.args.get("director_name")
    
    results = semantic_search(movies_df, keyword, threshold=0.5, n_movies=n_movies, min_number_of_ratings=min_number_of_ratings, min_average_ratings=min_average_ratings, min_published_year=min_published_year, actor_name=actor_name, director_name=director_name)

    # Return the paginated data
    return dumps(results), 200