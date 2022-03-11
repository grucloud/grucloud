const assert = require("assert");
const { pipe, tap, get, or, omit, pick, eq } = require("rubico");
const {
  defaultsDeep,
  isEmpty,
  first,
  unless,
  prepend,
  includes,
} = require("rubico/x");

const {
  buildTags,
  findValueInTags,
  findNamespaceInTagsOrEksCluster,
} = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const { createEC2, tagResource, untagResource } = require("./EC2Common");

const EC2Instance = require("./EC2Instance");

const findId = get("live.LaunchTemplateId");
const pickId = pick(["LaunchTemplateId"]);

const findNameEks = pipe([
  tap((params) => {
    assert(true);
  }),
  get("live"),
  findValueInTags({ key: "eks:nodegroup-name" }),
  unless(isEmpty, prepend("lt-")),
]);

const findName = (params) => {
  const fns = [findNameEks, get("live.LaunchTemplateName")];
  for (fn of fns) {
    const name = fn(params);
    if (!isEmpty(name)) {
      return name;
    }
  }
  assert(false, "should have a name");
};
const ignoreErrorCodes = [
  "InvalidLaunchTemplateId.NotFound",
  "InvalidLaunchTemplateName.NotFoundException",
];

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2LaunchTemplate = ({ spec, config }) => {
  const ec2 = createEC2(config);
  const client = AwsClient({ spec, config })(ec2);

  const managedByOther = pipe([
    get("live.CreatedBy"),
    includes("AWSServiceRoleForAmazonEKSNodegroup"),
  ]);

  const findDependencies = ({ live, lives, config }) => [
    {
      type: "KeyPair",
      group: "EC2",
      ids: [
        pipe([
          () => live,
          get("LaunchTemplateData.KeyName"),
          (KeyName) =>
            lives.getByName({
              name: KeyName,
              type: "KeyPair",
              group: "EC2",
              providerName: config.providerName,
            }),
          tap((keyPair) => {
            assert(keyPair);
          }),
          get("id"),
        ])(),
      ],
    },
    {
      type: "SecurityGroup",
      group: "EC2",
      ids: pipe([() => live, get("LaunchTemplateData.SecurityGroupIds")])(),
    },
    {
      type: "InstanceProfile",
      group: "IAM",
      ids: [
        pipe([() => live, get("LaunchTemplateData.IamInstanceProfile.Arn")])(),
        pipe([
          () => live,
          get("LaunchTemplateData.IamInstanceProfile.Name"),
          (name) =>
            lives.getByName({
              name,
              type: "InstanceProfile",
              group: "IAM",
              providerName: config.providerName,
            }),
          get("id"),
        ])(),
      ],
    },
  ];

  const findNamespace = findNamespaceInTagsOrEksCluster({
    config,
    key: "eks:cluster-name",
  });

  const decorate = () => (launchTemplate) =>
    pipe([
      () => launchTemplate,
      tap(({ LaunchTemplateId }) => {
        assert(LaunchTemplateId);
      }),
      ({ LaunchTemplateId }) => ({
        LaunchTemplateId,
        Versions: ["$Latest"],
      }),
      ec2().describeLaunchTemplateVersions,
      get("LaunchTemplateVersions"),
      first,
      omit(["LaunchTemplateData.TagSpecifications"]),
      defaultsDeep(launchTemplate),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeLaunchTemplates-property
  const getList = client.getList({
    method: "describeLaunchTemplates",
    getParam: "LaunchTemplates",
    decorate,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeLaunchTemplates-property
  const getById = client.getById({
    pickId: ({ LaunchTemplateName }) => ({
      LaunchTemplateNames: [LaunchTemplateName],
    }),
    method: "describeLaunchTemplates",
    getField: "LaunchTemplates",
    ignoreErrorCodes,
    decorate,
  });

  const getByName = pipe([
    ({ name }) => ({ LaunchTemplateName: name }),
    getById,
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createLaunchTemplate-property
  const create = client.create({
    method: "createLaunchTemplate",
    config,
    //TODO
    // getById
  });

  // Update https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createLaunchTemplateVersion-property
  //TODO update
  const update = client.update({
    filterParams: ({ payload }) =>
      pipe([() => payload, omit(["TagSpecifications"])])(),
    method: "createLaunchTemplateVersion",
    config,
    //getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteLaunchTemplate-property
  const destroy = client.destroy({
    pickId,
    method: "deleteLaunchTemplate",
    getById,
    ignoreErrorCodes,
    config,
  });

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        LaunchTemplateName: name,
        TagSpecifications: [
          {
            ResourceType: "launch-template",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
      defaultsDeep({
        LaunchTemplateData: EC2Instance.configDefault({
          config,
          includeTags: false,
        })({
          name,
          namespace,
          properties: {},
          dependencies,
        }),
      }),
      tap((params) => {
        assert(true);
      }),
    ])();

  return {
    spec,
    findId,
    managedByOther,
    findNamespace,
    findDependencies,
    getByName,
    findName,
    create,
    update,
    destroy,
    getList,
    configDefault,
    tagResource: tagResource({ ec2 }),
    untagResource: untagResource({ ec2 }),
  };
};
