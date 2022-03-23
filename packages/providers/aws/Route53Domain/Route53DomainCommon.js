const { createEndpoint } = require("../AwsCommon");

exports.createRoute53Domains = createEndpoint(
  "route-53-domains",
  "Route53Domains"
);
