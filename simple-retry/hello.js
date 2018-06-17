module.exports.hello = (event, context, callback) => {

    if(Math.random() > 0.2) {
        function MySpecificError(message) {
            this.name = 'MySpecificError';
            this.message = message;
        };
        MySpecificError.prototype = new Error();
    
        const error = new MySpecificError("no bueno");

        callback(error);
        return;
    }

    callback(null, "Hello");
};