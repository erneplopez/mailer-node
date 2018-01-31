var helpers=require("./helpers");
var mongoose=require("mongoose");
var mongooseConnect = require("../../private/mongooseConnect");
const Client=require("../models/client");
const Analyst=require("../models/analyst");
const Superuser=require("../models/superuser");
const Action=require("../models/action");
const moment=require("moment");
var connectionUri=mongooseConnect.uri();
mongoose.connect(connectionUri);

Client.find({},(err,clients)=>{
    clients.forEach(client=>{
        Action.find({'recipient.id':client._id},(err,actions)=>{
            let latestReassesmentApproval=helpers.findLatestReassesmentApproval(client);
            if(latestReassesmentApproval!=false){
                let sendMessage=true;
                let latestAction=helpers.findLatestReassesmentReportAction(actions);
               if(latestAction!=false){
                 if(moment(latestAction.date,"MM/DD/YYYY").isSameOrAfter(moment(latestReassesmentApproval.startDate,"MM/DD/YYYY"))){
                    if(latestAction.completedDate!=null){
                       
                        sendMessage=false;
                    }
                 }
               }
               if(sendMessage==true){
                   Analyst.findOne({clients:client._id},(err,analyst)=>{
                       Superuser.findOne({clients:client._id},(err,superuser)=>{
                           if(analyst!=null){
                                helpers.sendEmail(client.firstName+" "+client.lastName,analyst,superuser)
                               
                           }
                       })
                   })
               }
            }
            
         })
    })
    
})