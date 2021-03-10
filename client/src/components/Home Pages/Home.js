import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import SimpleBarChart from "./BarChart";
import SimpleTable from "./SimpleTable";
import Typography from "@material-ui/core/Typography";

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
}));

const Home = () => {
  const classes = useStyles();
  return (
    // These 2 lines are needed to maek sure the information is below the app bar
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Typography variant="h4" gutterBottom component="h2">
        Orders
      </Typography>
      <Typography component="div" className={classes.chartContainer}>
        <SimpleBarChart />
      </Typography>
      <Typography variant="h4" gutterBottom component="h2">
        Assets
      </Typography>
      <div className={classes.tableContainer}>
        <SimpleTable />
      </div>
    </main>
  );
};

export default Home;
