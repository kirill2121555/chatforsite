const mongoose = require('mongoose')
const userModel = require('./model/userModel')
const dialogModel = require('./model/dialogModel')
const express = require('express')
const app = express()
const server = require("http").Server(app);
const PORT = process.env.PORT || 9999
const cors = require('cors')

const io = require("socket.io")(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  }
})

app.use(cors(corsOptions));

app.get('/oo', function (req, res) {
  res.json('helloworld');
});


const start = async () => {
  try {
    await mongoose.connect('mongodb+srv://root:root@cluster0.xlabe.mongodb.net/?retryWrites=true&w=majority')
    server.listen(PORT, () => console.log('start'));
  } catch (e) {
    console.log(e)
  }
}

start()

