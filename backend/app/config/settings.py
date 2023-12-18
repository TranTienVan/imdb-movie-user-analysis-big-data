from pydantic_settings import BaseSettings
import pandas as pd

class Settings(BaseSettings):
    DEBUG: bool = False
    
    class Config:
        case_sensitive = True
        env_file = ".env"


SETTING = Settings()
movies_df = pd.read_csv("./data/movies.csv")
reviews_df = pd.read_csv("./data/reviews.csv")
users_df = pd.read_csv("./data/users.csv")