import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import React, { useEffect, useState } from "react";
import Axios from "axios";
import bcrypt from "bcryptjs";

const useStyles = makeStyles((theme) => ({
  // necessary for content to be below app bar
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    height: "100vh",
    overflow: "auto",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  chartContainer: {
    marginLeft: -22,
  },
  tableContainer: {
    height: 320,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  input: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

export default function Users() {
  const [usernameTextField, setUsernameTextField] = useState("");
  const [passwordTextField, setPasswordTextField] = useState("");

  function handleSaveButton() {
    if (usernameTextField == "" || passwordTextField == ""){
      alert("Username and Password must be filled out before saving a user!");
    }
    else{
    //Encrypt the password before sending over HTTP to endpoint
    bcrypt.hash(passwordTextField, 10, (err, hash) => {
      //Send encrypted password and username to endpoint
      Axios.post("/api/login_page/signup", {
        username: usernameTextField,
        password: hash,
      }).then((response)=>{
        //Handle response
        console.log(response);
      });
    });

    }
  }

  const classes = useStyles();
  return (
    // These 2 lines are needed to maek sure the information is below the app bar
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />

      <div style={{ paddingBottom: "8px" }}>
        <Typography variant="h4" className={classes.title}>
          Add a User
        </Typography>
      </div>

      <form className={classes.input}>
        <TextField
          label="Username"
          value={usernameTextField}
          onChange={(e) => setUsernameTextField(e.target.value)}
        />
        <TextField
          label="Password"
          value={passwordTextField}
          onChange={(e) => setPasswordTextField(e.target.value)}
          type="password"
        />

        <div style={{ maxWidth: "100%", paddingTop: "12px" }}>
          <Button
            onClick={handleSaveButton}
            type="submit"
            variant="contained"
            color="submit"
          >
            <SaveIcon />
            Save
          </Button>
        </div>
      </form>
      <div />
    </main>
  );
}
