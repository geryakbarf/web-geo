const AWS = require('aws-sdk');
const { v4: uuid } = require('uuid');

const {S3_ID: accessKeyId, S3_SECRET: secretAccessKey, S3_BUCKET: Bucket} = process.env;
const s3 = new AWS.S3({accessKeyId,secretAccessKey });

const uploadImageS3 = async(req, res) => {
    try {
        const {file} = req.files;
        const [name, fileType] = file.name.split('.');
        const Key = `${uuid()}.${fileType}`;
        const Body = file.data;
        await s3.upload({Bucket, Key, Body}).promise();
        res.json({
            message: "Succesfully to upload image",
            data: {
                path: `/images/${Key}`,
                options: { source: "s3", bucket: Bucket }
            }
        });
    } catch (error) {
        console.error(error);
        res.send("Something wrong.")        
    }
    
}

const getImage = async(req, res) => {
    try {
        let {key: Key} = req.params;
        let params = { Bucket, Key };
        await s3.getObject(params).promise();
        s3.getObject(params).createReadStream().pipe(res);
    } catch (error) {
        console.error(error.message);
        res.status(error.statusCode).send('');
    }
    
}

module.exports = {
    uploadImageS3,
    getImage
}