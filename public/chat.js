
window.onload = function () {
	var connection = io.connect('http://localhost:8080'),
			messages = [],
			userName,
			users;

	document.getElementById('btn-send').addEventListener('click', onClickSend);
	document.getElementById('btn-enter').addEventListener('click', onClickEnter);

	connection.on('message', function (data) {
		console.log(data);
		messages.push(data);
		document.getElementById('content').innerHTML = messages.join('<br>');
	});

	connection.on('users', function (data) {
		users = data.map(function (name) {
			return '<span>' + name + '</span>';
		});
		document.getElementById('users').innerHTML = users.join('<br>');
	});

	connection.on('nickname', function (nickname) {
		if (nickname) {
			userName = nickname;
			document.getElementById('name').value = '';
			document.getElementById('enter-wrapper').style.display = 'none';
			document.getElementById('send-wrapper').style.display = 'block';
		} else {
			alert('Никнейм уже занят! Выберите другой');
		}
	});

	connection.on('disc')


function onClickSend() {
	var value = document.getElementById('field').value;
	connection.emit('send', value);
	document.getElementById('field').value = '';
}

function onClickEnter() {
	var value = document.getElementById('name').value;
	if (!value) {
		return false;
	}
	connection.emit('nickname', value);
}

};
