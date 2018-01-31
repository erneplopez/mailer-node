const mailer = require("./index");


let mailOptions = {
	from: "loyaltycare2015@gmail.com", // sender address
	to: "erneplopez@gmail.com", // list of receivers
	subject: "Hello ✔", // Subject line
	html: "<h1>Hello world?</h1>" // html body
};

mailer.send(mailOptions,{user:"loyaltycare2015@gmail.com",pass:"Loyalty@2015"});
