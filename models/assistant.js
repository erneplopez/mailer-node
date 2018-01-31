var mongoose=require("mongoose");

var assistantSchema=new mongoose.Schema({
	firstName:String,
	lastName:String,
	phone:String,
	email:String,
	providerId:String,
	rate:String,
	licenseNumber:String,
	notes:String,
	photo:String,
	deactivationSuperuser:String,
	documents:
	[
		{
			startDate:String,
			expireDate:String,
			name:String
		}
	],
	clients:
		[
			{
				type:mongoose.Schema.Types.ObjectId,
				ref:"Client"
			},

		],
	reports:
		[
			{
				type:mongoose.Schema.Types.ObjectId,
				ref:"Report"
			},

		],
});

module.exports=mongoose.model("Assistant",assistantSchema);

