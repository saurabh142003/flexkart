import express from 'express'
import { verifyToken } from '../utils/verifyToken.js'
import { createList, deleteList, getListing, getListings, updateListing } from '../controllers/listing.controller.js'
const router = express.Router()
router.post('/create',verifyToken,createList)
router.delete('/delete/:id',verifyToken,deleteList)
router.get('/get/:id',getListing)
router.get('/get',getListings)
router.post('/update/:id',verifyToken,updateListing)
export default router