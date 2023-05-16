const express = require('express');
const db = require('./models');
const cors = require("cors")

const userRouter = require("./routes/UserRoute")

const app = express();

app.use(express.json())

app.use(cors())


app.use("/api/v1/auth", userRouter)


db.sequelize.sync().then(() => {
    app.listen(3001, () => {
      console.log("Server running on port 3001");
    });
  });