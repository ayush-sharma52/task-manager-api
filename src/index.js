const express=require('express')
require('./db/mongoose');
const userRouter=require('./router/user');
const taskRouter=require('./router/task');

const app=express()
const port=process.env.PORT

//without middle-ware :- new request  -- >  run route handler
//with middle-ware :-  new request --> do something --> run route handler

// app.use((req,res,next)=>{
//     // console.log(req.method,req.path);
//     if(req.method==='GET')
//     res.send('unable to process get requests');
//     else
//     next();
// })


// app.use((req,res,next)=>{
//     res.status(503).send('unable to process requests due to maintenance period');
// })

app.use(express.json())
app.use(userRouter);  
app.use(taskRouter);
// This would mount the user&taskRouter at the "/" path in our main Express application,
//  for ex:- so any requests to "/users" would be handled by the userRouter's GET handler for the "/users" path.


app.listen(port,()=>{
    console.log('server is up on port '+port);
})

// const bcrypt=require('bcryptjs');
// const myFunc=async()=>{
//     const pass="Red1234!";
//     const hashedPass=await bcrypt.hash(pass,8);
//     console.log(pass);
//     console.log(hashedPass);

//     const isMatch = await bcrypt.compare("Red12342!",hashedPass);
//     console.log(isMatch);

// }
// myFunc();

 const jwt=require('jsonwebtoken');

// const func=async ()=>{
// const token =jwt.sign({pass:'Red1234!'},'ayush');
// console.log(token);
// const data = await jwt.verify(token,'ayush');
// console.log(data);
// }
// func();

const User = require('./models/users');
const Task = require('./models/tasks');

// const main=async()=>{
// //     const task = await Task.findById('64317e90fde3668baa21e24c');
// //     await task.populate('owner');
// // console.log(task.owner);

// const user=await User.findById('64318578bc0a51c5c83dc0bb')
// await user.populate('tasks');
// console.log(user.tasks);
// }
// main();
const multer=require('multer');

const upload=multer({
    dest:'images',
    limit:{
            //  1 million bytes = 1MB
        fileSize:1000000 
    },
    fileFilter(req,file,cb){
            if(!file.originalname.match(/\.(doc|docx)$/))
            return cb(new Error('please upload a word document'));
            // return cb(new Error('please upload a pdf'));

            cb(undefined,true);
            // cb( new Error('file must be a pdf'));
            // cb(undefined,true);
            //  this statement means no error generated still not accepted file hence will never use this
            // cb(undefined,false); 
        }
    
    });
    // const errorMiddleWare=(req,res,next)=>{
    //     throw new Error('my middleware error');
    // }
    app.post('/upload',upload.single('upload'),async(req,res)=>{
        res.send();
    },(error,req,res,next)=>{
        res.status(400).send({error:error.message});
    })
    // giving another callback() is a type of implementing try-catch block