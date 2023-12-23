import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import Logo from "./images/imdb_logo.png";
import TextField from "@mui/material/TextField";
import { useParams, useNavigation } from "react-router-dom";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import { deepOrange, deepPurple } from "@mui/material/colors";

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

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Biểu đồ thể hiện tổng số user đã review qua các năm",
    },
  },
};

const Statistic = () => {
    const [yearLabels, setYearLabels] = useState([]);

    const [reviewsData, setReviewsData] = useState([]);

  const getStatistic = async () => {
    const res = await axios.get(
      "http://42.117.27.86:8080/api/reviews/statistics?limit=100000&page=1"
    );
    console.log("ndphong res 1", res);
    if (res && res.data) {
      setYearLabels(res.data.time_line);
      setReviewsData(res.data.number_review_per_year);
    }
  };

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
          <Line
            options={options}
            data={{
              labels: yearLabels,
              datasets: [
                {
                  label: "Số user",
                  data: reviewsData,
                  borderColor: "rgb(255, 99, 132)",
                  backgroundColor: "rgba(255, 99, 132, 0.5)",
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Statistic;
