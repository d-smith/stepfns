
const AWS = require('aws-sdk');
const S3 = new AWS.S3();

const FlakeIdGen = require('flake-idgen')
    , intformat = require('biguint-format')
    , generator = new FlakeIdGen;


module.exports.startProcess = async (event, context, callback) => {
    console.log(`event: ${JSON.stringify(event)}`);
    console.log(`context: ${JSON.stringify(context)}`);
    console.log(`bucket: ${process.env.BUCKET_NAME}`);

    let txnId = intformat(generator.next(), 'hex',{prefix:'0x'});
    console.log(`txnId: ${txnId}`);
    
    let params = {
        Body: event['body'],
        Key: txnId,
        ServerSideEncryption: "AES256",
        Bucket: process.env.BUCKET_NAME
    };

    let response = await S3.putObject(params).promise();
    console.log(response);

    callback(null, {statusCode: 200, body: txnId});
}