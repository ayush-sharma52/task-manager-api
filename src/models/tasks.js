const mongoose=require('mongoose');
const User = require('./users');
const TaskSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true,
    },
    completed:{
        type:Boolean,
        default:false,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        // this ref will further help when we populate then it will use the ref to look for the id in it and populate it
        ref:'User' 

    }
  },{
    timestamps:true
  });

const Task=mongoose.model('Task',TaskSchema);
module.exports=Task;