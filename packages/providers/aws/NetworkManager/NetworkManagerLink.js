const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./NetworkManagerCommon");

const createModel = ({ config }) => ({
  package: "networkmanager",
  client: "NetworkManager",
  region: "us-west-2",
  ignoreErrorCodes: ["ResourceNotFoundException", "ValidationException"],
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
});

const findId = pipe([get("live.LinkId")]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html
exports.NetworkManagerLink = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName: findNameInTagsOrId({ findId }),
    findId,
    pickId: pipe([pick(["LinkArn"])]),
    getByName: getByNameCore,
    tagResource: tagResource({ property: "LinkArn" }),
    untagResource: untagResource({ property: "LinkArn" }),
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
