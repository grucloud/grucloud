const assert = require("assert");
const { pipe, tap, get, pick, map } = require("rubico");
const { defaultsDeep, when, isIn } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./SageMakerCommon");

const buildArn = () =>
  pipe([
    get("WorkforceArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ WorkforceName }) => {
    assert(WorkforceName);
  }),
  pick(["WorkforceName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html
exports.SageMakerWorkforce = () => ({
  type: "Workforce",
  package: "sagemaker",
  client: "SageMaker",
  propertiesDefault: {},
  omitProperties: [
    "WorkforceArn",
    "CreationTime",
    "LastModifiedTime",
    "FailureReason",
    "WorkforceStatus",
    "SubnetId",
    "SecurityGroups",
    "RoleArn",
    "KmsKeyId",
  ],
  inferName: () =>
    pipe([
      get("WorkforceName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("WorkforceName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("WorkforceName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ValidationException"],
  dependencies: {
    codeRepository: {
      type: "CodeRepository",
      group: "SageMaker",
      dependencyId: ({ lives, config }) => get("DefaultCodeRepository"),
    },
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => get("RoleArn"),
    },
    subnet: {
      type: "Subnet",
      group: "EC2",
      dependencyId: ({ lives, config }) => get("SubnetId"),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("SecurityGroupIds"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#describeWorkforce-property
  getById: {
    method: "describeWorkforce",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#listWorkforces-property
  getList: {
    method: "listWorkforces",
    getParam: "Workforces",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#createWorkforce-property
  create: {
    method: "createWorkforce",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([get("WorkforceStatus"), isIn(["InService"])]),
    isInstanceError: pipe([get("WorkforceStatus"), isIn(["Failed"])]),
    getErrorMessage: pipe([get("FailureReason", "Failed")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#updateWorkforce-property
  update: {
    method: "updateWorkforce",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#deleteWorkforce-property
  destroy: {
    method: "deleteWorkforce",
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
    properties: { Tags, ...otherProps },
    dependencies: { codeRepository, iamRole, kmsKey, subnet, securityGroups },
    config,
  }) =>
    pipe([
      tap((id) => {
        assert(iamRole);
      }),
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        RoleArn: getField(iamRole, "Arn"),
      }),
      when(
        () => codeRepository,
        defaultsDeep({
          DefaultCodeRepository: getField(codeRepository, "CodeRepositoryArn"),
        })
      ),
      when(
        () => kmsKey,
        defaultsDeep({
          KmsKeyId: getField(kmsKey, "Arn"),
        })
      ),
      when(
        () => subnet,
        defaultsDeep({
          SubnetId: getField(subnet, "SubnetId"),
        })
      ),
      when(
        () => securityGroups,
        defaultsDeep({
          SecurityGroupIds: pipe([
            () => securityGroups,
            map((securityGroup) => getField(securityGroup, "GroupId")),
          ])(),
        })
      ),
    ])(),
});
