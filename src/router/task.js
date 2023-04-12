const express=require('express');
const router=express.Router();
const Task=require('../models/tasks');
const auth=require('../middleware/auth');
const multer=require('multer');

router.post('/tasks',auth,async (req,res)=>{
    // const task=new Task(req.body)
    const task=new Task({
        ...req.body,
        owner:req.user._id
    })
    
    try{
    await task.save()
    res.status(201).send(task);
    }
    catch(err){
        // console.log(err);
        res.status(400).send(err);
    }
    
});

// /tasks?completed=true
// /tasks?limit=2&skip=1
// /tasks?sortBy=createdAt:dsc
router.get('/tasks',auth,async (req,res)=>{
    const match={};
    const sort={};

    if(req.query.completed)
    match.completed= req.query.completed==='true';

    const parts=req.query.sortBy.split(':');
    if(req.query.sortBy)
    sort[parts[0]]= parts[1]==='desc'?-1:1;

    
    try{
    // const tasks=await Task.find({owner:req.user._id});
    await req.user.populate({
        path:'tasks',
        match,
        options:{
            // if limit is there in the queries then only it will work otherwise no effect
            limit:parseInt(req.query.limit),
            skip:parseInt(req.query.skip),
            sort
        }

    });
        res.send(req.user.tasks);
    }
    catch(err){
        res.status(500).send(err);
    }
})

router.get('/tasks/:id',auth,async (req,res)=>{
    const _id=req.params.id;
    try{
    const task=await Task.findOne({_id,owner:req.user._id})
        if(!task)
       return res.status(404).send();

        res.send(task);
    }
    catch(err){
        res.status(500).send(err);
    }
})
router.patch('/tasks/:id',auth,async (req,res)=>{
    try{
        const updateValues=Object.keys(req.body);
        const allowedValues=["description","completed"];

        const isValid=updateValues.every(value=> allowedValues.includes(value));
        if(!isValid)
        res.status(401).send({error:"Given values are not allowed to update"});

         //findByIdAndUpdate method surpasses the pre() so we will update user manually and then save it to go through the pre()
        // const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id});

        if(!task) //if no user is found with that id
        return res.status(404).send();

        updateValues.forEach( value => task[value]=req.body[value] )
        await task.save();
        res.send(task);
        
    }
    catch(e){
        res.status(400).send(e);
    }
})
router.delete('/tasks/:id',auth,async(req,res)=>{
    try{
        const task= await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!task)
        return res.status(404).send();

        res.send(task);
    }
    catch(e){
        res.status(500).send(e);
    }
});


module.exports=router;