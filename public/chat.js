console.log('up to date');
window.onload = function(){
	var connection = io.connect('http://localhost:8080');
	var messages = [];

	connection.on('message', function(data) {
		console.log(data);
		messages.push(data);
		document.getElementById('content').innerHTML = messages.join('<br>');
	});

	document.getElementById('send').addEventListener('click', function() {
		console.log('clicked');
		var value = document.getElementById('field').value;
		connection.emit('send', value);
		document.getElementById('field').value = '';
	})
};
