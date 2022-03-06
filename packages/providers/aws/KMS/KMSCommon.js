const { KMS } = require("@aws-sdk/client-kms");
const { createEndpoint } = require("../AwsCommon");

exports.createKMS = createEndpoint(KMS);
