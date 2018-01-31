
var helpers=require("./helpers");
var mongoose=require("mongoose");
var mongooseConnect = require("../../private/mongooseConnect");
var connectionUri=mongooseConnect.uri();

mongoose.connect(connectionUri);


helpers.messageAssistantOutdatedDocuments().then(function(){
    helpers.messageAnalystOutdatedDocuments().then(function(){
        helpers.messageSuperuserOutdatedDocuments().then(function(){
            mongoose.disconnect();
        });
    });
});









