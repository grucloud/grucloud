const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("AppMesh", async function () {
  it("GatewayRoute", () =>
    pipe([
      () => ({
        groupType: "AppMesh::GatewayRoute",
        livesNotFound: ({ config }) => [
          {
            meshName: "m123",
            virtualGatewayName: "vg123",
            gatewayRouteName: "gr123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Mesh", () =>
    pipe([
      () => ({
        groupType: "AppMesh::Mesh",
        livesNotFound: ({ config }) => [{ meshName: "m123" }],
      }),
      awsResourceTest,
    ])());
  it("Route", () =>
    pipe([
      () => ({
        groupType: "AppMesh::Route",
        livesNotFound: ({ config }) => [
          {
            meshName: "m123",
            virtualRouterName: "vg123",
            routeName: "gr123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("VirtualGateway", () =>
    pipe([
      () => ({
        groupType: "AppMesh::VirtualGateway",
        livesNotFound: ({ config }) => [
          { meshName: "m123", virtualGatewayName: "vg123" },
        ],
      }),
      awsResourceTest,
    ])());
  it("VirtualNode", () =>
    pipe([
      () => ({
        groupType: "AppMesh::VirtualNode",
        livesNotFound: ({ config }) => [
          { meshName: "m123", virtualNodeName: "vg123" },
        ],
      }),
      awsResourceTest,
    ])());
  it("VirtualRouter", () =>
    pipe([
      () => ({
        groupType: "AppMesh::VirtualRouter",
        livesNotFound: ({ config }) => [
          { meshName: "m123", virtualRouterName: "vg123" },
        ],
      }),
      awsResourceTest,
    ])());
  it("VirtualService", () =>
    pipe([
      () => ({
        groupType: "AppMesh::VirtualService",
        livesNotFound: ({ config }) => [
          { meshName: "m123", virtualServiceName: "vg123" },
        ],
      }),
      awsResourceTest,
    ])());
});
