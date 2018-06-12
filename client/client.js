
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

const doIt = async (arn) => {
    invokeResults = await invokeIt(arn);

    executionArn = invokeResults['executionArn'];
    console.log(executionArn);
}

doIt(process.argv[2]);
