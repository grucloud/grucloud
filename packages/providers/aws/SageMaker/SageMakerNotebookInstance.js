const assert = require("assert");
const { pipe, tap, get, pick, map } = require("rubico");
const { defaultsDeep, when, isIn } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./SageMakerCommon");

const buildArn = () =>
  pipe([
    get("NotebookInstanceArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ NotebookInstanceName }) => {
    assert(NotebookInstanceName);
  }),
  pick(["NotebookInstanceName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html
exports.SageMakerNotebookInstance = () => ({
  type: "NotebookInstance",
  package: "sagemaker",
  client: "SageMaker",
  propertiesDefault: {},
  omitProperties: [
    "NotebookInstanceArn",
    "CreationTime",
    "LastModifiedTime",
    "FailureReason",
    "NotebookInstanceStatus",
    "Url",
    "SubnetId",
    "SecurityGroups",
    "RoleArn",
    "KmsKeyId",
    "NetworkInterfaceId",
    "DefaultCodeRepository",
  ],
  inferName: () =>
    pipe([
      get("NotebookInstanceName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("NotebookInstanceName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("NotebookInstanceArn"),
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
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("KmsKeyId"),
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#describeNotebookInstance-property
  getById: {
    method: "describeNotebookInstance",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#listNotebookInstances-property
  getList: {
    method: "listNotebookInstances",
    getParam: "NotebookInstances",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#createNotebookInstance-property
  create: {
    method: "createNotebookInstance",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([get("NotebookInstanceStatus"), isIn(["InService"])]),
    isInstanceError: pipe([get("NotebookInstanceStatus"), isIn(["Failed"])]),
    getErrorMessage: pipe([get("FailureReason", "Failed")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#updateNotebookInstance-property
  update: {
    method: "updateNotebookInstance",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#deleteNotebookInstance-property
  destroy: {
    method: "deleteNotebookInstance",
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
