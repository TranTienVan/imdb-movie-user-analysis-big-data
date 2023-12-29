import logo from "./logo.svg";
import "./App.css";
import Logo from "./images/imdb_logo.png";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
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
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Checkbox from "@mui/material/Checkbox";
import InputLabel from "@mui/material/InputLabel";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { MenuProps, options } from "./utils";
import { Typography } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CircularProgress from "@mui/material/CircularProgress";

function App() {
  // const data = localStorage.getItem("data");
  // setData(JSON.parse(data));

  const navigation = useNavigate();

  const [data, setData] = React.useState(
    JSON.parse(localStorage.getItem("data"))
  );

  const [open, setOpen] = React.useState(
    data && Object.keys(data).length > 0 ? false : true
  );

  const [isLoading, setIsLoading] = React.useState(false);

  const [isOpenOnboard, setIsOpenOnboard] = React.useState(false);

  const [userId, setUserId] = useState("");

  const [moviesList, setMovieList] = useState([]);

  const [gender, setGender] = useState("female");

  const [age, setAge] = useState("less_18");

  const [rating, setRating] = useState("more_8");

  const handleChangeGender = (e) => {
    setGender(e.target.value);
  };

  const handleChangeAge = (e) => {
    setAge(e.target.value);
  };

  const handleChangeRating = (e) => {
    setRating(e.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseOnboard = () => {
    setIsOpenOnboard(false);
  };

  const getMoviesList = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        "http://183.81.100.71:8080/api/movies?limit=1000&page=1"
      );
      if (res && res.data) {
        setMovieList(res.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    handleClose();
    localStorage.setItem("user_id", userId);
    localStorage.removeItem("data");
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

  // const classes = useStyles();
  const [selected, setSelected] = useState([]);
  const isAllSelected =
    options.length > 0 && selected.length === options.length;

  const handleChange = (event) => {
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setSelected(selected.length === options.length ? [] : options);
      return;
    }
    setSelected(value);
  };

  const handleSaveInfor = () => {
    const data = {
      age,
      gender,
      rating,
      selected,
    };
    console.log("data", data);
    localStorage.setItem("data", JSON.stringify(data));
    handleCloseOnboard();
  };

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      setUserId(userId);
    }
  }, []);

  console.log("ndphong data", data);

  useEffect(() => {
    if (!open && !isOpenOnboard) {
      getMoviesList();
    }
  }, [open, isOpenOnboard]);

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
            {/* <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                flex: 1,
              }}
            >
              <Link to="/statistic" style={{ fontSize: "22px" }}>
                Thống kê
              </Link>
            </div> */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                flex: 1,
              }}
            >
              {userId ? (
                <Link
                  to="#"
                  style={{ fontSize: "22px" }}
                  onClick={() => {
                    setOpen(true);
                    localStorage.removeItem("data");
                    localStorage.removeItem("user_id");
                  }}
                >
                  Đăng xuất
                </Link>
              ) : (
                <Link
                  to="#"
                  style={{ fontSize: "22px" }}
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                marginTop: "120px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <Typography>Đang tải dữ liệu</Typography>
                <CircularProgress />
              </div>
            </Box>
          ) : (
            <div
              style={{
                display: !open && !isOpenOnboard ? "block" : "none",
              }}
            >
              <div
                className="reviewed-movies-list"
                style={{ paddingTop: "60px" }}
              >
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
                              dangerouslySetInnerHTML={{
                                __html: item.movie_title,
                              }}
                            />
                          </Grid>
                        );
                      })}
                  </Grid>
                </div>
              </div>
              <div
                className="reviewed-movies-list"
                style={{ paddingTop: "60px" }}
              >
                <div>
                  <h2
                    style={{
                      textTransform: "uppercase",
                    }}
                  >
                    Phim liên quan
                  </h2>
                </div>
                {/* <div style={{ paddingTop: "60px" }}>
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
              </Grid>
            </div> */}
              </div>
            </div>
          )}

          <Dialog open={isOpenOnboard} onClose={handleCloseOnboard} maxWidth>
            {/* <DialogTitle>Onboarding</DialogTitle> */}
            <DialogContent>
              <Typography
                color="primary"
                style={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  setOpen(true);
                  setIsOpenOnboard(false);
                }}
              >
                {/* <ArrowBackIcon /> */}
                Trở lại
              </Typography>
              <DialogContentText style={{ fontSize: "18px" }}>
                Để có được trải nghiệm xem phim tốt nhất, bạn vui lòng hoàn
                thành những sở thích xem phim của mình
              </DialogContentText>
              <div style={{ marginTop: "20px" }}>
                <FormControl>
                  <FormLabel id="demo-controlled-radio-buttons-group">
                    Giới tính
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={gender}
                    onChange={handleChangeGender}
                    style={{ display: "flex", flexDirection: "row" }}
                  >
                    <FormControlLabel
                      value="female"
                      control={<Radio />}
                      label="Nữ"
                    />
                    <FormControlLabel
                      value="male"
                      control={<Radio />}
                      label="Nam"
                    />
                    <FormControlLabel
                      value="private_gender"
                      control={<Radio />}
                      label="Riêng tư"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
              <div style={{ marginTop: "20px" }}>
                <FormControl>
                  <FormLabel id="demo-controlled-radio-buttons-group">
                    Độ tuổi
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={age}
                    onChange={handleChangeAge}
                    style={{ display: "flex", flexDirection: "row" }}
                  >
                    <FormControlLabel
                      value="less_18"
                      control={<Radio />}
                      label="Dưới 18"
                    />
                    <FormControlLabel
                      value="18_30"
                      control={<Radio />}
                      label="18 - 30"
                    />
                    <FormControlLabel
                      value="31_50"
                      control={<Radio />}
                      label="31 - 50"
                    />
                    <FormControlLabel
                      value="more_50"
                      control={<Radio />}
                      label="Trên 50"
                    />
                    <FormControlLabel
                      value="private_age"
                      control={<Radio />}
                      label="Riêng tư"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
              <div style={{ marginTop: "20px" }}>
                <FormControl
                  style={{
                    width: "360px",
                  }}
                >
                  <InputLabel id="mutiple-select-label">
                    Thể loại yêu thích
                  </InputLabel>
                  <Select
                    labelId="mutiple-select-label"
                    multiple
                    value={selected}
                    onChange={handleChange}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                  >
                    <MenuItem value="all">
                      <ListItemIcon>
                        <Checkbox
                          checked={isAllSelected}
                          indeterminate={
                            selected.length > 0 &&
                            selected.length < options.length
                          }
                        />
                      </ListItemIcon>
                      <ListItemText primary="Chọn tất cả" />
                    </MenuItem>
                    {options.map((option) => (
                      <MenuItem key={option} value={option}>
                        <ListItemIcon>
                          <Checkbox checked={selected.indexOf(option) > -1} />
                        </ListItemIcon>
                        <ListItemText primary={option} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div style={{ marginTop: "20px" }}>
                <FormControl>
                  <FormLabel id="demo-controlled-radio-buttons-group">
                    Bạn muốn xem những phim có đánh giá thế nào?
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={rating}
                    onChange={handleChangeRating}
                    style={{ display: "flex", flexDirection: "row" }}
                  >
                    <FormControlLabel
                      value="more_8"
                      control={<Radio />}
                      label="Trên 8 điểm"
                    />
                    <FormControlLabel
                      value="more_6"
                      control={<Radio />}
                      label="Trên 6 điểm"
                    />
                    <FormControlLabel
                      value="skip"
                      control={<Radio />}
                      label="Bỏ qua"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  handleCloseOnboard();
                  setData(null);
                  localStorage.removeItem("data");
                }}
              >
                Bỏ qua
              </Button>
              <Button onClick={handleSaveInfor}>Tiếp tục</Button>
            </DialogActions>
          </Dialog>
          <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>Đăng nhập</DialogTitle>
            <DialogContent>
              <DialogContentText>Tên đăng nhập</DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Nhập tên đăng nhập"
                type="email"
                fullWidth
                variant="standard"
                onChange={(e) => {
                  setUserId(e.target.value);
                }}
              />
              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  gap: "12px",
                  justifyContent: "center",
                }}
              >
                <Typography>Chưa có tài khoản?</Typography>
                <Typography
                  color="primary"
                  style={{
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                  onClick={() => {
                    setOpen(false);
                    setIsOpenOnboard(true);
                    setUserId("");
                  }}
                >
                  Tiếp tục với vai trò Khách
                </Typography>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Đóng</Button>
              <Button disabled={!userId} onClick={handleLogin}>
                Tiếp tục
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default App;
