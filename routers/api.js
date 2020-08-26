const express = require('express')
const AWS = require('aws-sdk');
const { v4: uuid } = require('uuid');

const router = express.Router()
const v1 = express.Router()

const placeCatHandler = require('../handlers/v1/place_categories');
const cuisineHandler = require('../handlers/v1/cuisines');
const paymentHandler = require('../handlers/v1/payments');
const facilityHandler = require('../handlers/v1/facilities');
const covidHandler = require('../handlers/v1/covids');
const placeHandler = require('../handlers/v1/places');

v1.get('/place-categories', placeCatHandler.getAll)
v1.get('/cuisines', cuisineHandler.getAll)
v1.get('/payments', paymentHandler.getAll)
v1.get('/facilities', facilityHandler.getAll)
v1.get('/covid-protocols', covidHandler.getAll)
v1.post('/places', placeHandler.createPlace)
v1.post('/upload', async(req, res) => {

    const {file} = req.files;
    const [name, fileType] = file.name.split('.');
    // res.send(fileType);

    const s3 = new AWS.S3({
        accessKeyId: process.env.S3_ID,
        secretAccessKey: process.env.S3_SECRET
    });

    // Setting up S3 upload parameters
    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: `${uuid()}.${fileType}`, // File name you want to save as in S3
        Body: file.data
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        res.send(`File uploaded successfully. ${data.Location}`);
    });
})

v1.get('/images', async(req, res) => {
    try {
        const s3 = new AWS.S3({
            accessKeyId: process.env.S3_ID,
            secretAccessKey: process.env.S3_SECRET
        });
        
        let o = s3.getObject({
            Bucket: process.env.S3_BUCKET,
            Key: 'daondoawnid.webp'
        }).createReadStream();
        o.pipe(res);    
    } catch (error) {
        res.status(404)
    }
    
})

router.use('/v1', v1);

module.exports = router