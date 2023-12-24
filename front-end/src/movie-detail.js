import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import Logo from "./images/imdb_logo.png";
import TextField from "@mui/material/TextField";
import { useParams, useNavigation } from "react-router-dom";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import { deepOrange, deepPurple } from "@mui/material/colors";

const MovieDetail = () => {
  const { id } = useParams();

  const navigation = useNavigation();

  const [movie, setMovie] = useState({});

  const [reviews, setReviews] = useState([]);

  const getMovieDetail = async (id) => {
    console.log("ndphong id", id);

    const params = {
      ids: id,
    };

    const res = await axios.get("http://183.81.100.71:8080/api/movies", {
      params,
    });

    if (res && res.data && res.data.length) {
      setMovie(res.data[0]);
    }
  };

  const getMovieReviews = async (id) => {
    const params = {
      movie_ids: id,
    };
    const res = await axios.get("http://183.81.100.71:8080/api/reviews", {
      params,
    });
    console.log("ndphong res 1", res);
    if (res && res.data) {
      setReviews(res.data);
    }
  };

  const handleHoverReview = (content) => {
    console.log("content", content);
  };

  useEffect(() => {
    if (movie && movie.id) {
      getMovieReviews(movie.id);
    }
  }, [movie]);

  useEffect(() => {
    if (id) {
      getMovieDetail(id);
    }
  }, [id]);

  return (
    <div>
      <ToastContainer />
      <div
        className="header"
        style={{ paddingTop: "40px", paddingBottom: "40px" }}
      >
        <div className="container">
          <div className="header-main" style={{ display: "flex" }}>
            <div
              className="header-logo"
              style={{
                width: "300px",
              }}
            >
              <a href="/">
                <img
                  src={Logo}
                  style={{
                    width: "25%",
                  }}
                />
              </a>
            </div>
            <div style={{ width: "600px" }}>
              <TextField
                id="outlined-basic"
                label="Nhập tên phim"
                variant="outlined"
                style={{ width: "100%" }}
              />
            </div>
          </div>
          <div style={{ paddingTop: "60px" }}>
            <div
              style={{
                display: "flex",
                gap: "12px",
                textTransform: "uppercase",
              }}
            >
              <img
                src="https://picsum.photos/900/500"
                style={{
                  borderRadius: "6px",
                }}
              />
              <div>
                <h3>Phim liên quan</h3>
                <div
                  style={{
                    marginTop: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <div style={{ display: "flex", gap: "12px" }}>
                    <img
                      src="https://picsum.photos/120/66"
                      style={{
                        borderRadius: "6px",
                      }}
                    />
                    <h3>Phim liên quan</h3>
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <img
                      src="https://picsum.photos/120/66"
                      style={{
                        borderRadius: "6px",
                      }}
                    />
                    <h3>Phim liên quan</h3>
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <img
                      src="https://picsum.photos/120/66"
                      style={{
                        borderRadius: "6px",
                      }}
                    />
                    <h3>Phim liên quan</h3>
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <img
                      src="https://picsum.photos/120/66"
                      style={{
                        borderRadius: "6px",
                      }}
                    />
                    <h3>Phim liên quan</h3>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2
                dangerouslySetInnerHTML={{ __html: movie.title }}
                style={{
                  textTransform: "uppercase",
                }}
              />
              <h3>Nội dung: {movie.description}</h3>
              <div style={{ marginTop: "24px" }}>
                <h3>Bình luận:</h3>
                <div>
                  {reviews &&
                    reviews.length &&
                    reviews.map((review) => {
                      return (
                        <div
                          style={{
                            display: "flex",
                            gap: "12px",
                            padding: "6px 0px",
                          }}
                        >
                          <Avatar sx={{ bgcolor: deepOrange[500] }}>
                            {review.user_review[0]}
                          </Avatar>
                          <div>
                            <p style={{ fontWeight: "bold" }}>
                              {review.user_review}
                            </p>
                            <p
                              onMouseOver={() => {
                                handleHoverReview(review.description);
                              }}
                            >
                              {review.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
