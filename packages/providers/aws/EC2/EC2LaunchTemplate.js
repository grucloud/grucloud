const assert = require("assert");
const {
  pipe,
  tap,
  tryCatch,
  get,
  switchCase,
  eq,
  not,
  or,
  pick,
  map,
  omit,
} = require("rubico");
const { defaultsDeep, isEmpty, size, first } = require("rubico/x");

const logger = require("@grucloud/core/logger")({
  prefix: "EC2LaunchTemplate",
});
const { tos } = require("@grucloud/core/tos");
const { retryCall } = require("@grucloud/core/Retry");
const {
  createEndpoint,
  shouldRetryOnException,
  buildTags,
} = require("../AwsCommon");

const EC2Instance = require("./EC2Instance");

const findName = get("live.LaunchTemplateName");
const findId = get("live.LaunchTemplateId");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html

exports.EC2LaunchTemplate = ({ spec, config }) => {
  const ec2 = () => createEndpoint({ endpointName: "EC2" })(config);

  const findDependencies = ({ live, lives }) => [
    {
      type: "KeyPair",
      group: "ec2",
      ids: [live.LaunchTemplateData.KeyName],
    },
    {
      type: "SecurityGroup",
      group: "ec2",
      ids: live.LaunchTemplateData.SecurityGroupIds,
    },
    {
      type: "InstanceProfile",
      group: "iam",
      ids: [live.LaunchTemplateData.IamInstanceProfile.Arn],
    },
  ];

  const findNamespace = pipe([() => ""]);

  const notFound = or([
    eq(get("code"), "InvalidLaunchTemplateId.NotFound"),
    eq(get("code"), "InvalidLaunchTemplateName.NotFoundException"),
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeLaunchTemplates-property
  const describeLaunchTemplates = pipe([
    tap((params) => {
      assert(true);
    }),
    ec2().describeLaunchTemplates,
    tap((params) => {
      assert(true);
    }),
    get("LaunchTemplates"),
    tap((launchTemplates) => {
      logger.debug(
        `describeLaunchTemplates #launchTemplates ${size(launchTemplates)}`
      );
    }),
    map((launchTemplate) =>
      pipe([
        () => launchTemplate,
        ({ LaunchTemplateId }) => ({
          LaunchTemplateId,
          Versions: ["$Latest"],
        }),
        tap((params) => {
          assert(true);
        }),
        ec2().describeLaunchTemplateVersions,
        tap((params) => {
          assert(true);
        }),
        get("LaunchTemplateVersions"),
        first,
        tap((params) => {
          assert(true);
        }),
        defaultsDeep(launchTemplate),
        tap((params) => {
          assert(true);
        }),
      ])()
    ),
  ]);

  const getList = pipe([
    tap((params) => {
      assert(true);
    }),
    () => ({}),
    describeLaunchTemplates,
    tap((params) => {
      assert(true);
    }),
  ]);

  const getByName = ({ name }) =>
    tryCatch(
      pipe([
        tap(() => {
          assert(name);
        }),
        () => ({ LaunchTemplateNames: [name] }),
        describeLaunchTemplates,
        tap((params) => {
          assert(true);
        }),
        first,
      ]),
      switchCase([
        notFound,
        () => undefined,
        (error) => {
          throw error;
        },
      ])
    )();

  const isUpByName = pipe([getByName, not(isEmpty)]);
  const isDownByName = pipe([getByName, isEmpty]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createLaunchTemplate-property
  const create = ({ payload, name, namespace }) =>
    pipe([
      () => payload,
      ec2().createLaunchTemplate,
      // tap(() =>
      //   retryCall({
      //     name: `createCluster isUpByName: ${name}`,
      //     fn: () => isUpByName({ name }),
      //   })
      // ),
    ])();
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteLaunchTemplate-property
  const destroy = ({ live }) =>
    pipe([
      () => live,
      pick(["LaunchTemplateId"]),
      tap(({ LaunchTemplateId }) => {
        assert(LaunchTemplateId);
      }),
      tryCatch(pipe([ec2().deleteLaunchTemplate]), (error, params) =>
        pipe([
          tap(() => {
            logger.error(
              `error deleteLaunchTemplate ${tos({ params, error })}`
            );
          }),
          () => error,
          switchCase([
            notFound,
            () => undefined,
            () => {
              throw error;
            },
          ]),
        ])()
      ),
    ])();

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
        LaunchTemplateData: EC2Instance.configDefault({ config })({
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
    findNamespace,
    findDependencies,
    getByName,
    findName,
    create,
    destroy,
    getList,
    configDefault,
    shouldRetryOnException,
  };
};
