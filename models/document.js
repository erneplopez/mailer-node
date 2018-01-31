var mongoose=require("mongoose");

var documentSchema=new mongoose.Schema({
	date:Date,
	name:String,
	owner:{
		kind:String,
		id:String
    }	
   
});

module.exports=mongoose.model("Document",documentSchema);