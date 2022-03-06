const { AppRunner } = require("@aws-sdk/client-apprunner");
const { createEndpoint } = require("../AwsCommon");

exports.createAppRunner = createEndpoint(AppRunner);

exports.ignoreErrorCodes = ["ResourceNotFoundException"];
