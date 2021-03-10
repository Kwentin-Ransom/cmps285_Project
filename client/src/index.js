import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import SignIn2 from "./Signin2";
import App from "./App";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#2481ba", // This is the "Nortech Blue"
    },
    secondary: {
      main: "#F21D1D",
    },
    success: {
      main: "#00e676",
    },
  },
});

export default theme;

//Uses a cookie to determine if the user can access the page or not
if (localStorage.getItem("loggedIn")) {
  //Reroute to dashboard
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </ThemeProvider>,
    document.getElementById("root")
  );
} else {
  //Renders the sign in page
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <React.StrictMode>
        <SignIn2 />
      </React.StrictMode>
    </ThemeProvider>,
    document.getElementById("root")
  );
}

//Renders the sign in page
/* ReactDOM.render(
  <ThemeProvider theme={theme}>
    <React.StrictMode>
      <SignIn2 />
    </React.StrictMode>
  </ThemeProvider>,
  document.getElementById("root")
); */
