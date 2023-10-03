const assert = require("assert");
const { pipe, tap, get, pick, eq, assign, omit, map, or } = require("rubico");
const { defaultsDeep, callProp, when, isIn } = require("rubico/x");
const yaml = require("js-yaml");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags } = require("../AwsCommon");

const ignoreErrorMessages = ["does not exist"];

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFormation.html

const findName = () =>
  pipe([
    get("StackName"),
    tap((StackName) => {
      assert(StackName);
    }),
  ]);

const findId = () =>
  pipe([
    get("Arn"),
    tap((Arn) => {
      assert(Arn);
    }),
  ]);

const managedByOther = () =>
  pipe([
    get("StackName"),
    or([
      callProp("startsWith", "awsconfigconforms-"),
      callProp("startsWith", "CDK"),
      callProp("startsWith", "Infra-ECS-Cluster"),
    ]),
  ]);

const pickId = pipe([
  pick(["StackName"]),
  tap(({ StackName }) => {
    assert(StackName);
  }),
]);

const assignArn = ({ config }) =>
  pipe([
    tap((params) => {
      assert(config);
    }),
    assign({
      Arn: pipe([
        tap(({ StackId }) => {
          assert(StackId);
        }),
        ({ StackId }) =>
          `arn:${config.partition}:cloudformation:${
            config.region
          }:${config.accountId()}:stack/${StackId}`,
      ]),
    }),
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    assign({
      TemplateBody: pipe([
        pickId,
        endpoint().getTemplate,
        get("TemplateBody"),
        tap((TemplateBody) => {
          assert(TemplateBody);
        }),
        (TemplateBody) => yaml.load(TemplateBody, { schema: yaml.JSON_SCHEMA }),
      ]),
      Resources: pipe([
        pickId,
        endpoint().describeStackResources,
        get("StackResources"),
        map(omit(["StackName", "StackId"])),
      ]),
    }),
    assignArn({ config }),
  ]);

exports.CloudFormationStack = () => ({
  type: "Stack",
  package: "cloudformation",
  client: "CloudFormation",
  propertiesDefault: {},
  omitProperties: [
    "StackId",
    "ChangeSetId",
    "Arn",
    "RoleARN",
    "NotificationARNs",
    "CreationTime",
    "DeletionTime",
    "LastUpdatedTime",
    "StackStatus",
  ],
  inferName: findName,
  findName,
  findId,
  ignoreErrorCodes: ["ResourceNotFoundException"],
  managedByOther,
  cannotBeDeleted: managedByOther,
  dependencies: {
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("RoleARN")]),
    },
    snsTopics: {
      type: "Topic",
      group: "SNS",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("NotificationARNs")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFormation.html#getStack-property
  getById: {
    pickId,
    method: "describeStacks",
    getField: "Stacks",
    ignoreErrorMessages,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFormation.html#listStacks-property
  getList: {
    method: "describeStacks",
    getParam: "Stacks",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFormation.html#createStack-property
  create: {
    method: "createStack",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([get("StackStatus"), isIn(["CREATE_COMPLETE"])]),
    isInstanceError: pipe([
      get("StackStatus"),
      isIn(["CREATE_FAILED", "ROLLBACK_FAILED"]),
    ]),
    getErrorMessage: pipe([get("StackStatusReason", "FAILED")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFormation.html#updateStack-property
  update: {
    method: "updateStack",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFormation.html#deleteStack-property
  destroy: {
    pickId,
    method: "deleteStack",
    ignoreErrorMessages,
    isInstanceDown: pipe([get("StackStatus"), isIn(["DELETE_COMPLETE"])]),
    isInstanceError: pipe([eq(get("StackStatus"), "DELETE_FAILED")]),
    getErrorMessage: pipe([get("StackStatusReason", "DELETE_FAILED")]),
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { iamRole, snsTopics },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => iamRole,
        assign({
          RoleARN: () => getField(iamRole, "Arn"),
        })
      ),
      when(
        () => snsTopics,
        assign({
          NotificationARNs: pipe([
            () => snsTopics,
            map((snsTopic) => getField(snsTopic, "Attributes.TopicArn")),
          ]),
        })
      ),
    ])(),
});
