# stepfns - some simple step function patterns

1. simpleflow - the canonical hello world step function sample packaged
as inline code and step function spec within a cloud formation template. 
Essentially the example from the amazon doc except with a constrainted 
resource on the step function service policy.

2. simplesls - the canonical hello world step function, implemented using
the [serverless framework](https://serverless.com/) and a plugin, integrated
into the serverless toolset and workflow.