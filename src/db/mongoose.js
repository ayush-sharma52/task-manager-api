const mongoose=require('mongoose')
const link=process.env.MONGODB_URL;
mongoose.connect(link)
    .then(function(result){
        console.log("connected");
    })
    .catch((err)=>
    {
        console.log(err);
    })

