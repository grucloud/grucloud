const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { Tagger } = require("./NetworkManagerCommon");

const buildArn = () =>
  pipe([
    get("SiteArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const findId = () =>
  pipe([
    get("SiteId"),
    tap((SiteId) => {
      assert(SiteId);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html
exports.NetworkManagerSite = () => ({
  type: "Site",
  package: "networkmanager",
  client: "NetworkManager",
  ignoreErrorCodes: ["ResourceNotFoundException", "ValidationException"],
  findName: findNameInTagsOrId({ findId }),
  findId,
  pickId: pipe([pick(["SiteArn"])]),
  omitProperties: [
    "GlobalNetworkId",
    "SiteId",
    "SiteArn",
    "CreatedAt",
    "State",
  ],
  dependencies: {
    globalNetwork: {
      type: "GlobalNetwork",
      group: "NetworkManager",
      parent: true,
      dependencyId: ({ lives, config }) => get("GlobalNetworkId"),
    },
  },
  getByName: getByNameCore,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#getSites-property
  getById: {
    method: "getSites",
    pickId: pipe([
      ({ GlobalNetworkId, SiteId }) => ({ GlobalNetworkId, SiteIds: [SiteId] }),
    ]),
    getField: "Sites",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#createSite-property
  create: {
    method: "createSite",
    pickCreated: ({ payload }) => pipe([get("Site")]),
    isInstanceUp: pipe([eq(get("State"), "AVAILABLE")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#updateSite-property
  update: {
    method: "updateSite",
    filterParams: ({ payload }) =>
      pipe([
        () => payload,
        defaultsDeep(pipe([() => live, pick(["SiteId", "GlobalNetworkId"])])()),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#deleteSite-property
  destroy: {
    method: "deleteSite",
    pickId: pipe([pick(["GlobalNetworkId", "SiteId"])]),
  },
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#getSites-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "GlobalNetwork", group: "NetworkManager" },
          pickKey: pipe([pick(["GlobalNetworkId"])]),
          method: "getSites",
          getParam: "Sites",
          config,
        }),
    ])(),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { globalNetwork },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(globalNetwork);
      }),
      () => otherProps,
      defaultsDeep({
        GlobalNetworkId: getField(globalNetwork, "GlobalNetworkId"),
        Tags: buildTags({ config, namespace, name, UserTags: Tags }),
      }),
    ])(),
});
