import dotenv from 'dotenv';
import sequelize from './config/database';
import { server } from './socket';

dotenv.config();
startServer();

async function startServer() {
  try {
    await sequelize.sync();
    console.log('Database connected successfully');
    server.listen(process.env.PORT, () => {
      console.log('Server running on port ' + process.env.PORT);
    });
  } catch (err) {
    console.error('Error starting server:', err);
  }
}
// export socket
