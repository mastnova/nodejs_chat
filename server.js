'use strict';

const express = require('express');
const socket = require('socket.io');

const server = express();
const serverSocket = socket.listen(server.listen(8080));

server.set('views', __dirname + '/tpl');
server.set('view engine', 'jade');
server.engine('jade', require('jade').__express);
server.use(express.static('public'));

server.get('/', function(req, res) {
	res.render('page');
})

serverSocket.sockets.on('connection', function(client) {
	console.log('client connected');
	client.emit('message', 'Welcome to chat!');
	client.on('send', function(data) {
		console.log('send='+data);
		serverSocket.sockets.emit('message', data);
	})
})
