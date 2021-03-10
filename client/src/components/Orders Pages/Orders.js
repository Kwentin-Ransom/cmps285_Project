import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import DeleteIcon from "@material-ui/icons/Delete";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Input, Form, FormGroup, Label } from "reactstrap";
import Axios from "axios";
import PublishIcon from "@material-ui/icons/Publish";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

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
  searchInput: {
    minWidth: "200px",
    margin: "5px",
  },
}));

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#2481ba", // This is the "Nortech Blue"
    },
    secondary: {
      main: "#00e676",
    },
  },
});

export default function Order() {
  const [orderTableData, setOrderTableData] = useState([]);
  const [clientNameMenu, setClientNameMenu] = useState("");
  const [orderNumberTextBoxInput, setOrderNumberTextBoxInput] = useState("");
  const [clientName] = useState([]);
  const [
    additionalOrderNotesTextBoxInput,
    setAdditionalOrderNotesTextBoxInput,
  ] = useState("");
  const [poNumberTextBox, setPOOrderTextBox] = useState("");
  const [technicianTextBox, setTechnicianTextBox] = useState("");

  useEffect(() => {
    searchAvailableData();
  }, []);

  function searchAvailableData() {
    //Get all available assets
    Axios.get("/api/orders_page/getAssets").then((documents) => {
      setOrderTableData(documents.data);
    });

    //Set order number value
    Axios.get("/api/orders_page/getOrderNumber").then((documents) => {
      if (documents.data.length === 0) {
        setOrderNumberTextBoxInput("0");
      } else {
        let orderNumber = Number(documents.data[0].orderNumber) + 1;
        setOrderNumberTextBoxInput(orderNumber);
      }
    });

    //Get Client names for drop down menu
    Axios.get("/api/orders_page/getClientNames").then((documents) => {
      //Loops through all clients returned from DB
      documents.data.forEach((element) => {
        //Push a MenuItem component to clientName
        clientName.push(
          <MenuItem value={element.client}>{element.client}</MenuItem>
        );
      });
    });
  }

  function handleSubmitOrder() {
    if (clientNameMenu === "" || orderNumberTextBoxInput === "") {
      alert("You have not entered all of the required information");
    } else {
      //check if they have allocated stock to the client (don't allow nothing to be allocated)
      let somethingAllocated = false;
      let incorrectAllocation = false;
      let allocatedItemsArray = [];
      orderTableData.every((element) => {
        if (element.allocated !== "0") {
          somethingAllocated = true;

          //make sure allocated is not more than stock
          if (Number(element.allocated) > Number(element.stock)) {
            alert(
              "You have allocated more than is in stock for: " + element.item
            );
            incorrectAllocation = true;
            return false;
          } else if (Number(element.allocated) < 0) {
            //make sure allocated is not less than 0
            alert("You cannot set a value less than 0 for: " + element.item);
            incorrectAllocation = true;
            return false;
          }

          //add item to allocatedItemsArray
          allocatedItemsArray.push({
            item: element.item,
            allocated: element.allocated,
          });

          //Make sure to return a value in an every() loop
          return true;
        }
        //Make sure to return a value in an every() loop
        return true;
      });

      if (somethingAllocated === true && incorrectAllocation === false) {
        //Create an order for each item
        allocatedItemsArray.forEach((element) => {
          Axios.post("/api/orders_page/post", {
            item: element.item,
            allocated: element.allocated,
            clientName: clientNameMenu,
            orderNumber: orderNumberTextBoxInput,
            notes: additionalOrderNotesTextBoxInput,
            technician: technicianTextBox,
            poNumber: poNumberTextBox,
          }).then((response) => {
            console.log(response.status);
          });
        });

        //Subtract allocated from stock of each item
        allocatedItemsArray.forEach((element) => {
          Axios.post("/api/orders_page/update", {
            item: element.item,
            allocated: element.allocated,
          }).then((result) => {
            console.log(result.status);
          });
        });

        setClientNameMenu("");
        setAdditionalOrderNotesTextBoxInput("");
        setPOOrderTextBox("");
        setTechnicianTextBox("");
        searchAvailableData();
        window.location.reload();
      } else if (somethingAllocated === false) {
        alert("Please do not submit an order without allocating anything.");
      }
    }
  }

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
      editable: "never",
    },
    {
      title: "Allocated",
      field: "allocated",
      editable: "always",
    },
  ];

  const classes = useStyles();
  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <div style={{ maxWidth: "100%", paddingTop: "12px" }}>
        <div style={{ paddingBottom: "15px" }}>
          <Typography variant="h4" className={classes.title}>
            Create a New Order
          </Typography>
        </div>

        <Form>
          {/* Input to attatch a client */}
          <FormGroup className="w-50">
            {/* Drop down menu for client's name */}
            <InputLabel id="client_Name">Client Name:</InputLabel>
            <Select
              variant="outlined"
              className={classes.searchInput}
              autoComplete
              id="Client Name"
              autoWidth="true"
              value={clientNameMenu}
              onChange={(e) => setClientNameMenu(e.target.value)}
            >
              {clientName}
            </Select>
          </FormGroup>

          {/* //This is to attatch who is making the order */}
          <FormGroup className="w-50">
            <Label for="orderNumber">Order #:</Label>
            <Input
              value={orderNumberTextBoxInput}
              disabled={true}
              name="order"
              id="orderNumber"
              addonType="prepend"
            />
          </FormGroup>
          <FormGroup className="w-50">
            <Label for="poNumber">PO Number:</Label>
            <Input
              value={poNumberTextBox}
              onChange={(e) => setPOOrderTextBox(e.target.value)}
              name="purchaseorder"
              id="PurchaseOrder"
              placeholder="PO#"
            />
          </FormGroup>
          <FormGroup className="w-50">
            <Label for="exampleText">Additional Order Notes:</Label>
            <Input
              value={additionalOrderNotesTextBoxInput}
              onChange={(e) =>
                setAdditionalOrderNotesTextBoxInput(e.target.value)
              }
              name="text"
              id="exampleText"
            />
          </FormGroup>
          <FormGroup className="w-50">
            <Label>Technician Name:</Label>
            <Input
              value={technicianTextBox}
              onChange={(e) => setTechnicianTextBox(e.target.value)}
              id="technicianBox"
            />
          </FormGroup>
          <br />
        </Form>

        <div style={{ maxWidth: "100%", paddingTop: "50px" }}>
          {/* //Start of the table component  */}
          <MaterialTable
            //defines the columns, what the title is and its associated value.
            columns={columns}
            data={orderTableData}
            //allows the user to edit the cells
            cellEditable={{
              onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
                return new Promise((resolve, reject) => {
                  //forEach to find what row to edit
                  let indexOfRow;
                  orderTableData.forEach((element) => {
                    if (element.item === rowData.item) {
                      indexOfRow = orderTableData.indexOf(element);
                    }
                  });

                  orderTableData[indexOfRow].allocated = newValue;
                  setTimeout(resolve, 1000);
                });
              },
            }}
            title="Add Items to Order"
            icons={{
              Clear: () => <ClearIcon />,
              Search: () => <SearchIcon />,
              ResetSearch: () => <DeleteIcon />,
            }}
            options={{
              headerStyle: {
                backgroundColor: "#2481ba",
                color: "#FF-F",
                rowStyle: {
                  borderBottom: "5px solid white",
                },
              },
            }}
          />
        </div>
        <div
          style={{
            maxWidth: "100%",
            paddingTop: "30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        ></div>
        <ThemeProvider theme={theme}>
          <Button
            onClick={handleSubmitOrder}
            type="submit"
            variant="contained"
            color="secondary"
          >
            <PublishIcon />
            Submit Order
          </Button>
        </ThemeProvider>
      </div>
      <div />
    </main>
  );
}
