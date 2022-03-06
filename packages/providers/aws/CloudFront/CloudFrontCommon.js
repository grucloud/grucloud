const { CloudFront } = require("@aws-sdk/client-cloudfront");
const { createEndpoint } = require("../AwsCommon");

exports.createCloudFront = createEndpoint(CloudFront);
