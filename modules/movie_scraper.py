import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
import os

top_250_movie_ids = ['tt0111161',
 'tt0068646',
 'tt0468569',
 'tt0071562',
 'tt0050083',
 'tt0108052',
 'tt0167260',
 'tt0110912',
 'tt0120737',
 'tt0060196',
 'tt0109830',
 'tt0137523',
 'tt0167261',
 'tt1375666',
 'tt0080684',
 'tt0133093',
 'tt0099685',
 'tt0073486',
 'tt0114369',
 'tt0038650',
 'tt0047478',
 'tt0816692',
 'tt0102926',
 'tt0120815',
 'tt0317248',
 'tt0118799',
 'tt0120689',
 'tt9362722',
 'tt0076759',
 'tt0103064',
 'tt0088763',
 'tt0245429',
 'tt0253474',
 'tt0054215',
 'tt6751668',
 'tt0172495',
 'tt0110357',
 'tt0110413',
 'tt0120586',
 'tt0407887',
 'tt2582802',
 'tt0482571',
 'tt0095327',
 'tt0114814',
 'tt0056058',
 'tt0034583',
 'tt1675434',
 'tt0027977',
 'tt0095765',
 'tt0064116',
 'tt0047396',
 'tt0078748',
 'tt0021749',
 'tt0078788',
 'tt1853728',
 'tt0209144',
 'tt0082971',
 'tt0910970',
 'tt0405094',
 'tt0043014',
 'tt0050825',
 'tt4154756',
 'tt0081505',
 'tt15398776',
 'tt4633694',
 'tt0051201',
 'tt0032553',
 'tt0090605',
 'tt0361748',
 'tt1345836',
 'tt0169547',
 'tt0057012',
 'tt0364569',
 'tt2380307',
 'tt0086879',
 'tt0114709',
 'tt0082096',
 'tt0112573',
 'tt4154796',
 'tt7286456',
 'tt0119698',
 'tt0119217',
 'tt5311514',
 'tt0087843',
 'tt0057565',
 'tt1187043',
 'tt0045152',
 'tt8267604',
 'tt0180093',
 'tt0091251',
 'tt0435761',
 'tt0086190',
 'tt0338013',
 'tt0062622',
 'tt2106476',
 'tt0105236',
 'tt0044741',
 'tt0056172',
 'tt0053604',
 'tt0033467',
 'tt0022100',
 'tt0053125',
 'tt0052357',
 'tt0036775',
 'tt0211915',
 'tt0086250',
 'tt0093058',
 'tt1255953',
 'tt0066921',
 'tt0113277',
 'tt1049413',
 'tt0056592',
 'tt0070735',
 'tt8503618',
 'tt1832382',
 'tt0097576',
 'tt0017136',
 'tt0095016',
 'tt0986264',
 'tt0208092',
 'tt0119488',
 'tt0040522',
 'tt8579674',
 'tt0075314',
 'tt0363163',
 'tt5074352',
 'tt0059578',
 'tt0372784',
 'tt1745960',
 'tt0053291',
 'tt0012349',
 'tt0993846',
 'tt10272386',
 'tt6966692',
 'tt0042192',
 'tt0055031',
 'tt0120382',
 'tt0469494',
 'tt0112641',
 'tt1130884',
 'tt0089881',
 'tt0457430',
 'tt0107290',
 'tt0167404',
 'tt0105695',
 'tt0268978',
 'tt0477348',
 'tt0040897',
 'tt0055630',
 'tt0266697',
 'tt0084787',
 'tt0071853',
 'tt0057115',
 'tt0266543',
 'tt0042876',
 'tt0080678',
 'tt0071315',
 'tt0347149',
 'tt0046912',
 'tt0031381',
 'tt1392214',
 'tt0434409',
 'tt0081398',
 'tt0120735',
 'tt1305806',
 'tt2096673',
 'tt10872600',
 'tt5027774',
 'tt0117951',
 'tt0050212',
 'tt0116282',
 'tt1291584',
 'tt0264464',
 'tt1205489',
 'tt4729430',
 'tt0096283',
 'tt0405159',
 'tt1201607',
 'tt0118849',
 'tt0083658',
 'tt2024544',
 'tt0112471',
 'tt2278388',
 'tt0052618',
 'tt0072684',
 'tt0015864',
 'tt2267998',
 'tt2119532',
 'tt0107207',
 'tt0047296',
 'tt0353969',
 'tt0017925',
 'tt0077416',
 'tt0050986',
 'tt3011894',
 'tt0097165',
 'tt0041959',
 'tt0046268',
 'tt1392190',
 'tt0015324',
 'tt0198781',
 'tt0031679',
 'tt0073195',
 'tt0892769',
 'tt0978762',
 'tt1950186',
 'tt0050976',
 'tt3170832',
 'tt0118715',
 'tt0382932',
 'tt0046438',
 'tt0075148',
 'tt0395169',
 'tt3315342',
 'tt1895587',
 'tt0091763',
 'tt0019254',
 'tt0088247',
 'tt15097216',
 'tt0381681',
 'tt1979320',
 'tt0074958',
 'tt0070047',
 'tt0036868',
 'tt0092005',
 'tt0113247',
 'tt0325980',
 'tt0032138',
 'tt0317705',
 'tt0758758',
 'tt1028532',
 'tt4016934',
 'tt0035446',
 'tt0476735',
 'tt0107048',
 'tt0058946',
 'tt0032551',
 'tt0245712',
 'tt0059742',
 'tt0032976',
 'tt0061512',
 'tt0129167',
 'tt1454029',
 'tt0025316',
 'tt0048473',
 'tt0053198',
 'tt0103639',
 'tt0099348',
 'tt0060827',
 'tt0079470']

COOKIES = {
    'session-id': '132-9465593-9579807',
    'ubid-main': '135-6830841-7942246',
    'ad-oo': '0',
    'x-main': 'w0ZaH5Eo3FmqVdfuysdVNtYtfKr3ZcI2HRoZI0XQ0JcXNqFZ4dR4GgtS5NhNzMVX',
    'at-main': 'Atza|IwEBIOSayYl4Fq5MXlnWj-XCeod479dbf5kNoLnC3G73bhkNsW3WySbj_TBGXn7SJzeRVLAaJPWDpY1lffbqCzw-a4Y-NhZhNMqv5OkiLpxSvYhr-oE6q0affb-aYD31fzp__S9ApxOTsD1fnxcRdGg0c_oQ3_YogUfqGkmX-pV5YO5FlYgcdhX0RwFhAAitQkHNX3SoQzH-Yj41k8K2c_W0_vWyXgPmgi0HS_eyUWKkayADgA',
    'sess-at-main': '"6tsRA4li+0+CoTNmqSzcYfAM3/wZF4TOP8JKh3ENzNg="',
    'uu': 'eyJpZCI6InV1ZDA3NDU0MmVmNmIxNGVhODk5YTUiLCJwcmVmZXJlbmNlcyI6eyJmaW5kX2luY2x1ZGVfYWR1bHQiOmZhbHNlfSwidWMiOiJ1cjE3MjkzODc4NSJ9',
    'session-id-time': '2082787201l',
    'session-token': 'BWHcwie5n8868mQEr4Xl+CdTj+rJFQiZPYq+ERR/91bIDVtZZ03WY1UIKpggOdbn27hotqmS11DOQJ25ulBJbix07PynzwrTtx3adxgqOuIfgySRRn5PT40vKd4XuBDYn4bZ2dq2y9gsc72do6wSOiS3dgFhbAQmB/lwlCX6+VBKtPmlKMXjhYelRjbtnQQPjhLYL6/vjbMwx2GWWJV0BWVzXNuFUIeLKxGBX7Lx1ZnFPP1qgp7/JMgs2MYLXC2rxMkbk443QHe8UaNpZLBkIPuOo3LO4z9yuKOLIis/bKwtUR2mq3oqeqGrlirfsfumFwgFD9lHsRoy+mQRP5H9803TgybcRpxNFy+ZfJdWSWn9POWaT8qOHTrbcnCtxxVv',
    'csm-hit': 'tb:s-7CWXG8YJNX44RR1NP6BQ|1700399524276&t:1700399526398&adb:adblk_no',
}

HEADERS_2 = {
    'authority': 'www.imdb.com',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-language': 'en-US,en;q=0.9',
    'cache-control': 'max-age=0',
    # 'cookie': 'session-id=132-9465593-9579807; ubid-main=135-6830841-7942246; ad-oo=0; x-main=w0ZaH5Eo3FmqVdfuysdVNtYtfKr3ZcI2HRoZI0XQ0JcXNqFZ4dR4GgtS5NhNzMVX; at-main=Atza|IwEBIOSayYl4Fq5MXlnWj-XCeod479dbf5kNoLnC3G73bhkNsW3WySbj_TBGXn7SJzeRVLAaJPWDpY1lffbqCzw-a4Y-NhZhNMqv5OkiLpxSvYhr-oE6q0affb-aYD31fzp__S9ApxOTsD1fnxcRdGg0c_oQ3_YogUfqGkmX-pV5YO5FlYgcdhX0RwFhAAitQkHNX3SoQzH-Yj41k8K2c_W0_vWyXgPmgi0HS_eyUWKkayADgA; sess-at-main="6tsRA4li+0+CoTNmqSzcYfAM3/wZF4TOP8JKh3ENzNg="; uu=eyJpZCI6InV1ZDA3NDU0MmVmNmIxNGVhODk5YTUiLCJwcmVmZXJlbmNlcyI6eyJmaW5kX2luY2x1ZGVfYWR1bHQiOmZhbHNlfSwidWMiOiJ1cjE3MjkzODc4NSJ9; session-id-time=2082787201l; session-token=BWHcwie5n8868mQEr4Xl+CdTj+rJFQiZPYq+ERR/91bIDVtZZ03WY1UIKpggOdbn27hotqmS11DOQJ25ulBJbix07PynzwrTtx3adxgqOuIfgySRRn5PT40vKd4XuBDYn4bZ2dq2y9gsc72do6wSOiS3dgFhbAQmB/lwlCX6+VBKtPmlKMXjhYelRjbtnQQPjhLYL6/vjbMwx2GWWJV0BWVzXNuFUIeLKxGBX7Lx1ZnFPP1qgp7/JMgs2MYLXC2rxMkbk443QHe8UaNpZLBkIPuOo3LO4z9yuKOLIis/bKwtUR2mq3oqeqGrlirfsfumFwgFD9lHsRoy+mQRP5H9803TgybcRpxNFy+ZfJdWSWn9POWaT8qOHTrbcnCtxxVv; csm-hit=tb:s-7CWXG8YJNX44RR1NP6BQ|1700399524276&t:1700399526398&adb:adblk_no',
    'referer': 'https://www.imdb.com/chart/top/?ref_=nv_mv_250',
    'sec-ch-ua': '"Microsoft Edge";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0',
}



def scrape_a_movie(movie_id):
    path_data = f"./data/movies/"
    
    if os.path.exists(path_data + f"{movie_id}.json"):
        print("This movie has been scraped")
        
        with open(path_data + f"{movie_id}.json", "r", encoding="utf-8") as f:
            data = json.load(f)
        return None
    
    response = requests.get(f"https://www.imdb.com/title/{movie_id}/", cookies=COOKIES, headers=HEADERS_2)
    soup = BeautifulSoup(response.content, "html.parser")
    
    movie_obj = {"id": movie_id}
    
    ########### Script 1 ###########
    try:
        item_script_1 = soup.find("script", type="application/ld+json")
        detail_infor_script = json.loads(item_script_1.text)
    except:
        item_script_1 = soup.find("script", type="application/json")
        detail_infor_script = json.loads(item_script_1.text)
    ##### scraped_date
    scraped_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    movie_obj["scraped_date"] = scraped_date
    
    ##### title
    Title = detail_infor_script['name']
    movie_obj["title"] = Title
    
    ##### genre
    Genre = detail_infor_script["genre"]
    movie_obj["genre"] = Genre
    
    ##### published_date
    Published_Data = detail_infor_script["datePublished"]
    movie_obj["published_date"] = Published_Data
    
    ##### number_of_ratings
    Number_Of_Ratings = detail_infor_script['aggregateRating']['ratingCount']
    movie_obj["number_of_ratings"] = Number_Of_Ratings
    
    ##### ratings_average
    Ratings_Average = detail_infor_script['aggregateRating']['ratingValue']
    movie_obj["ratings_average"] = Ratings_Average
    
    ##### popularity_rank
    try: 
        Popularity_Rank = soup.find("div", class_="sc-5f7fb5b4-1 fTREEx").text
    except:
        Popularity_Rank = ""
    movie_obj["popularity_rank"] = Popularity_Rank
    
    ##### popularity_delta
    try: 
        Popularity_Delta = soup.find("div", "sc-5f7fb5b4-2 gNFLrF").text
    except:
        Popularity_Delta = ""
    movie_obj["popularity_delta"] = Popularity_Delta
    
    ##### description
    try:
        Description = detail_infor_script['description']
        movie_obj["description"] = Description
    except:
        movie_obj["description"] = ""
    
    ##### directors
    try:
        Directors = detail_infor_script["director"]
        movie_obj["directors"] = Directors
    except:
        movie_obj["directors"] = ""
    
    ##### creators
    try:
        Creators = detail_infor_script["creator"]
        movie_obj["creators"] = Creators
    except:
        movie_obj["creators"] = ""
    
    ##### actors
    try:
        Actors = detail_infor_script["actor"]
        movie_obj["actors"] = Actors
    except:
        movie_obj["actors"] = ""
    
    ########### Script 2 ###########
    
    item_script_2 = soup.find("script", id="__NEXT_DATA__")
    detail_infor_script = json.loads(item_script_2.text)
    
    ##### published_year
    try: 
        Published_Year =  int(detail_infor_script['props']['pageProps']['aboveTheFoldData']["releaseYear"]['year'])
    except: 
        Published_Year = ""
    movie_obj["published_year"] = Published_Year
    
    ##### duration
    try: 
        Duration =  detail_infor_script['props']['pageProps']['aboveTheFoldData']['runtime']["displayableProperty"]["value"]["plainText"]
    except: 
        Duration = ""
    movie_obj["duration"] = Duration
    
    ##### age_ratings
    try: 
        Ages_Ratings =  detail_infor_script['props']['pageProps']['aboveTheFoldData']["certificate"]["rating"]
    except: 
        Ages_Ratings = ""
    movie_obj["age_ratings"] = Ages_Ratings
    
    ##### number_of_videos
    try:
        Number_Of_Videos = int(detail_infor_script['props']['pageProps']['aboveTheFoldData']['videos']['total'])
    except:
        Number_Of_Videos = ""
    movie_obj["number_of_videos"] = Number_Of_Videos
    
    ##### number_of_images
    try:
        Number_Of_Images = int(detail_infor_script['props']['pageProps']['aboveTheFoldData']['images']['total'])
    except:
        Number_Of_Images = ""
    movie_obj["number_of_images"] = Number_Of_Images
    
    ##### total_added_users
    Total_Added_Users = detail_infor_script['props']['pageProps']['aboveTheFoldData']['engagementStatistics']['watchlistStatistics']['displayableCount']['text']
    movie_obj["total_added_users"] = Total_Added_Users
    
    ##### total_reviews
    try:
        Total_Reviews = int(detail_infor_script['props']['pageProps']['aboveTheFoldData']['reviews']['total'])
    except:
        Total_Reviews = ""
    movie_obj["total_reviews"] = Total_Reviews
    
    ##### total_critic_reviews
    try: 
        Total_Critic_Reviews = int(detail_infor_script['props']['pageProps']['aboveTheFoldData']['criticReviewsTotal']['total'])
    except:
        Total_Critic_Reviews = ""
    movie_obj["total_critic_reviews"] = Total_Critic_Reviews
    
    ##### meta_score
    try: 
        Meta_Score = int(detail_infor_script['props']['pageProps']['aboveTheFoldData']["metacritic"]['metascore']['score'])
    except:
        Meta_Score = ""
    movie_obj["meta_score"] = Meta_Score
    
    with open(path_data + f"{movie_id}.json", "w", encoding="utf-8") as f:
        json.dump(movie_obj, f, indent=3)
    
    print("Scrape movie success", path_data + f"{movie_id}.json")
    return movie_obj

