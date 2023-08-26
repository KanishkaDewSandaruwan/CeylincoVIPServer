const nodemailer = require('nodemailer');

const sendEmail = (to, subject, message) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'ceylincodk97@gmail.com', // Replace with your Gmail email
            pass: 'fltwiuttvqaykgok' // Replace with your Gmail password or app-specific password
        }
    });

    const mailOptions = {
        from: 'ceylincodk97@gmail.com', // Sender's email address
        to: to, // Receiver's email address
        subject: subject,
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

const sendEmailWithAttachment = (to, subject, message, uploadedFile) => {
  const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
          user: 'ceylincodk97@gmail.com', // Replace with your Gmail email
          pass: 'fltwiuttvqaykgok' // Replace with your Gmail password or app-specific password
      }
  });

  const mailOptions = {
      from: 'ceylincodk97@gmail.com', // Sender's email address
      to: to, // Receiver's email address
      subject: subject,
      text: message,
      attachments: [
          {
              filename: uploadedFile.filename,  // Use filename instead of originalname
              path: uploadedFile.path
          }
      ]
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error('Error sending email:', error);
      } else {
          console.log('Email sent:', info.response);
      }
  });
};

module.exports = { sendEmail, sendEmailWithAttachment };
