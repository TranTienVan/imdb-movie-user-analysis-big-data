import logo from "./logo.svg";
import "./App.css";
import Logo from "./images/imdb_logo.png";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

function App() {
  const navigation = useNavigate();

  const [open, setOpen] = React.useState(true);

  const [userId, setUserId] = useState("");

  const [moviesList, setMovieList] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getMoviesList = async () => {
    try {
      const res = await axios.get(
        "http://183.81.100.71:8080/api/movies?limit=1000&page=1"
      );
      console.log("ndphong res", res);
      if (res && res.data) {
        setMovieList(res.data);
      }
    } catch (error) {
      console.log("ndphong error", error);
    }
  };

  const handleLogin = () => {
    handleClose();
    localStorage.setItem("user_id", userId);
    toast("🦄 Đăng nhập thành công", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const getRandomImage = () => {};

  useEffect(() => {
    getMoviesList();
  }, []);

  return (
    <div>
      <ToastContainer />
      <div
        className="header"
        style={{ paddingTop: "40px", paddingBottom: "40px" }}
      >
        <div className="container">
          <div
            className="header-main"
            style={{ display: "flex", alignItems: "center" }}
          >
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
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                flex: 1,
              }}
            >
              <Link to="/statistic" style={{ fontSize: "22px" }}>
                Thống kê
              </Link>
            </div>
          </div>
          <div className="reviewed-movies-list" style={{ paddingTop: "60px" }}>
            <div>
              <h2
                style={{
                  textTransform: "uppercase",
                }}
              >
                Phim đã xem
              </h2>
            </div>
            <div style={{ paddingTop: "60px" }}>
              <Grid container spacing={2}>
                {moviesList &&
                  moviesList.length > 0 &&
                  moviesList.map((item) => {
                    return (
                      <Grid
                        item
                        xs={3}
                        onClick={() => {
                          navigation(`/movie/${item.id}`);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          src="https://picsum.photos/300/201"
                          style={{
                            borderRadius: "6px",
                          }}
                        />
                        <h3
                          style={{ textAlign: "justify" }}
                          dangerouslySetInnerHTML={{ __html: item.movie_title }}
                        />
                      </Grid>
                    );
                  })}
              </Grid>
            </div>
          </div>
          <div className="reviewed-movies-list" style={{ paddingTop: "60px" }}>
            <div>
              <h2
                style={{
                  textTransform: "uppercase",
                }}
              >
                Phim liên quan
              </h2>
            </div>
            <div style={{ paddingTop: "60px" }}>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <img
                    src="https://picsum.photos/300/200"
                    style={{
                      borderRadius: "6px",
                    }}
                  />
                  <h3 style={{ textAlign: "justify" }}>
                    Mất Trăm Năm Đôi Mình Mới Chung Thuyền Remix, Đừng Lo Nhé Có
                    Anh Đây Remix
                  </h3>
                </Grid>
                <Grid item xs={3}>
                  <img
                    src="https://picsum.photos/300/200"
                    style={{
                      borderRadius: "6px",
                    }}
                  />
                  <h3 style={{ textAlign: "justify" }}>
                    Mất Trăm Năm Đôi Mình Mới Chung Thuyền Remix, Đừng Lo Nhé Có
                    Anh Đây Remix
                  </h3>
                </Grid>
                <Grid item xs={3}>
                  <img
                    src="https://picsum.photos/300/200"
                    style={{
                      borderRadius: "6px",
                    }}
                  />
                  <h3 style={{ textAlign: "justify" }}>
                    Mất Trăm Năm Đôi Mình Mới Chung Thuyền Remix, Đừng Lo Nhé Có
                    Anh Đây Remix
                  </h3>
                </Grid>
                <Grid item xs={3}>
                  <img
                    src="https://picsum.photos/300/201"
                    style={{
                      borderRadius: "6px",
                    }}
                  />
                  <h3 style={{ textAlign: "justify" }}>
                    Mất Trăm Năm Đôi Mình Mới Chung Thuyền Remix, Đừng Lo Nhé Có
                    Anh Đây Remix
                  </h3>
                </Grid>
              </Grid>
            </div>
          </div>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Đăng nhập</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Để có được trải nghiệm xem phim tốt nhất, bạn vui lòng điền
                thông tin đăng nhập của mình vào form.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="User ID"
                type="email"
                fullWidth
                variant="standard"
                onChange={(e) => {
                  setUserId(e.target.value);
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Đóng</Button>
              <Button onClick={handleLogin}>Tiếp tục</Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default App;
