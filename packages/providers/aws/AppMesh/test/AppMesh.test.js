const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("AppMesh", async function () {
  it.skip("GatewayRoute", () =>
    pipe([
      () => ({
        groupType: "AppMesh::GatewayRoute",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Mesh", () =>
    pipe([
      () => ({
        groupType: "AppMesh::Mesh",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Route", () =>
    pipe([
      () => ({
        groupType: "AppMesh::Route",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("VirtualGateway", () =>
    pipe([
      () => ({
        groupType: "AppMesh::VirtualGateway",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("VirtualNode", () =>
    pipe([
      () => ({
        groupType: "AppMesh::VirtualNode",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("VirtualRouter  ", () =>
    pipe([
      () => ({
        groupType: "AppMesh::VirtualRouter",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("VirtualService", () =>
    pipe([
      () => ({
        groupType: "AppMesh::VirtualService",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
