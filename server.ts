import app from "./app";
import dotenv from "dotenv";
import sequelize from "./config/database";
import User from "./src/models/User";
dotenv.config();
sequelize
  .sync()
  .then((result) => {
    oprate();
    // createUser().then((user) => console.log(user));
  })
  .catch((err) => {
    console.log(err);
  });

function oprate() {
  app.listen(process.env.PORT, () => {
    console.log("server running on port " + process.env.PORT);
  });
}
enum Gender {
  male = "male",
  female = "female",
}
async function createUser() {
  const user = await User.create({
    name: "samin",
    email: "bomb@hmada.eiada",
    password: "docktoerr",
    gender: Gender.male,
  });
  return user;
}
