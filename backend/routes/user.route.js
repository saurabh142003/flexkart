import express, { Router } from 'express'
import { deleteUser, getUser, getUserProducts, updateUser } from '../controllers/user.controller.js'
import { verifyToken } from '../utils/verifyToken.js'
const router = express.Router()
router.post('/update/:id',verifyToken,updateUser)
router.delete('/delete/:id',verifyToken,deleteUser)
// router.get('/restaurants/:id',verifyToken,getUserRestaurants)
router.get('/products/:id',verifyToken,getUserProducts)
router.get('/:id',verifyToken,getUser)
export default router