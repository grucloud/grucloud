const assert = require("assert");
const { pipe, eq, get, tap, map } = require("rubico");
const { defaultsDeep, find } = require("rubico/x");
const { compare } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { findDependenciesResourceGroup, buildTags } = require("../AzureCommon");

exports.fnSpecs = ({ config }) =>
  pipe([
    () => [
      {
        // https://docs.microsoft.com/en-us/rest/api/app/
        type: "ManagedEnvironment",
        isInstanceDown: pipe([
          tap((params) => {
            assert(true);
          }),
          eq(get("properties.provisioningState"), "ScheduledForDelete"),
        ]),
        findDependencies: ({ live, lives }) => [
          findDependenciesResourceGroup({ live, lives, config }),
          {
            type: "Workspace",
            group: "OperationalInsights",
            ids: [
              pipe([
                () => live,
                get(
                  "properties.appLogsConfiguration.logAnalyticsConfiguration.customerId"
                ),
                (customerId) =>
                  pipe([
                    tap((params) => {
                      assert(customerId);
                    }),
                    lives.getByType({
                      providerName: config.providerName,
                      type: "Workspace",
                      group: "OperationalInsights",
                    }),
                    find(eq(get("live.properties.customerId"), customerId)),
                    get("id"),
                  ])(),
              ])(),
            ],
          },
        ],
        configDefault: ({ properties, dependencies: { workspace } }) =>
          pipe([
            tap(() => {
              assert(workspace);
            }),
            () => properties,
            defaultsDeep({
              tags: buildTags(config),
              properties: {
                environmentType: "Managed",
                appLogsConfiguration: {
                  logAnalyticsConfiguration: {
                    customerId: getField(workspace, "properties.customerId"),
                    sharedKey: getField(
                      workspace,
                      "sharedKeys.primarySharedKey"
                    ),
                  },
                },
              },
            }),
            tap((params) => {
              assert(true);
            }),
          ])(),
      },
    ],
    map(defaultsDeep({ group: "App" })),
  ])();
