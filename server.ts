import app from './app';
import dotenv from 'dotenv';
import sequelize from './config/database';
import http from 'http';
import SocketServer from './socket/socket';
// import Server from './src/models/Serves';

dotenv.config();

sequelize
  .sync()
  .then((result) => {
    oprate();
  })
  .catch((err) => {
    console.log(err);
  });

async function oprate() {
  const server = http.createServer(app);
  const socket = SocketServer.run(server);
  server.listen(process.env.PORT, () => {
    console.log('server running on port ' + process.env.PORT);
  });
}
