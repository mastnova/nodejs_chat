
window.onload = function () {
	var connection = io.connect('http://localhost:8080'),
			nameInput = document.getElementById('name'),
			fieldInput = document.getElementById('field'),
			enterForm = document.getElementById('form-enter'),
			sendForm = document.getElementById('form-send'),
			content = document.getElementById("content"),
			usersList = document.getElementById('users'),
			messages = [],
			userName,
			users;


	document.getElementById('btn-send').addEventListener('click', onClickSend);
	document.getElementById('btn-enter').addEventListener('click', onClickEnter);


	connection.on('message', function (data) {
		console.log(data);
		messages.push(data);
		content.innerHTML = messages.join('<br>');
		content.scrollTop = content.scrollHeight;
	});

	connection.on('users', function (data) {
		users = data.map(function (name) {
			return '<span>' + name + '</span>';
		});
		usersList.innerHTML = users.join('<br>');
	});

	connection.on('nickname', function (nickname) {
		if (nickname) {
			userName = nickname;
			nameInput.value = '';
			enterForm.style.display = 'none';
			sendForm.style.display = 'block';
		} else {
			alert('Никнейм уже занят! Выберите другой');
		}
	});



function onClickSend() {
	var value = fieldInput.value;
	if (value) {
		connection.emit('send', value);
		fieldInput.value = '';
	}
}

function onClickEnter() {
	var value = nameInput.value;
	if (value) {
		connection.emit('nickname', value);
	}
}

};
