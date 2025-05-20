let socket;

async function loadPoets() {
  const res = await fetch('/poets');
  const poets = await res.json();
  const container = document.getElementById('poets');
  container.innerHTML = '';
  poets.forEach(poet => {
    const div = document.createElement('div');
    div.className = 'poet';
    const button = document.createElement('button');
    button.textContent = `Vote for ${poet}`;
    button.onclick = () => socket.emit('vote', poet);
    const count = document.createElement('span');
    count.className = 'count';
    count.id = `count-${poet}`;
    div.appendChild(button);
    div.appendChild(count);
    container.appendChild(div);
  });
}

function connect() {
  socket = io();
  socket.on('votes', data => {
    Object.entries(data).forEach(([poet, count]) => {
      const el = document.getElementById(`count-${poet}`);
      if (el) {
        el.textContent = count;
      }
    });
  });
}

loadPoets().then(connect);
