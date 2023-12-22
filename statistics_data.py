## inport library
import pandas as pd
## Code
def chart_1(df):
    number_review_per_year = df.groupby('year')['id'].count()
    time_line = list(number_review_per_year.index.values)
    values = list(number_review_per_year.values)
    return [time_line, values]

def chart_2(df):
    df = df[df['user_id_review'].duplicated()]
    count_new_user = df.groupby('year')['user_id_review'].count()
    value = list(count_new_user.values)
    return value

def chart_3(df):
    df = df[~df['ratings'].isna()]
    avg_ratings_per_year = df.groupby('year')['ratings'].mean()
    return list(avg_ratings_per_year.values)

def get_number_user_film(df):
    number_user = df['user_id_review'].unique().shape[0]
    number_film = df['movie_id'].unique().shape[0]
    return [number_film, number_user]

def statistics():
    ## Mày lấy api về bỏ vào biến df giùm t nha Tiến, rồi chuyển nó sang dataFrame có các cột giống cái file final.json
    df = pd.read_json('Data/final.json')
    df['date_review'] = pd.to_datetime(df['date_review'], format='%d %B %Y')
    df['year'] = df['date_review'].dt.year
    
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