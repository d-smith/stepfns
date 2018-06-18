class MySpecificError extends Error {
    constructor(...args) {
        super(...args)
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}


module.exports.hello = (event, context, callback) => {

    console.log(`call context: ${JSON.stringify(context)}`);

    if(Math.random() > 0.2) {
        console.log('Random error - invoke callback with error');
        const error = new MySpecificError("no bueno");
        callback(error);
        return;
    }

    console.log("all ok");
    callback(null, "Hello");
};