import Restaurant from "../models/restaurant.model.js"
import Food from "../models/food.model.js"
export const registerRes = async (req,res,next)=>{
    try{
    const resta = await Restaurant.create(req.body)
    res.status(201).json(resta)
    }catch(err){
        next(err)
    }
}
 export const deleteRes =async (req,res,next)=>{
        const restaurant = await Restaurant.findById(req.params.id)
        if(!restaurant) return next()
        if(req.user.id !== restaurant.userRef) return next()
        
        try{
            await Restaurant.findByIdAndDelete(req.params.id)
            res.status(200).json("Listing deleted successfully")
        }catch(err){
            next(err)
        }
        
        
    
 }
 export const getResFoods = async (req, res, next) => {
    try {
      const foods = await Food.find({ resRef: req.params.id });
      if(!foods) return next()
      res.status(200).json(foods);
    } catch (error) {
      next(error);
    }
  }
 export const getRestaurant = async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findById(req.params.id);
      if (!restaurant) {
        return next();
      }
      res.status(200).json(restaurant);
    } catch (error) {
      next(error);
    }
  };

 export const updateRestaurant = async (req, res, next) => {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return next();
    }
    if (req.user.id !== restaurant.userRef) {
      return next();
    }
  
    try {
      const updatedRestaurant = await Restaurant.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json(updatedRestaurant);
    } catch (error) {
      next(error);
    }
 };  

 export const getRestaurants = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    // let offer = req.query.offer;

    // if (offer === undefined || offer === 'false') {
    //   offer = { $in: [false, true] };
    // }

    // let furnished = req.query.furnished;

    // if (furnished === undefined || furnished === 'false') {
    //   furnished = { $in: [false, true] };
    // }

    // let parking = req.query.parking;

    // if (parking === undefined || parking === 'false') {
    //   parking = { $in: [false, true] };
    // }

    // let type = req.query.type;

    // if (type === undefined || type === 'all') {
    //   type = { $in: ['sale', 'rent'] };
    // }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const Restaurants = await Restaurant.find({
      name: { $regex: searchTerm, $options: 'i' }
      
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(Restaurants);
  } catch (error) {
    next(error);
  }
};