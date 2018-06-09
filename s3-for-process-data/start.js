module.exports.startProcess = (event, context, callback) => {
    console.log(`event: ${JSON.stringify(event)}`);
    console.log(`context: ${JSON.stringify(context)}`);
    console.log(`bucket: ${process.env.BUCKET_NAME}`)
    callback(null, {statusCode: 200, body: "got it"});
}