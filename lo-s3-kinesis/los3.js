const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const Lambda =new AWS.Lambda();

const FlakeIdGen = require('flake-idgen')
    , intformat = require('biguint-format')
    , generator = new FlakeIdGen;

const callStep = async (functionName, txnId) => {
    let payload = {
        txnId: txnId
    };

    let params = {
        FunctionName: functionName,
        InvocationType: "RequestResponse",
        Payload: JSON.stringify(payload)
    }

    let response = await Lambda.invoke(params).promise();
    return response;
}

module.exports.startProcess = async (event, context, callback) => {
    console.log(`event: ${JSON.stringify(event)}`);
    console.log(`context: ${JSON.stringify(context)}`);

    // Generate a txnId to correlate the data 
    let txnId = intformat(generator.next(), 'hex',{prefix:'0x'});
    console.log(`txnId: ${txnId}`);

    //Make the input durable
    let params = {
        Body: event['body'],
        Key: txnId,
        ServerSideEncryption: "AES256",
        Bucket: process.env.BUCKET_NAME
    };

    try {
        let response = await S3.putObject(params).promise();
        console.log(response);
    } catch(theError) {
        console.log(JSON.stringify(theError));
        callback(null, {statusCode: 500, body: 'Error capturing process input'});
    }

    //Process
    let a = await callStep(process.env.STEPA_NAME, txnId);
    let b = await callStep(process.env.STEPB_NAME, txnId);
    let c = await callStep(process.env.STEPC_NAME, txnId);
    let d = await callStep(process.env.STEPD_NAME, txnId);
    let e = await callStep(process.env.STEPE_NAME, txnId);
    let f = await callStep(process.env.STEPF_NAME, txnId);

    processOut = {}
    processOut['step-a'] = a;
    processOut['step-b'] = b;
    processOut['step-c'] = c;
    processOut['step-d'] = d;
    processOut['step-e'] = e;
    processOut['step-f'] = f;


    callback(null, {statusCode: 200, body: JSON.stringify(processOut)});
}

module.exports.stepA = async (event, context, callback) => {
    let result = {
        status: 'ok',
        details: 'nothing to share',
        stepAOutput1: 'a1',
        stepAOutput2: false,
        stepAOutput3: 123
    };

    callback(null, result);
}

module.exports.stepB = async (event, context, callback) => {
    let result = {
        property1: 'p1',
        property2: 'p2',
    };

}

module.exports.stepC = async (event, context, callback) => {
    let result = {
        cProperty: 'i like c'
    };

    callback(null, result);
}
    
module.exports.stepD = async (event, context, callback) => {
    callback(null, {d: 'd output'});
}

module.exports.stepE = async (event, context, callback) => {
    callback(null, {e: 'e output'});
}

module.exports.stepF = async (event, context, callback) => {
    callback(null, {f: 'f output'});
}
