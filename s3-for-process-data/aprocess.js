const AWS = require('aws-sdk');
const S3 = new AWS.S3();

module.exports.stepA = async (event, context, callback) => {
    console.log(`event: ${JSON.stringify(event)})`);

    let key = event['processData'];
    console.log(`process data via key ${key}`);

    let params = {
        Bucket: process.env.BUCKET_NAME,
        Key: key
    };

    let s3response = await S3.getObject(params).promise();
    console.log(s3response);

    let input = s3response['Body'].toString();
    console.log(`input: ${input}`);

    //Make process data available to the next downstream process
    callback(null, event);
}