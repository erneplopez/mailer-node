const nodemailer = require("nodemailer");




var mailer={
	send: function(mailOptions,auth){
		let transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 587,
			secure: false, 
			auth:auth
		});
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
			console.log("Message sent: %s", info.messageId);
            
		});
	}
};


module.exports = mailer;

	

