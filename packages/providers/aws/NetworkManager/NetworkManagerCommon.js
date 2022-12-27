const assert = require("assert");
const { tap, pipe, assign, get } = require("rubico");
const { prepend } = require("rubico/x");

const { arnFromId } = require("../AwsCommon");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "ResourceArn",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#tagResource-property
exports.tagResource =
  ({ property }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      (Tags) => ({ ResourceArn: live[property], Tags }),
      endpoint().tagResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#untagResource-property
exports.untagResource =
  ({ property }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      (TagKeys) => ({ ResourceArn: live[property], TagKeys }),
      endpoint().untagResource,
    ]);

// https://docs.aws.amazon.com/service-authorization/latest/reference/list_awsnetworkmanager.html
exports.assignArnAttachment = ({ config }) =>
  assign({
    Arn: pipe([
      get("AttachmentId"),
      prepend("attachment/"),
      arnFromId({ service: "ec2", config }),
    ]),
  });
