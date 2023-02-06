const assert = require("assert");
const { pipe, tap, get, eq, assign } = require("rubico");
const { defaultsDeep, first } = require("rubico/x");

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

const tagsToPayload = ({ Tags, ...other }) => ({
  ...other,
  TagsList: Tags,
});

const decorate = ({ endpoint }) =>
  pipe([
    assign({
      Tags: pipe([
        ({ EventDataStoreArn }) => ({ ResourceIdList: [EventDataStoreArn] }),
        endpoint().listTags,
        get("ResourceTagList"),
        first,
        get("TagsList"),
      ]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudTrail.html
exports.CloudTrailEventDataStore = ({}) => ({
  type: "EventDataStore",
  package: "cloudtrail",
  client: "CloudTrail",
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("EventDataStoreArn"),
      tap((EventDataStoreArn) => {
        assert(EventDataStoreArn);
      }),
    ]),
  ignoreErrorCodes: ["EventDataStoreNotFoundException"],
  omitProperties: ["KmsKeyId"],
  dependencies: {
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("KmsKeyId"),
    },
  },
  getById: {
    method: "getEventDataStore",
    pickId,
    decorate,
  },
  getList: {
    method: "listEventDataStores",
    getParam: "EventDataStores",
    decorate: ({ endpoint, getById }) => pipe([getById]),
  },
  create: {
    filterPayload: tagsToPayload,
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
    dependencies: { kmsKey },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => kmsKey,
        defaultsDeep({
          KmsKeyId: getField(kmsKey, "Arn"),
        })
      ),
    ])(),
});
