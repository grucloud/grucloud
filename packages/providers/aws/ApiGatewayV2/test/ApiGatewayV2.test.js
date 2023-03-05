const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("ApiGatewayV2", async function () {
  it("Api", () =>
    pipe([
      () => ({
        groupType: "ApiGatewayV2::Api",
        livesNotFound: ({ config }) => [{ ApiId: "12345" }],
      }),
      awsResourceTest,
    ])());
  it("ApiMapping", () =>
    pipe([
      () => ({
        groupType: "ApiGatewayV2::ApiMapping",
        livesNotFound: ({ config }) => [
          { ApiMappingId: "12345", DomainName: "12345" },
        ],
      }),
      awsResourceTest,
    ])());
  it("Authorizer", () =>
    pipe([
      () => ({
        groupType: "ApiGatewayV2::Authorizer",
        livesNotFound: ({ config }) => [
          { ApiId: "12345", AuthorizerId: "12345" },
        ],
      }),
      awsResourceTest,
    ])());
  it("Deployment", () =>
    pipe([
      () => ({
        groupType: "ApiGatewayV2::Deployment",
        livesNotFound: ({ config }) => [
          { ApiId: "12345", DeploymentId: "12345" },
        ],
      }),
      awsResourceTest,
    ])());
  it("DomainName", () =>
    pipe([
      () => ({
        groupType: "ApiGatewayV2::DomainName",
        livesNotFound: ({ config }) => [{ DomainName: "12345" }],
      }),
      awsResourceTest,
    ])());
  it("Integration", () =>
    pipe([
      () => ({
        groupType: "ApiGatewayV2::Integration",
        livesNotFound: ({ config }) => [
          { ApiId: "12345", IntegrationId: "i123445" },
        ],
      }),
      awsResourceTest,
    ])());
  it("IntegrationResponse", () =>
    pipe([
      () => ({
        groupType: "ApiGatewayV2::IntegrationResponse",
        livesNotFound: ({ config }) => [
          {
            ApiId: "12345",
            IntegrationId: "i123445",
            IntegrationResponseId: "ir123445",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Route", () =>
    pipe([
      () => ({
        groupType: "ApiGatewayV2::Route",
        livesNotFound: ({ config }) => [{ ApiId: "12345", RouteId: "12345" }],
      }),
      awsResourceTest,
    ])());
  it("RouteResponse", () =>
    pipe([
      () => ({
        groupType: "ApiGatewayV2::RouteResponse",
        livesNotFound: ({ config }) => [
          { ApiId: "12345", RouteId: "12345", RouteResponseId: "rs123" },
        ],
      }),
      awsResourceTest,
    ])());
  it("Stage", () =>
    pipe([
      () => ({
        groupType: "ApiGatewayV2::Stage",
        livesNotFound: ({ config }) => [{ ApiId: "12345", StageName: "12345" }],
      }),
      awsResourceTest,
    ])());
  it("VpcLink", () =>
    pipe([
      () => ({
        groupType: "ApiGatewayV2::VpcLink",
        livesNotFound: ({ config }) => [{ VpcLinkId: "12345" }],
      }),
      awsResourceTest,
    ])());
});
