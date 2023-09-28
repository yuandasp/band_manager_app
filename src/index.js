require("dotenv/config");
const express = require("express");
const cors = require("cors");

const { bandRoutes, personnelRoutes } = require("./routes");
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/band", bandRoutes);
app.use("/personnel", personnelRoutes);

app.listen(PORT, (err) => console.log(`Running in PORT ${PORT}`));
