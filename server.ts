import dotenv from 'dotenv';
import sequelize from './config/database';
import WebSocketServer from './socket';
import http from 'http';
import app from './app';
dotenv.config();
startServer();

async function startServer() {
  try {
    await sequelize.sync();
    const server = http.createServer(app);
    WebSocketServer.getInstance(server);
    console.log('Database connected successfully');
    server.listen(process.env.PORT, () => {
      console.log('Server running on port ' + process.env.PORT);
    });
  } catch (err) {
    console.error('Error starting server:', err);
  }
}
// export socket
