const express=require('express');
const sharp=require('sharp');
const multer=require('multer');
const router=express.Router();
const User=require('../models/users');
const auth=require('../middleware/auth');
const Task = require('../models/tasks');
const {sendWelcomeEmail,sendCancelEmail}=require('../emails/accounts');


router.post('/users',async (req,res)=>{
    const user=new User(req.body)
    
    try{
     await user.save()
     const token=await user.generateAuthToken();
    //  we can make it await or not , no effect
     sendWelcomeEmail(user.email,user.name); 
     res.status(201).send({user,token});
    }
    catch(err) {
        // console.log(err);
        res.status(400).send(err);
    }
    
})

//not a good thing to expose other users info
// router.get('/users',async (req,res)=>{
//     try{
//     const users = await User.find({})
//         res.send(users);
//     }
    
//     catch(err){
//         // console.log(err);
//         res.status(500).send(err);
//     }
// })

// to add middle-ware into a specific route we give that function as 2nd parameter to the callback ()
//here we are getting the profile of a user using the token generated when he/she is created
router.get('/users/me',auth,async (req,res)=>{
    res.send(req.user);
})

router.patch('/users/me',auth,async (req,res)=>{
   
        const updateValues=Object.keys(req.body);
        const allowedValues=["email","age","name","password"];

        const isValid=updateValues.every(value=> allowedValues.includes(value));
        if(!isValid)
        res.status(401).send({error:"Given values are not allowed to update"});
        
        try{
        //findByIdAndUpdate method surpasses the pre() so we will update user manually and then save it to go through the pre()
        // const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
        // const user = await User.findById(req.params.id);
        
        // no use now
        // const user = await User.findById(req.params.id);
        // if(!user) //if no user is found with that id
        // return res.status(404).send();

        updateValues.forEach( value => req.user[value]=req.body[value] )
        await req.user.save();
        res.send(req.user);
    }
    catch(e){
        // console.log(e);
        res.status(400).send(e);
    }
})
router.delete('/users/me',auth,async (req,res)=>{
    try{
        sendCancelEmail(req.user.email,req.user.name);
        await User.deleteOne({_id:req.user._id});
        await Task.deleteMany({owner:req.user._id});
        // await req.user.remove();
        
        res.send(req.user);
    }
    catch(e){
        console.log(e);
        res.status(500).send(e);
    }
})

//in the login and create requests we are generating and returning authTokens which are further handled in postman so that in the routes
//  where authorization is required this authToken is used automatically to use the corresponding user in the route(update,delete,read)
//ex:- we create/login a user, an authToken is generated and its value is assigned to the variable in postman now whenever that user wants
// to read,update,delete (ie:- which requires auth). It can only do those operations to itself.

router.post('/users/login',async(req,res)=>{
 try{
    //we first find the user with that email and password
    const user=await User.findByCredentials(req.body.email,req.body.password);
    //we then generate an auth token for that user and save it to the array of token for that particular user
    const token =await user.generateAuthToken();

    res.status(200).send({user,token});
}
catch(e){
    console.log(e);
    res.status(400).send(e);
}
})

//the authToken that came in header belongs to thee loggedin user so we remove it from her tokens array so that next time he performs some operation
// that req. auth. then that token (which is now expired as he loggedout) can't be found in his tokens array and error is thrown
router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter( token => token.token !== req.token ) //token{_id:  , token:  }
        await req.user.save();
       res.status(200).send();
   }
   catch(e){
       console.log(e);
       res.status(500).send(e);
   }
   })

//to log current user out of all logged in devices
router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens=[];
        await req.user.save();
       res.status(200).send();
   }
   catch(e){
       console.log(e);
       res.status(500).send(e);
   }
   })

const upload=multer({
    // dest:'avatars',
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
        return cb(new Error('please upload an image'));

         cb(undefined,true);

    }

})

router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res) => {
    const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer();
    req.user.avatar=buffer;
    await req.user.save();
    res.send();
},(error,req,res,next)=>{
    res.status(400).send({error:error.message});
})

router.delete('/users/me/avatar',auth,async (req,res) => {
    req.user.avatar=undefined;
    await req.user.save();
    res.send();
})

router.get('/users/:id/avatar',async (req,res) => {
    const user = await User.findById(req.params.id);
    if(!user || !user.avatar)
    throw new Error();

    res.set('Content-Type','image/png')
    res.send(user.avatar);
},(error,req,res,next)=>{
    res.status(400).send({error:error.message});
})


module.exports=router;