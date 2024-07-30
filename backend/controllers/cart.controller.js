import Cart from '../models/cart.model.js';
import Food from '../models/food.model.js';


const calculateTotalPrice = async (items) => {
  let totalPrice = 0;

  for (let item of items) {
   
    const food = await Food.findById(item.foodId.toString());

    if (food) {
      if(food.discountPrice!=0) totalPrice += (food.discountPrice) * item.quantity;
      else totalPrice += (food.regularPrice) * item.quantity;
    }
  }

  return totalPrice;
};


export const getCartByUserId = async (req, res, next) => {
  console.log(req.params.userId)

  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.foodId');
    if (!cart) {
      console.log("no cart")
      res.status(300).json({message:"notFound"})
    }
    console.log("cart found"+cart)
    res.status(200).json(cart);
  } catch (error) {
    next()
  }
};


export const addItemToCart = async (req, res, next) => {
  
  const { userId, foodId, quantity } = req.body;
  console.log("hello in cart Items"+userId,foodId)

  try {
    let cart = await Cart.findOne({ userId });
    if (cart) {
        
      const itemIndex = cart.items.findIndex(item => item.foodId.toString() === foodId);
      if (itemIndex > -1) {

        cart.items[itemIndex].quantity += quantity;
      } else {

        cart.items.push({ foodId, quantity });
      }
    } else {
      console.log("im in new cart")
      cart = new Cart({
        userId,
        items: [{ foodId, quantity }]
      });
    }

  
    cart.totalPrice = await calculateTotalPrice(cart.items);
  

    const savedCart = await cart.save();
    console.log("saved cart"+savedCart)
  
    res.status(200).json(savedCart);
  } catch (error) {
    next()
  }
};


export const removeItemFromCart = async (req, res, next) => {
  console.log("hhii from remov e item")
  const { userId, foodId } = req.body;
  console.log("userId "+userId+"foodId"+ foodId)
  try {
    let cart = await Cart.findOne({ userId });
    console.log(cart+"the cart is available")

    if (cart) {
      cart.items = cart.items.filter(item => item.foodId.toString() !== foodId);


      cart.totalPrice = await calculateTotalPrice(cart.items);
      console.log("before saving cart "+cart)
      await cart.save();
      console.log("after saving cart"+cart)
      res.status(200).json(cart);
    } else {
      console.log("cart is not available")
      next()
    }
  } catch (error) {
    next()
  }
};

export const removeCartItem = async (req, res, next) => {
  console.log("hhii from remov e item")
  const { userId, foodId } = req.body;
  console.log("userId "+userId+"foodId"+ foodId)
  try {
    let cart = await Cart.findOne({ userId });
    console.log(cart+"the cart is available")

    if (cart) {
      cart.items = cart.items.filter(item => item._id.toString() !== foodId);


      cart.totalPrice = await calculateTotalPrice(cart.items);
      console.log("before saving cart "+cart)
      await cart.save();
      console.log("after saving cart"+cart)
      res.status(200).json(cart);
    } else {
      console.log("cart is not available")
      next()
    }
  } catch (error) {
    next()
  }
};

