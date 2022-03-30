const assert = require("assert");
const { pipe, tap, assign, omit, get, eq } = require("rubico");
const { find } = require("rubico/x");

const { createEndpoint } = require("../AwsCommon");

exports.createRDS = createEndpoint("rds", "RDS");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#addTagsToResource-property
exports.tagResource =
  ({ rds }) =>
  ({ id }) =>
    pipe([(Tags) => ({ ResourceName: id, Tags }), rds().addTagsToResource]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#removeTagsFromResource-property
exports.untagResource =
  ({ rds }) =>
  ({ id }) =>
    pipe([
      (TagKeys) => ({ ResourceName: id, TagKeys }),
      rds().removeTagsFromResource,
    ]);

exports.renameTagList = pipe([
  assign({ Tags: get("TagList") }),
  omit(["TagList"]),
]);

exports.findDependenciesSecret = ({
  live,
  lives,
  config,
  secretField,
  rdsUsernameField,
}) => ({
  type: "Secret",
  group: "SecretsManager",
  ids: [
    pipe([
      () =>
        lives.getByType({
          type: "Secret",
          group: "SecretsManager",
          providerName: config.providerName,
        }),
      tap((params) => {
        assert(true);
      }),
      find(eq(get(`live.SecretString.${secretField}`), live[rdsUsernameField])),
      tap((params) => {
        assert(true);
      }),
    ])(),
  ],
});
