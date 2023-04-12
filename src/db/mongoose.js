const mongoose=require('mongoose')
const link="mongodb+srv://ayush052sharma:9811933794@cluster0.rrahjdv.mongodb.net/task-manager-api?retryWrites=true&w=majority";
mongoose.connect(link)
    .then(function(result){
        console.log("connected");
    })
    .catch((err)=>
    {
        console.log(err);
    })

