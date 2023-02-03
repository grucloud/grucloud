const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger, ignoreErrorCodes } = require("./Macie2Common");

const buildArn = () =>
  pipe([
    get("jobArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ jobId }) => {
    assert(jobId);
  }),
  pick(["jobId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html
exports.Macie2ClassificationJob = () => ({
  type: "ClassificationJob",
  package: "macie2",
  client: "Macie2",
  propertiesDefault: {},
  omitProperties: [
    "allowListIds",
    "clientToken",
    "createdAt",
    "customDataIdentifierIds",
    "jobId",
    "jobArn",
    "jobStatus",
    "lastRunErrorStatus",
    "lastRunTime",
    "managedDataIdentifierIds",
    "managedDataIdentifierSelector", //TODO
    "userPausedDetails",
  ],
  inferName: () =>
    pipe([
      get("name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("jobId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes,
  dependencies: {
    account: {
      type: "Account",
      group: "Macie2",
      dependencyId: ({ lives, config }) => pipe([() => "default"]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html#getClassificationJob-property
  getById: {
    method: "describeClassificationJob",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html#listClassificationJobs-property
  getList: {
    method: "listClassificationJobs",
    getParam: "items",
    decorate: ({ getById }) => pipe([getById]),
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html#createClassificationJob-property
  create: {
    method: "createClassificationJob",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html#updateClassificationJob-property
  update: {
    method: "updateClassificationJob",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html#deleteClassificationJob-property
  //   destroy: {
  //     method: "deleteClassificationJob",
  //     pickId,
  //   },
  cannotBeDeleted: () => () => true,
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
