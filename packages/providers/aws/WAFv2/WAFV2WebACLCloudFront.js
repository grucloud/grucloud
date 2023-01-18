const assert = require("assert");
const { pipe, tap, get } = require("rubico");
const { createModelWebAcls } = require("./WAFV2Common");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html
exports.WAFV2WebACLCloudFront = ({ compare }) =>
  createModelWebAcls({
    compare,
    type: "WebACLCloudFront",
    region: "us-east-1",
    Scope: "CLOUDFRONT",
  });
