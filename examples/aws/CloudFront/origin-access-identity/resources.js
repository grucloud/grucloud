// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "OriginAccessControl",
    group: "CloudFront",
    properties: ({}) => ({
      OriginAccessControlConfig: {
        Name: "cloudfront-demo-waf.grucloud.org.s3.us-east-1.amazonaws.com",
        OriginAccessControlOriginType: "s3",
        SigningBehavior: "always",
        SigningProtocol: "sigv4",
      },
    }),
  },
  {
    type: "OriginAccessIdentity",
    group: "CloudFront",
    name: ({ config }) =>
      `access-identity-cloudfront-demo.grucloud.org.s3.${config.region}.amazonaws.com`,
  },
];
