var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// Built-in ES6 Promise library.
mongoose.Promise = Promise

// Mongoose Connection (Localhost Setup)
var dbUrl = "mongodb+srv://jmavris:y8tDVT3i@app-hw2jh.mongodb.net/test?retryWrites=true"

// Message Model 
var Message = mongoose.model('Message', {
    name:String,
    message:String
})

// Send Message
app.get('/messages', (req, res) => {
    Message.find ( {}, (err, messages) => {
        res.send(messages)
    })
})

//Post Message
app.post('/messages', (req, res) => {
    var message = new Message(req.body)

    message.save((err) => {
        if (err)
            sendStatus(500)

        io.emit('message', req.body)
        res.sendStatus(200)
    })
})

// Callback for the socket connection event
io.on('connection', (socket) => {
    console.log('a user connected')
})

//Mongoose Connection
mongoose.connect(dbUrl, {useMongoClient: true},  (err) => {
    console.log('mongo db connection', err)
})

//Server Localhost
var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})