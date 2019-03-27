function socketDelayedSend(socket, message) {
  if (socket.readyState == 1) {
    socket.send(message);
    return;
  }

  socket.addEventListener('open', (event) => {
    socket.send(message);
  });
}

export default ({ store }, inject) => {
  const socket = new WebSocket('ws://localhost:9001');
  inject('selectCategory', (id) => console.log("Selecting category from plugin", id));
  inject('selectPlayer', (id) => console.log("Selecting player from plugin", id));

  inject('selectTournament', (id) => {
    socketDelayedSend(socket, 'select-tournament ' + id);
  });

  // Connection opened
  socket.addEventListener('open', function (event) {
    store.commit('openConnection');
  });

  // Listen for messages
  socket.addEventListener('message', function (event) {
    const message = JSON.parse(event.data);
    store.commit('updateTournament', message);
  });

  socket.addEventListener('error', function (event) {
    store.commit('closeConnection');
  });

  socket.addEventListener('close', function (event) {
    store.commit('closeConnection');
  });

  // store.commit("increment");
  // console.log("Loading", store.state.closed);
}

// }

