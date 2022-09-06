const mongoose = require('mongoose')
const userModel = require('./model/userModel')
const dialogModel = require('./model/dialogModel')
const express = require('express')
const app = express()
const server = require("http").Server(app);
const PORT = process.env.PORT || 9999
const cors = require('cors')
const fs = require("fs");


const io = require("socket.io")(server, {
  cors: {
    origin: 'https://fronthelp.vercel.app',
    methods: ["GET", "POST"],
    path: "/my-custom-path/",
    credentials: true
  }
})


app.get('/oo', function (req, res) {
  console.log('oooo')
  res.json('helloworld');
});

io.on('connection', (socket) => {
  try {
    socket.on('message', async (data) => {
      const user = await userModel.findById(data.i)
      const isdialog = await user.dialogs.get(data.to)
      let dialog = [];
      dialog = await dialogModel.findById(isdialog)
      dialog.messages.push({ username: data.username, message: data.message })
      dialog.save()
      socket.join(dialog.room_uuid)
      io.to(dialog.room_uuid).emit('message', JSON.stringify(data));
    })

    socket.on('img', async (imgData) => {
      const user = await userModel.findById(imgData.i)
      const isdialog = await user?.dialogs.get(imgData.to)
      let dialog = [];
      dialog = await dialogModel.findById(isdialog)
      dialog.messages.push({ username: imgData.username, message: imgData.message })
      dialog.save()
      socket.join(dialog.room_uuid)
      io.to(dialog.room_uuid).emit('newImg', JSON.stringify(imgData));
    });
  } catch (e) {
    console.log('error')
  }
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

