import app from './app';
import dotenv from 'dotenv';
import sequelize from './config/database';
import User from './src/models/User';
import { Gender } from './types';
import UserAuth from './src/DAO/auth/UserAuth';

let userAuth = new UserAuth();
dotenv.config();
sequelize
  .sync()
  .then((result) => {
    oprate();
    createUser().then((user) => console.log(user));
  })
  .catch((err) => {
    console.log(err);
  });

function oprate() {
  app.listen(process.env.PORT, () => {
    console.log('server running on port ' + process.env.PORT);
  });
}
async function createUser() {
  const user = await userAuth.signup('normal', {
    name: 'ahmed',
    email: 'ahmed@gmail.com',
    password: 'ahmed1234',
    gender: Gender.male,
    photo: 'url/photo/agmedsorah',
  });
  console.log(user);
  return 'done';
}
