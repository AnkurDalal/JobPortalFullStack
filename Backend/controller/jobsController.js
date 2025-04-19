import mongoose from "mongoose";
import jobsModel from "../models/jobsModel.js";

export const createJobController = async (req, resp, next) => {
  const { company, position } = req.body;
  if (!company || !position) {
    next("Please provide all fields");
  }
  req.body.createdBy = req.user.userId;
  const job = await jobsModel.create(req.body);
  resp.status(201).json({
    job,
  });
};

export const getAllJobsController = async (req, resp, next) => {
  const { status, workType, search, sort } = req.query;
  //condition for searching filters
  const QueryObject = {
    createdBy: req.user.userId,
  };
  //logic filters
  if (status && status !== "all") {
    QueryObject.status = status;
  }
  if (workType && workType !== "all") {
    QueryObject.workType = workType;
  }
  if (search) {
    QueryObject.position = { $regex: search, $options: "i" };
  }
  let QueryResult = jobsModel.find(QueryObject);
  //sorting
  if (sort == "latest") {
    QueryResult = QueryResult.sort("-createdAt");
  }
  if (sort == "oldest") {
    QueryResult = QueryResult.sort("createdAt");
  }
  if (sort == "a-z") {
    QueryResult = QueryResult.sort("position");
  }
  if (sort == "A-Z") {
    QueryResult = QueryResult.sort("-position");
  }
  //pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  QueryResult = QueryResult.skip(skip).limit(limit);
  //jobs count
  const totalJobs = await jobsModel.countDocuments(QueryResult);
  const numOfPages = Math.ceil(totalJobs / limit);
  const jobs = await QueryResult;
  // const jobs = await jobsModel.find({ createdBy: req.user.userId });
  resp.status(200).json({
    totalJobs,
    jobs,
    numOfPages,
  });
};

export const updateJobsController = async (req, resp, next) => {
  const { id } = req.params;
  const { company, position } = req.body;
  if (!company || !position) {
    next("please provide all the fields!");
  }
  //find job
  const job = await jobsModel.findOne({ _id: id });
  if (!job) {
    next(`no jobs found with this id ${id}`);
  }
  if (!req.user.userId === job.createdBy.toString()) {
    next("You are not authorized to update this job !");
    return;
  }
  //update job
  const updateJob = await jobsModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  resp.status(200).json({ updateJob });
};

export const deleteJobsController = async (req, resp, next) => {
  const { id } = req.params;
  //find job
  const job = await jobsModel.findOne({ _id: id });
  if (!job) {
    next(`No job found with this id ${id}`);
  }
  if (!req.user.userId === job.createdBy.toString()) {
    next("You are not authorized to delete this job !");
    return;
  }
  await job.deleteOne();
  resp.status(200).json({ message: "Success,job Deleted !" });
};

//jobs stats and filter
export const jobStatsController = async (req, resp) => {
  const stats = await jobsModel.aggregate([
    //search by user jobs
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);
  const defaultStats = {
    pending: stats.pending || 0,
    reject: stats.reject || 0,
    interview: stats.interview || 0,
  };
  //monthly yearly stats
  let monthlyApplication = await jobsModel.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: {
          $sum: 1,
        },
      },
    },
  ]);
  resp
    .status(200)
    .json({ totalJob: stats.length, defaultStats, monthlyApplication });
};
