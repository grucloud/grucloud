const assert = require("assert");
const { pipe, tap, assign, get, tryCatch } = require("rubico");
const { first } = require("rubico/x");

const { createEndpoint } = require("../AwsCommon");
const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "Arn",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

exports.setup = ({ config }) =>
  pipe([
    () => config,
    createEndpoint("mediaconvert", "MediaConvert"),
    (endpoint) =>
      pipe([
        () => ({
          Mode: "DEFAULT",
        }),
        endpoint().describeEndpoints,
        get("Endpoints"),
        first,
        get("Url"),
        tap((url) => {
          assert(url);
        }),
        (endpoint) => ({ endpoint }),
      ])(),
  ])();
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaConvert.html#listTagsForResource-property
exports.assignTags = ({ buildArn, endpoint, endpointConfig }) =>
  pipe([
    tap((params) => {
      assert(endpointConfig);
    }),
    assign({
      Tags: tryCatch(
        pipe([
          buildArn,
          (Arn) => ({ Arn }),
          endpoint(endpointConfig).listTagsForResource,
          get("ResourceTags.Tags"),
        ]),
        (error) =>
          pipe([
            tap((params) => {
              assert(error);
            }),
            () => [],
          ])()
      ),
    }),
  ]);
