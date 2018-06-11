# stepfns - some simple step function patterns

1. simpleflow - the canonical hello world step function sample packaged
as inline code and step function spec within a cloud formation template. 
Essentially the example from the amazon doc except with a constrainted 
resource on the step function service policy.

2. simplesls - the canonical hello world step function, implemented using
the [serverless framework](https://serverless.com/) and a plugin, integrated
into the serverless toolset and workflow.

3. moresteps - shows the use of a multistep process, including how
to pass data between steps, and how to instantiate a downstream process.

4. s3-for-process-data - for processes that exceed the data limits for step functions,
and for processes that need to protect data at rest, data can be stored in s3 buckets
that can be configured to encrypt data at rest.

5. lambda-orchestration - Entry lambda via POST, which calls other lambas to do the work. Allows comparison with step functions in terms of overhead.
