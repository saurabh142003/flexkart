import express from 'express'
import { verifyToken } from '../utils/verifyToken.js'
import { addFood } from '../controllers/product.controller.js'
import { deleteFood, getAllFoods, getFood, updateFood } from '../controllers/product.controller.js'

const router = express.Router()
router.post('/create',verifyToken,addFood)
router.delete('/delete/:id',verifyToken,deleteFood)
router.get('/get/:id',getFood)
router.get('/get',getAllFoods)
router.post('/update/:id',verifyToken,updateFood)
export default router