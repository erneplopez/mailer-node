
var mongoose=require("mongoose");
var mongooseConnect = require("../../private/mongooseConnect");
const Client=require("../models/client");
const Analyst=require("../models/analyst");
const Action=require("../models/action");
const moment=require("moment");
const mailer=require("../mailer");
const sms=require("../sms");
var connectionUri=mongooseConnect.uri();
mongoose.connect(connectionUri);


helpers={};



helpers.findLatestReassesmentReportAction=function(actions){
    reassesmentActions=[];
    
    if(actions!=null){
        actions.forEach(action=>{
            
            if(action.action=="Re-assesment Report" ){
                reassesmentActions.push(action);
            }
        })
        if(reassesmentActions.length>0){
            reassesmentActions.sort(function(a,b){
                if(moment(a.date).isSameOrBefore(moment(b.date))) return 1;
                if(moment(a.date).isSameOrAfter(moment(b.date))) return -1;
                return 0;
            });
            
            return reassesmentActions[0];
            
        }
        else{
            return false;
        }
    }
    else{
        return false;
    }
    
}

helpers.findLatestReassesmentApproval=function(client){
    reassesmentApprovals=[];
    client.approvals.forEach(approval=>{
        if(approval.procedure=="H0032 BA" && moment(Date.now()).isSameOrAfter(moment(approval.startDate)) && moment(Date.now()).isSameOrBefore(moment(approval.endDate))){
            reassesmentApprovals.push(approval);
        }
    })
    if(reassesmentApprovals.length>0){
        reassesmentApprovals.sort(function(a,b){
            if(moment(a.startDate).isSameOrBefore(moment(b.startDate))) return 1;
            if(moment(a.startDate).isSameOrAfter(moment(b.startDate))) return -1;
            return 0;
        });
        return reassesmentApprovals[0];
    }
    else{
        return false;
    }
}

helpers.sendEmail=function(clientName,analyst,superuser){
    let mailOptions = {
        from: superuser.email, // sender address
        to: analyst.email, // list of receivers
        subject: "CLIENT READY FOR REASSESMENT!!!", // Subject line
        html:   "<h4>Hi "+analyst.firstName +"</h4>"+
                "<p>You are receiving this message from "+superuser.company+
                " because "+clientName+" is ready for reassesment</p>"
               
    };
    mailer.send(mailOptions,{user:superuser.email,pass:superuser.emailPass});
}




module.exports=helpers;