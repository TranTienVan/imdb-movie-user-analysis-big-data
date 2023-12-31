from flask_openapi3 import APIBlueprint, Tag
from bson.json_util import dumps
from flask import request  # Import the 'request' object
from app.config.settings import users_df, refined_dataset, user_enc, item_enc, min_rating, max_rating, recommend_model, test_movies_df
import numpy as np
import pandas as pd

tag = Tag(name="users", description="Movie Operation")

users_route = APIBlueprint("users", __name__, abp_tags=[tag], url_prefix="/api")

def filter_rows_by_word(lst, target_word):
    return any(target_word.lower() in value.lower() for value in lst)

def recommender_system(refined_dataset, user_enc, item_enc, user_id, model, n_movies, min_rating, max_rating):
  encoded_user_id = user_enc.transform([user_id])
  seen_movies = list(refined_dataset[refined_dataset['user_id_review'] == user_id]['movie'])
  
  unseen_movies = [i for i in range(min(refined_dataset['movie']), max(refined_dataset['movie'])+1) if i not in seen_movies]

  model_input = [np.asarray(list(encoded_user_id)*len(unseen_movies)), np.asarray(unseen_movies)]
  predicted_ratings = model.predict(model_input)
  predicted_ratings = np.max(predicted_ratings, axis=1)
  sorted_index = np.argsort(predicted_ratings)[::-1]
  recommended_movies = item_enc.inverse_transform(sorted_index)

  # Tạo DataFrame từ danh sách tên phim và dự đoán ratings
  recommendations_df = pd.DataFrame({
      'movie': recommended_movies[:n_movies],
      'ratings': predicted_ratings[sorted_index][:n_movies]*(max_rating - min_rating)  + min_rating# Lấy các dự đoán tương ứng
  })

  return recommendations_df

def recommender_system_2(movies_df, n_movies, category = []):
    movie_filter = []
    for kw in category:
        movie_filter = movie_filter + list(movies_df[movies_df['genre'].apply(lambda x: filter_rows_by_word(x, kw))]['id'])
    movie_filter = pd.DataFrame({'id': list(set(movie_filter))})

    movie_1 = pd.merge(movies_df, movie_filter, how='inner', on='id')
    recommended_movies = movie_1.sort_values(by='popularity_rank',ascending = True)
    recommended_movies.reset_index(drop=True)

    # Tạo DataFrame từ danh sách tên phim và dự đoán ratings
    recommendations_df = pd.DataFrame({
        'movie': recommended_movies['movie_title'][:n_movies],
        'ratings': recommended_movies['ratings_average'][:n_movies]
    })

    return recommendations_df

def recommender_system_3(refined_dataset, user_enc, item_enc, user_id, model, n_movies, min_rating, max_rating, category = []):
    encoded_user_id = user_enc.transform([user_id])

    seen_movies = list(refined_dataset[refined_dataset['user_id_review'] == user_id]['movie'])
    unseen_movies = []
    if not category:
        unseen_movies = [i for i in range(min(refined_dataset['movie']), max(refined_dataset['movie'])+1) if i not in seen_movies]
    else:
        movie_filter = []
        for kw in category:
            movie_filter = movie_filter + list(refined_dataset[refined_dataset['genre'].apply(lambda x: filter_rows_by_word(x, kw))]['movie'])
            movie_filter = list(set(movie_filter))
            unseen_movies = [i for i in movie_filter if i not in seen_movies]
    
    model_input = [np.asarray(list(encoded_user_id)*len(unseen_movies)), np.asarray(unseen_movies)]
    predicted_ratings = model.predict(model_input)
    predicted_ratings = np.max(predicted_ratings, axis=1)
    sorted_index = np.argsort(predicted_ratings)[::-1]
    recommended_movies = item_enc.inverse_transform(sorted_index)

    # Tạo DataFrame từ danh sách tên phim và dự đoán ratings
    recommendations_df = pd.DataFrame({
        'movie': recommended_movies[:n_movies],
        'ratings': predicted_ratings[sorted_index][:n_movies]*(max_rating - min_rating)  + min_rating# Lấy các dự đoán tương ứng
    })

    return recommendations_df



@users_route.get("/users")
def users_job():
    # Get the values of page and per_page from the query parameters
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 1000))
    ids = request.args.get('ids')
    
    if ids:
        list_ids = ids.split(",")
        data = users_df[users_df["id"].isin(list_ids)].to_dict("records")
        
    else:

        # Calculate the start and end indices based on the page and per_page values
        start_index = (page - 1) * limit
        end_index = start_index + limit

        # Slice the dataframe based on the calculated indices
        paginated_df = users_df.iloc[start_index:end_index]

        # Convert the paginated dataframe to a list of records
        data = paginated_df.to_dict("records")

    # Return the paginated data
    return dumps(data), 200


@users_route.get("/users/recommend")
def recommend_job():
    # Get the values of page and per_page from the query parameters
    n_movies = int(request.args.get('n_movies', 1))
    id = request.args.get('id')
    try:
        categories = request.args.get("categories").split(";")
    except:
        categories = None
    
    if id:
        if categories:
            rating_df = recommender_system_3(refined_dataset, user_enc, item_enc, id, recommend_model, n_movies, min_rating, max_rating, category=categories).merge(test_movies_df[["id", "movie_title"]], left_on="movie", right_on="movie_title", how="inner")
        else:
            rating_df = recommender_system(refined_dataset, user_enc, item_enc, id, recommend_model, n_movies, min_rating, max_rating).merge(test_movies_df[["id", "movie_title"]], left_on="movie", right_on="movie_title", how="inner")
    else:
        rating_df = recommender_system_2(test_movies_df, n_movies, category=categories).merge(test_movies_df[["id", "movie_title"]], left_on="movie", right_on="movie_title", how="inner")
    
    # Return the paginated data
    return dumps(rating_df.to_dict("records")), 200