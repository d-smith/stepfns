
const AWS = require('aws-sdk');

var proxy = require('proxy-agent');    
AWS.config.update({
    httpOptions: { agent: proxy(process.env.HTTPS_PROXY) }
});

const stepFunctions = new AWS.StepFunctions();

const invokeIt = async (sfnArn) => {

    let input = {
        foo: 'foo val',
        bar: 'bar val'
    };

    let params = {
        stateMachineArn: sfnArn,
        input: JSON.stringify(input)
    }

    let result = await stepFunctions.startExecution(params).promise();
    return result;
}

if(process.argv.length != 3) {
    console.log('provide the step function arn on the command line');
    process.exit(1);
}

function poll(fn, timeout, interval) {
    var endTime = Number(new Date()) + (timeout || 2000);
    interval = interval || 100;

    var checkCondition = async function(resolve, reject) {
        console.log('checkCondition');
        // If the condition is met, we're done!
        var result = await fn();
        if(result) {
            resolve(result);
        }
        // If the condition isn't met but the timeout hasn't elapsed, go again
        else if (Number(new Date()) < endTime) {
            setTimeout(checkCondition, interval, resolve, reject);
        }
        // Didn't match and too much time, reject!
        else {
            reject(new Error('timed out for ' + fn + ': ' + arguments));
        }
    };

    return new Promise(checkCondition);
}

const finishCheckerForArn = (execArn) => {
    return async () => {
        let description = await stepFunctions.describeExecution({executionArn: execArn}).promise();
        let status = description['status'];
        console.log(`status: ${status}`);
        return status !== 'RUNNING';
    }
}

const waitForFinish = async (executionArn) => {
    //let description = await stepFunctions.describeExecution({executionArn: executionArn}).promise();
    //console.log(description);
    checkForFinish = finishCheckerForArn(executionArn);
    let x = await poll(checkForFinish, 30000, 250);
}

const doIt = async (arn) => {
    invokeResults = await invokeIt(arn);

    let executionArn = invokeResults['executionArn'];
    console.log(executionArn);
    waitForFinish(executionArn);
    console.log('done');
}

doIt(process.argv[2]);
