const assert = require("assert");
const { pipe, tap, get, pick, assign, map } = require("rubico");
const {
  defaultsDeep,
  isIn,
  first,
  pluck,
  when,
  identity,
  keys,
  values,
} = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./SSMIncidentsCommon");

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
  pick(["arn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn({ config }), endpoint }),
  ]);

// TODO the createReplicationSet API does not allow to set an explicit name

const findName = () =>
  pipe([
    get("regionMap"),
    keys,
    first,
    tap((name) => {
      assert(name);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSMIncidents.html
exports.SSMIncidentsReplicationSet = () => ({
  type: "ReplicationSet",
  package: "ssm-incidents",
  client: "SSMIncidents",
  propertiesDefault: {},
  omitProperties: [
    "arn",
    "createdBy",
    "createdTime",
    "lastModifiedBy",
    "lastModifiedTime",
    "status",
  ],
  inferName: findName,
  findName,
  findId: () =>
    pipe([
      get("arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException", "ValidationException"],
  dependencies: {
    kmsKeys: {
      type: "Key",
      group: "KMS",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("regionMap"), values, pluck("sseKmsKeyId")]),
    },
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        regionMap: pipe([
          get("regionMap"),
          map(
            when(
              get("sseKmsKeyId"),
              assign({
                sseKmsKeyId: pipe([
                  get("sseKmsKeyId"),
                  replaceWithName({
                    groupType: "KMS::Key",
                    path: "id",
                    providerConfig,
                    lives,
                  }),
                ]),
              })
            )
          ),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSMIncidents.html#getReplicationSet-property
  getById: {
    method: "getReplicationSet",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSMIncidents.html#listReplicationSets-property
  getList: {
    method: "listReplicationSets",
    getParam: "replicationSetArns",
    decorate: ({ getById }) => pipe([(arn) => ({ arn }), getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSMIncidents.html#createReplicationSet-property
  create: {
    method: "createReplicationSet",
    pickCreated: ({ payload }) => pipe([identity]),
    isInstanceUp: pipe([get("status"), isIn(["ACTIVE"])]),
    isInstanceError: pipe([get("status"), isIn(["FAILED"])]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSMIncidents.html#updateReplicationSet-property
  update:
    ({ endpoint, getById }) =>
    async ({ payload, live, diff }) =>
      pipe([
        () => diff,
        // TODO deal with addRegionAction and deleteRegionAction
        //endpoint().updateReplicationSet,
        //
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSMIncidents.html#deleteReplicationSet-property
  destroy: {
    method: "deleteReplicationSet",
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
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
    ])(),
});
