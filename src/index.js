require("dotenv/config");
const express = require("express");
const cors = require("cors");

const { db, query } = require("./database/index");
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.listen(PORT, (err) => console.log(`Running in PORT ${PORT}`));
