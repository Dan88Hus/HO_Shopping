const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const PORT= process.env.PORT || 8000
//import routes
const fs = require("fs")

const app = express()

mongoose.connect(process.env.MONGO_URI,{
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}) //its promise
.then(() => console.log('DB connected'))
.catch((error) => console.log("DB Connection Error",error))

//middlewares

app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(cors())

// routes middleware
fs.readdirSync("./routes").map((r)=> app.use("/api",require(`./routes/${r}`)))

//route to route folder
// app.get( )

app.listen(PORT, () => {
  console.log(`Server is runnning on port ${PORT}`)
})