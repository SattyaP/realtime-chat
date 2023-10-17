document.addEventListener('DOMContentLoaded', function () {
    const socket = io();
    let username = null;
    let roomId = null;
    let ownId = null;

    document.getElementById('login').addEventListener('click', function () {
        username = document.getElementById('username-input').value;
        if (username) {
            socket.emit('user login', username);
        }
    });

    socket.on('warning', function () {
        alert("Character can't be more than 30");
    });

    socket.on('username-taken', function () {
        alert('Username is already taken. Please choose a different username.');
    });

    socket.on('login-success', function (socketId) {
        document.getElementById('username-form').style.display = 'none';
        document.getElementById('room-form').style.display = 'block';
        ownId = socketId;
    });

    document.getElementById('roomEnter').addEventListener('click', function () {
        roomId = document.getElementById('room-input').value;
        if (roomId) {
            document.getElementById('chat').style.display = 'block';
            document.getElementById('room-form').style.display = 'none';
            document.getElementById('messages').style.display = 'block';
            document.querySelector('.header-chat').style.display = 'block';
            document.getElementById('warpchat').classList.toggle('col-lg-6', false);
            document.getElementById('warpchat').classList.toggle('col-lg-12', true);
            socket.emit('join room', roomId);
        }
    });

    document.getElementById('ownroom').addEventListener('click', function () {
        roomId = ownId
        if (roomId) {
            document.getElementById('chat').style.display = 'block';
            document.getElementById('room-form').style.display = 'none';
            document.getElementById('messages').style.display = 'block';
            document.querySelector('.header-chat').style.display = 'block';
            document.getElementById('warpchat').classList.toggle('col-lg-6', false);
            document.getElementById('warpchat').classList.toggle('col-lg-12', true);
            socket.emit('join room', roomId);
        }
    });

    document.getElementById('chat-form').addEventListener('submit', function (e) {
        e.preventDefault();
        let message = document.getElementById('message-input').value;
        if (message) {
            socket.emit('chat message', {
                message: message,
                roomId: roomId
            });
            document.getElementById('message-input').value = '';
        }
    });

    socket.on('room-message', function (data) {
        const messages = document.getElementById('messages');
        const msgBox = document.createElement('div');
        msgBox.setAttribute('id', 'msg-box');
        msgBox.classList.add('mb-3');
        const usernameSpan = document.createElement('span');
        usernameSpan.classList.add('text-decoration-underline');
        usernameSpan.setAttribute('id', 'username');
        usernameSpan.textContent = data.usernames;
        const br = document.createElement('br');
        const messageSpan = document.createElement('span');
        messageSpan.textContent = data.message;
        msgBox.appendChild(usernameSpan);
        msgBox.appendChild(br);
        msgBox.appendChild(messageSpan);
        messages.appendChild(msgBox);
        messages.scrollTop = messages.scrollHeight;
    });

    socket.on('code-room', function (data) {
        document.getElementById('roomId').textContent = 'Chat Room ID: ' + data.code;
    });

    document.getElementById("roomId").addEventListener("click", () => {
        let data = document.getElementById("roomId");
        const textToCopy = data.textContent.split('Chat Room ID: '); 
        navigator.clipboard.writeText(textToCopy[1]).then(function () {
            alert("Copied success: " + textToCopy[1]);
        }).catch(function (err) {
            alert("Failed to copy: ", err);
        });
    });

    socket.on('user-disconnect', function (username) {
        const messages = document.getElementById('messages');
        const li = document.createElement('li');
        li.textContent = username + ' has left the chat.';
        messages.appendChild(li);
    });
});