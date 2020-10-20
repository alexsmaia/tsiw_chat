const formChat = document.getElementById('form_chat');
const messagesBox = document.getElementById('messages_box');
const roomName = document.getElementById('room');
const usersList = document.getElementById('users');

// Get Username an Room from URL Query
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

// Join User to Room
socket.emit('joinRoom', { username, room });

// Set Users and Room
socket.on('roomUsers', ({ room, users }) => {
    outputRoom(room);
    outputUsers(users);
});

// Set Msgs
socket.on('message', message => {

    // Send Msg
    outputMessage(message);
    // Set Scrool to last Msg
    messagesBox.scrollTop = messagesBox.scrollHeight;

});

/**
 * 
 * @param {*} message 
 */
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">${message.text}</p>`;
    messagesBox.appendChild(div);
}

function outputRoom(room) {
    roomName.innerText = room
}

function outputUsers(users) {
    usersList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}


formChat.addEventListener('submit', (e) => {
    e.preventDefault(); // prevents page reloading

    const chatMsg = e.target.elements.msg.value;

    // 
    socket.emit('chatMessage', chatMsg);

    // Clear message input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

    
});
