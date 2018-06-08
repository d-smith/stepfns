
const aSucceeds = (callback, event) => {
    let result = {
        status: 'ok',
        details: 'nothing to share'
    };

    event['step-a-output'] = result;
    callback(null, event);
};



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
    if(Math.random() > 0.5) {
        aSucceeds(callback, event);
    } else {
        aFails(callback, event);
    }

    
};