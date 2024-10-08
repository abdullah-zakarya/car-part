// export default class EmailSend {
//   constructor(email: { from: string; to: string; text: string }) {
//     const { from, to, text } = email;
//     this. msg = `from : ${from}
//         to : ${to}
//         ${text}
//         ${Date.now()}`;
//   }
//   public send(){

//   }
// }
export default class EmailSend {
  public send() {
    console.log('Sending email...');
  }
}
