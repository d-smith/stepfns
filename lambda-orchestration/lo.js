const AWS = require('aws-sdk');
const Lambda =new AWS.Lambda();


const callStepA = async () => {
    let params = {
        FunctionName: process.env.STEPA_NAME,
        InvocationType: "RequestResponse"
    }

    let response = await Lambda.invoke(params).promise();
    return response;
}

module.exports.startProcess = async (event, context, callback) => {
    console.log(`event: ${JSON.stringify(event)}`);
    console.log(`context: ${JSON.stringify(context)}`);


    let a = await callStepA();
    console.log(`a: ${a}`);

    callback(null, {statusCode: 200, body: "did it"});
}

module.exports.stepA = async (event, context, callback) => {
    callback(null, "yo");
}