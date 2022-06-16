const assert = require("assert");
const { pipe, tap, get, pick, eq, filter, not } = require("rubico");
const { defaultsDeep, first } = require("rubico/x");
const { buildTags } = require("../AwsCommon");

const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./RAMCommon");

const model = ({ config }) => ({
  package: "ram",
  client: "RAM",
  ignoreErrorCodes: ["UnknownResourceException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html#getResourceShares-property
  getById: {
    method: "getResourceShares",
    getField: "resourceShares",
    pickId: pipe([
      tap((params) => {
        assert(true);
      }),
      tap(({ resourceShareArn }) => {
        assert(resourceShareArn);
      }),
      ({ resourceShareArn, owningAccountId }) => ({
        resourceShareArns: [resourceShareArn],
        resourceOwner: "SELF",
      }),
    ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html#getResourceShares-property
  getList: {
    extraParam: { resourceOwner: "SELF" },
    method: "getResourceShares",
    getParam: "resourceShares",
    transformListPre: () => pipe([filter(not(eq(get("status"), "DELETED")))]),
    decorate: ({ endpoint }) =>
      pipe([
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html#listResourceShareIpAddresses-property
        tap((params) => {
          assert(true);
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html#createResourceShare-property
  create: {
    method: "createResourceShare",
    pickCreated: ({ payload }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        get("resourceShare"),
      ]),
    isInstanceUp: pipe([eq(get("status"), "ACTIVE")]),
    //isInstanceError: pipe([eq(get("Status"), "ACTION_NEEDED")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html#updateResourceShare-property
  update: {
    method: "updateResourceShare",
    //TODO
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html#deleteResourceShare-property
  destroy: {
    method: "deleteResourceShare",
    pickId: pipe([pick(["resourceShareArn"])]),
    isInstanceDown: pipe([eq(get("status"), "DELETED")]),
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html
exports.RAMResourceShare = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.name")]),
    findId: pipe([get("live.resourceShareArn")]),
    getByName: ({ getList, endpoint }) =>
      pipe([
        ({ name }) => ({
          name,
          resourceShareStatus: "ACTIVE",
          resourceOwner: "SELF",
        }),
        endpoint().getResourceShares,
        get("resourceShares"),
        //TODO
        // getList,
        first,
      ]),
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { tags, ...otherProps },
      dependencies: {},
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          name: name,
          tags: buildTags({
            name,
            config,
            namespace,
            userTags: tags,
            key: "key",
            value: "value",
          }),
        }),
      ])(),
  });
