import express from 'express'
import userAuth from '../middlewares/authMiddleware.js'
import { createJobController, deleteJobsController, getAllJobsController, jobStatsController, updateJobsController } from '../controller/jobsController.js'

//router object
const router=express.Router()
//create route
router.post('/create-job',userAuth,createJobController)
//get jobs || GET
router.get('/get-jobs',userAuth,getAllJobsController)
//update jobs || patch 
router.patch('/update-job/:id',userAuth,updateJobsController)
//delete jobs || delete
router.delete('/delete-job/:id',userAuth,deleteJobsController)
//job stats and filter
router.get('/job-stats',userAuth,jobStatsController)
export default router