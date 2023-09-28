require("dotenv/config");
const express = require("express");
const cors = require("cors");

const { bandRoutes, personnelRoutes } = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/band", bandRoutes);
app.use("/personnel", personnelRoutes);

module.exports = app;
