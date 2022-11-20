const assert = require("assert");
const {
  pipe,
  tap,
  map,
  pick,
  omit,
  assign,
  get,
  fork,
  not,
  eq,
} = require("rubico");
const { defaultsDeep, when, callProp } = require("rubico/x");
const { compare, omitIfEmpty, shellRun } = require("@grucloud/core/Common");
const { deepPick } = require("@grucloud/core/deepPick");

const logger = require("@grucloud/core/logger")({ prefix: "ContainerService" });

const group = "ContainerService";

const kubeConfigUpdate = ({ id, name }) =>
  pipe([
    tap(() => {
      assert(name);
      assert(id);
    }),
    tap.if(
      () => !process.env.CONTINUOUS_INTEGRATION,
      pipe([
        () => id,
        callProp("split", "/"),
        fork({
          resourceGroup: (ids) => ids[4],
        }),
        ({ resourceGroup }) =>
          `az aks get-credentials --resource-group ${resourceGroup} --name ${name} --overwrite-existing`,
        shellRun,
      ])
    ),
  ])();

const kubeConfigRemove = ({ name }) =>
  pipe([
    tap(() => {
      assert(name);
      logger.debug(`kubeConfigRemove: ${name}`);
    }),
    tap.if(
      () => !process.env.CONTINUOUS_INTEGRATION && name,
      pipe([
        () =>
          `kubectl config delete-context ${name}; kubectl config delete-cluster ${name}`,
        shellRun,
      ])
    ),
  ])();

const assignContainerProp = assign({
  agentPoolProfiles: pipe([
    get("agentPoolProfiles"),
    map(pipe([omit(["provisioningState", "powerState", "nodeImageVersion"])])),
  ]),
  addonProfiles: pipe([
    get("addonProfiles"),
    when(
      get("ingressApplicationGateway"),
      assign({
        ingressApplicationGateway: pipe([
          get("ingressApplicationGateway"),
          pick(["enabled", "config"]),
          assign({
            config: pipe([
              get("config"),
              pick(["applicationGatewayName", "subnetCIDR"]),
            ]),
          }),
        ]),
      })
    ),
    when(
      get("httpApplicationRouting"),
      assign({
        httpApplicationRouting: pipe([
          get("httpApplicationRouting"),
          pick(["enabled"]),
        ]),
      })
    ),
    //TODO check
    when(
      get("azureKeyvaultSecretsProvider"),
      assign({
        ingressApplicationGateway: pipe([
          get("azureKeyvaultSecretsProvider"),
          omit(["identity"]),
        ]),
      })
    ),
  ]),
  networkProfile: pipe([
    get("networkProfile"),
    omit(["podCidrs", "serviceCidrs", "ipFamilies"]),
    assign({
      loadBalancerProfile: pipe([
        get("loadBalancerProfile"),
        pick(["managedOutboundIPs"]),
      ]),
    }),
  ]),
});

exports.fnSpecs = ({ config }) =>
  pipe([
    () => [
      {
        type: "AgentPool",
        ignoreResource: () => () => true,
        cannotBeDeleted: () => () => true,
      },
      {
        type: "ManagedCluster",
        environmentVariables: [], //TODO windows stuff
        dependencies: {
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
            name: "resourceGroupName",
            parent: true,
          },
          managedIdentities: {
            type: "UserAssignedIdentity",
            group: "ManagedIdentity",
            createOnly: true,
            list: true,
          },
          diskEncryptionSet: {
            type: "DiskEncryptionSet",
            group: "Compute",
            createOnly: true,
            pathId: "properties.diskEncryptionSetID",
          },
          routes: {
            type: "Route",
            group: "Network",
            list: true,
          },
        },
        propertiesDefault: {
          properties: {
            maxAgentPools: 100,
          },
        },
        create: { postCreate: () => kubeConfigUpdate },
        destroy: { postDestroy: () => kubeConfigRemove },
        omitPropertiesExtra: [
          "properties.identityProfile",
          "properties.nodeResourceGroup",
        ],
      },
    ],
    map(defaultsDeep({ group })),
  ])();
