This variant adds some safety to lambda only orchestration, capturing
process inputs in an s3 bucket, as well as writing data to kinesis
along the way, which could be read and added to the s3 bucket.
