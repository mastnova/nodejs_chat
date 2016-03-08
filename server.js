'use strict';

const express = require('express');
const socket = require('socket.io');

const server = express();
const serverSocket = socket.listen(server.listen(8080));
let msgLimit = 20,
messages =[],
users = [];

server.set('views', __dirname + '/tpl');
server.set('view engine', 'jade');
server.engine('jade', require('jade').__express);
server.use(express.static('public'));

server.get('/', function (req, res) {
	res.render('page');
})

serverSocket.sockets.on('connection', function (client) {
	client.emit('message', messages.join('<br>'));
	client.emit('users', users);

	client.on('send', function (data) {
		data = linkWrapper( removeTags(data) );
		client.get('nickname', function (err, nickname) {
			let message = '<span>' + nickname + ':</span> ' + data;
			if (messages.length == msgLimit) {
				messages.shift();
			}
			messages.push(message)
			serverSocket.sockets.emit('message', message);
		})
	});

	client.on('nickname', function (nickname) {
		nickname = removeTags(nickname);
		if (users.indexOf(nickname) > -1 || nickname === '') {
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
			if (index > -1) {
				users.splice(index, 1);
			}
		});
		serverSocket.sockets.emit('users', users);
	});
})

function removeTags(str) {
	const regexp = /<[^>]+>/g;
	return str.replace(regexp, '');
}

function linkWrapper(str) {
	const regexp = /(http:\/\/|https:\/\/)/i;
	let stringBlocks = [],
	resultArray = [],
	start,
	end;

	do {
		start = str.search(regexp);
		if (start > -1) {
			end = str.indexOf(' ', start);
			if (end > -1) {
				stringBlocks.push( str.substr(0, end) );
				str = str.substr(end);
			} else {
				stringBlocks.push( str.substr(0) );
				str = '';
			}
		}
	} while (start > -1)

	stringBlocks.push(str);

	resultArray = stringBlocks.map(function (str) {
		let link,
		start,
		end,
		partBefore,
		partAfter,
		wrappedLink;

		start = str.search(regexp);
		if (start > -1) {
			end = str.indexOf(' ', start);
			if (end > -1) {
				link = str.substr(start, end);
				partAfter = str.substr(end);
			} else {
				link = str.substr(start);
				partAfter = '';
			}
			wrappedLink = '<a href="' + link + '" target="_blank">' + link + '</a>';
			partBefore = str.substr(0, start);
			return partBefore + wrappedLink + partAfter;
		} else {
			return str;
		}
	});
	return resultArray.join('');
}


