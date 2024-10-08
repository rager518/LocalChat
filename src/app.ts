const host = import.meta.env.VITE_WS_SERVER;
const port = import.meta.env.VITE_WS_PORT;

const chatbox = document.getElementById('chatbox') as HTMLDivElement;
const messageInput = document.getElementById('message') as HTMLInputElement;
const sendBtn = document.getElementById('sendBtn') as HTMLButtonElement;
const fileBtn = document.getElementById('fileInput') as HTMLInputElement;


const ws = new WebSocket(`ws://${host}:${port}`);

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const time = `${hours}:${minutes}`;

  let userTemplate = `<div class="chat-item">
<div class="row align-items-end">
    <div class="col-auto"><span class="avatar" style="background-image: url(./img/user.jpg)"></span>
    </div>
    <div class="col col-lg-6">
        <div class="chat-bubble">
            <div class="chat-bubble-title">
                <div class="row">
                    <div class="col chat-bubble-author">${data.ip}</div>
                    <div class="col-auto chat-bubble-date">${time}</div>
                </div>
            </div>
            <div class="chat-bubble-body">
            <p>${data.message}</p>
            </div>
        </div>
    </div>
</div>
</div>`;

  let adminTemplate = `<div class="chat-item"><div class="row align-items-end justify-content-end">
    <div class="col col-lg-6">
        <div class="chat-bubble chat-bubble-me">
            <div class="chat-bubble-title">
                <div class="row">
                    <div class="col chat-bubble-author">Server</div>
                    <div class="col-auto chat-bubble-date">${time}</div>
                </div>
            </div>
            <div class="chat-bubble-body">
                <p>${data.message}</p>
            </div>
        </div>
    </div>
    <div class="col-auto"><span class="avatar" style="background-image: url(./img/agent.jpg)"></span>
    </div>
</div></div>`;

  const message = document.createElement('div');
  if (data.ip == host) {
    message.innerHTML = adminTemplate;
  } else {
    message.innerHTML = userTemplate;
  }

  chatbox.appendChild(message);
};

function sendMessage() {
  const message = messageInput.value;
  if (message.trim()) {
    const msg = JSON.stringify({ type: 'text', content: message.trim() });
    ws.send(msg);
    messageInput.value = '';
  }
}

messageInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
})

sendBtn.onclick = () => {
  sendMessage();
};

fileBtn.onchange = (event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        const arrayBuffer = reader.result as ArrayBuffer;
        const fileName = file.name;
        const encoder = new TextEncoder();
        const fileNameBytes = encoder.encode(fileName);
        const fileNameLength = new Uint16Array([fileNameBytes.length]);

        const combinedBuffer = new Uint8Array(2 + fileNameBytes.length + arrayBuffer.byteLength);

        combinedBuffer.set(new Uint8Array(fileNameLength.buffer), 0);
        combinedBuffer.set(fileNameBytes, 2);
        combinedBuffer.set(new Uint8Array(arrayBuffer), 2 + fileNameBytes.length);

        ws.send(combinedBuffer.buffer);
      }
    };
    reader.readAsArrayBuffer(file);
  }
}

export { }