// ****** IGNORE THIS FILE **************** ////////////////////////////

import express from 'express'
import { sendEMail } from '../controllers/gmail.controller.js'
const router = express.Router();
router.post("/send-mail",sendEMail)
export default router