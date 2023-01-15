const assert = require("assert");
const { pipe, tap, get, pick, map, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");
const {
  createEC2,
  imageDescriptionFromId,
  fetchImageIdFromDescription,
} = require("../EC2/EC2Common");

const {
  createAutoScaling,
  tagResource,
  untagResource,
} = require("./AutoScalingCommon");

const ignoreErrorMessages = ["Launch configuration name not found"];
const ResourceType = "launch-configuration";

const findName = () => get("LaunchConfigurationName");
const findId = () => get("LaunchConfigurationARN");

const pickId = pipe([pick(["LaunchConfigurationName"])]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(config);
    }),
    assign({
      Image: imageDescriptionFromId({ config }),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html
exports.AutoScalingLaunchConfiguration = ({ spec, config }) => {
  const autoScaling = createAutoScaling(config);
  const ec2 = createEC2(config);

  const client = AwsClient({ spec, config })(autoScaling);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#describeLaunchConfigurations-property
  const getById = client.getById({
    pickId: ({ LaunchConfigurationName }) => ({
      LaunchConfigurationNames: [LaunchConfigurationName],
    }),
    method: "describeLaunchConfigurations",
    getField: "LaunchConfigurations",
    ignoreErrorMessages,
    decorate,
  });

  const getList = client.getList({
    method: "describeLaunchConfigurations",
    getParam: "LaunchConfigurations",
    decorate,
  });

  const getByName = pipe([
    ({ name }) => ({ LaunchConfigurationName: name }),
    getById({}),
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#createLaunchConfiguration-property
  const create = client.create({
    method: "createLaunchConfiguration",
    shouldRetryOnExceptionMessages: ["Invalid IamInstanceProfile:"],
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#deleteLaunchConfiguration-property
  const destroy = client.destroy({
    pickId,
    method: "deleteLaunchConfiguration",
    getById,
    ignoreErrorMessages,
  });

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, Image, ...otherProps },
    dependencies: { instanceProfile, securityGroups = [], keyPair },
    config,
  }) =>
    pipe([
      () => Image,
      fetchImageIdFromDescription({ config }),
      (ImageId) =>
        pipe([
          () => otherProps,
          defaultsDeep({
            ImageId,
            ...(instanceProfile && {
              IamInstanceProfile: getField(
                instanceProfile,
                "InstanceProfileName"
              ),
            }),
            ...(keyPair && { KeyName: keyPair.resource.name }),
            SecurityGroups: pipe([
              () => securityGroups,
              map((securityGroup) => getField(securityGroup, "GroupId")),
            ])(),
          }),
          assign({
            UserData: ({ UserData }) =>
              Buffer.from(UserData, "utf-8").toString("base64"),
          }),
        ])(),
    ])();

  return {
    spec,
    findId,
    getByName,
    getById,
    findName,
    create,
    destroy,
    getList,
    configDefault,
    tagResource: tagResource({
      autoScaling,
      ResourceType,
      property: "LaunchConfigurationName",
    }),
    untagResource: untagResource({
      autoScaling,
      ResourceType,
      property: "LaunchConfigurationName",
    }),
  };
};
