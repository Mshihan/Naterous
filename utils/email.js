const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Mohamed Sihan <shihan167@gmail.com>`;
  }

  newTransport() {
    if (process.env.NODE_ENV !== "production") {
      // Send grid
      return 1;
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIl_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // Render HTML file based on a pub template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );

    // Define mail options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };

    // Send mail from transporter
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to the natours family");
  }
};

const sendEmail = async (options) => {
  // 1) Create a transporter
  // Most common transporter services are SENDGRID and MAILGUN
  // mailtrap.io service to trap the developer mails.
  // const transporter =

  // 2) Define the email options
  const mailOptions = {
    from: "Mohamed Shihan <167sihan@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html
  };

  // 3) Actually send the email
};
