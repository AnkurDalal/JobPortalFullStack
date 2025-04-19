
import express from 'express'
import userAuth from '../middlewares/authMiddleware.js'
import { getUserController, updateUserController } from '../controller/userController.js'

//router object
const router=express.Router()

//get user data ||POST
router.post('/getUser',userAuth,getUserController)
//update user || PUT

router.put('/update-user',userAuth,updateUserController)

export default router