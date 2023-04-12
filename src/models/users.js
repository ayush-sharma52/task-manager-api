const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const Task=require('../models/tasks');

const userSchema = new mongoose.Schema({
        name: {
            trim:true,
            type:String,
            required:true,
        },
        email:{
            type:String,
            unique:true,
            required:true,
            trim:true,
            lowercase:true,
            validate(value){
                if(!validator.isEmail(value))
                throw new Error('not a valid Email');
            }
        },
        age:{
            type:Number,
            default:0,
            validate(value){
                if(value<0)
                throw new Error('age must be a positive Number');
            }
        },
        password:{
            type:String,
            required:true,
            trim:true,
            minlength:7,
            validate(value){
                if(value.toLowerCase().includes('password'))
                throw new Error('cannot contain the word password');
            }
        },
        tokens:[{
            token:{
                type:String,
                required:true,
            }}
        ],
        avatar:{
            type:Buffer
        }

      },{
        timestamps:true
      });

//   foreign field is the property of documents to whom our virtual  property ref
// foreign field there is the owner property of task doc which stores the _id prop of the user doc
userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id', 
    foreignField:'owner'
})


// now we will use the concept of middleware which will be possible only if we inculcate the use of schema

// this function will execute just before the object gets saved to the collection
userSchema.pre('save',async function(next){
    const user=this;
    // console.log('just before saving');
    //return true either when the user is created or when user is updated with it's password
    if(user.isModified('password'))
    user.password=await bcrypt.hash(user.password,8);

    next();

})

//we can create our own function for a model like below
userSchema.statics.findByCredentials=async(email,password)=>{
    const user=await User.findOne({email});
    if(!user)
    throw new Error('unable to login');
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch)
    throw new Error('unable to login');

    return user;

}

userSchema.methods.generateAuthToken=async function(){
    const user=this;

//  A JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred between two parties. 
// It consists of three parts: a header, a payload, and a signature. The header and payload are Base64Url encoded JSON objects,
//  and the signature is a hash of the concatenation of the Base64Url-encoded header and payload, using a secret key.

    const token=jwt.sign({id:user._id.toString()},process.env.JWT_SECRET);
    user.tokens=user.tokens.concat({token});
    await user.save();
    return token;

// In summary, jwt.verify() is a method used to verify the authenticity of a JWT, 
// ensuring that it has not been tampered with and contains the expected claims.
    
}

//before sending the response express convverts the data using .toStringify() and when .toStringify() is executed .toJSON() is also executed
// hence we defined the () below which will hide our private details and we don't need to call it explicitly
userSchema.methods.toJSON=function(){
    const user=this;
    const userObject=user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    
    return userObject;
}
const User = mongoose.model('User', userSchema);

module.exports=User;