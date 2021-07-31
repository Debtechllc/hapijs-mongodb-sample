'use strict';

const AWS = require('aws-sdk');

const {
  AWS_S3_ACCESS_KEY_ID,
  AWS_S3_SECRET_ACCESS_KEY,
  AWS_S3_REGION,
  AWS_S3_BUCKET_NAME
} = process.env;

AWS.config.update({
  accessKeyId: AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: AWS_S3_SECRET_ACCESS_KEY,
  region: AWS_S3_REGION
});

const s3Bucket = new AWS.S3({ params: { Bucket: AWS_S3_BUCKET_NAME } });
const s3Stream = require('s3-upload-stream')(s3Bucket);

class AwsS3 {
  static s3Upload(key, data) {

    return new Promise((resolve, reject) => {

      s3Bucket.putObject({
        Key: key,
        Body: Buffer.from(data),
        ContentEncoding: 'base64',
        ACL: 'public-read'
      }, (err) => {

        if (err) {
          return reject(err);
        }

        return resolve(key);
      });
    });
  }

  static s3UploadStream(key, data) {
    return new Promise((resolve, reject) => {

      const upload = s3Stream.upload({
        Bucket: AWS_S3_BUCKET_NAME,
        Key: key
      });

      upload.on('error', (err) => reject(err));
      upload.on('uploaded', () => resolve(key));

      data.pipe(upload);
    });
  }

  static s3getFileMetadata(key) {

    return new Promise((resolve, reject) => s3Bucket.headObject({ Key: key }, (err, data) => {

      if (err) {
        return reject(err);
      }

      return resolve(data);
    }));
  }

  static s3Download(key) {

    return s3Bucket.getObject({ Key: key }).createReadStream();
  }
}

module.exports = AwsS3;
