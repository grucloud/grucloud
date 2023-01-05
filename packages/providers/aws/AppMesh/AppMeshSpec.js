const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppMesh.html

const { AppMeshGatewayRoute } = require("./AppMeshGatewayRoute");
const { AppMeshMesh } = require("./AppMeshMesh");
const { AppMeshRoute } = require("./AppMeshRoute");
const { AppMeshVirtualGateway } = require("./AppMeshVirtualGateway");
const { AppMeshVirtualNode } = require("./AppMeshVirtualNode");
const { AppMeshVirtualRouter } = require("./AppMeshVirtualRouter");
const { AppMeshVirtualService } = require("./AppMeshVirtualService");

const GROUP = "AppMesh";
const tagsKey = "tags";

const compare = compareAws({ tagsKey, key: "key" });

module.exports = pipe([
  () => [
    AppMeshGatewayRoute({}),
    AppMeshMesh({}),
    AppMeshRoute({}),
    AppMeshVirtualGateway({}),
    AppMeshVirtualNode({}),
    AppMeshVirtualRouter({}),
    AppMeshVirtualService({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compare({}),
        tagsKey,
      }),
    ])
  ),
]);
