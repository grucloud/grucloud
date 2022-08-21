const assert = require("assert");
const { pipe, tap, get, tryCatch } = require("rubico");

const { pathCreate } = require("../AzClient");

assert(process.env.AZURE_SUBSCRIPTION_ID);

const apiVersion = "2022-01-01";

describe("AzClient", function () {
  before(async function () {});
  it("pathCreate VirtualNetworkGatewayConnections_CreateOrUpdate", async function () {
    const methods = {
      get: {
        path: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/connections/{virtualNetworkGatewayConnectionName}",
      },
    };

    const dependencies = {
      resourceGroup: {
        type: "ResourceGroup",
        group: "Resources",
        name: "rg",
        parent: true,
      },
    };

    assert.equal(
      pathCreate({ methods, apiVersion })({
        dependencies,
        name: "rg::conn",
        payload: {},
      }),
      `/subscriptions/${process.env.AZURE_SUBSCRIPTION_ID}/resourceGroups/rg/providers/Microsoft.Network/connections/conn?api-version=2022-01-01`
    );
  });
  it("pathCreate VirtualNetworkGatewayConnections_SetSharedKey", async function () {
    const methods = {
      get: {
        path: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/connections/{virtualNetworkGatewayConnectionName}/sharedkey",
      },
    };

    const dependencies = {
      resourceGroup: {
        type: "ResourceGroup",
        group: "Resources",
        name: "rg",
        parent: true,
      },
      virtualNetworkGatewayConnection: {
        type: "VirtualNetworkGatewayConnection",
        group: "Network",
        name: "conn",
        parent: true,
      },
    };

    assert.equal(
      pathCreate({ methods, apiVersion })({
        dependencies,
        name: "rg::conn",
        payload: {},
      }),
      `/subscriptions/${process.env.AZURE_SUBSCRIPTION_ID}/resourceGroups/rg/providers/Microsoft.Network/connections/conn/sharedkey?api-version=2022-01-01`
    );
  });
});
