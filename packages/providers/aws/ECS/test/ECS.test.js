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
            taskDefinitionArn: `arn:aws:ecs:eu-west-2:${config.accountId()}:task-definition/not-exist:1`,
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
            clusterArn: `arn:aws:ecs:eu-west-2:${config.accountId()}:cluster/not-existing`,
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
            clusterArn: `arn:aws:ecs:eu-west-2:${config.accountId()}:cluster/not-existing`,
            taskArn: `arn:aws:ecs:eu-west-2:${config.accountId()}:task/demo/ee0e3ce2ad9a49ce90e6a257303c1773`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  // TODO
  // it("TaskSet", () =>
  //   pipe([
  //     () => ({
  //       groupType: "ECS::TaskSet",
  //       livesNotFound: ({ config }) => [{}],
  //     }),
  //     awsResourceTest,
  //   ])());
});
