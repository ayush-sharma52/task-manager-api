const jwt=require('jsonwebtoken');
const User=require('../models/users');

const auth=async (req,res,next) => {
    try{
    // first we extracted the token from the header
    const token=req.header('Authorization').replace('Bearer ','');
    // we verified whether the token is the one we generated(and not tempered thereafter) if yes we return the data of token
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    // now we find the user with the id contained in token and also check that the tokens array of that user contains that token or not so
    //  as to  ensure that that user is still loggedin or whatsoever (explained in next videos)
    const user=await User.findOne({_id:decoded.id,'tokens.token':token});
    if(!user)
    throw new Error();

    req.token=token;
    req.user=user;
    next();
    }
    catch(e)
    {   console.log(e);
        res.status(401).send('error:please authenticate');}

}
module.exports=auth;