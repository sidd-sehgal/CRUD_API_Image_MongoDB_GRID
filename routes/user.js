const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const { validateInput,
    validateInputPatch } = require("../functions/validateInput");
const User = require("../models/user");

const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const storage = new GridFsStorage({
    url: process.env.DB,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        let ext = file.originalname.split(".")[1]
        return {
            bucketName: process.env.GRID_FS_BUCKET,
            filename: `${Date.now()}.${ext}`,
        };
    },
});

router.post("/file/:mobile", verifyToken, function (req, res) {
    const mobile_number = req.params.mobile;

    var upload = multer({
        storage: storage,
        fileFilter: function (req, file, callback) {
            let ext = file.originalname.split(".")[1]
            if (ext !== 'png' && ext !== 'jpg' && ext !== 'jpeg') {
                return callback(new Error('Only images are allowed'))
            }
            callback(null, true)
        }
    }).array('file');

    upload(req, res, function (err) {
        if (err) {
            return res.send("Error uploading file. " + err.message);
        }
        let files = req.files;
        // console.log(files);
        files = files.map(file => {
            return {
                imgId: file.id,
                imgUrl: `${process.env.DOMAIN}/user/file/${file.id}`,
            }
        });
        User.findOne({ mobile_number: mobile_number }, function (err, user) {
            if (!err)
                if (user) {
                    const gridfsbucket = new mongoose.mongo.GridFSBucket(
                        mongoose.connection.db, {
                        chunkSizeBytes: 1024,
                        bucketName: process.env.GRID_FS_BUCKET
                    });
                    let imgUrl = user.imgUrl;
                    if (imgUrl) {
                        imgUrl.forEach((data) => {
                            gridfsbucket.delete(ObjectId(data.imgId));
                        });
                    }
                    User.updateOne({ mobile_number: mobile_number },
                        { $set: { imgUrl: files } }, function (err, user) {
                            if (!err)
                                return res.send("Done")
                        })
                } else return res.send("No user found with this mobile number " + mobile_number)
        });

    });
});

router.get("/file/:id", async function (req, res) {
    const id = req.params.id;

    const gridfsbucket = new mongoose.mongo.GridFSBucket(
        mongoose.connection.db, {
        chunkSizeBytes: 1024,
        bucketName: process.env.GRID_FS_BUCKET
    });

    try {
        const stream = gridfsbucket.openDownloadStream(ObjectId(id));
        stream.on('error', function (err) {
            res.send("" + err)
        });
        stream.pipe(res);
    } catch (e) {

        res.send("" + e)
    }


});

router.post('/', verifyToken, upload.none(), function (req, res) {
    const { name, email, mobile_number } = req.body;

    const { isValid, msg } = validateInput({ name, email, mobile_number });

    if (isValid) {

        User.findOne({ mobile_number: mobile_number }, (err, user) => {
            if (!user) {
                const user = new User({
                    name, email, mobile_number,
                    timeStamp: new Date(Date.now()), imgUrl: [],
                });
                user.save(function (err, user) {
                    if (!err) {
                        res.send("User Added Successfully")
                    }
                })
                // console.log(file);
                // const stream = fs.createReadStream(file.path);
                // storage.fromStream(stream, req, file)
                //     .then(() => {
                //         console.log(req.file);
                //         res.send('File uploaded')
                //     })
                //     .catch(() => res.status(500).send('error'));

            } else res.send(`User already Exists with this mobile number ${mobile_number}`);
        })
    } else res.send(msg)
});

router.get("/", verifyToken, function (req, res) {
    User.find({}, function (err, users) {
        res.send(users)
    })
})

router.get("/:mobile", verifyToken, function (req, res) {
    const mobile_number = req.params.mobile;
    User.findOne({ mobile_number: mobile_number }, function (err, user) {
        if (user)
            res.send(user);
        else
            res.send("No User exists with this mobile number " + mobile_number);
    })
})

router.delete("/:mobile", verifyToken, upload.none(), function (req, res) {
    const mobile_number = req.params.mobile;

    if (mobile_number) {
        User.findOne({ mobile_number: mobile_number }, function (err, user) {
            if (!err)
                if (user) {
                    const gridfsbucket = new mongoose.mongo.GridFSBucket(
                        mongoose.connection.db, {
                        chunkSizeBytes: 1024,
                        bucketName: process.env.GRID_FS_BUCKET
                    });
                    let imgUrl = user.imgUrl;
                    if (imgUrl) {
                        imgUrl.forEach((data) => {
                            gridfsbucket.delete(ObjectId(data.imgId));
                        });
                    }
                    User.deleteOne({ mobile_number: mobile_number }, function (err, result) {
                        res.send(`Account linked with this mobile number ${mobile_number} is Deleted`);
                    });
                } else return res.send("No user found with this mobile number " + mobile_number)
        });
    } else res.send("Please provide a Mobile Number")
})

router.patch('/:mobile', verifyToken, upload.none(), function (req, res) {
    const mobile_number = req.params.mobile;
    const body = req.body;

    const { isValid, msg } = validateInputPatch(body)

    if (isValid) {
        User.findOne({ mobile_number: mobile_number }, function (err, user) {
            if (!err) {
                if (user) {
                    let query = { $set: {} };
                    for (let key in body) {
                        if (user[key] && user[key] !== body[key])
                            query.$set[key] = body[key];
                    }
                    User.updateOne({ mobile_number: mobile_number }, query, function (err, result) {
                        if (!err) res.send("User Details Updated");
                    });
                } else res.send("No User Exist with Mobile Number: " + mobile_number);
            }
        });
    } else res.send(msg)
});


module.exports = router;