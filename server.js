'use strict';

const express = require('express');
const socket = require('socket.io');

const server = express();
const serverSocket = socket.listen(server.listen(8080));

server.set('views', __dirname + '/tpl');
server.set('view engine', 'jade');
server.engine('jade', require('jade').__express);
server.use(express.static('public'));

let users = [];

server.get('/', function (req, res) {
	res.render('page');
})

serverSocket.sockets.on('connection', function (client) {
	client.emit('message', 'Welcome to chat!');

	client.on('send', function (data) {
		serverSocket.sockets.emit('message', data);
	});

	client.on('nickname', function (nickname) {
		if (users.indexOf(nickname) > -1) {
			client.emit('nickname', 0);
		} else {
			users.push(nickname);
			client.set('nickname', nickname);
			serverSocket.sockets.emit('users', users);
			client.emit('nickname', nickname);
		}
	});

	client.on('disconnect', function () {
		client.get('nickname', function (err, nickname) {
			let index = users.indexOf(nickname);
			users.splice(index, 1);
		});
		serverSocket.sockets.emit('users', users);
	});
})



