import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";
import SearchIcon from "@material-ui/icons/Search";
import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import Axios from "axios";

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

export default function Assets() {

  const [itemsTableData, setItemsTableData] = useState([]);
  const [itemNameTextBoxValue, setItemNameTextBoxValue] = useState("");
  const [modelNumberTextBoxValue, setModelNumberTextBoxValue] = useState("");
  const [manufacturerTextBoxValue, setManufacturerTextBoxValue] = useState("");

  //Determines the columns for the Items table
  const columns = [
    {
      title: "Item",
      field: "item",
      editable: "never",
    },
    {
      title: "Model",
      field: "modelNumber",
      editable: "never",
    },
    {
      title: "Manufacturer",
      field: "manufacturer",
      editable: "never",
    },
    {
      title: "Stock",
      field: "stock",
      initialEditValue: "0",
      editable: "onAdd",
    },
  ];

  useEffect(() => {
    fetchItemsTableData();
  }, []);

  function resetTextValues() {
    setItemNameTextBoxValue("");
    setModelNumberTextBoxValue("");
    setManufacturerTextBoxValue("");
  }



  function handleSaveButtonClicked() {
    //Add the asset to the "Assets" MongoDB collection, also add an "allocated" field
    if (itemNameTextBoxValue === "" || modelNumberTextBoxValue == "" || manufacturerTextBoxValue === ""){
      alert("All fields must have a value before submitting!");
    }
    else{
      Axios.post("/api/assets_page/post", {
        item: itemNameTextBoxValue,
        modelNumber: modelNumberTextBoxValue,
        manufacturer: manufacturerTextBoxValue,
        stock: "0",
      }).then(() => {
        resetTextValues();
        fetchItemsTableData();
      });
    } 
}

  async function fetchItemsTableData() {
    //Pull all assets from "Assets" MongoDB collection
    let documents = await Axios.get("/api/assets_page/get");
    setItemsTableData(documents.data);
  }

  function updateItemData(newValue, oldValue, rowData, columnDef) {
    //Sends the info it needs to update the database with
    Axios.post("/api/assets_page/update", {
      item: rowData.item,
      oldValue: oldValue,
      infoToUpdate: columnDef.field,
      valueToUpdateWith: newValue,
    })
      .then(() => {
        fetchItemsTableData();
        return true;
      })
      .catch(() => {
        fetchItemsTableData();
        return false;
      });
  }

  //I kept this in case we decide to bring back the delete button
  /* function deleteItem(item) {
    Axios.post("/api/assets_page/delete", {
      item: item,
    }).then(() => {
      fetchItemsTableData();
    });
  } */

  const classes = useStyles();
  return (
    // These 2 lines are needed to make sure the information is below the app bar
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />

      <div style={{ paddingBottom: "8px" }}>
        <Typography variant="h4" className={classes.title}>
          Assets
        </Typography>
      </div>

      <form className={classes.input}>
        <TextField
          label="Item Name"
          value={itemNameTextBoxValue}
          onChange={(e) => setItemNameTextBoxValue(e.target.value)}
        />

        <TextField
          label="Model Number"
          value={modelNumberTextBoxValue}
          onChange={(e) => setModelNumberTextBoxValue(e.target.value)}
        />
        <TextField
          label="Manufacturer"
          value={manufacturerTextBoxValue}
          onChange={(e) => setManufacturerTextBoxValue(e.target.value)}
        />

        <div style={{ maxWidth: "100%", paddingTop: "12px" }}>
          <Button
            variant="contained"
            color="inherit"
            onClick={handleSaveButtonClicked}
          >
            <SaveIcon />
            Save
          </Button>
        </div>
      </form>

      {/* Items Table */}
      <div style={{ maxWidth: "100%", paddingTop: "25px" }}>
        <MaterialTable
          //defines the columns, what the title is and its associated value.
          columns={columns}
          data={itemsTableData}
          //allows the user to edit the cells
          cellEditable={{
            onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
              return new Promise(async (resolve, reject) => {
                let result = updateItemData(newValue, oldValue, rowData, columnDef);
                if (result === true) {
                  resolve(true);
                } else {
                  reject(true);
                }
              });
            },
          }}
          title="Items"
          icons={{
            Clear: () => <ClearIcon />,
            Search: () => <SearchIcon />,
            ResetSearch: () => <DeleteIcon />,
          }}
          options={{
            headerStyle: {
              backgroundColor: "#2481ba",
              color: "#FFF",
            },
          }}
        />
      </div>
      <div />
    </main>
  );
}
