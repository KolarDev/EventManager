const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

// This is a class that handles all sorts of email notifications in the app
module.exports = class Email {
  constructor(user, extraData = {}) {
    this.to = user.email;
    this.user = user;
    this.from = `Eventii <${process.env.EMAIL_FROM}>`;
    this.extraData = extraData;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: process.env.BREVO_HOST,
      port: process.env.BREVO_PORT,
      auth: {
        user: process.env.BREVO_USERNAME,
        pass: process.env.BREVO_PASSWORD,
      },
    });
  }

  // This send method should receive dynamic options to extend the object
  async send(template, subject) {
    const html = await pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        user: this.user,
        subject,
        ...this.extraData, // pass all extra data to the template
      }
    );

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
      attachments: [],
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("Welcome", "Welcome to Eventii Event Manager App");
  }

  async sendFavouriteEventUpdate() {
    await this.send("favouriteEventUpdate", "Update on favorite event");
  }
};
