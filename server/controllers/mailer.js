import nodemailer from "nodemailer";
import Mailgen from "mailgen";

// let nodeConfig = {
//   host: "smtp.ethereal.email",
//   port: 587,
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: process.env.EMAIL, // generated ethereal user
//     pass: process.env.PASSWORD, // generated ethereal password
//   },
// };

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "alejandra.walter50@ethereal.email",
    pass: "t3mdcENwPj15Z4Q3UH",
  },
});

let mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js",
  },
});

export const registerMail = async (req, res) => {
  const { username, userEmail, text, subject } = req.body;

  // body of the email
  let email = {
    body: {
      name: username,
      intro: text || "Hello there, We are very excited to have you on board!",
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  var emailBody = mailGenerator.generate(email);
  let message = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: subject || "Signup Successful!",
    html: emailBody,
  };

  //send mail
  transporter
    .sendMail(message)
    .then(() => {
      return res.status(200).send({ message: "Mail Sent" });
    })
    .catch((error) => res.status(500).send({ error }));
};
