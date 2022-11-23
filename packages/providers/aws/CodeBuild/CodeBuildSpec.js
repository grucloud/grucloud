const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { isOurMinion, compareAws } = require("../AwsCommon");
const { CodeBuildProject } = require("./CodeBuildProject");

const GROUP = "CodeBuild";

const tagsKey = "tags";

const compareCodeBuild = compareAws({ tagsKey: "Tags" });

module.exports = pipe([
  () => [
    {
      type: "Project",
      Client: CodeBuildProject,
      inferName: () => pipe([get("name")]),
      dependencies: {
        serviceRole: {
          type: "Role",
          group: "IAM",
          dependencyId: ({ lives, config }) => get("serviceRole"),
        },
        vpc: {
          type: "Vpc",
          group: "EC2",
          dependencyId: ({ lives, config }) => get("vpcConfig.vpcId", []),
        },
        subnets: {
          type: "Subnet",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) => get("vpcConfig.subnets", []),
        },
        securityGroups: {
          type: "SecurityGroup",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) =>
            get("vpcConfig.securityGroupIds", []),
        },
      },
      omitProperties: [
        "arn",
        "created",
        "encryptionKey",
        "lastModified",
        "serviceRole",
      ],
      propertiesDefault: {
        badge: {
          badgeEnabled: false,
        },
        cache: {
          type: "NO_CACHE",
        },
        source: {
          gitCloneDepth: 1,
          insecureSsl: false,
        },
        projectVisibility: "PRIVATE",
        queuedTimeoutInMinutes: 480,
        secondaryArtifacts: [],
        secondarySourceVersions: [],
        secondarySources: [],
        timeoutInMinutes: 60,
      },
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      isOurMinion,
      tagsKey,
      compare: compareCodeBuild({}),
    })
  ),
]);
