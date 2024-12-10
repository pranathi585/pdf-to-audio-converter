const mongoose=require("mongoose")

mongoose.connect("mongodb://localhost:27017/loginsignup")
.then(()=>{
    console.log("Mongodb Connected");
})

.catch((err)=>{
    console.log("failed to Connect");
})

const LoginSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const collection =new mongoose.model("collections",LoginSchema)
module.exports=collection