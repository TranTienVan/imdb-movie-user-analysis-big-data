import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import Logo from "./images/imdb_logo.png";
import TextField from "@mui/material/TextField";
import { useParams, useNavigation } from "react-router-dom";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import { deepOrange, deepPurple } from "@mui/material/colors";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const reviewOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Biểu đồ thể hiện tổng số review qua các năm",
    },
  },
};

export const userOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Biểu đồ thể hiện tổng số user mới qua các năm",
    },
  },
};

export const ratingOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Biểu đồ thể hiện ratings trung bình qua các năm",
    },
  },
};

const Statistic = () => {
  const [yearLabels, setYearLabels] = useState([]);

  const [reviewsData, setReviewsData] = useState([]);

  const [usersData, setUsersData] = useState([]);

  const [ratingsData, setRatingsData] = useState([]);

  const [users, setUsers] = useState(0);

  const [movies, setMovies] = useState(0);

  const getStatistic = async () => {
    const res = await axios.get(
      "http://183.81.100.71:8080/api/reviews/statistics?limit=4000000"
    );
    console.log("ndphong res 1", res);
    if (res && res.data) {
      setYearLabels(res.data.time_line);
      setReviewsData(res.data.number_review_per_year);
      setUsersData(res.data.number_new_user_per_year);

      let avg_ratings = [];
      for (var key in res.data.avg_ratings_per_year) {
        avg_ratings.push(res.data.avg_ratings_per_year[key]);
      }
      setRatingsData(avg_ratings);
      setUsers(res.data.number_user);
      setMovies(res.data.number_film);
    }
  };

  console.log("ndphong ratings data", ratingsData.length);

  useEffect(() => {
    getStatistic();
  }, []);

  return (
    <div>
      <ToastContainer />
      <div
        className="header"
        style={{ paddingTop: "40px", paddingBottom: "40px" }}
      >
        <div className="container">
          <h1>Thống kê chung về phim trên imdb.com</h1>

          <Grid container spacing={6}>
            <Grid item xs={6}>
              <Line
                options={userOptions}
                data={{
                  labels: yearLabels,
                  datasets: [
                    {
                      label: "Số user",
                      data: usersData,
                      borderColor: "rgb(53, 162, 235)",
                      backgroundColor: "rgba(53, 162, 235, 0.5)",
                    },
                  ],
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <Card sx={{ width: "50%" }}>
                  <CardContent>
                    <Typography
                      sx={{ fontSize: 24 }}
                      color="primary"
                      gutterBottom
                    >
                      Số lượng Users
                    </Typography>
                    <Typography variant="h5" component="div">
                      {users}
                    </Typography>
                  </CardContent>
                </Card>
                <Card sx={{ width: "50%" }}>
                  <CardContent>
                    <Typography
                      sx={{ fontSize: 24 }}
                      color="primary"
                      gutterBottom
                    >
                      Số lượng Movies
                    </Typography>
                    <Typography variant="h5" component="div">
                      {movies}
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            </Grid>
            <Grid item xs={6}>
              <Line
                options={reviewOptions}
                data={{
                  labels: yearLabels,
                  datasets: [
                    {
                      label: "Số review",
                      data: reviewsData,
                      borderColor: "rgb(255, 99, 132)",
                      backgroundColor: "rgba(255, 99, 132, 0.5)",
                    },
                  ],
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Line
                options={ratingOptions}
                data={{
                  labels: yearLabels,
                  datasets: [
                    {
                      label: "Ratings trung bình",
                      data: ratingsData,
                      borderColor: "rgba(255, 206, 86, 1)",
                      backgroundColor: "rgba(255, 206, 86, 0.2)",
                    },
                  ],
                }}
              />
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default Statistic;
