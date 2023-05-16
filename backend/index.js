const express = require('express');
const db = require('./models');
const cors = require("cors")



const app = express();

app.use(express.json())

app.use(cors())

const userRouter = require("./routes/UserRoute")
const packageRoute = require("./routes/packageRoute")


app.use("/api/v1/auth", userRouter)
app.use("/api/v1/package", packageRoute)



db.sequelize.sync().then(() => {
    app.listen(3001, () => {
      console.log("Server running on port 3001");
    });
  });