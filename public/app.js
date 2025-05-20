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
    button.onclick = () => vote(poet);
    const count = document.createElement('span');
    count.className = 'count';
    count.id = `count-${poet}`;
    div.appendChild(button);
    div.appendChild(count);
    container.appendChild(div);
  });
}

async function vote(poet) {
  await fetch('/vote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ poet })
  });
}

function listenForUpdates() {
  const events = new EventSource('/events');
  events.onmessage = e => {
    const data = JSON.parse(e.data);
    Object.entries(data).forEach(([poet, count]) => {
      const el = document.getElementById(`count-${poet}`);
      if (el) {
        el.textContent = count;
      }
    });
  };
}

loadPoets();
listenForUpdates();
