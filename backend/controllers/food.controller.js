import Food from "../models/food.model.js";

// Get all food items
export const getAllFoods = async (req, res,next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;
        let offer = req.query.offer;
    
        if (offer === undefined || offer === 'false') {
          offer = { $in: [false, true] };
        }
    
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
    
        const foods = await Food.find({
          name: { $regex: searchTerm, $options: 'i' },offer,
          
        })
          .sort({ [sort]: order })
          .limit(limit)
          .skip(startIndex);
    
        return res.status(200).json(foods);
      } catch (error) {
        next(error);
      }
};

// Get a single food item by ID
export const getFood = async (req, res, next) => {
  console.log("in getFood")
  try {
    const food = await Food.findById(req.params.id);
    console.log("food"+food)
    if (!food) return next()
    res.status(200).json(food);
  console.log("after sending data "+food)
  } catch (error) {
    next(error)
  }
};

// Create a new food item
export const addFood = async (req, res ,next) => {
  try {
    const newFood = new Food({
      imageUrls: req.body.imageUrls,
      name: req.body.name,
      description: req.body.description,
      isVeg: req.body.isVeg,
      regularPrice: req.body.regularPrice,
      discountPrice: req.body.discountPrice,
      offer: req.body.offer,
      resRef: req.body.resRef
    });

    const savedFood = await newFood.save();
    res.status(201).json(savedFood);
  } catch (error) {
    next(error)
  }
};

// Update a food item by ID
export const updateFood = async (req, res ,next) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(
      req.params.id,
      req.body ,
      { new: true }
    );

    if (!updatedFood) return next()
    res.status(200).json(updatedFood);
  } catch (error) {
    next(error)
  }
};

// Delete a food item by ID
export const deleteFood = async (req, res ,next) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);
    if (!deletedFood) return next()
    res.status(200).json({ message: 'Food item deleted successfully' });
  } catch (error) {
    next(error)
  }
};
