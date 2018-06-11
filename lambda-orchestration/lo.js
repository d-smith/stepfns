const AWS = require('aws-sdk');
const Lambda =new AWS.Lambda();


const callStep = async (functionName) => {
    let params = {
        FunctionName: functionName,
        InvocationType: "RequestResponse"
    }

    let response = await Lambda.invoke(params).promise();
    return response;
}

module.exports.startProcess = async (event, context, callback) => {
    console.log(`event: ${JSON.stringify(event)}`);
    console.log(`context: ${JSON.stringify(context)}`);


    let a = await callStep(process.env.STEPA_NAME);
    let b = await callStep(process.env.STEPB_NAME);
    let c = await callStep(process.env.STEPC_NAME);
    let d = await callStep(process.env.STEPD_NAME);
    let e = await callStep(process.env.STEPE_NAME);
    let f = await callStep(process.env.STEPF_NAME);

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
