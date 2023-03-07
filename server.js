const { SocketMsg, ClientMsg } = require('./types');
const pg = require('pg');
const webSocket = require('ws');
let config = {
  connString: process.env.PGCONNSTRING,
  client: null,
};

config.client = new pg.Client({
  connectionString: config.connString,
});
config.client.connect();

const runQuery = async (query) => {
  if (config.client) {
    try {
      const res = await config.client.query(query);
      return { data: res };
    } catch (e) {
      return { error: e };
    }
  }
};

const wss = new webSocket.Server({ port: 8080 });

// creating connection using websocket
wss.on('connection', (ws) => {
  console.log('new client connected');

  const send = (data) => ws.send(JSON.stringify(data));
  //on message from client
  ws.on('message', async (data) => {
    console.log('Client sent: ' + data);
    data = JSON.parse(data);
    switch (data.type) {
      case SocketMsg.RUN_QUERY:
        const { data: result, error } = await runQuery(data.data);
        send({
          type: error ? ClientMsg.QUERY_ERROR : ClientMsg.QUERY_RESULT,
          data: error
            ? error.toString()
            : {
                rows: result.rows,
                columns: result.columns,
                count: result.rowCount,
              },
        });
        break;
      //case MsgType.UPDATE_CONN_STRING:
      //updateConnString(data.data);
      //break;
      default:
        break;
    }
  });

  // handling what to do when clients disconnects from server
  ws.on('close', () => {
    if (config.client) {
      // config.client.end();
    }
  });
  // handling client connection error
  ws.onerror = function () {
    console.log('Some Error occurred');
  };
});
console.log('The WebSocket server is running on port 8080');

// (async function () {
//   console.log(
//     await config.client.query('select * from hackernews_best limit 10')
//   );
// })();
