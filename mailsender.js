var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
var express = require('express');
var config = require('./config');

// create reusable transporter object using the default SMTP transport

var mailAddress = config.get('mailAddress')
var mailAddressEncoded = mailAddress.replace("@", "%40");
var mailPassword = config.get('mailPassword');
var smtpServer = config.get('smtpServer');
var mailSenderName = config.get('mailSenderName');

var transporter = nodemailer.createTransport('smtps://' + mailAddressEncoded + ':' + mailPassword + '@' + smtpServer);

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/sendMail', function (req, res) {

	var mailTo = req.body.to;
	var mailSubject = req.body.subject;
	var mailContent = req.body.content;


	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: '"' + mailSenderName + '" <' + mailAddress + '>', // sender address
	    to: mailTo, // list of receivers
	    subject: mailSubject, // Subject line
	    text: mailContent, // plaintext body
	    html: null // html body
	};


	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return console.log(error);
	    }
	    console.log('Message sent: ' + info.response);
	});

	res.end(JSON.stringify(mailOptions));
})

var server = app.listen(12000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("MailSender app listening at http://%s:%s", host, port)

})

