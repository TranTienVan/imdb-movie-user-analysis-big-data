from flask_openapi3 import APIBlueprint, Tag
from bson.json_util import dumps
from flask import request  # Import the 'request' object
from app.config.settings import reviews_df
from app.api.reviews.statistics_data import *

tag = Tag(name="reviews", description="Movie Operation")

reviews_route = APIBlueprint("reviews", __name__, abp_tags=[tag], url_prefix="/api")

@reviews_route.get("/reviews")
def reviews_job():
    # Get the values of page and per_page from the query parameters
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 1000))
    ids = request.args.get('ids')
    user_ids = request.args.get('user_ids')
    movie_ids = request.args.get('movie_ids')
    
    if ids:
        list_ids = ids.split(",")
        data = reviews_df[reviews_df["id"].isin(list_ids)].to_dict("records")
    elif user_ids:
        list_ids = user_ids.split(",")
        data = reviews_df[reviews_df["user_id_review"].isin(list_ids)].to_dict("records")
    elif movie_ids:
        list_ids = movie_ids.split(",")
        data = reviews_df[reviews_df["movie_id"].isin(list_ids)].to_dict("records")
    else:

        # Calculate the start and end indices based on the page and per_page values
        start_index = (page - 1) * limit
        end_index = start_index + limit

        # Slice the dataframe based on the calculated indices
        paginated_df = reviews_df.iloc[start_index:end_index]

        # Convert the paginated dataframe to a list of records
        data = paginated_df.to_dict("records")

    # Return the paginated data
    return dumps(data), 200

@reviews_route.get("/reviews/sentiment")
def reviews_sentiment_job():
    # Get the values of page and per_page from the query parameters
    ids = request.args.get('ids')
    list_ids = ids.split(",")
    data = reviews_df[reviews_df["id"].isin(list_ids)].to_dict("records")

    # Solve sentiment analysis
    data = [{**d, "sentiment": 1} for d in data]

    # Return the paginated data
    return dumps(data), 200


@reviews_route.get("/reviews/chart_1")
def char_1_job():
    # Get the values of page and per_page from the query parameters
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 1000))
    ids = request.args.get('ids')
    user_ids = request.args.get('user_ids')
    movie_ids = request.args.get('movie_ids')
    
    if ids:
        list_ids = ids.split(",")
        data = reviews_df[reviews_df["id"].isin(list_ids)]
    elif user_ids:
        list_ids = user_ids.split(",")
        data = reviews_df[reviews_df["user_id_review"].isin(list_ids)]
    elif movie_ids:
        list_ids = movie_ids.split(",")
        data = reviews_df[reviews_df["movie_id"].isin(list_ids)]
    else:

        # Calculate the start and end indices based on the page and per_page values
        start_index = (page - 1) * limit
        end_index = start_index + limit

        # Slice the dataframe based on the calculated indices
        data = reviews_df.iloc[start_index:end_index]

    # Return the paginated data
    return dumps(chart_1(data)), 200


@reviews_route.get("/reviews/chart_2")
def char_2_job():
    # Get the values of page and per_page from the query parameters
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 1000))
    ids = request.args.get('ids')
    user_ids = request.args.get('user_ids')
    movie_ids = request.args.get('movie_ids')
    
    if ids:
        list_ids = ids.split(",")
        data = reviews_df[reviews_df["id"].isin(list_ids)]
    elif user_ids:
        list_ids = user_ids.split(",")
        data = reviews_df[reviews_df["user_id_review"].isin(list_ids)]
    elif movie_ids:
        list_ids = movie_ids.split(",")
        data = reviews_df[reviews_df["movie_id"].isin(list_ids)]
    else:

        # Calculate the start and end indices based on the page and per_page values
        start_index = (page - 1) * limit
        end_index = start_index + limit

        # Slice the dataframe based on the calculated indices
        data = reviews_df.iloc[start_index:end_index]

    # Return the paginated data
    return dumps(chart_2(data)), 200


@reviews_route.get("/reviews/chart_3")
def char_3_job():
    # Get the values of page and per_page from the query parameters
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 1000))
    ids = request.args.get('ids')
    user_ids = request.args.get('user_ids')
    movie_ids = request.args.get('movie_ids')
    
    if ids:
        list_ids = ids.split(",")
        data = reviews_df[reviews_df["id"].isin(list_ids)]
    elif user_ids:
        list_ids = user_ids.split(",")
        data = reviews_df[reviews_df["user_id_review"].isin(list_ids)]
    elif movie_ids:
        list_ids = movie_ids.split(",")
        data = reviews_df[reviews_df["movie_id"].isin(list_ids)]
    else:

        # Calculate the start and end indices based on the page and per_page values
        start_index = (page - 1) * limit
        end_index = start_index + limit

        # Slice the dataframe based on the calculated indices
        data = reviews_df.iloc[start_index:end_index]

    # Return the paginated data
    return dumps(chart_3(data)), 200


@reviews_route.get("/reviews/statistics")
def statistics_job():
    # Get the values of page and per_page from the query parameters
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 1000))
    ids = request.args.get('ids')
    user_ids = request.args.get('user_ids')
    movie_ids = request.args.get('movie_ids')
    
    if ids:
        list_ids = ids.split(",")
        data = reviews_df[reviews_df["id"].isin(list_ids)]
    elif user_ids:
        list_ids = user_ids.split(",")
        data = reviews_df[reviews_df["user_id_review"].isin(list_ids)]
    elif movie_ids:
        list_ids = movie_ids.split(",")
        data = reviews_df[reviews_df["movie_id"].isin(list_ids)]
    else:

        # Calculate the start and end indices based on the page and per_page values
        start_index = (page - 1) * limit
        end_index = start_index + limit

        # Slice the dataframe based on the calculated indices
        data = reviews_df.iloc[start_index:end_index]

    result_data = statistics(data)
    # Return the paginated data
    return dumps(result_data), 200