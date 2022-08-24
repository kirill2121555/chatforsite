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
    origin: "https://fronthelp.vercel.app",
    methods: ["GET", "POST"]
  }
})


const corsOptions ={
  origin:'https://fronthelp.vercel.app', 
  credentials:true,
  optionSuccessStatus:200
}
app.use(cors(corsOptions));


io.on('connection', (socket) => {

  socket.on('message', async (data) => {
    try{
    const user = await userModel.findById(data.i)
    const isdialog = await user?.dialogs.get(data.to)
    let dialog=[];
    dialog = await dialogModel.findById(isdialog)
    dialog.messages.push({ username: data.username, message: data.message })
    dialog.save()
    socket.join(dialog.room_uuid)
    io.to(dialog.room_uuid).emit('message', JSON.stringify(data));
  }catch(e){
    console.log('error')
  }
  })
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

