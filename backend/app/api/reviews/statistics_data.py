## inport library
import pandas as pd
## Code
def chart_1(df):
    number_review_per_year = df.groupby('year')['id'].count()
    time_line = number_review_per_year.index.tolist()
    time_line = [int(t) for t in time_line]
    values = number_review_per_year.tolist()
    values = [int(v) for v in values]
    return [time_line, values]

def chart_2(df):
    df = df[df['user_id_review'].duplicated()]
    count_new_user = df.groupby('year')['user_id_review'].count()
    values = count_new_user.tolist()
    values = [int(v) for v in values]
    return values

def chart_3(df):
    df = df[~df['ratings'].isna()]
    avg_ratings_per_year = df.groupby('year')['ratings'].mean()
    
    values = avg_ratings_per_year.tolist()
    values = [int(v) for v in values]
    return avg_ratings_per_year

def get_number_user_film(df):
    number_user = int(df['user_id_review'].unique().shape[0])
    number_film = int(df['movie_id'].unique().shape[0])
    return [number_film, number_user]

def statistics(df):
    time_line, number_review_per_year = chart_1(df)
    number_new_user_per_year = chart_2(df)
    avg_ratings_per_year = chart_3(df)
    number_film, number_user = get_number_user_film(df)
    
    dict_result = {
        'time_line': time_line,
        'number_review_per_year': number_review_per_year,
        'number_new_user_per_year': number_new_user_per_year,
        'avg_ratings_per_year': avg_ratings_per_year,
        'number_film': number_film,
        'number_user': number_user
    }
    return dict_result