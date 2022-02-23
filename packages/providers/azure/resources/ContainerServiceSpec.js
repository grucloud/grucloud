const assert = require("assert");
const shell = require("shelljs");
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
const { compare, omitIfEmpty } = require("@grucloud/core/Common");

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
        (command) =>
          pipe([
            tap((params) => {
              logger.info(`kubeConfigUpdate: command: ${command}`);
            }),
            () =>
              shell.exec(command, {
                silent: true,
              }),
            tap.if(not(eq(get("code"), 0)), (result) => {
              throw {
                message: `command '${command}' failed`,
                ...result,
              };
            }),
          ])(),
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
        (command) =>
          pipe([
            () =>
              shell.exec(command, {
                silent: true,
              }),
            tap.if(not(eq(get("code"), 0)), (result) => {
              logger.error(
                `command '${command}' failed, ${JSON.stringify(
                  result,
                  4,
                  null
                )}`
              );
            }),
          ])(),
      ])
    ),
  ])();

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
        postCreate: () => kubeConfigUpdate,
        postDestroy: () => kubeConfigRemove,
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
                  "windowsProfile",
                  "addonProfiles.httpApplicationRouting.identity",
                  "addonProfiles.httpApplicationRouting.config.HTTPApplicationRoutingZoneName",
                  "addonProfiles.azureKeyvaultSecretsProvider.identity",
                  "diskEncryptionSetID",
                ]),
                omitIfEmpty(["addonProfiles.httpApplicationRouting.config"]),
                assign({
                  agentPoolProfiles: pipe([
                    get("agentPoolProfiles"),
                    map(
                      pipe([
                        omit([
                          "provisioningState",
                          "powerState",
                          "nodeImageVersion",
                        ]),
                      ])
                    ),
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
                      get("azureKeyvaultSecretsProvider"),
                      assign({
                        ingressApplicationGateway: pipe([
                          get("azureKeyvaultSecretsProvider"),
                          omit(["identity"]),
                        ]),
                      })
                    ),
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
              "name",
              ...pickPropertiesCreate,
              "properties.servicePrincipalProfile.clientId",
              "identity.type",
            ]),
            assign({
              properties: pipe([
                get("properties"),
                omit([
                  "identityProfile",
                  "nodeResourceGroup",
                  "windowsProfile", // For now no windows need to add the password as env var
                ]),
                assign({
                  agentPoolProfiles: pipe([
                    get("agentPoolProfiles"),
                    map(pipe([omit(["provisioningState", "powerState"])])),
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
