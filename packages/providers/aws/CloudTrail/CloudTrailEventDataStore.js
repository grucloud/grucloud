const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./CloudTrailCommon");

const model = {
  package: "cloudtrail",
  client: "CloudTrail",
  ignoreErrorCodes: ["EventDataStoreNotFoundException"],
  getById: { method: "getEventDataStore" },
  getList: { method: "listEventDataStores", getParam: "EventDataStores" },
  create: { method: "createEventDataStore" },
  update: { method: "updateEventDataStore" },
  destroy: { method: "deleteEventDataStore" },
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudTrail.html
exports.CloudTrailEventDataStore = ({ spec, config }) =>
  createAwsResource({
    model,
    spec,
    config,
    findName: get("live.Name"),
    findId: pipe([get("live.EventDataStoreArn")]),
    pickId: pipe([
      ({ EventDataStoreArn }) => ({ EventDataStore: EventDataStoreArn }),
    ]),
    //findDependencies: ({ live, lives }) => [],
    decorateList: ({ endpoint, getById }) =>
      pipe([
        tap((params) => {
          assert(getById);
          assert(endpoint);
        }),
        getById,
      ]),
    decorate: ({ endpoint }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
      ]),
    pickCreated: ({ pickId }) =>
      pipe([
        tap((params) => {
          assert(pickId);
        }),
        pickId,
      ]),
    getByName: ({ getById }) =>
      pipe([({ name }) => ({ EventDataStore: name }), getById]),
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({ name, namespace, properties: { Tags, ...otherProps } }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Name: name,
          TagsList: buildTags({ name, config, namespace, UserTags: Tags }),
        }),
      ])(),
  });
