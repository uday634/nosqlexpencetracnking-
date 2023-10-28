const Expence = require("../models/Expense");
const User = require("../models/User");
// const AWS = require("aws-sdk");
// const UserServices = require("../services/userservices");
// const DownloadedFiles = require("../models/DownloadedFiles");

exports.exportData = async (req, res, next) => {
  try {
    const { amount, description, desType } = req.body;
    const user = req.user;
    const expence = new Expence({
      amount: amount,
      description: description,
      desType: desType,
      userId: req.user.userId
    })
    expence.save()
    console.log('successs')
  }catch(err){
    res.status(401).json({message: 'can not add expences', err: err})
  }
};

exports.sendData = async (req, res, next) => {
  try {
      const userId = req.user.userId;
      const expenses = await Expence.find({ userId: userId });
      res.json(expenses);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteData = async (req, res, next) => {
  try {
    const deleteId = req.params.id;
    console.log(deleteId)

    const record = await Expence.deleteOne({ _id: deleteId });
    if (record.deletedCount === 0) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

function uploadToS3(data, filename) {
  return new Promise((resolve, reject) => {
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    let s3bucket = new AWS.S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET,
    });

    var params = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: data,
      ACL: "public-read",
    };
    s3bucket.upload(params, (err, data) => {
      if (err) {
        console.log("Something went wrong", err);
        reject(err);
      } else {
        console.log("success", data);
        resolve(data.Location);
      }
    });
  });
}

exports.downloadExpence = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    let Expence = await expence.findAll({ where: { id: userId } });
    const stringifiedExpences = JSON.stringify(Expence);
    const filename = `Expences${userId}/${new Date()}.txt`;
    const fileURL = await uploadToS3(stringifiedExpences, filename);
    console.log(fileURL);
    const downloadefiles = DownloadedFiles.create({
      link: fileURL,
      UserId: userId,
    });
    res.status(200).json({ fileURL, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong", err: err });
  }
};

exports.getfilehistory = async (req, res, next) => {
  try {
    let userId = req.user.userId;
    let files = await DownloadedFiles.findAll({ where: { UserId: userId } });
    console.log(files);
    res.json(files)
    
  } catch (err) {
    res.status(500).json({ message: "can't find the require files", err: err });
  }
};
