
let region = process.env.REGION || 'us-east-1';
let streamName = process.env.STREAM_NAME || "los3-dev-stream";

const READ_SIZE = 25;

console.log(`stream name is ${streamName}`);

var AWS = require('aws-sdk');

var proxy = require('proxy-agent');
    
AWS.config.update({
    httpOptions: { agent: proxy(process.env.HTTPS_PROXY) }
});

var kinesis = new AWS.Kinesis({region: region});

//Note: this getRecords method DOES NOT handle stream resharding!
const getRecords = async (shardItor, limit) => {
    console.log(`get records for shardItor ${shardItor}`);
    const params = {
        ShardIterator: shardItor,
        Limit: limit
    }

    let data  = await kinesis.getRecords(params).promise();

    records = data['Records'];
    console.log(`${records.length} record(s)`);
    for(r of records) {
        console.log(r['Data'].toString());
    }

    const nextItor = data['NextShardIterator'];

    //Do not call get records more than once a second - we'll be conservative
    //and go every 10 seconds
    setTimeout(() => {
        getRecords(nextItor, READ_SIZE);
    }, 10000);

}

const getIterator = async (shard) => {
    const params = {
        ShardId: shard['ShardId'],
        ShardIteratorType: 'TRIM_HORIZON',
        StreamName: streamName
    };

    let itor = await kinesis.getShardIterator(params).promise();

    getRecords(itor['ShardIterator'], READ_SIZE);
}

const getShards = async () => {
    let data = await kinesis.describeStream({StreamName:streamName}).promise();
    //TODO - just grabbing the shards returned by a single
    //call. A more robust app would look at the HasMoreShards flag and
    //keep calling describeStream until all the shards have been obtained.
    const shards = data['StreamDescription']['Shards'];
    return shards;
}

const main = async () => {
    try {
        let shards = await getShards();
        for(shard of shards) {
            console.log(shard);
            getIterator(shard);
        }
    } catch(err) {
        console.log(err);
    }
}

main();