import React, { PureComponent } from "react";
import ResponsiveContainer from "recharts/lib/component/ResponsiveContainer";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import Axios from "axios";

export default class SimpleBarChart extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      client_orders: [],
    };
  }

  async componentDidMount() {
    let documents = await Axios.get("/api/home_page/getBarChartData");
    let documentData = documents.data;
    let clientNameArray = [];
    let tableData = [];

    //pull clients with an order
    documentData.forEach((document) => {
      if (clientNameArray.includes(document.clientName) === false) {
        clientNameArray.push(document.clientName);
      }
    });

    //count how many orders each client has
    clientNameArray.forEach((client) => {
      let count = 0;
      documentData.forEach((document) => {
        if (document.clientName === client) {
          count++;
        }
      });
      tableData.push({ name: client, count: count });
    });

    //populate the table with
    this.setState(() => {
      return {
        client_orders: tableData,
      };
    });
  }

  render() {
    return (
      <ResponsiveContainer width="99%" height={320}>
        <BarChart
          width={500}
          height={300}
          data={this.state.client_orders}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#2481ba" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
