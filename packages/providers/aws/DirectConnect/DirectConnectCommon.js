const assert = require("assert");
const { tap, pipe, gte, get, tryCatch, map } = require("rubico");
const { defaultsDeep, size, when } = require("rubico/x");

const { createEndpoint } = require("../AwsCommon");
const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "resourceArn",
  TagsKey: "tags",
  UnTagsKey: "tagKeys",
});

exports.inferRequestMACSec = pipe([
  when(
    gte(pipe([get("macSecKeys"), size]), 1),
    defaultsDeep({ requestMACSec: true })
  ),
]);

const deleteSecret =
  ({ config }) =>
  ({ secretARN }) =>
    pipe([
      tap(() => {
        assert(config);
        assert(secretARN);
      }),
      () => config,
      createEndpoint("secrets-manager", "SecretsManager"),
      tap((endpoint) => {
        assert(endpoint);
      }),
      (endpoint) =>
        tryCatch(
          pipe([
            () => ({
              SecretId: secretARN,
              //ForceDeleteWithoutRecovery: true,
            }),
            endpoint().deleteSecret,
          ]),
          (error) =>
            pipe([
              tap((params) => {
                assert(error);
              }),
            ])()
        )(),
    ])();

exports.deleteSecret = deleteSecret;

exports.deleteSecrets = ({ config }) =>
  pipe([
    tap((params) => {
      assert(config);
    }),
    get("macSecKeys"),
    map(deleteSecret({ config })),
  ]);
