import User from "../models/user.model.js"
import bycryptjs from 'bcryptjs'
import Listing from '../models/listing.model.js'


export const updateUser = async (req,res,next)=>{
    if(req.user.id !== req.params.id) return next(401,"not the correct token")

    try{
        if(req.body.password){
            req.body.password = bycryptjs.hashSync(req.body.password,10)
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set:{
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
                avatar:req.body.avatar,
            }
        },{new:true})

        const {password,...rest} = updatedUser._doc
        res.status(200).json(rest)
    }catch(err){
        next(err)
    }
   

}
export const deleteUser = async (req,res,next)=>{

    
    if(req.user.id !== req.params.id) return next()
    try{

    await User.findByIdAndDelete(req.params.id)
    res.clearCookie('access_token')
    res.status(200).json("User deleted Successfully")
    }catch(err){
        next(err)
    }
}
export const getUserListings = async (req, res, next) => {
    if (req.user.id === req.params.id) {
      try {
        const listings = await Listing.find({ userRef: req.params.id });
        res.status(200).json(listings);
      } catch (error) {
        next(error);
      }
    } else {
      return next();
    }
  };

  export const getUser = async (req, res, next) => {
    try {
      
      const user = await User.findById(req.params.id);
    
      if (!user) return next();
    
      const { password: pass, ...rest } = user._doc;
    
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  };