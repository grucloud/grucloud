const log = require('SyntheticsLogger');
const synthetics = require('Synthetics');
const syntheticsUploader = require('SyntheticsUploader');
const fs = require('fs');

exports.handler = async (event, context) => {
    const PASS_RESULT = 'PASSED';
    const FAIL_RESULT = 'FAILED';
    const NO_RESULT = 'ERROR';

    let canaryResult = NO_RESULT;
    let canaryError = null;
    let startTime = null;
    let endTime = null;
    let returnValue = null;
    let resetTime = null;
    let setupTime = null;
    let launchTime = null;
    let customerCanaryCompleted = false;
    try {
        // Setting HOME environment variable for fonts
        process.env.HOME = '/opt/fonts';

        let startCanaryLogString = "Start Canary";
        console.log(startCanaryLogString);

        resetTime = new Date();
        await log.reset();
        log.write(startCanaryLogString);

        await synthetics.reset();
        resetTime = new Date().getTime() - resetTime.getTime();

        setupTime = new Date();
        await synthetics.setEventAndContext(event, context);

        await synthetics.beforeCanary();
        setupTime = new Date().getTime() - setupTime.getTime();

        fs.mkdirSync('/tmp/private/synthetics', { recursive: true });

        // Setup for the Lambda extension
        await syntheticsUploader.setUpUploader();
        const s3BucketName = syntheticsUploader.s3UploadLocation.s3Bucket;
        fs.writeFileSync('/tmp/private/synthetics/s3-bucket-name', s3BucketName);
        const s3KeyPrefix = syntheticsUploader.s3UploadLocation.s3Key;
        fs.writeFileSync('/tmp/private/synthetics/s3-key-prefix', s3KeyPrefix);

        launchTime = new Date();
        await synthetics.launch();
        launchTime = new Date().getTime() - launchTime.getTime();

    } catch (ex) {
        startTime = new Date();
        endTime = startTime;
        returnValue = await synthetics.afterCanary(canaryResult, canaryError, startTime, endTime, resetTime, setupTime, launchTime);
        let endCanaryLogString = "End Canary. Result: " + canaryResult;
        console.log(endCanaryLogString);
        log.write(endCanaryLogString);
        return context.fail(returnValue);
    }

    try {
        log.info('Start executing customer steps');

        startTime = new Date(); // Lambdas use UTC time

        let customerCanaryHandler = event.customerCanaryHandlerName;
        let fileName, functionName;
        if (customerCanaryHandler) {
            // Assuming handler format : fileName.functionName
            fileName = customerCanaryHandler.substring(0, customerCanaryHandler.indexOf("."));
            functionName = customerCanaryHandler.substring(customerCanaryHandler.indexOf(".") + 1);
            log.info(`Customer canary entry file name: ${JSON.stringify(fileName)}`);
            log.info(`Customer canary entry function name: ${JSON.stringify(functionName)}`);
        }

        // Call customer's execution handler        
        let customerCanaryFilename = '/opt/nodejs/node_modules/' + fileName;

        log.info(`Calling customer canary: ${customerCanaryFilename}.${functionName}()`);
        let customerCanary = require(customerCanaryFilename);
        let response = await customerCanary[functionName]();
        log.info(`Customer canary response: ${JSON.stringify(response)}`);
        customerCanaryCompleted = true;
        endTime = new Date();
        log.info('Finished executing customer steps');

        // If one or more canary step error occurred, set canary result as failed.
        if (synthetics.getStepErrors() && synthetics.getStepErrors().length) {
            canaryResult = FAIL_RESULT;
        } else if (synthetics.getVisualMonitoringFailureOutsideStep()) {
            // Get visual monitoring error outside steps. Step errors has priority over visual monitoring error.
            canaryResult = FAIL_RESULT;
            canaryError = synthetics.getVisualMonitoringFailureOutsideStep();
        } else {
            canaryResult = PASS_RESULT;
        }
    } catch (error) {
        endTime = new Date();
        canaryResult = FAIL_RESULT;
        canaryError = error;
    }

    returnValue = await synthetics.afterCanary(canaryResult, canaryError, startTime, endTime, resetTime, setupTime, launchTime, customerCanaryCompleted);
    let endCanaryLogString = "End Canary. Result: " + canaryResult;
    console.log(endCanaryLogString);
    log.write(endCanaryLogString);
    await log.deleteLogFile();
    return context.succeed(returnValue);
};
