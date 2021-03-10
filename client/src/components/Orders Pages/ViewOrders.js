import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import DeleteIcon from "@material-ui/icons/Delete";
import SearchIcon from "@material-ui/icons/Search";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Axios from "axios";

const useStyles = makeStyles((theme) => ({
  // necessary for content to be below app bar
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(4),
    height: "100vh",
    overflow: "auto",
    color: "inherit",
  },
  toolbar: {
    color: "inherit",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
}));

export default function ViewOrders() {
  //Initializes the orderTableData variable as a blank array
  const [orderTableData, setOrderTableData] = useState([]);

  useEffect(() => {
    getOrderTableData();
  }, []);

  function getOrderTableData() {
    Axios.get("/api/orders_page/getClientOrders").then((documents) => {
      //This is a stupid work around for bad formatting in the table
      documents.data.forEach((document) => {
        let newAssetArray = [];
        document.assets.forEach((assetTag) => {
          assetTag = assetTag.toString() + ", ";
          newAssetArray.push(assetTag);
        });
        Object.assign(document, { assets: newAssetArray });
      });

      //Populates the table
      setOrderTableData(documents.data);
    });
  }

  const columns = [
    {
      title: "Client Name",
      field: "clientName",
      editable: "never",
    },
    {
      title: "Item",
      field: "item",
      editable: "never",
    },
    {
      title: "Allocated",
      field: "allocated",
      editable: "never",
    },
    {
      title: "Order Number",
      field: "orderNumber",
      editable: "never",
    },
    {
      title: "Technician Name",
      field: "technician",
      editable: "never",
    },
    {
      title: "Notes",
      field: "notes",
      editable: "never",
    },
    {
      title: "Asset ID",
      field: "assets",
      editable: "never",
    },
  ];

  const classes = useStyles();
  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <div style={{ maxWidth: "100%", paddingTop: "12px" }}>
        <div style={{ paddingBottom: "15px" }}>
          <Typography variant="h4" className={classes.title}>
            View Existing Orders
          </Typography>
        </div>

        {/* //Start of the table component  */}
        <MaterialTable
          //defines the columns, what the title is and its associated value.
          columns={columns}
          data={orderTableData}
          //allows the user to edit the cells
          cellEditable={{
            onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
              return new Promise((resolve, reject) => {
                console.log("newValue: " + newValue);
                setTimeout(resolve, 1000);
              });
            },
          }}
          title="Orders"
          icons={{
            Clear: () => <DeleteIcon />,
            Search: () => <SearchIcon />,
            ResetSearch: () => <DeleteIcon />,
          }}
          options={{
            headerStyle: {
              backgroundColor: "#2481ba",
              color: "#FFF",
              rowStyle: {
                borderBottom: "5px solid white",
              },
            },
          }}
        />
      </div>
      <div />
    </main>
  );
}
