const assert = require("assert");
const { pipe, tap, assign, get } = require("rubico");
const { omitIfEmpty } = require("@grucloud/core/Common");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "resourceArn",
  TagsKey: "tags",
  UnTagsKey: "tagKeys",
});

exports.assignTags = ({ endpoint, buildArn }) =>
  pipe([
    assign({
      tags: pipe([
        buildArn,
        (resourceArn) => ({ resourceArn }),
        endpoint().listTagsForResource,
        get("tags"),
      ]),
    }),
    omitIfEmpty(["tags"]),
  ]);

exports.ignoreErrorCodes = ["ResourceNotFoundException"];

exports.LogGroupNameManagedByOther = [
  "/aws/amazonmq/broker/",
  "/aws/codebuild/",
  "/aws/APIGW",
  "API-Gateway-Execution-Logs",
  "/aws/batch/job",
  "/aws/apigateway/",
  "/aws/lambda/",
  "/aws/ecs/",
  "/aws-glue/jobs/",
  "/ecs/",
  "/aws/rds/",
  "RDSOSMetrics",
  "/aws/apprunner",
  "/aws/cloudhsm/",
  "/aws/transfer/",
  "/aws/vendedlogs/RUMService",
];
