var mongoose=require("mongoose");

var actionSchema=new mongoose.Schema({
	date:Date,
	completedDate:Date,
	action:String,
	status:String,
	recipient:{
		name:String,
		id:String,
	},
	responsible:{
		name:String,
		id:String,
	},
	superuserId:String
		
});

module.exports=mongoose.model("Action",actionSchema);