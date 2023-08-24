const socket = io();

const username = prompt("Enter your username:");
socket.emit('join', username);

const userList = document.getElementById('user-list');
const messageList = document.getElementById('message-list');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

const wordToEmoji = new Map([
  ['react', '⚛️'],
  ['woah', '😯'],
  ['hey', '👋🏼'],
  ['lol', '😂'],
  ['like', '❤️'],
  ['congratulation', '🥳'],
]);

socket.on('userJoined', user => {
  messageList.innerHTML += `<p class="system-message">${user} joined the chat</p>`;
});

socket.on('userLeft', user => {
  messageList.innerHTML += `<p class="system-message">${user} left the chat</p>`;
});

socket.on('updateUserList', users => {
  userList.innerHTML = users.map(user => `<li>${user}</li>`).join('');
});

socket.on('message', data => {
  let messageContent = data.message;
  wordToEmoji.forEach((emoji, word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    messageContent = messageContent.replace(regex, emoji);
  });

  messageList.innerHTML += `<p><strong>${data.user}:</strong> ${messageContent}</p>`;
  messageList.scrollTop = messageList.scrollHeight;
});

sendButton.addEventListener('click', () => {
  const message = messageInput.value;
  if (message.trim() !== '') {
    socket.emit('message', message);
    messageInput.value = '';
  }
});
