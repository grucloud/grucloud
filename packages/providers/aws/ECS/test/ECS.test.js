const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("ECS", async function () {
  it("CapacityProvider", () =>
    pipe([
      () => ({
        groupType: "ECS::CapacityProvider",
        livesNotFound: ({ config }) => [{ name: "12345" }],
      }),
      awsResourceTest,
    ])());
  it("Cluster", () =>
    pipe([
      () => ({
        groupType: "ECS::Cluster",
        livesNotFound: ({ config }) => [{ clusterName: "12345" }],
      }),
      awsResourceTest,
    ])());
  it("TaskDefinition", () =>
    pipe([
      () => ({
        groupType: "ECS::TaskDefinition",
        livesNotFound: ({ config }) => [
          {
            taskDefinitionArn: `arn:aws:ecs:${
              config.region
            }:${config.accountId()}:task-definition/not-exist:1`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Service", () =>
    pipe([
      () => ({
        groupType: "ECS::Service",
        livesNotFound: ({ config }) => [
          {
            clusterArn: `arn:aws:ecs:${
              config.region
            }:${config.accountId()}:cluster/not-existing`,
            serviceName: "12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Task", () =>
    pipe([
      () => ({
        groupType: "ECS::Task",
        livesNotFound: ({ config }) => [
          {
            clusterArn: `arn:aws:ecs:${
              config.region
            }:${config.accountId()}:cluster/not-existing`,
            taskArn: `arn:aws:ecs:${
              config.region
            }:${config.accountId()}:task/demo/ee0e3ce2ad9a49ce90e6a257303c1773`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("TaskSet", () =>
    pipe([
      () => ({
        groupType: "ECS::TaskSet",
        livesNotFound: ({ config }) => [
          {
            cluster: `arn:aws:ecs:${
              config.region
            }:${config.accountId()}:cluster/not-existing`,
            service: `arn:aws:ecs:${
              config.region
            }:${config.accountId()}:service/ee0e3ce2ad9a49ce90e6a257303c1773`,
            taskDefinition: `arn:aws:ecs:${
              config.region
            }:${config.accountId()}:task-definition/demo/ee0e3ce2ad9a49ce90e6a257303c1773`,
            taskSet: `arn:aws:ecs:${
              config.region
            }:${config.accountId()}:task-set/demo/ee0e3ce2ad9a49ce90e6a257303c1773`,
          },
        ],
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
});
