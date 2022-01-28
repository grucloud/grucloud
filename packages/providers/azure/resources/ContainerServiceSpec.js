const assert = require("assert");
const { pipe, tap, map, pick, omit, assign, get } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { compare } = require("@grucloud/core/Common");

const {
  findDependenciesResourceGroup,
  assignDependenciesId,
} = require("../AzureCommon");

const group = "ContainerService";

exports.fnSpecs = ({ config }) =>
  pipe([
    () => [
      {
        type: "AgentPool",
        ignoreResource: () => () => true,
        cannotBeDeleted: () => true,
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
          properties: { maxAgentPools: 100 },
        },
        compare: compare({
          filterAll: pipe([
            tap((params) => {
              assert(true);
            }),
            pick(["properties"]),
            assign({
              properties: pipe([
                get("properties"),
                //TODO
                omit([
                  "networkProfile",
                  "provisioningState",
                  "powerState",
                  "currentKubernetesVersion",
                  "fqdn",
                  "azurePortalFQDN",
                  "identityProfile",
                  "nodeResourceGroup",
                ]),
                assign({
                  agentPoolProfiles: pipe([
                    get("agentPoolProfiles"),
                    map(pipe([omit(["provisioningState", "powerState"])])),
                  ]),
                }),
              ]),
            }),
            tap((params) => {
              assert(true);
            }),
          ]),
        }),
        filterLive: ({ pickPropertiesCreate, lives }) =>
          pipe([
            tap((params) => {
              assert(pickPropertiesCreate);
            }),
            pick([
              ...pickPropertiesCreate,
              "properties.servicePrincipalProfile.clientId",
              "identity.type",
            ]),
            assign({
              properties: pipe([
                get("properties"),
                omit(["identityProfile", "nodeResourceGroup"]),
                assign({
                  agentPoolProfiles: pipe([
                    get("agentPoolProfiles"),
                    map(pipe([omit(["provisioningState", "powerState"])])),
                  ]),
                  addonProfiles: pipe([
                    get("addonProfiles"),
                    when(
                      get("httpApplicationRouting"),
                      assign({
                        httpApplicationRouting: pipe([
                          get("httpApplicationRouting"),
                          when(
                            get("identity"),
                            assign({
                              identity: pipe([
                                get("identity"),
                                pick(["resourceId"]),
                                assignDependenciesId({
                                  group: "ManagedIdentity",
                                  type: "UserAssignedIdentity",
                                  lives,
                                  propertyName: "resourceId",
                                }),
                              ]),
                            })
                          ),
                        ]),
                      })
                    ),
                  ]),
                }),
                assign({
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
                }),
              ]),
            }),
          ]),
      },
    ],
    map(defaultsDeep({ group })),
  ])();
