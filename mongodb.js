const mongoose=require('mongoose');

const link=process.env.MONGODB_URL;
mongoose.connect(link)
    .then(function(result){
        console.log("connected");
    })
    .catch((err)=>
    {
        console.log(err);
    })
const userSchema = new mongoose.Schema({
        name: String,
        email: String,
        age: Number
      });
const User = mongoose.model('User', userSchema);

// const user = new User({
//         name: 'Ayush',
//         email: 'ayush@example.com',
//         age: 20
//       });
// user.save()
//         .then((savedUser) => console.log(savedUser))
//         .catch((err) => console.error('Failed to create user', err));

      
    //   const userToInsert = [
    //     { name: 'John Doe', age: 30, email: 'johndoe@example.com' },
    //     { name: 'Jane Smith', age: 25, email: 'janesmith@example.com' },
    //     { name: 'Bob Johnson', age: 40, email: 'bobjohnson@example.com' }
    //   ];

    //   User.insertMany(userToInsert)
    //   .then(savedUsers=>{console.log(savedUsers);})
    //   .catch(err=>{
    //     console.log(err);
    //   })
      

    const TaskSchema = new mongoose.Schema({
        description:String,
        completed:Boolean,
      });
    
    const Task=mongoose.model('Task',TaskSchema);
    // const task = new Task({
    //     description:'gardening',
    //     completed:true,
    //   });
    
    //   const tasksToInsert = [
    //     {description: 'cleaning',completed: false},
    //     {description: 'cooking', completed: false},
    //     {description: 'homework',completed:  false}
    //   ];
      
    //   Task.insertMany(tasksToInsert).then((savedTasks) => console.log(savedTasks))
    //           .catch((err) => console.error('Failed to create user', err));
      
    // Task.findOne({description:'gardening'})
    // .then(result=>{
    //     console.log(result);
    // })
    // .catch(err=>{
    //     console.log(err);
    // })
    // User.find({age:30})
    // .then(res=>console.log(res))
    // .catch(err=>console.log(err));
//     User.updateOne({ name: 'Ayush' },  { $inc: { age: 1 } } )
//   .then((result) => console.log(result.modifiedCount +' document(s) updated'))
//   .catch((err) => console.error('Failed to update user', err));

// Task.deleteOne({ description:'cooking' })
//   .then(() => console.log('task deleted'))
//   .catch((err) => console.error('Failed to delete task', err));
