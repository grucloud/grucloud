const { Route53Domains } = require("@aws-sdk/client-route-53-domains");
const { createEndpoint } = require("../AwsCommon");

exports.createRoute53Domains = createEndpoint(Route53Domains);
