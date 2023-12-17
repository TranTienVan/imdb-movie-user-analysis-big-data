from flask_openapi3 import APIBlueprint, Tag
from bson.json_util import dumps
from flask import request  # Import the 'request' object
from app.config.settings import movies_df

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