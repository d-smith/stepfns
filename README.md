# stepfns - some simple step function patterns

1. simpleflow - the canonical hello world step function sample packaged
as inline code and step function spec within a cloud formation template. 
Essentially the example from the amazon doc except with a constrained 
resource on the step function service policy.

2. simplesls - the canonical hello world step function, implemented using
the [serverless framework](https://serverless.com/) and a plugin, integrated
into the serverless toolset and workflow.

3. moresteps - shows the use of a multistep process, including how
to pass data between steps, and how to instantiate a downstream process.

4. s3-for-process-data - Early version of this pattern, which is more fully fleshout out in [this project](https://github.com/d-smith/sfs3)

5. lambda-orchestration - Entry lambda via POST, which calls other lambas to do the work. Allows comparison with step functions in terms of overhead.

6. lo-s3-kinesis - All lambda, make process input durable in s3 at start, write results for each step to an event stream.

7. simple-retry - Use step function retry logic to handle a specific error condition. Make sure to think about idempotency wrt retry before you adopt this pattern.
