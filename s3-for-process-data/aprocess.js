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
    let processData = JSON.parse(input);
    
    //Write output to object
    let result = {
        status: 'ok',
        details: 'nothing to share',
        stepAOutput1: 'a1',
        stepAOutput2: false,
        stepAOutput3: 123
    };

    processData['step-a-output'] = result;

    let putParams = {
        Body: JSON.stringify(processData),
        Key: key,
        ServerSideEncryption: "AES256",
        Bucket: process.env.BUCKET_NAME
    };
    console.log(`putParams: ${JSON.stringify(putParams)}`);

    s3response = await S3.putObject(putParams).promise();
    console.log(s3response);

    //Make process data available to the next downstream process
    callback(null, event);
}