const app = require("./index");
const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => console.log(`Running in PORT ${PORT}`));
