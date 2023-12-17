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
import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [open, setOpen] = React.useState(true);

  const [userId, setUserId] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
                width: "400px",
              }}
            >
              <img
                src={Logo}
                style={{
                  width: "25%",
                }}
              />
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
