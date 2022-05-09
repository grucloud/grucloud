const assert = require("assert");
const { pipe, tap, get, omit, pick, assign, fork, map } = require("rubico");
const {
  defaultsDeep,
  isEmpty,
  first,
  unless,
  prepend,
  includes,
  when,
  pluck,
  flatten,
} = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const {
  buildTags,
  findValueInTags,
  findNamespaceInTagsOrEksCluster,
  DecodeUserData,
} = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const {
  createEC2,
  tagResource,
  untagResource,
  imageDescriptionFromId,
  fetchImageIdFromDescription,
  assignUserDataToBase64,
} = require("./EC2Common");

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
      type: "Subnet",
      group: "EC2",
      ids: pipe([
        () => live,
        get("LaunchTemplateData.NetworkInterfaces"),
        pluck("SubnetId"),
      ])(),
    },
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
          get("id"),
        ])(),
      ],
    },
    {
      type: "SecurityGroup",
      group: "EC2",
      ids: pipe([
        () => live,
        fork({
          fromMain: get("LaunchTemplateData.SecurityGroupIds"),
          fromInterfaces: pipe([
            get("LaunchTemplateData.NetworkInterfaces"),
            pluck("Groups"),
            flatten,
          ]),
        }),
        ({ fromMain = [], fromInterfaces = [] }) => [
          ...fromMain,
          ...fromInterfaces,
        ],
      ])(),
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

  const decorate =
    ({ endpoint }) =>
    (launchTemplate) =>
      pipe([
        () => launchTemplate,
        tap(({ LaunchTemplateId }) => {
          assert(LaunchTemplateId);
          assert(endpoint);
        }),
        ({ LaunchTemplateId }) => ({
          LaunchTemplateId,
          Versions: ["$Latest"],
        }),
        ec2().describeLaunchTemplateVersions,
        get("LaunchTemplateVersions"),
        first,
        assign({
          LaunchTemplateData: pipe([
            get("LaunchTemplateData"),
            when(
              get("ImageId"),
              assign({ Image: imageDescriptionFromId({ ec2 }) })
            ),
            omit(["TagSpecifications"]),
            DecodeUserData,
          ]),
        }),
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
    filterPayload: pipe([
      assign({
        LaunchTemplateData: pipe([
          get("LaunchTemplateData"),
          assignUserDataToBase64,
        ]),
      }),
    ]),
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

  const configDefaultLaunchTemplateData =
    ({ config, ec2 }) =>
    ({
      name,
      namespace,
      properties: { Image, ...otherProperties },
      dependencies: { keyPair, subnets, securityGroups, iamInstanceProfile },
    }) =>
      pipe([
        tap((params) => {
          assert(ec2);
        }),
        () => Image,
        fetchImageIdFromDescription({ ec2 }),
        (ImageId) =>
          pipe([
            () => otherProperties,
            defaultsDeep({
              ImageId,
            }),
            //Instance Profile
            when(
              () => iamInstanceProfile,
              assign({
                IamInstanceProfile: () => ({
                  Arn: getField(iamInstanceProfile, "Arn"),
                }),
              })
            ),
            // KeyPair
            when(
              () => keyPair,
              assign({
                KeyName: () => keyPair.resource.name,
              })
            ),
            // Security Groups
            when(
              () => securityGroups && !subnets,
              assign({
                SecurityGroupIds: pipe([
                  () => securityGroups,
                  map((sg) => getField(sg, "GroupId")),
                ]),
              })
            ),
          ])(),
      ])();

  const configDefault = async ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies,
  }) =>
    pipe([
      () => ({}),
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
        LaunchTemplateData: await configDefaultLaunchTemplateData({
          config,
          ec2,
        })({
          name,
          namespace,
          properties: otherProps.LaunchTemplateData,
          dependencies,
        }),
      }),
      defaultsDeep(otherProps),
      omit(["LaunchTemplateData.Image"]),
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
    tagResource: tagResource({ endpoint: ec2 }),
    untagResource: untagResource({ endpoint: ec2 }),
  };
};
