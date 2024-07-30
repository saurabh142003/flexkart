import express from 'express'
import { verifyToken } from '../utils/verifyToken.js'
import { deleteRes, getResFoods, getRestaurant,getRestaurants,registerRes, updateRestaurant } from '../controllers/restaurant.controller.js'
const router = express.Router()
router.post('/create',verifyToken,registerRes)
router.delete('/delete/:id',verifyToken,deleteRes)
router.get('/get/:id',getRestaurant)
router.get('/get',getRestaurants)
router.post('/update/:id',verifyToken,updateRestaurant)
router.get('/foods/:id',verifyToken,getResFoods)
export default router