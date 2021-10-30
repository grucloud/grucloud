const assert = require("assert");
const { pipe, tap, tryCatch, get, switchCase, pick, map } = require("rubico");
const {
  defaultsDeep,
  isEmpty,
  size,
  first,
  includes,
  callProp,
} = require("rubico/x");

const logger = require("@grucloud/core/logger")({
  prefix: "EC2LaunchConfiguration",
});
const { tos } = require("@grucloud/core/tos");
const { createEndpoint, shouldRetryOnException } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");

const findName = get("live.LaunchConfigurationName");
const findId = get("live.LaunchConfigurationARN");

const pickId = pick(["LaunchConfigurationName"]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html
exports.AutoScalingLaunchConfiguration = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const autoScaling = () =>
    createEndpoint({ endpointName: "AutoScaling" })(config);

  const findDependencies = ({ live, lives }) => [
    {
      type: "KeyPair",
      group: "EC2",
      ids: [live.KeyName],
    },
    {
      type: "SecurityGroup",
      group: "EC2",
      ids: live.SecurityGroups,
    },
    {
      type: "InstanceProfile",
      group: "IAM",
      ids: [
        pipe([
          () => live.IamInstanceProfile,
          switchCase([
            isEmpty,
            () => undefined,
            callProp("startsWith", "arn"),
            pipe([
              () =>
                lives.getById({
                  id: live.IamInstanceProfile,
                  type: "InstanceProfile",
                  group: "IAM",
                  providerName: config.providerName,
                }),
              get("id"),
            ]),
            pipe([
              () =>
                lives.getByName({
                  name: live.IamInstanceProfile,
                  type: "InstanceProfile",
                  group: "IAM",
                  providerName: config.providerName,
                }),
              get("id"),
            ]),
          ]),
        ])(),
      ],
    },
    //TODO
    // {
    //   type: "Image",
    //   group: "EC2",
    //   ids: [live.ImageId],
    // },
  ];

  const findNamespace = pipe([() => ""]);

  const notFound = pipe([
    get("message"),
    includes("Launch configuration name not found"),
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#describeLaunchConfigurations-property
  const describeLaunchConfigurations = pipe([
    tap((params) => {
      assert(true);
    }),
    autoScaling().describeLaunchConfigurations,
    tap((params) => {
      assert(true);
    }),
    get("LaunchConfigurations"),
    tap((launchConfigurations) => {
      logger.debug(
        `describeLaunchConfigurations #launchConfigurations ${size(
          launchConfigurations
        )}`
      );
    }),
  ]);

  const getList = pipe([
    tap((params) => {
      assert(true);
    }),
    () => ({}),
    describeLaunchConfigurations,
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
        () => ({ LaunchConfigurationNames: [name] }),
        describeLaunchConfigurations,
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

  const getById = client.getById({
    pickId: ({ LaunchConfigurationName }) => ({
      LaunchConfigurationNames: [LaunchConfigurationName],
    }),
    method: "describeLaunchConfigurations",
    getField: "LaunchConfigurations",
    ignoreErrorMessages: ["Launch configuration name not found"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#createLaunchConfiguration-property
  const create = client.create({
    method: "createLaunchConfiguration",
    shouldRetryOnException: pipe([
      get("error.message"),
      includes("Invalid IamInstanceProfile:"),
    ]),
    pickId,
    getById,
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#deleteLaunchConfiguration-property
  const destroy = ({ live }) =>
    pipe([
      () => live,
      pick(["LaunchConfigurationName"]),
      tap(({ LaunchConfigurationName }) => {
        assert(LaunchConfigurationName);
      }),
      tryCatch(
        pipe([autoScaling().deleteLaunchConfiguration]),
        (error, params) =>
          pipe([
            tap(() => {
              logger.error(
                `error deleteLaunchConfiguration ${tos({ params, error })}`
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
    dependencies: { instanceProfile, securityGroups = [], keyPair },
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        LaunchConfigurationName: name,
        ...(instanceProfile && {
          IamInstanceProfile: getField(instanceProfile, "InstanceProfileName"),
        }),
        ...(keyPair && { KeyName: keyPair.resource.name }),
        SecurityGroups: pipe([
          () => securityGroups,
          map((securityGroup) => getField(securityGroup, "GroupId")),
        ])(),
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
    getById,
    findName,
    create,
    destroy,
    getList,
    configDefault,
    shouldRetryOnException,
  };
};
