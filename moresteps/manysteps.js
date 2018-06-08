

const getFailureProbFromEnvrionment = (step) => {
    var FailureProb;

    switch(step) {
        case 'a':
            failureProb = parseFloat(process.env.STEP_A_FAILURE_PROB);
            break;
        case 'c':
            failureProb = parseFloat(process.env.STEP_C_FAILURE_PROB);
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

    //Flip a coin to succeed or fail.
    if(Math.random() > stepAFailureProb) {
        aSucceeds(callback, event);
    } else {
        aFails(callback, event);
    } 
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

module.exports.stepB = (event, context, callback) => {
    console.log(`input: ${JSON.stringify(event)}`);
    storeAOutput(event['step-a-output']);    

    //Return the event as output to make the data available downstream
    callback(null, event);
};