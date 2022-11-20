const assert = require("assert");
const { pipe, tap, get, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./CloudTrailCommon");

const pickId = pipe([
  tap(({ EventDataStoreArn }) => {
    assert(EventDataStoreArn);
  }),
  ({ EventDataStoreArn }) => ({ EventDataStore: EventDataStoreArn }),
]);

const model = {
  package: "cloudtrail",
  client: "CloudTrail",
  ignoreErrorCodes: ["EventDataStoreNotFoundException"],
  getById: { method: "getEventDataStore", pickId },
  getList: {
    method: "listEventDataStores",
    getParam: "EventDataStores",
    decorate: ({ endpoint, getById }) => pipe([getById]),
  },
  create: {
    method: "createEventDataStore",
    pickCreated: ({ pickId }) => pipe([pickId]),
    isInstanceUp: pipe([eq(get("Status"), "ENABLED")]),
  },
  update: { method: "updateEventDataStore" },
  destroy: { method: "deleteEventDataStore", pickId },
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudTrail.html
exports.CloudTrailEventDataStore = ({ spec, config }) =>
  createAwsResource({
    model,
    spec,
    config,
    findName: () => get("Name"),
    findId: () => pipe([get("EventDataStoreArn")]),
    getByName: ({ getById }) =>
      pipe([({ name }) => ({ EventDataStoreArn: name }), getById({})]),
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({ name, namespace, properties: { Tags, ...otherProps } }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          TagsList: buildTags({ name, config, namespace, UserTags: Tags }),
        }),
      ])(),
  });
