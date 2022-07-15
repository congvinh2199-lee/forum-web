const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const CLIENT_ID =
  "591942089962-f0pm3v0qhda0dj19741eqngdmotqckqo.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REFRESH_TOKEN =
  "1//04F2exrfHSE9HCgYIARAAGAQSNwF-L9IrbhekggAKxCurl3ag-AjRtZYMC2sprt_mRh5Lu8F71A59hpJab_1j-_aXd3WYHJd16j0";

const oauth2Client = new OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN,
});

const getTransporter = async() => {
  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject();
      }
      resolve(token);
    });
  });

  return transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "lieuquynh3001@gmail.com",
      accessToken,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
    },
  })
}


module.exports = {
  SEND_MAIL: async (to, questionCreateDate, link) => {
    try {   
      const transporter = await getTransporter()
      const mailOptions = {
        from: '"FORUM WEB" <lieuquynh3001@gmail.com>',
        to: to,
        subject: "Gửi thông tin tài khoản",
        html: ` 
        <div>
            <p>Câu hỏi bạn đăng vào ngày ${questionCreateDate} đã nhận được 1 phản hồi</p>
            <p>Nhấn đường link sau để xem chi tiết: <a href=${link}>${link}</a></p>
        </div>`,
      }

      return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            resolve(false);
          } else {
            resolve(true);
            console.log("Email sent: " + info.response);
          }
        });
      });
    } catch (error) {}
  },
};
