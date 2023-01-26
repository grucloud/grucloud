"use strict";
/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
// eslint-disable-next-line import/no-extraneous-dependencies
const AWS = require("aws-sdk");
/**
 * Creates a log group and doesn't throw if it exists.
 *
 * @param logGroupName the name of the log group to create.
 * @param region to create the log group in
 * @param options CloudWatch API SDK options.
 */
async function createLogGroupSafe(logGroupName, region, options) {
    var _a;
    // If we set the log retention for a lambda, then due to the async nature of
    // Lambda logging there could be a race condition when the same log group is
    // already being created by the lambda execution. This can sometime result in
    // an error "OperationAbortedException: A conflicting operation is currently
    // in progress...Please try again."
    // To avoid an error, we do as requested and try again.
    let retryCount = (options === null || options === void 0 ? void 0 : options.maxRetries) == undefined ? 10 : options.maxRetries;
    const delay = ((_a = options === null || options === void 0 ? void 0 : options.retryOptions) === null || _a === void 0 ? void 0 : _a.base) == undefined ? 10 : options.retryOptions.base;
    do {
        try {
            const cloudwatchlogs = new AWS.CloudWatchLogs({ apiVersion: '2014-03-28', region, ...options });
            await cloudwatchlogs.createLogGroup({ logGroupName }).promise();
            return;
        }
        catch (error) {
            if (error.code === 'ResourceAlreadyExistsException') {
                // The log group is already created by the lambda execution
                return;
            }
            if (error.code === 'OperationAbortedException') {
                if (retryCount > 0) {
                    retryCount--;
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
                else {
                    // The log group is still being created by another execution but we are out of retries
                    throw new Error('Out of attempts to create a logGroup');
                }
            }
            // Any other error
            console.error(error);
            throw error;
        }
    } while (true); // exit happens on retry count check
}
/**
 * Puts or deletes a retention policy on a log group.
 *
 * @param logGroupName the name of the log group to create
 * @param region the region of the log group
 * @param options CloudWatch API SDK options.
 * @param retentionInDays the number of days to retain the log events in the specified log group.
 */
async function setRetentionPolicy(logGroupName, region, options, retentionInDays) {
    const cloudwatchlogs = new AWS.CloudWatchLogs({ apiVersion: '2014-03-28', region, ...options });
    if (!retentionInDays) {
        await cloudwatchlogs.deleteRetentionPolicy({ logGroupName }).promise();
    }
    else {
        await cloudwatchlogs.putRetentionPolicy({ logGroupName, retentionInDays }).promise();
    }
}
async function handler(event, context) {
    try {
        console.log(JSON.stringify(event));
        // The target log group
        const logGroupName = event.ResourceProperties.LogGroupName;
        // The region of the target log group
        const logGroupRegion = event.ResourceProperties.LogGroupRegion;
        // Parse to AWS SDK retry options
        const retryOptions = parseRetryOptions(event.ResourceProperties.SdkRetry);
        if (event.RequestType === 'Create' || event.RequestType === 'Update') {
            // Act on the target log group
            await createLogGroupSafe(logGroupName, logGroupRegion, retryOptions);
            await setRetentionPolicy(logGroupName, logGroupRegion, retryOptions, parseInt(event.ResourceProperties.RetentionInDays, 10));
            if (event.RequestType === 'Create') {
                // Set a retention policy of 1 day on the logs of this very function.
                // Due to the async nature of the log group creation, the log group for this function might
                // still be not created yet at this point. Therefore we attempt to create it.
                // In case it is being created, createLogGroupSafe will handle the conflic.
                const region = process.env.AWS_REGION;
                await createLogGroupSafe(`/aws/lambda/${context.functionName}`, region, retryOptions);
                // If createLogGroupSafe fails, the log group is not created even after multiple attempts
                // In this case we have nothing to set the retention policy on but an exception will skip
                // the next line.
                await setRetentionPolicy(`/aws/lambda/${context.functionName}`, region, retryOptions, 1);
            }
        }
        await respond('SUCCESS', 'OK', logGroupName);
    }
    catch (e) {
        console.log(e);
        await respond('FAILED', e.message, event.ResourceProperties.LogGroupName);
    }
    function respond(responseStatus, reason, physicalResourceId) {
        const responseBody = JSON.stringify({
            Status: responseStatus,
            Reason: reason,
            PhysicalResourceId: physicalResourceId,
            StackId: event.StackId,
            RequestId: event.RequestId,
            LogicalResourceId: event.LogicalResourceId,
            Data: {
                // Add log group name as part of the response so that it's available via Fn::GetAtt
                LogGroupName: event.ResourceProperties.LogGroupName,
            },
        });
        console.log('Responding', responseBody);
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const parsedUrl = require('url').parse(event.ResponseURL);
        const requestOptions = {
            hostname: parsedUrl.hostname,
            path: parsedUrl.path,
            method: 'PUT',
            headers: { 'content-type': '', 'content-length': responseBody.length },
        };
        return new Promise((resolve, reject) => {
            try {
                // eslint-disable-next-line @typescript-eslint/no-require-imports
                const request = require('https').request(requestOptions, resolve);
                request.on('error', reject);
                request.write(responseBody);
                request.end();
            }
            catch (e) {
                reject(e);
            }
        });
    }
    function parseRetryOptions(rawOptions) {
        const retryOptions = {};
        if (rawOptions) {
            if (rawOptions.maxRetries) {
                retryOptions.maxRetries = parseInt(rawOptions.maxRetries, 10);
            }
            if (rawOptions.base) {
                retryOptions.retryOptions = {
                    base: parseInt(rawOptions.base, 10),
                };
            }
        }
        return retryOptions;
    }
}
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0JBQStCOzs7QUFFL0IsNkRBQTZEO0FBQzdELCtCQUErQjtBQVMvQjs7Ozs7O0dBTUc7QUFDSCxLQUFLLFVBQVUsa0JBQWtCLENBQUMsWUFBb0IsRUFBRSxNQUFlLEVBQUUsT0FBeUI7O0lBQ2hHLDRFQUE0RTtJQUM1RSw0RUFBNEU7SUFDNUUsNkVBQTZFO0lBQzdFLDRFQUE0RTtJQUM1RSxtQ0FBbUM7SUFDbkMsdURBQXVEO0lBQ3ZELElBQUksVUFBVSxHQUFHLENBQUEsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLFVBQVUsS0FBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztJQUM1RSxNQUFNLEtBQUssR0FBRyxPQUFBLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxZQUFZLDBDQUFFLElBQUksS0FBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUM7SUFDeEYsR0FBRztRQUNELElBQUk7WUFDRixNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxHQUFHLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDaEcsTUFBTSxjQUFjLENBQUMsY0FBYyxDQUFDLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNoRSxPQUFPO1NBQ1I7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxnQ0FBZ0MsRUFBRTtnQkFDbkQsMkRBQTJEO2dCQUMzRCxPQUFPO2FBQ1I7WUFDRCxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssMkJBQTJC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QU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDbEUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQzVCLE9BQU8sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQzVCLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQzthQUNmO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1YsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ1g7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxTQUFTLGlCQUFpQixDQUFDLFVBQWU7UUFDeEMsTUFBTSxZQUFZLEdBQW9CLEVBQUUsQ0FBQztRQUN6QyxJQUFJLFVBQVUsRUFBRTtZQUNkLElBQUksVUFBVSxDQUFDLFVBQVUsRUFBRTtnQkFDekIsWUFBWSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQzthQUMvRDtZQUNELElBQUksVUFBVSxDQUFDLElBQUksRUFBRTtnQkFDbkIsWUFBWSxDQUFDLFlBQVksR0FBRztvQkFDMUIsSUFBSSxFQUFFLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQztpQkFDcEMsQ0FBQzthQUNIO1NBQ0Y7UUFDRCxPQUFPLFlBQVksQ0FBQztJQUN0QixDQUFDO0FBQ0gsQ0FBQztBQTNGRCwwQkEyRkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCAqIGFzIEFXUyBmcm9tICdhd3Mtc2RrJztcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCB0eXBlIHsgUmV0cnlEZWxheU9wdGlvbnMgfSBmcm9tICdhd3Mtc2RrL2xpYi9jb25maWctYmFzZSc7XG5cbmludGVyZmFjZSBTZGtSZXRyeU9wdGlvbnMge1xuICBtYXhSZXRyaWVzPzogbnVtYmVyO1xuICByZXRyeU9wdGlvbnM/OiBSZXRyeURlbGF5T3B0aW9ucztcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbG9nIGdyb3VwIGFuZCBkb2Vzbid0IHRocm93IGlmIGl0IGV4aXN0cy5cbiAqXG4gKiBAcGFyYW0gbG9nR3JvdXBOYW1lIHRoZSBuYW1lIG9mIHRoZSBsb2cgZ3JvdXAgdG8gY3JlYXRlLlxuICogQHBhcmFtIHJlZ2lvbiB0byBjcmVhdGUgdGhlIGxvZyBncm91cCBpblxuICogQHBhcmFtIG9wdGlvbnMgQ2xvdWRXYXRjaCBBUEkgU0RLIG9wdGlvbnMuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUxvZ0dyb3VwU2FmZShsb2dHcm91cE5hbWU6IHN0cmluZywgcmVnaW9uPzogc3RyaW5nLCBvcHRpb25zPzogU2RrUmV0cnlPcHRpb25zKSB7XG4gIC8vIElmIHdlIHNldCB0aGUgbG9nIHJldGVudGlvbiBmb3IgYSBsYW1iZGEsIHRoZW4gZHVlIHRvIHRoZSBhc3luYyBuYXR1cmUgb2ZcbiAgLy8gTGFtYmRhIGxvZ2dpbmcgdGhlcmUgY291bGQgYmUgYSByYWNlIGNvbmRpdGlvbiB3aGVuIHRoZSBzYW1lIGxvZyBncm91cCBpc1xuICAvLyBhbHJlYWR5IGJlaW5nIGNyZWF0ZWQgYnkgdGhlIGxhbWJkYSBleGVjdXRpb24uIFRoaXMgY2FuIHNvbWV0aW1lIHJlc3VsdCBpblxuICAvLyBhbiBlcnJvciBcIk9wZXJhdGlvbkFib3J0ZWRFeGNlcHRpb246IEEgY29uZmxpY3Rpbmcgb3BlcmF0aW9uIGlzIGN1cnJlbnRseVxuICAvLyBpbiBwcm9ncmVzcy4uLlBsZWFzZSB0cnkgYWdhaW4uXCJcbiAgLy8gVG8gYXZvaWQgYW4gZXJyb3IsIHdlIGRvIGFzIHJlcXVlc3RlZCBhbmQgdHJ5IGFnYWluLlxuICBsZXQgcmV0cnlDb3VudCA9IG9wdGlvbnM/Lm1heFJldHJpZXMgPT0gdW5kZWZpbmVkID8gMTAgOiBvcHRpb25zLm1heFJldHJpZXM7XG4gIGNvbnN0IGRlbGF5ID0gb3B0aW9ucz8ucmV0cnlPcHRpb25zPy5iYXNlID09IHVuZGVmaW5lZCA/IDEwIDogb3B0aW9ucy5yZXRyeU9wdGlvbnMuYmFzZTtcbiAgZG8ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBjbG91ZHdhdGNobG9ncyA9IG5ldyBBV1MuQ2xvdWRXYXRjaExvZ3MoeyBhcGlWZXJzaW9uOiAnMjAxNC0wMy0yOCcsIHJlZ2lvbiwgLi4ub3B0aW9ucyB9KTtcbiAgICAgIGF3YWl0IGNsb3Vkd2F0Y2hsb2dzLmNyZWF0ZUxvZ0dyb3VwKHsgbG9nR3JvdXBOYW1lIH0pLnByb21pc2UoKTtcbiAgICAgIHJldHVybjtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgaWYgKGVycm9yLmNvZGUgPT09ICdSZXNvdXJjZUFscmVhZHlFeGlzdHNFeGNlcHRpb24nKSB7XG4gICAgICAgIC8vIFRoZSBsb2cgZ3JvdXAgaXMgYWxyZWFkeSBjcmVhdGVkIGJ5IHRoZSBsYW1iZGEgZXhlY3V0aW9uXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChlcnJvci5jb2RlID09PSAnT3BlcmF0aW9uQWJvcnRlZEV4Y2VwdGlvbicpIHtcbiAgICAgICAgaWYgKHJldHJ5Q291bnQgPiAwKSB7XG4gICAgICAgICAgcmV0cnlDb3VudC0tO1xuICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFRoZSBsb2cgZ3JvdXAgaXMgc3RpbGwgYmVpbmcgY3JlYXRlZCBieSBhbm90aGVyIGV4ZWN1dGlvbiBidXQgd2UgYXJlIG91dCBvZiByZXRyaWVzXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdPdXQgb2YgYXR0ZW1wdHMgdG8gY3JlYXRlIGEgbG9nR3JvdXAnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gQW55IG90aGVyIGVycm9yXG4gICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfSB3aGlsZSAodHJ1ZSk7IC8vIGV4aXQgaGFwcGVucyBvbiByZXRyeSBjb3VudCBjaGVja1xufVxuXG4vKipcbiAqIFB1dHMgb3IgZGVsZXRlcyBhIHJldGVudGlvbiBwb2xpY3kgb24gYSBsb2cgZ3JvdXAuXG4gKlxuICogQHBhcmFtIGxvZ0dyb3VwTmFtZSB0aGUgbmFtZSBvZiB0aGUgbG9nIGdyb3VwIHRvIGNyZWF0ZVxuICogQHBhcmFtIHJlZ2lvbiB0aGUgcmVnaW9uIG9mIHRoZSBsb2cgZ3JvdXBcbiAqIEBwYXJhbSBvcHRpb25zIENsb3VkV2F0Y2ggQVBJIFNESyBvcHRpb25zLlxuICogQHBhcmFtIHJldGVudGlvbkluRGF5cyB0aGUgbnVtYmVyIG9mIGRheXMgdG8gcmV0YWluIHRoZSBsb2cgZXZlbnRzIGluIHRoZSBzcGVjaWZpZWQgbG9nIGdyb3VwLlxuICovXG5hc3luYyBmdW5jdGlvbiBzZXRSZXRlbnRpb25Qb2xpY3kobG9nR3JvdXBOYW1lOiBzdHJpbmcsIHJlZ2lvbj86IHN0cmluZywgb3B0aW9ucz86IFNka1JldHJ5T3B0aW9ucywgcmV0ZW50aW9uSW5EYXlzPzogbnVtYmVyKSB7XG4gIGNvbnN0IGNsb3Vkd2F0Y2hsb2dzID0gbmV3IEFXUy5DbG91ZFdhdGNoTG9ncyh7IGFwaVZlcnNpb246ICcyMDE0LTAzLTI4JywgcmVnaW9uLCAuLi5vcHRpb25zIH0pO1xuICBpZiAoIXJldGVudGlvbkluRGF5cykge1xuICAgIGF3YWl0IGNsb3Vkd2F0Y2hsb2dzLmRlbGV0ZVJldGVudGlvblBvbGljeSh7IGxvZ0dyb3VwTmFtZSB9KS5wcm9taXNlKCk7XG4gIH0gZWxzZSB7XG4gICAgYXdhaXQgY2xvdWR3YXRjaGxvZ3MucHV0UmV0ZW50aW9uUG9saWN5KHsgbG9nR3JvdXBOYW1lLCByZXRlbnRpb25JbkRheXMgfSkucHJvbWlzZSgpO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50OiBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZUV2ZW50LCBjb250ZXh0OiBBV1NMYW1iZGEuQ29udGV4dCkge1xuICB0cnkge1xuICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGV2ZW50KSk7XG5cbiAgICAvLyBUaGUgdGFyZ2V0IGxvZyBncm91cFxuICAgIGNvbnN0IGxvZ0dyb3VwTmFtZSA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5Mb2dHcm91cE5hbWU7XG5cbiAgICAvLyBUaGUgcmVnaW9uIG9mIHRoZSB0YXJnZXQgbG9nIGdyb3VwXG4gICAgY29uc3QgbG9nR3JvdXBSZWdpb24gPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuTG9nR3JvdXBSZWdpb247XG5cbiAgICAvLyBQYXJzZSB0byBBV1MgU0RLIHJldHJ5IG9wdGlvbnNcbiAgICBjb25zdCByZXRyeU9wdGlvbnMgPSBwYXJzZVJldHJ5T3B0aW9ucyhldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuU2RrUmV0cnkpO1xuXG4gICAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSAnQ3JlYXRlJyB8fCBldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ1VwZGF0ZScpIHtcbiAgICAgIC8vIEFjdCBvbiB0aGUgdGFyZ2V0IGxvZyBncm91cFxuICAgICAgYXdhaXQgY3JlYXRlTG9nR3JvdXBTYWZlKGxvZ0dyb3VwTmFtZSwgbG9nR3JvdXBSZWdpb24sIHJldHJ5T3B0aW9ucyk7XG4gICAgICBhd2FpdCBzZXRSZXRlbnRpb25Qb2xpY3kobG9nR3JvdXBOYW1lLCBsb2dHcm91cFJlZ2lvbiwgcmV0cnlPcHRpb25zLCBwYXJzZUludChldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuUmV0ZW50aW9uSW5EYXlzLCAxMCkpO1xuXG4gICAgICBpZiAoZXZlbnQuUmVxdWVzdFR5cGUgPT09ICdDcmVhdGUnKSB7XG4gICAgICAgIC8vIFNldCBhIHJldGVudGlvbiBwb2xpY3kgb2YgMSBkYXkgb24gdGhlIGxvZ3Mgb2YgdGhpcyB2ZXJ5IGZ1bmN0aW9uLlxuICAgICAgICAvLyBEdWUgdG8gdGhlIGFzeW5jIG5hdHVyZSBvZiB0aGUgbG9nIGdyb3VwIGNyZWF0aW9uLCB0aGUgbG9nIGdyb3VwIGZvciB0aGlzIGZ1bmN0aW9uIG1pZ2h0XG4gICAgICAgIC8vIHN0aWxsIGJlIG5vdCBjcmVhdGVkIHlldCBhdCB0aGlzIHBvaW50LiBUaGVyZWZvcmUgd2UgYXR0ZW1wdCB0byBjcmVhdGUgaXQuXG4gICAgICAgIC8vIEluIGNhc2UgaXQgaXMgYmVpbmcgY3JlYXRlZCwgY3JlYXRlTG9nR3JvdXBTYWZlIHdpbGwgaGFuZGxlIHRoZSBjb25mbGljLlxuICAgICAgICBjb25zdCByZWdpb24gPSBwcm9jZXNzLmVudi5BV1NfUkVHSU9OO1xuICAgICAgICBhd2FpdCBjcmVhdGVMb2dHcm91cFNhZmUoYC9hd3MvbGFtYmRhLyR7Y29udGV4dC5mdW5jdGlvbk5hbWV9YCwgcmVnaW9uLCByZXRyeU9wdGlvbnMpO1xuICAgICAgICAvLyBJZiBjcmVhdGVMb2dHcm91cFNhZmUgZmFpbHMsIHRoZSBsb2cgZ3JvdXAgaXMgbm90IGNyZWF0ZWQgZXZlbiBhZnRlciBtdWx0aXBsZSBhdHRlbXB0c1xuICAgICAgICAvLyBJbiB0aGlzIGNhc2Ugd2UgaGF2ZSBub3RoaW5nIHRvIHNldCB0aGUgcmV0ZW50aW9uIHBvbGljeSBvbiBidXQgYW4gZXhjZXB0aW9uIHdpbGwgc2tpcFxuICAgICAgICAvLyB0aGUgbmV4dCBsaW5lLlxuICAgICAgICBhd2FpdCBzZXRSZXRlbnRpb25Qb2xpY3koYC9hd3MvbGFtYmRhLyR7Y29udGV4dC5mdW5jdGlvbk5hbWV9YCwgcmVnaW9uLCByZXRyeU9wdGlvbnMsIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGF3YWl0IHJlc3BvbmQoJ1NVQ0NFU1MnLCAnT0snLCBsb2dHcm91cE5hbWUpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5sb2coZSk7XG5cbiAgICBhd2FpdCByZXNwb25kKCdGQUlMRUQnLCBlLm1lc3NhZ2UsIGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5Mb2dHcm91cE5hbWUpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzcG9uZChyZXNwb25zZVN0YXR1czogc3RyaW5nLCByZWFzb246IHN0cmluZywgcGh5c2ljYWxSZXNvdXJjZUlkOiBzdHJpbmcpIHtcbiAgICBjb25zdCByZXNwb25zZUJvZHkgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBTdGF0dXM6IHJlc3BvbnNlU3RhdHVzLFxuICAgICAgUmVhc29uOiByZWFzb24sXG4gICAgICBQaHlzaWNhbFJlc291cmNlSWQ6IHBoeXNpY2FsUmVzb3VyY2VJZCxcbiAgICAgIFN0YWNrSWQ6IGV2ZW50LlN0YWNrSWQsXG4gICAgICBSZXF1ZXN0SWQ6IGV2ZW50LlJlcXVlc3RJZCxcbiAgICAgIExvZ2ljYWxSZXNvdXJjZUlkOiBldmVudC5Mb2dpY2FsUmVzb3VyY2VJZCxcbiAgICAgIERhdGE6IHtcbiAgICAgICAgLy8gQWRkIGxvZyBncm91cCBuYW1lIGFzIHBhcnQgb2YgdGhlIHJlc3BvbnNlIHNvIHRoYXQgaXQncyBhdmFpbGFibGUgdmlhIEZuOjpHZXRBdHRcbiAgICAgICAgTG9nR3JvdXBOYW1lOiBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuTG9nR3JvdXBOYW1lLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnNvbGUubG9nKCdSZXNwb25kaW5nJywgcmVzcG9uc2VCb2R5KTtcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXG4gICAgY29uc3QgcGFyc2VkVXJsID0gcmVxdWlyZSgndXJsJykucGFyc2UoZXZlbnQuUmVzcG9uc2VVUkwpO1xuICAgIGNvbnN0IHJlcXVlc3RPcHRpb25zID0ge1xuICAgICAgaG9zdG5hbWU6IHBhcnNlZFVybC5ob3N0bmFtZSxcbiAgICAgIHBhdGg6IHBhcnNlZFVybC5wYXRoLFxuICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgIGhlYWRlcnM6IHsgJ2NvbnRlbnQtdHlwZSc6ICcnLCAnY29udGVudC1sZW5ndGgnOiByZXNwb25zZUJvZHkubGVuZ3RoIH0sXG4gICAgfTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0c1xuICAgICAgICBjb25zdCByZXF1ZXN0ID0gcmVxdWlyZSgnaHR0cHMnKS5yZXF1ZXN0KHJlcXVlc3RPcHRpb25zLCByZXNvbHZlKTtcbiAgICAgICAgcmVxdWVzdC5vbignZXJyb3InLCByZWplY3QpO1xuICAgICAgICByZXF1ZXN0LndyaXRlKHJlc3BvbnNlQm9keSk7XG4gICAgICAgIHJlcXVlc3QuZW5kKCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJlamVjdChlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlUmV0cnlPcHRpb25zKHJhd09wdGlvbnM6IGFueSk6IFNka1JldHJ5T3B0aW9ucyB7XG4gICAgY29uc3QgcmV0cnlPcHRpb25zOiBTZGtSZXRyeU9wdGlvbnMgPSB7fTtcbiAgICBpZiAocmF3T3B0aW9ucykge1xuICAgICAgaWYgKHJhd09wdGlvbnMubWF4UmV0cmllcykge1xuICAgICAgICByZXRyeU9wdGlvbnMubWF4UmV0cmllcyA9IHBhcnNlSW50KHJhd09wdGlvbnMubWF4UmV0cmllcywgMTApO1xuICAgICAgfVxuICAgICAgaWYgKHJhd09wdGlvbnMuYmFzZSkge1xuICAgICAgICByZXRyeU9wdGlvbnMucmV0cnlPcHRpb25zID0ge1xuICAgICAgICAgIGJhc2U6IHBhcnNlSW50KHJhd09wdGlvbnMuYmFzZSwgMTApLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV0cnlPcHRpb25zO1xuICB9XG59XG4iXX0=