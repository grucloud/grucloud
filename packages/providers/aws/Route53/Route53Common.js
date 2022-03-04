const { callProp } = require("rubico/x");
const { Route53 } = require("@aws-sdk/client-route-53");
const { createEndpoint } = require("../AwsCommon");

exports.createRoute53 = createEndpoint(Route53);

exports.hostedZoneIdToResourceId = callProp("replace", "/hostedzone/", "");
