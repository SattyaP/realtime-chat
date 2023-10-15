$(() => {
    const socket = io();
    let username = null;
    let roomId = null;

    $('#login').click(function () {
        username = $('#username-input').val();
        if (username) {
            socket.emit('user login', username);
        }
    });

    socket.on('warning', () => {
        alert("Character cant more than 30")
    })

    socket.on('username-taken', () => {
        alert('Username is already taken. Please choose a different username.');
    });

    socket.on('login-success', () => {
        $('#username-form').hide();
        $('#room-form').show();
    });

    $('#roomEnter').click(() => {
        roomId = $('#room-input').val();
        if (roomId) {
            $('#chat').show();
            $('#room-form').hide()
            socket.emit('join room', roomId);
        }
    });

    $('#chat-form').submit(function () {
        let message = $('#message-input').val();
        if (message) {
            socket.emit('chat message', {
                message,
                roomId
            });
            $('#message-input').val('');
        }
        return false;
    });

    socket.on('room-message', (data) => {
        $('#messages').append($(`<div id="msg-box" class="mb-3">
        <span class="text-decoration-underline" id="username">${data.usernames.slice(0, 10)}</span> <br>
        <span>${data.message}</span>
      </div>`));
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
    });

    socket.on('code-room', (data) => {  
        $('#roomId').text('Chat room ID : ' + data.code)
    })
    
    socket.on('user-disconnect', (username) => {
        $('#messages').append($('<li>').text(`${username} has left the chat.`));
    });

});