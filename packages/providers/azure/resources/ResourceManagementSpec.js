const assert = require("assert");
const { pipe, eq, get, tap, pick, map, filter, not, any } = require("rubico");
const { defaultsDeep, callProp } = require("rubico/x");

const AzClient = require("../AzClient");
const { buildTags } = require("../AzureCommon");

exports.fnSpecs = ({ config }) => {
  const { location } = config;

  const isDefaultResourceGroup = pipe([
    get("live.name"),
    callProp("startsWith", "DefaultResourceGroup"),
  ]);

  return pipe([
    () => [
      {
        // https://docs.microsoft.com/en-us/rest/api/resources/resource-groups
        group: "Resources",
        type: "ResourceGroup",
        dependencies: () => ({}),
        filterLive: () => pipe([pick(["tags"])]),
        ignoreResource: () =>
          pipe([
            tap((params) => {
              assert(params.name);
            }),
            get("name"),
            callProp("startsWith", "DefaultResourceGroup"),
          ]),
        methods: {
          get: {
            path: "/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}",
          },
          delete: {
            path: "/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}",
          },
          getAll: {
            path: `/subscriptions/{subscriptionId}/resourcegroups`,
          },
        },
        apiVersion: "2021-04-01",
        cannotBeDeleted: isDefaultResourceGroup,
        Client: ({ spec }) =>
          AzClient({
            spec,
            config,
            onResponseList: () =>
              pipe([
                get("value", []),
                filter(not(eq(get("name"), "NetworkWatcherRG"))),
              ]),
            isDefault: isDefaultResourceGroup,
            managedByOther: isDefaultResourceGroup,
            cannotBeDeleted: isDefaultResourceGroup,
          }),
      },
    ],
  ])();
};
