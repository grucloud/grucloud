const assert = require("assert");
const { pipe, tap, get, pick, assign, tryCatch } = require("rubico");
const { defaultsDeep, identity, when } = require("rubico/x");

const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./MediaPackageCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ Id }) => {
    assert(Id);
  }),
  pick(["Id"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assign({
      DomainName: tryCatch(
        pipe([get("Url"), (url) => new URL(url).host]),
        () => undefined
      ),
    }),
    omitIfEmpty(["Whitelist", "Url", "DomainName"]),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaPackage.html
exports.MediaPackageOriginEndpoint = () => ({
  type: "OriginEndpoint",
  package: "mediapackage",
  client: "MediaPackage",
  propertiesDefault: {
    ManifestName: "index",
    Origination: "ALLOW",
    StartoverWindowSeconds: 0,
    TimeDelaySeconds: 0,
  },
  omitProperties: [
    "Arn",
    "ChannelId",
    "Authorization",
    "DomainName",
    "Url",
    "CmafPackage.HlsManifests[].Url",
  ],
  inferName: () =>
    pipe([
      get("Id"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Id"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("Arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    channel: {
      type: "Channel",
      group: "MediaPackage",
      dependencyId: ({ lives, config }) => pipe([get("ChannelId")]),
    },
    iamRoleSecret: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        pipe([get("Authorization.SecretsRoleArn")]),
    },
    secretsManagerSecret: {
      type: "Secret",
      group: "SecretsManager",
      dependencyId: ({ lives, config }) =>
        pipe([get("Authorization.CdnIdentifierSecret")]),
    },
  },
  ignoreErrorCodes: ["NotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaPackage.html#getOriginEndpoint-property
  getById: {
    method: "describeOriginEndpoint",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaPackage.html#listOriginEndpoints-property
  getList: {
    method: "listOriginEndpoints",
    getParam: "OriginEndpoints",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaPackage.html#createOriginEndpoint-property
  create: {
    method: "createOriginEndpoint",
    pickCreated: ({ payload }) => pipe([identity]),
    shouldRetryOnExceptionMessages: [
      "The secret could not be accessed using the given role",
    ],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaPackage.html#updateOriginEndpoint-property
  update: {
    method: "updateOriginEndpoint",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaPackage.html#deleteOriginEndpoint-property
  destroy: {
    method: "deleteOriginEndpoint",
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
    properties: { Tags, ...otherProps },
    dependencies: { channel, iamRoleSecret, secretsManagerSecret },
    config,
  }) =>
    pipe([
      () => otherProps,
      tap(() => {
        assert(channel);
        //assert(iamRoleSecret);
        //assert(secretsManagerSecret);
      }),
      defaultsDeep({
        ChannelId: getField(channel, "Id"),
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
      when(
        () => iamRoleSecret,
        defaultsDeep({
          Authorization: {
            SecretsRoleArn: getField(iamRoleSecret, "Arn"),
          },
        })
      ),
      when(
        () => secretsManagerSecret,
        defaultsDeep({
          Authorization: {
            CdnIdentifierSecret: getField(secretsManagerSecret, "ARN"),
          },
        })
      ),
    ])(),
});
