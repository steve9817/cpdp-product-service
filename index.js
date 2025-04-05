const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()

const bodyParser = require("body-parser")

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

const serverPort = process.env.SERVER_PORT | 3000

//==============
const CatergoryRoute = require("./route/CatogeryRoute")
//==============
try {
  mongoose.connect(
    `${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`
  )
  app.listen(serverPort, () => {
    console.log(`server up & running on port ${serverPort}`)
  })
} catch (e) {
  console.log(e)
}

app.get("/test-api", (req, res) => {
  return res.json({ messege: "Hi the Server is Working..." })
})

//http://localhost:3000/api/v1/categories/create-category
//===================
app.use("/api/v1/categories", CatergoryRoute)
//===================
