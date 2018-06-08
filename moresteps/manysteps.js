
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

module.exports.stepA = (event, context, callback) => {
    console.log(`input: ${JSON.stringify(event)}`);

    //Flip a coin to succeed or fail.
    if(Math.random() > 0.15) {
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