const assert = require("assert");
const {
  pipe,
  tap,
  get,
  assign,
  tryCatch,
  switchCase,
  pick,
} = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags, isAwsError, findNameInTagsOrId } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./SecretsManagerCommon");

const ignoreErrorMessages = [
  "You can't perform this operation on the secret because it was marked for deletion",
];

const model = {
  package: "secrets-manager",
  client: "SecretsManager",
  ignoreErrorCodes: ["ResourceNotFoundException", "InvalidRequestException"],
  getById: {
    method: "getSecretValue",
    ignoreErrorMessages,
  },
  getList: {
    method: "listSecrets",
    getParam: "SecretList",
    decorate:
      ({ endpoint, getById }) =>
      (live) =>
        pipe([() => live, getSecretValue({ endpoint }), defaultsDeep(live)])(),
  },
  update: {
    method: "putSecretValue",
    filterParams: ({ payload }) => pipe([() => payload]),
  },
  destroy: {
    method: "deleteSecret",
    ignoreErrorMessages,
  },
};

const getSecretValue = ({ endpoint }) =>
  tryCatch(
    pipe([
      tap(({ Name }) => {
        assert(Name);
        assert(endpoint);
      }),
      ({ Name }) => ({ SecretId: Name }),
      endpoint().getSecretValue,
      pick(["SecretString", "SecretBinary"]),
      when(
        get("SecretString"),
        assign({
          SecretString: tryCatch(
            pipe([get("SecretString"), JSON.parse]),
            (error, input) => input
          ),
        })
      ),
    ]),
    (error) => pipe([() => undefined])()
  );

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecretsManager.html
exports.SecretsManagerSecret = ({ spec, config }) =>
  createAwsResource({
    model,
    spec,
    config,
    findName: findNameInTagsOrId({ findId: get("live.Name") }),
    pickId: pipe([
      tap(({ Name }) => {
        assert(Name);
      }),
      ({ Name }) => ({ SecretId: Name }),
    ]),
    findId: pipe([get("live.ARN")]),
    findDependencies: ({ live }) => [
      { type: "Key", group: "KMS", ids: [live.KmsKeyId] },
    ],
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({ name, namespace, properties: { Tags, ...otherProps } }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Name: name,
          Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        }),
      ])(),
    create:
      ({ endpoint, getById }) =>
      ({ payload }) =>
        tryCatch(
          pipe([
            () => payload,
            when(
              get("SecretString"),
              assign({
                SecretString: pipe([get("SecretString"), JSON.stringify]),
              })
            ),
            endpoint().createSecret,
          ]),
          switchCase([
            isAwsError("InvalidRequestException"),
            pipe([
              () => ({ SecretId: payload.Name }),
              endpoint().restoreSecret,
              ({ Name }) => ({
                SecretId: Name,
              }),
              defaultsDeep(
                pipe([
                  () => payload,
                  pick(["SecretString", "SecretBinary"]),
                  assign({
                    SecretString: pipe([get("SecretString"), JSON.stringify]),
                  }),
                ])()
              ),
              endpoint().putSecretValue,
            ]),
            (error) => {
              throw error;
            },
          ])
        )(),
  });
