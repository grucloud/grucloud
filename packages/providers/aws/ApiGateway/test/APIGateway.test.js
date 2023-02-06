const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("APIGateway", async function () {
  it("ApiKey", () =>
    pipe([
      () => ({
        groupType: "APIGateway::ApiKey",
        livesNotFound: ({ config }) => [
          {
            id: `12345`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Authorizer", () =>
    pipe([
      () => ({
        groupType: "APIGateway::Authorizer",
        livesNotFound: ({ config }) => [
          {
            restApiId: "12345",
            id: "12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("APIGatewayClientCertificate", () =>
    pipe([
      () => ({
        groupType: "APIGateway::ClientCertificate",
        livesNotFound: ({ config }) => [
          {
            clientCertificateId: `12345abcd`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("RestApi", () =>
    pipe([
      () => ({
        groupType: "APIGateway::RestApi",
        livesNotFound: ({ config }) => [
          {
            id: "12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Stage", () =>
    pipe([
      () => ({
        groupType: "APIGateway::Stage",
        livesNotFound: ({ config }) => [
          {
            restApiId: "12345",
            stageName: "12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("UsagePlan", () =>
    pipe([
      () => ({
        groupType: "APIGateway::UsagePlan",
        livesNotFound: ({ config }) => [
          {
            id: "12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("UsagePlanKey", () =>
    pipe([
      () => ({
        groupType: "APIGateway::UsagePlanKey",
        livesNotFound: ({ config }) => [
          {
            keyId: "12345",
            usagePlanId: "123",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
