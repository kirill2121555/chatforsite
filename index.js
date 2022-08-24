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
    origin:'https://fronthelp.vercel.app',
    methods: ["GET", "POST"],
    credentials: true  }
})


app.get('/oo', function(req, res) {
  console.log('ooooooo')

  res.json('helloworld');
});
console.log('mess')

io.on('connection', (socket) => {
  try{
  socket.on('message', async (data) => {
    console.log('mess')
    const user = await userModel.findById(data.i)
    const isdialog = await user?.dialogs.get(data.to)
    let dialog=[];
    dialog = await dialogModel.findById(isdialog)
    dialog.messages.push({ username: data.username, message: data.message })
    dialog.save()
    socket.join(dialog.room_uuid)
    io.to(dialog.room_uuid).emit('message', JSON.stringify(data));
  

  })}catch(e){
    console.log('error')  }
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

