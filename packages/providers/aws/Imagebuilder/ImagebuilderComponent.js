const assert = require("assert");
const { pipe, tap, get, tryCatch } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./ImagebuilderCommon");

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ arn }) => {
    assert(arn);
  }),
  ({ arn }) => ({ componentBuildVersionArn: arn }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    (live) =>
      tryCatch(
        pipe([
          () => ({ componentArn: live.arn }),
          endpoint().getComponentPolicy,
          get("policy"),
          JSON.parse,
          (policy) => ({ ...live, policy }),
        ]),
        () => live
      )(),
  ]);

const putComponentPolicy = ({ endpoint, config }) =>
  pipe([
    ({ arn, policy }) => ({ componentArn: arn, policy }),
    endpoint().putComponentPolicy,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html
exports.ImagebuilderComponent = () => ({
  type: "Component",
  package: "imagebuilder",
  client: "Imagebuilder",
  propertiesDefault: {},
  inferName: () =>
    pipe([
      get("name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  omitProperties: ["owner", "arn", "state", "kmsKeyId", "dateCreated"],
  dependencies: {
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("kmsKeyId"),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html#getComponent-property
  getById: {
    method: "getComponent",
    getField: "component",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html#listComponents-property
  getList: {
    method: "listComponents",
    getParam: "componentVersionList",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html#createComponent-property
  create: {
    method: "createComponent",
    pickCreated: ({ payload }) =>
      pipe([
        ({ componentBuildVersionArn }) => ({ arn: componentBuildVersionArn }),
      ]),
    postCreate:
      ({ endpoint, payload, created }) =>
      (live) =>
        pipe([
          () => payload,
          tap.if(get("policy"), pipe([putComponentPolicy({ endpoint, live })])),
        ])(),
  },
  // No Update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html#deleteComponent-property
  destroy: {
    method: "deleteComponent",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { kmsKey },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
      when(
        () => kmsKey,
        defaultsDeep({
          kmsKeyId: getField(kmsKey, "Arn"),
        })
      ),
    ])(),
});
