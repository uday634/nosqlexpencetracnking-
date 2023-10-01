const expence = require("../models/Expense");
const User = require("../models/User");
const sequelize = require("../util/sqlconfig");
const AWS = require("aws-sdk");
const UserServices = require("../services/userservices");
const DownloadedFiles = require("../models/DownloadedFiles");

exports.exportData = async (req, res, next) => {
  let t;
  try {
    const { amount, description, desType } = req.body;
    const user = req.user;
    const currentUser = await User.findByPk(user.userId);
    t = await sequelize.transaction();

    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const currentTotalCost = currentUser.total_cost || 0;
    const newTotalCost = currentTotalCost + parseInt(amount, 10);
    await User.update(
      { total_cost: newTotalCost },
      { where: { id: user.userId } },
      { transaction: t }
    );
    const newExpense = await expence.create(
      {
        amount: parseInt(amount, 10),
        description: description,
        desType: desType,
        UserId: user.userId,
      },
      { transaction: t }
    );
    t.commit();
    console.log(newExpense);
    res.status(201).json({ message: "Expense created successfully" });
  } catch (error) {
    if (t) {
      t.rollback();
    }
    console.error("Error creating expense:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.sendData = async (req, res, next) => {
  try {
    let Expence = await expence.findAll({ where: { userId: req.user.userId } });
    // .then(data => {
    //     console.log(data)
    //     res.json(data);
    // })
    res.json(Expence);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteData = async (req, res, next) => {
  let t;
  try {
    t = sequelize.transaction();
    const deleteId = req.params.id;
    const record = await expence.findByPk(deleteId);

    if (!record) {
      return res.status(404).json({ error: "Record not found" });
    }

    const curreamount = record.amount;

    const user = req.user;
    const currentUser = await User.findByPk(user.userId);
    const newTotalCost = currentUser.total_cost - curreamount;
    await User.update(
      { total_cost: newTotalCost },
      { where: { id: user.userId } },
      { transaction: t }
    );

    // Delete the record
    await record.destroy();

    res.status(204).send();
  } catch (err) {
    if (t) {
      t.rollback();
    }
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
