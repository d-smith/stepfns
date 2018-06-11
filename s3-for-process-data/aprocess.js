const AWS = require('aws-sdk');
const S3 = new AWS.S3();

const readInputDataString = async (key) => {
    let params = {
        Bucket: process.env.BUCKET_NAME,
        Key: key
    };

    let s3response = await S3.getObject(params).promise();
    console.log(s3response);

    return s3response['Body'].toString();
}

const writeBodyObj = async(key, body) => {
    let putParams = {
        Body: JSON.stringify(body),
        Key: key,
        ServerSideEncryption: "AES256",
        Bucket: process.env.BUCKET_NAME
    };

    s3response = await S3.putObject(putParams).promise();
    console.log(s3response);
}

module.exports.stepA = async (event, context, callback) => {
    console.log(`event: ${JSON.stringify(event)})`);

    let key = event['processData'];
    console.log(`process data via key ${key}`);

    let input = await readInputDataString(key);
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
    writeBodyObj(key, processData);

    //Make process data available to the next downstream process
    callback(null, event);
}

module.exports.stepB = async (event, context, callback) => {
    console.log(`event: ${JSON.stringify(event)})`);

    let key = event['processData'];
    console.log(`process data via key ${key}`);

    //
    // TODO/WARNING - due to the s3 consitency model, we need to test to make sure
    // we are reading the output from the previous step before we proceed! Ignoring
    // this for now... DO NOT REUSE THIS YET!
    //
    let input = await readInputDataString(key);
    console.log(`input: ${input}`);
    let processData = JSON.parse(input);
    
    //Write output to object
    let result = {
        property1: 'p1',
        property2: 'p2',
    };

    processData['step-b-output'] = result;
    writeBodyObj(key, processData);

    //Make process data available to the next downstream process
    callback(null, event);
}