const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "center",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "center",
  },
  variant: "menu",
};

const cateOptions = [
  "Drama",
  "Adult",
  "War",
  "Animation",
  "Film-Noir",
  "Family",
  "Reality-TV",
  "Short",
  "Talk-Show",
  "Musical",
  "Thriller",
  "Fantasy",
  "Western",
  "Romance",
  "Documentary",
  "History",
  "Music",
  "Crime",
  "Game-Show",
  "Sci-Fi",
  "News",
  "Adventure",
  "Sport",
  "Biography",
  "Comedy",
  "Action",
  "Horror",
  "Mystery",
];

export { MenuProps, cateOptions };
