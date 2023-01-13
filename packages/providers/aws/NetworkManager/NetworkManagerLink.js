const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { Tagger } = require("./NetworkManagerCommon");

const buildArn = () =>
  pipe([
    get("LinkArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const findId = () => pipe([get("LinkId")]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html
exports.NetworkManagerLink = () => ({
  type: "Link",
  package: "networkmanager",
  client: "NetworkManager",
  ignoreErrorCodes: ["ResourceNotFoundException", "ValidationException"],
  findName: findNameInTagsOrId({ findId }),
  findId,
  pickId: pipe([pick(["LinkArn"])]),
  omitProperties: [
    "GlobalNetworkId",
    "SiteId",
    "CreatedAt",
    "State",
    "LinkArn",
    "LinkId",
  ],
  dependencies: {
    globalNetwork: {
      type: "GlobalNetwork",
      group: "NetworkManager",
      parent: true,
      dependencyId: ({ lives, config }) => get("GlobalNetworkId"),
    },
    site: {
      type: "Site",
      group: "NetworkManager",
      parent: true,
      dependencyId: ({ lives, config }) => get("SiteId"),
    },
  },
  getByName: getByNameCore,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#getLinks-property
  getById: {
    method: "getLinks",
    pickId: pipe([
      ({ GlobalNetworkId, SiteId, LinkId }) => ({
        GlobalNetworkId,
        SiteId,
        LinkIds: [LinkId],
      }),
    ]),
    getField: "Links",
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#createLink-property
  create: {
    method: "createLink",
    pickCreated: ({ payload }) => pipe([get("Link")]),
    isInstanceUp: pipe([eq(get("State"), "AVAILABLE")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#updateLink-property
  update: {
    method: "updateLink",
    filterParams: ({ payload }) =>
      pipe([
        () => payload,
        defaultsDeep(
          pipe([() => live, pick(["LinkId", "SiteId", "GlobalNetworkId"])])()
        ),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#deleteLink-property
  destroy: {
    method: "deleteLink",
    pickId: pipe([pick(["GlobalNetworkId", "SiteId", "LinkId"])]),
  },
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#getLinks-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "GlobalNetwork", group: "NetworkManager" },
          pickKey: pipe([pick(["GlobalNetworkId"])]),
          method: "getLinks",
          getParam: "Links",
          config,
        }),
    ])(),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { globalNetwork, site },
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
      when(
        () => site,
        defaultsDeep({
          SiteId: getField(site, "SiteId"),
        })
      ),
    ])(),
});
