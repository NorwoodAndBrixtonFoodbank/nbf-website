# Accessing error logs on AWS CloudWatch

Currently errors and warns are logged to AWS CloudWatch.

To access the logs:
1. Navigate to softwire.awsapps.com/start
2. Select Vauxhall Foodbank and SoftwireViewOnlyPlusCloudWatch
3. Ensure that the region is set to Europe(London) eu-west-2
4. Search for CloudWatch in the search bar

There are two methods:

### Access via Log Groups
1. Expand Logs menu on the left side menu
2. Click on Log Groups
3. Select InfrastructureStack-WebsiteServerLogGroup7593293...
4. Scroll down to Log streams
5. Select the environment you expect the error to be logged in (Where did this error happen? Local, Dev or Prod?)
6. Here you can see a list of the logs
7. You can filter by elapsed time at the top

### Access via Logs Insights
This method allows for more specific search
1. Expand Logs menu on the left side menu
2. Click on Logs Insights
3. Select InfrastructureStack-WebsiteServerLogGroup7593293...
4. Run a query with your parameters eg.

```
fields @timestamp, @message, @logStream, @log
| filter @message like /4966b142-66b5-427f-a78e-d4fdf4acf9dc/
```
The query above asks for the fields timestamp, message, logStream, log and to filter the results to message including "4966b142-66b5-427f-a78e-d4fdf4acf9dc" (logId)

Further query syntax can be found here: https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html
