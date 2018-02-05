const Assistant=require("../models/assistant");
const Analyst=require("../models/analyst");
const Superuser=require("../models/superuser");
const mailer=require("../mailer");
const sms=require("../sms");
const moment=require("moment");


helpers={};

helpers.messageAssistantOutdatedDocuments=function() {
	return new Promise(function (resolve, reject) {
		Assistant.find({},(err,assistants)=>{
            if(err){
                reject(err);
            }
            else{
                assistants.forEach(assistant=>{
                    var outdatedDocuments=[];
                    assistant.documents.forEach(document=>{
                        if(moment(document.expireDate,"MM/DD/YYYY").isBefore(moment(Date.now()).add(15, 'days'))){
                            outdatedDocuments.push(document);
                        }
                    })
                    if(outdatedDocuments.length>0){
                        Superuser.findOne({assistants:assistant._id},(error,superuser)=>{
                            mailer.send(helpers.generateEmployeeMailOptions(assistant.firstName+" "+assistant.lastName,assistant.email,
                            superuser.email,superuser.company,outdatedDocuments),{user:superuser.email,pass:superuser.emailPass});
                        
                            // sms.send(helpers.generateSMSOptions(assistant.firstName+" "+assistant.lastName,
                            //          assistant.phone,superuser.company,outdatedDocuments));
                        })  
                    }
                })
                resolve();
            } 
        })
	});
}

helpers.messageAnalystOutdatedDocuments=function() {
	return new Promise(function (resolve, reject) {
		Analyst.find({},(err,analysts)=>{
            if(err){
                reject(err);
            }
            else{
                analysts.forEach(analyst=>{
                    var outdatedDocuments=[];
                    analyst.documents.forEach(document=>{
                        if(moment(document.expireDate,"MM/DD/YYYY").isBefore(moment(Date.now()).add(15, 'days'))){
                            outdatedDocuments.push(document);
                        }
                    })
                    if(outdatedDocuments.length>0){
                        Superuser.findOne({analysts:analyst._id},(error,superuser)=>{
                            mailer.send(helpers.generateEmployeeMailOptions(analyst.firstName+" "+analyst.lastName,analyst.email,
                            superuser.email,superuser.company,outdatedDocuments),{user:superuser.email,pass:superuser.emailPass});
                           
                            //sms.send(helpers.generateSMSOptions(analyst.firstName+" "+analyst.lastName,
                                    // analyst.phone,superuser.company,outdatedDocuments));
                        })  
                    }
                })
                resolve();
            } 
        })
	});
}
helpers.messageSuperuserOutdatedDocuments=function(){
    return new Promise(function (resolve, reject) {
        Superuser.find({}).populate("assistants").populate("analysts").exec((err,superusers)=>{
            superusers.forEach(superuser=>{
                var messages=[];
                superuser.assistants.forEach(assistant=>{
                    let outdatedDocuments=[];
                    assistant.documents.forEach(document=>{
                        if(moment(document.expireDate,"MM/DD/YYYY").isBefore(moment(Date.now()).add(15, 'days'))){
                            outdatedDocuments.push(document);
                        }
                    })
                    if(outdatedDocuments.length>0){
                        messages.push({name:assistant.firstName+" "+assistant.lastName,phone:assistant.phone,email:assistant.email,outdatedDocuments:outdatedDocuments});
                    }
                })
                superuser.analysts.forEach(analyst=>{
                    let outdatedDocuments=[];
                    analyst.documents.forEach(document=>{
                        if(moment(document.expireDate,"MM/DD/YYYY").isBefore(moment(Date.now()).add(15, 'days'))){
                            outdatedDocuments.push(document);
                        }
                    })
                    if(outdatedDocuments.length>0){
                        messages.push({name:analyst.firstName+" "+analyst.lastName,phone:analyst.phone,email:analyst.email,outdatedDocuments:outdatedDocuments});
                    }
                })
                mailer.send(helpers.generateSuperuserMailOptions(superuser.email,messages),{user:superuser.email,pass:superuser.emailPass});
            })
            resolve();
        });
    });
}
helpers.generateEmployeeMailOptions=function(name,recipientEmail,senderEmail,company,outdatedDocuments){
    var outdatedDocumentsHTML="";
    outdatedDocuments.forEach((outdatedDocument)=>{
        outdatedDocumentsHTML+="<li><strong>"
        outdatedDocumentsHTML+=outdatedDocument.name;
        outdatedDocumentsHTML+=", "
        outdatedDocumentsHTML+=outdatedDocument.expireDate;
        if(moment(outdatedDocument.expireDate,"MM/DD/YYYY").isBefore(moment(Date.now()))){
            outdatedDocumentsHTML+=" <span style='color:red'>(expired)</span>"
        }
        outdatedDocumentsHTML+="</strong></li>"
    })
    let mailOptions = {
        from: senderEmail, // sender address
        to: recipientEmail, // list of receivers
        subject: "OUTDATED DOCUMENTS (DOCUMENTOS DESACTUALIZADOS)", // Subject line
        html:   "<h4>Hi "+name+"</h4>"+
                "<p>You are receiving this message from "+company+
                " because the following documents have expired or are about to expire:</p>"+
                "<ul>"+ outdatedDocumentsHTML+"</ul>"+
                "<p>Please come by the office and bring updated copies.</p>"+
                "<p>Remember that <strong>you will not be able to work</strong> for the days that you have outdated documents.</p>"+
                "<p>Have a nice day</p>"+
                "<h4>Hola "+name+"</h4>"+
                "<p>Usted esta recibiendo este mensaje desde "+company+
                " debido a que los siguientes documentos han expirado o estan al expirar:</p>"+
                "<ul>"+ outdatedDocumentsHTML+"</ul>"+
                "<p>Por favor haga llegar a la oficina copias actualizadas de los documentos listados anteriormente.</p>"+
                "<p>Recuerde que <strong>usted no podra trabajar</strong> mientras tenga un documento vencido.</p>"+
                "<p>Tenga un buen dia</p>"

    };
    return mailOptions;
}
helpers.generateSuperuserMailOptions=function(superuserEmail,messages){
    var outdatedDocumentsHTML="";
    messages.forEach(message=>{
        outdatedDocumentsHTML+="<h3>"+message.name+"<span style='font-size:13px'> "+message.phone+" "+message.email+"</span></h3>";
        outdatedDocumentsHTML+="<ul>";
        message.outdatedDocuments.forEach(outdatedDocument=>{
            outdatedDocumentsHTML+="<li>"+"<span><strong>"+outdatedDocument.name+"</strong></span>"+"---"+outdatedDocument.expireDate;
            if(moment(outdatedDocument.expireDate,"MM/DD/YYYY").isBefore(moment(Date.now()))){
                outdatedDocumentsHTML+=" <span style='color:red'>(expired)</span></li>"
            }
            else{
                outdatedDocumentsHTML+="</li>"
            }
        })
        outdatedDocumentsHTML+="</ul>";
    })
    let mailOptions = {
        from: superuserEmail, // sender address
        to: superuserEmail, // list of receivers
        subject: "DOCUMENTOS DESACTUALIZADOS: REPORTE DIARIO", // Subject line
        html:   "<h2 style='text-decoration:underline'>Reporte de documentos vencidos</h2>"+outdatedDocumentsHTML
                

    };
    return mailOptions;
}

helpers.generateSMSOptions=function(name,recipientNumber,company,outdatedDocuments){
    var outdatedDocumentsText="\n"
    outdatedDocuments.forEach((outdatedDocument)=>{
        outdatedDocumentsText+=outdatedDocument.name;
        outdatedDocumentsText+=", "
        outdatedDocumentsText+=outdatedDocument.expireDate;
        if(moment(outdatedDocument.expireDate,"MM/DD/YYYY").isBefore(moment(Date.now()))){
            outdatedDocumentsText+=" (expired)"
        }
        outdatedDocumentsText+="\n";
    })
   
    let smsOptions = {
        topic:"OUTDATED DOCUMENTS (DOCUMENTOS DESACTUALIZADOS)" , 
        number: recipientNumber, 
        text:   "Hola "+name+
                " ,usted esta recibiendo este mensaje desde "+company+
                " debido a que los siguientes documentos han expirado o estan al expirar "+outdatedDocumentsText+
                "Por favor haga llegar a la oficina copias actualizadas de los documentos listados anteriormente."+
                " Recuerde que usted no podra trabajar mientras tenga un documento vencido."+
                " Tenga un buen dia"

    };
    
    return smsOptions;
}

module.exports=helpers;
