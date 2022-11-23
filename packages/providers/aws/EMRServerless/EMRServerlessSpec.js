const assert = require("assert");
const { tap, pipe, map, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");

const { EMRServerlessApplication } = require("./EMRServerlessApplication");

const GROUP = "EMRServerless";
const tagsKey = "tags";
const compare = compareAws({ tagsKey, key: "key" });

module.exports = pipe([
  () => [
    {
      type: "Application",
      Client: EMRServerlessApplication,
      omitProperties: [
        "arn",
        "applicationId",
        "state",
        "stateDetails",
        "createdAt",
        "updatedAt",
      ],
      inferName: () => get("name"),
      propertiesDefault: {
        autoStartConfiguration: {
          enabled: true,
        },
        autoStopConfiguration: {
          enabled: true,
          idleTimeoutMinutes: 15,
        },
        initialCapacity: {
          Driver: {
            workerConfiguration: {
              cpu: "4 vCPU",
              disk: "20 GB",
              memory: "16 GB",
            },
            workerCount: 1,
          },
          Executor: {
            workerConfiguration: {
              cpu: "4 vCPU",
              disk: "20 GB",
              memory: "16 GB",
            },
            workerCount: 2,
          },
        },
        maximumCapacity: {
          cpu: "400 vCPU",
          disk: "20000 GB",
          memory: "3000 GB",
        },
      },
      dependencies: {
        securityGroups: {
          type: "SecurityGroup",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) =>
            get("networkConfiguration.securityGroupIds"),
        },
        subnets: {
          type: "Subnet",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) =>
            get("networkConfiguration.subnetIds"),
        },
      },
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
      tagsKey,
    })
  ),
]);
