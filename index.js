const express = require('express');
const fs = require("fs");
const { getRecords } = require('./controllers');
const { readExcelFile } = require('./excel');
const multer = require('multer');

const app = express();
const storage = multer.diskStorage({
    destination: async function (req, file, callback) {
      callback(null, "uploads/");
    },
    filename: function (req, file, callback) {
      callback(null, file.originalname);
    },
  });
  
 const upload = multer({ storage });

app.post('/', async (req, res, next) => {
    try {
        res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
        let { filePath, filename } = await getRecords();
        res.status(200).download(filePath, filename, (err) => {
            if (err) throw err;

            fs.unlink(filePath, (err) => {
                if (err) throw err;
            });
        })


    }
    catch (err) {
        next({
            code: 500,
            message: err,
        });
    }
})

app.post('/get_data',upload.array('files'), async (req, res, next) => {
    try {
        let data = await readExcelFile({filePath:req.files[0]?.path});
        res.status(200).send({
            data:data
        })
    }
    catch (err) {
        console.warn(err)
        next({
            code: 500,
            message: err,
        });
    }
})

app.listen(7000, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log('app running')
})

// const buffer = new Buffer.from("vishwas")
// console.log(buffer.toString("base64"))
// console.log(buffer)
