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
import { MenuProps, cateOptions } from "./utils";
import { Typography } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CircularProgress from "@mui/material/CircularProgress";
import SearchIcon from "@mui/icons-material/Search";
import Input from "@mui/material/Input";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import { ImageUrls } from "./csvjson";

function App() {
  // const data = localStorage.getItem("data");
  // setData(JSON.parse(data));

  const navigation = useNavigate();

  const [data, setData] = React.useState(
    JSON.parse(localStorage.getItem("data"))
  );

  const [open, setOpen] = React.useState(
    (data && Object.keys(data).length > 0) || localStorage.getItem("is_skipped")
      ? false
      : true
  );

  const [isLoading, setIsLoading] = React.useState(false);

  const [isOpenOnboard, setIsOpenOnboard] = React.useState(false);

  const [isSkipped, setIsSkipped] = React.useState(false);

  const [userId, setUserId] = useState("");

  const [moviesList, setMovieList] = useState([]);

  const [actorsList, setActorsList] = useState([]);

  const [gender, setGender] = useState("female");

  const [age, setAge] = useState("less_18");

  const [rating, setRating] = useState("more_8");

  const [searchType, setSearchType] = useState("keyword");

  const [searchContent, setSearchContent] = useState("");

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

  const getSearchList = async (data, n_movies = 100) => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        "http://183.81.100.71:8080/api/movies/search",
        {
          params: {
            ...data,
            n_movies,
          },
        }
      );
      if (res && res.data) {
        setMovieList(res.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getMoviesList = async (data, n_movies = 100, isSkipped = false) => {
    try {
      setIsLoading(true);
      let categoriesList = "";
      cateOptions &&
        cateOptions.forEach((item, index) => {
          if (index !== cateOptions.length - 1) categoriesList += item + ";";
          else {
            categoriesList += item;
          }
        });
      const res = await axios.get(
        "http://183.81.100.71:8080/api/users/recommend",
        {
          params: !localStorage.getItem("is_skipped")
            ? {
                ...data,
                n_movies: 100,
              }
            : {
                categories: categoriesList,
                n_movies: 100,
              },
        }
      );
      if (res && res.data) {
        let tempMoviesList = res.data.map((item) => {
          const randomIndex = Math.floor(Math.random() * (3000 - 0 + 1)) + 0;
          return {
            ...item,
            urlIndex: randomIndex,
          };
        });

        setMovieList(tempMoviesList);
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
  const [categories, setCategories] = useState([]);
  const isAllSelected =
    cateOptions.length > 0 && categories.length === cateOptions.length;

  const handleChange = (event) => {
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setCategories(
        categories.length === cateOptions.length ? [] : cateOptions
      );
      return;
    }
    setCategories(value);
  };

  const handleSaveInfor = () => {
    let categoriesList = "";
    categories &&
      categories.forEach((item, index) => {
        if (index !== categories.length - 1) categoriesList += item + ";";
        else {
          categoriesList += item;
        }
      });
    const data = {
      age: age !== "private_age" ? age : null,
      gender: gender !== "private_gender" ? age : null,
      min_number_of_ratings:
        rating === "more_8" ? 8 : rating === "more_6" ? 6 : null,
      categories: categoriesList,
    };
    console.log("post data", data);
    localStorage.setItem("data", JSON.stringify(data));
    handleCloseOnboard();
  };

  const handleSearch = (e) => {
    console.log(searchContent);
    if (searchContent) {
      let tempData = JSON.parse(localStorage.getItem("data"));
      // let searchObj = {};
      let searchObj = JSON.parse(localStorage.getItem("search_obj")) || {};

      console.log("ndphong searchObj", searchObj);
      if (searchObj[searchType]) {
        searchObj[searchType] += ";" + searchContent;
      } else {
        searchObj[searchType] = searchContent;
      }

      // searchObj[searchType] = localStorage.getItem("")
      localStorage.setItem("search_obj", JSON.stringify(searchObj));

      console.log("tempData", tempData);
      // console.log("searchObj", searchObj);
      if (searchType == "keyword") {
        tempData.keyword = searchContent;
      } else if (searchType == "actor_names") {
        tempData.actor_names = searchContent;
      } else if (searchType == "director_name") {
        tempData.director_names = searchContent;
      }
      console.log("ndphong update data", tempData);
      getSearchList(tempData);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      setUserId(userId);
    }
  }, []);

  console.log("ndphong data", data);

  useEffect(() => {
    if (!open && !isOpenOnboard && !isSkipped) {
      getMoviesList({
        ...JSON.parse(localStorage.getItem("data")),
      });
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
            <div
              style={{ width: "600px", display: "flex", alignItems: "center" }}
            >
              <FormControl style={{ width: "200px" }}>
                <InputLabel id="demo-simple-select-label">Menu</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={searchType}
                  label="Tên phim"
                  onChange={(e) => {
                    setSearchType(e.target.value);
                  }}
                >
                  <MenuItem value="keyword" style={{ width: "200px" }}>
                    Tên phim
                  </MenuItem>
                  <MenuItem value="actor_names" style={{ width: "200px" }}>
                    Diễn viên
                  </MenuItem>
                  <MenuItem value="director_names" style={{ width: "200px" }}>
                    Đạo diễn
                  </MenuItem>
                </Select>
              </FormControl>

              {/* <TextField
                id="outlined-basic"
                label="Nhập nội dung tìm kiếm"
                variant="outlined"
                style={{ width: "100%" }}
              /> */}

              <FormControl sx={{ m: 1, width: "400px" }} variant="outlined">
                <InputLabel htmlFor="filled-adornment-password">
                  Nhập nội dung
                </InputLabel>
                <OutlinedInput
                  id="filled-adornment-password"
                  type={"text"}
                  onChange={(e) => {
                    console.log(e.target.value);
                    setSearchContent(e.target.value);
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <SearchIcon
                        aria-label="toggle password visibility"
                        onClick={(e) => {
                          handleSearch();
                        }}
                        edge="end"
                        style={{ cursor: "pointer" }}
                      >
                        <VisibilityOff />
                      </SearchIcon>
                    </InputAdornment>
                  }
                />
              </FormControl>
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
                    Phim Liên quan
                  </h2>
                </div>
                <div style={{ paddingTop: "60px" }}>
                  <Grid container spacing={6}>
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
                              src={ImageUrls[item.urlIndex].image}
                              style={{
                                borderRadius: "6px",
                                height: "300px",
                              }}
                            />

                            <h3
                              style={{ textAlign: "justify" }}
                              dangerouslySetInnerHTML={{
                                __html: item.movie_title || item.movie,
                              }}
                            />
                          </Grid>
                        );
                      })}
                  </Grid>
                </div>
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
                    value={categories}
                    onChange={handleChange}
                    renderValue={(categories) => categories.join(", ")}
                    MenuProps={MenuProps}
                  >
                    <MenuItem value="all">
                      <ListItemIcon>
                        <Checkbox
                          checked={isAllSelected}
                          indeterminate={
                            categories.length > 0 &&
                            categories.length < cateOptions.length
                          }
                        />
                      </ListItemIcon>
                      <ListItemText primary="Chọn tất cả" />
                    </MenuItem>
                    {cateOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        <ListItemIcon>
                          <Checkbox checked={categories.indexOf(option) > -1} />
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
                  localStorage.removeItem("search_obj");
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
              <Button
                onClick={() => {
                  handleClose();
                  setIsSkipped(true);
                  getMoviesList({}, 100, true);
                  localStorage.setItem("is_skipped", true);
                }}
              >
                Đóng
              </Button>
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
