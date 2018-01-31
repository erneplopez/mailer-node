const Sender = require('aws-sms-send');
const AWSPrivate = require("../../private/awsPrivate");
var sms={
    config :{
        AWS: {
          accessKeyId: AWSPrivate.accessKey(),
          secretAccessKey: AWSPrivate.secretAccess(),
          region: AWSPrivate.region(),
        },
      },
    send:function(smsOptions){
        var sender = new Sender(sms.config);
        sender.sendSms(smsOptions.text, smsOptions.topic, false,"+1"+String(smsOptions.number))
        .then(function(response) {
          console.log(response);
        })
        .catch(function(err) {
           console.log(err)
        });
    }
}

   
  
module.exports = sms;