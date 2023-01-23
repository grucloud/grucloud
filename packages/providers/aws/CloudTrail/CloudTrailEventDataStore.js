const assert = require("assert");
const { pipe, tap, get, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { buildTags } = require("../AwsCommon");
const { Tagger } = require("./CloudTrailCommon");

const buildArn = () =>
  pipe([
    get("EventDataStoreArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ EventDataStoreArn }) => {
    assert(EventDataStoreArn);
  }),
  ({ EventDataStoreArn }) => ({ EventDataStore: EventDataStoreArn }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudTrail.html
exports.CloudTrailEventDataStore = ({}) => ({
  type: "EventDataStore",
  package: "cloudtrail",
  client: "CloudTrail",
  inferName: () => get("Name"),
  findName: () => get("Name"),
  findId: () => pipe([get("EventDataStoreArn")]),
  ignoreErrorCodes: ["EventDataStoreNotFoundException"],
  omitProperties: [],
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
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ EventDataStoreArn: name }), getById({})]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        TagsList: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
