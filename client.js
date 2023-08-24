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
    if (message.startsWith('/')) {
      const command = message.slice(1).toLowerCase();
      handleCommand(command);
    } else {
      socket.emit('message', message);
    }
    messageInput.value = '';
  }
});

function handleCommand(command) {
    if (command.startsWith('calc ')) {
      const expression = command.slice(5); // Remove the "calc " part
      try {
        const result = eval(expression);
        showMessage(`Result: ${expression} = ${result}`);
      } catch (error) {
        showMessage(`Error in calculation: ${error.message}`);
      }
    } else {
      switch (command) {
        case 'help':
          showMessage('You can use commands: /help /calc /clear /random');
          break;
        case 'clear':
          messageList.innerHTML = '';
          break;
        case 'random':
          const randomNumber = Math.floor(Math.random() * 100) + 1;
          showMessage(`Random number: ${randomNumber}`);
          break;
        default:
          showMessage(`Command not recognized: ${command}`);
      }
    }
  }

function showMessage(message) {
  const li = document.createElement('li');
  li.textContent = message;
  messageList.appendChild(li);
  messageList.scrollTop = messageList.scrollHeight;
}
