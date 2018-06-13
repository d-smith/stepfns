const AWS = require('aws-sdk');
const stepFunctions = new AWS.StepFunctions();

const getFailureProbFromEnvrionment = (step) => {
    let failureProb = 0;

    switch(step) {
        case 'a':
            failureProb = parseFloat(process.env.STEP_A_FAILURE_PROB);
            break;
        case 'c':
            failureProb = parseFloat(process.env.STEP_C_FAILURE_PROB);
            break;
        case 'e1':
            failureProb = parseFloat(process.env.STEP_E1_FAILURE_PROB);
            break;
        case 'e2':
            failureProb = parseFloat(process.env.STEP_E2_FAILURE_PROB);
            break;
        default:
            failureProb = 0;
    }

    if(isNaN(failureProb) || failureProb < 0 || failureProb > 1) {
        failureProb = 0;
    }

    return failureProb;
}

const stepAFailureProb = getFailureProbFromEnvrionment('a');
const stepCFailureProb = getFailureProbFromEnvrionment('c');
const stepE1FailureProb = getFailureProbFromEnvrionment('e1');
const stepE2FailureProb = getFailureProbFromEnvrionment('e2');


const aSucceeds = (callback, event) => {
    let result = {
        status: 'ok',
        details: 'nothing to share',
        stepAOutput1: 'a1',
        stepAOutput2: false,
        stepAOutput3: 123
    };

    event['step-a-output'] = result;
    callback(null, event);
};

const storeAOutput = async (stepAOut) => {
    console.log(`store A output: ${JSON.stringify(stepAOut)}`);
}

const aFails = (callback, event) => {
    function StepAError(message) {
        this.name = 'StepAError';
        this.message = message;
    };
    StepAError.prototype = new Error();

    const error = new StepAError("step a - no bueno");

    callback(error);
};

const cSucceeds = (callback, event) => {
    let result = {
        status: 'ok',
        details: 'nothing to share',
        stepCOutput1: 'this is step c output'
    };

    event['step-c-output'] = result;
    callback(null, event);
};

const cFails = (callback, event) => {
    function StepCError(message) {
        this.name = 'StepCError';
        this.message = message;
    };
    StepCError.prototype = new Error();

    const error = new StepCError("step c failed big-time");
    callback(error);
};

module.exports.stepA = (event, context, callback) => {
    console.log(`input: ${JSON.stringify(event)}`);
    console.log(`context: ${JSON.stringify(context)}`);

    //Flip a coin to succeed or fail.
    if(Math.random() > stepAFailureProb) {
        aSucceeds(callback, event);
    } else {
        aFails(callback, event);
    } 
};

module.exports.stepB = (event, context, callback) => {
    console.log(`input: ${JSON.stringify(event)}`);
    storeAOutput(event['step-a-output']);    

    //Return the event as output to make the data available downstream
    callback(null, event);
};

module.exports.stepC = (event, context, callback) => {
    console.log(`input: ${JSON.stringify(event)}`);

    //Flip a coin to succeed or fail.
    if(Math.random() > stepCFailureProb) {
        cSucceeds(callback, event);
    } else {
        cFails(callback, event);
    }  
};

module.exports.stepD = (event, context, callback) => {
    event['step-d-output'] = {
      computationResult: 123456  
    };

    callback(null, event);
};

const doStepEPart1 = () => {
    if(Math.random() < stepE1FailureProb) {
        throw new Error("part 1 failed");
    }
    return "part 1 output";
}

const doStepEPart2 = () => {
    if(Math.random() < stepE1FailureProb) {
        throw new Error("part 2 failed");
    }
    return "part 2 output";
}

module.exports.stepE = (event, context, callback) => {
    try {
        p1Results = doStepEPart1();
        p2Results = doStepEPart2();
        event['step-e-output'] = {
            part1: p1Results,
            part2: p2Results
        }
        callback(null,event);
    } catch(theError) {
        function StepEError(message) {
            this.name = 'Step E Error';
            this.message = message;
        };
        StepEError.prototype = new Error();
    
        const error = new StepEError(theError.message);
    
        callback(error);
    }
};

const kickOffDownstream = async (downstreamInput) => {
    var params = {
        stateMachineArn: process.env.DOWNSTREAM_ARN,
        input: downstreamInput
    }

    let result = await stepFunctions.startExecution(params).promise();
    return result;
}

module.exports.stepF = async (event, context, callback) => {
    try {
        console.log(`context: ${JSON.stringify(context)}`);
        console.log(`instantiate state machine ${process.env.DOWNSTREAM_ARN}`);
        let result = await kickOffDownstream(JSON.stringify(event));
        console.log(result);
        event['step-f-output'] = {
            downstreamExecutionArn: result['executionArn']
        }
        callback(null, event);
    } catch(theError) {
        function StepEError(message) {
            this.name = 'Step E Error';
            this.message = message;
        };
        StepEError.prototype = new Error();
    
        const error = new StepEError(theError.message);
    
        callback(error);
    }
};



