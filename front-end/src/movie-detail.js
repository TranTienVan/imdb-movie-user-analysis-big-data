import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import Logo from "./images/imdb_logo.png";
import TextField from "@mui/material/TextField";
import { useParams, useNavigation } from "react-router-dom";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import { deepOrange, deepPurple } from "@mui/material/colors";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { blue } from "@mui/material/colors";
import { DialogContent } from "@mui/material";
import { Chart as ChartJS, ArcElement } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";

import {
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  indexAxis: "y",
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "right",
    },
    title: {
      display: true,
      text: "Những phim người dùng này có thể thích",
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: labels.map(() => Math.floor(Math.random() * (100 - 50 + 1)) + 50),
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Dataset 2",
      data: labels.map(() => Math.floor(Math.random() * (100 - 50 + 1)) + 50),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

const MovieDetail = () => {
  const { id } = useParams();

  const navigation = useNavigation();

  const [movie, setMovie] = useState({});

  const [reviews, setReviews] = useState([]);

  const [isOpenModal, setIsOpenModal] = useState(false);

  const [currentReview, setCurrentReview] = useState({});

  const [currentSentiment, setCurrentSentiment] = useState({});

  const [recommenedList, setRecommenedList] = useState([]);

  const handleClose = () => {
    setIsOpenModal(false);
  };

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

  const handleGetSentiment = async (content) => {
    try {
      const params = {
        text: content,
      };

      const res = await axios.get(
        "http://183.81.100.71:8080/api/reviews/sentiment",
        {
          params,
        }
      );
      console.log("ndphong res2", res);
      if (res && res.data) {
        setCurrentSentiment(res.data);
      }
    } catch (error) {
      console.log("ndphong error", error);
    }
  };

  const getRecommendationMovies = async (id) => {
    try {
      const params = {
        id: id,
        n_movies: 10,
      };

      const res = await axios.get(
        "http://183.81.100.71:8080/api/users/recommend",
        {
          params,
        }
      );
      console.log("ndphong res3", res);
      if (res && res.data) {
        setRecommenedList(res.data);
      }
    } catch (error) {
      console.log("ndphong error", error);
    }
  };

  useEffect(() => {
    if (
      currentReview &&
      Object.keys(currentReview).length > 0 &&
      currentReview.description
    ) {
      handleGetSentiment(currentReview.description);
      getRecommendationMovies(currentReview.user_id_review);
    }
  }, [currentReview]);

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
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setIsOpenModal(true);
                            setCurrentReview(review);
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
                              // onMouseOver={() => {
                              //   handleGetSentiment(review.description);
                              // }}
                              style={{ textAlign: "justify" }}
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
            <Dialog onClose={handleClose} open={isOpenModal} maxWidth>
              <DialogTitle>Thông tin người dùng</DialogTitle>
              <DialogContent>
                <p>
                  <b>Họ tên:</b> {currentReview.user_review}
                </p>
                <div style={{ display: "flex", gap: "20px" }}>
                  <p>
                    <b>Nội dung review: </b>
                    <p style={{ textAlign: "justify" }}>
                      {currentReview.description}
                    </p>
                  </p>
                  <div>
                    <Pie
                      data={{
                        labels: ["Neg", "Neu", "Pos"],
                        datasets: [
                          {
                            label: "Sentiment percentage",
                            data: [
                              currentSentiment.neg,
                              currentSentiment.neu,
                              currentSentiment.pos,
                            ],
                            backgroundColor: [
                              "rgba(255, 99, 132, 0.2)",
                              "rgba(54, 162, 235, 0.2)",
                              "rgba(255, 206, 86, 0.2)",
                            ],
                            borderColor: [
                              "rgba(255, 99, 132, 1)",
                              "rgba(54, 162, 235, 1)",
                              "rgba(255, 206, 86, 1)",
                            ],
                            borderWidth: 1,
                          },
                        ],
                      }}
                    />
                  </div>
                </div>
                <Bar
                  options={options}
                  data={{
                    labels:
                      recommenedList &&
                      recommenedList.length > 0 &&
                      recommenedList.map((item) => item.movie),
                    datasets: [
                      {
                        label: "Mức độ tương thích",
                        data:
                          recommenedList &&
                          recommenedList.length > 0 &&
                          recommenedList.map((item) => item.ratings * 10),
                        borderColor: "rgb(255, 99, 132)",
                        backgroundColor: "rgba(255, 99, 132, 0.5)",
                      },
                    ],
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
