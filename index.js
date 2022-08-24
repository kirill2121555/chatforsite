const mongoose = require('mongoose')
const userModel = require('./model/userModel')
const dialogModel = require('./model/dialogModel')
const express = require('express')
const app = express()
const server = require("http").Server(app);
const PORT = process.env.PORT || 9999
const io = require("socket.io")(server, {
  cors: {
    origin: "https://fronthelp.vercel.app",
    methods: ["GET", "POST"]
  }
})

const cors = require('cors')
app.use(cors({ credentials: true, origin: 'https://fronthelp.vercel.app' }));

app.get('/o', function(req, res) {
 res.json('ok')
});
io.on('connection', (socket) => {

  socket.on('message', async (data) => {
    const user = await userModel.findById(data.i)
    const isdialog = await user?.dialogs.get(data.to)
    let dialog=[];
    dialog = await dialogModel.findById(isdialog)
    dialog.messages.push({ username: data.username, message: data.message })
    dialog.save()
    socket.join(dialog.room_uuid)
    io.to(dialog.room_uuid).emit('message', JSON.stringify(data));
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

