const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { isOurMinion, compareAws } = require("../AwsCommon");
const { CodeBuildProject } = require("./CodeBuildProject");

const GROUP = "CodeBuild";

const compareCodeBuild = compareAws({ tagsKey: "tags" });

module.exports = pipe([
  () => [
    {
      type: "Project",
      Client: CodeBuildProject,
      inferName: pipe([get("properties.name")]),
      dependencies: {
        serviceRole: { type: "Role", group: "IAM" },
        vpc: { type: "Vpc", group: "EC2" },
        subnets: { type: "Subnet", group: "EC2", list: true },
        securityGroups: { type: "SecurityGroup", group: "EC2", list: true },
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
          gitSubmodulesConfig: {
            fetchSubmodules: false,
          },
          insecureSsl: false,
          reportBuildStatus: false,
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
      compare: compareCodeBuild({}),
    })
  ),
]);
