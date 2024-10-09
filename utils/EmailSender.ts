export default class EmailSend {
  constructor(email: { from: string; to: string; text: string }) {
    const { from, to, text } = email;
    const msg = `from : ${from}
          to : ${to}
          ${text}
          ${Date.now()}`;
    console.log(msg);
  }

  public send() {
    console.log('Sending email...');
  }
}
