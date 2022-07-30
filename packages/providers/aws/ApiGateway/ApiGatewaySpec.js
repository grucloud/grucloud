const assert = require("assert");
const { pipe, assign, map, tap, omit, pick, get, eq, and } = require("rubico");
const { defaultsDeep, first, find, when, uniq } = require("rubico/x");

const {
  omitIfEmpty,
  replaceWithName,
  flattenObject,
} = require("@grucloud/core/Common");
const {
  isOurMinionObject,
  compareAws,
  replaceAccountAndRegion,
} = require("../AwsCommon");

const { RestApi } = require("./RestApi");
const { Stage } = require("./Stage");
const { Authorizer } = require("./Authorizer");
const { ApiKey } = require("./ApiKey");
const { Account } = require("./Account");
const { UsagePlan } = require("./UsagePlan");
const { UsagePlanKey } = require("./UsagePlanKey");

const GROUP = "APIGateway";
const tagsKey = "tags";
const compareAPIGateway = compareAws({ tagsKey });

module.exports = pipe([
  () => [
    {
      type: "Account",
      Client: Account,
      inferName: () => "default",
      isOurMinion: ({ live, config }) => true,
      omitProperties: ["apiKeyVersion", "throttleSettings"],
      propertiesDefault: {
        features: ["UsagePlans"],
      },
      filterLive: () => pipe([omit(["features", "cloudwatchRoleArn"])]),
      dependencies: {
        cloudwatchRole: {
          type: "Role",
          group: "IAM",
          dependencyId: ({ lives, config }) => get("cloudwatchRoleArn"),
        },
      },
    },
    {
      type: "ApiKey",
      Client: ApiKey,
      inferName: get("properties.name"),
      omitProperties: ["id", "createdDate", "lastUpdatedDate", "stageKeys"],
      propertiesDefault: { enabled: true },
    },
    {
      type: "RestApi",
      Client: RestApi,
      inferName: get("properties.name"),
      omitProperties: ["id", "createdDate", "deployments", "version"],
      propertiesDefault: { disableExecuteApiEndpoint: false },
      compare: compareAPIGateway({
        filterTarget: () => pipe([omit(["deployment"])]),
      }),
      filterLive:
        ({ providerConfig, lives }) =>
        (live) =>
          pipe([
            tap(() => {
              assert(providerConfig);
            }),
            () => live,
            pick(["name", "apiKeySource", "endpointConfiguration", "schema"]),
            assign({
              schema: pipe([
                get("schema"),
                assign({
                  paths: pipe([
                    get("paths"),
                    map(
                      pipe([
                        map(
                          pipe([
                            when(
                              get("x-amazon-apigateway-integration"),
                              assign({
                                "x-amazon-apigateway-integration": pipe([
                                  get("x-amazon-apigateway-integration"),
                                  tap((params) => {
                                    assert(true);
                                  }),
                                  //TODO requestTemplates
                                  when(
                                    get("credentials"),
                                    assign({
                                      credentials: pipe([
                                        get("credentials"),
                                        replaceAccountAndRegion({
                                          providerConfig,
                                          lives,
                                        }),
                                      ]),
                                    })
                                  ),
                                  when(
                                    get("uri"),
                                    assign({
                                      uri: pipe([
                                        get("uri"),
                                        replaceAccountAndRegion({
                                          providerConfig,
                                          lives,
                                        }),
                                      ]),
                                    })
                                  ),
                                ]),
                              })
                            ),
                          ])
                        ),
                      ])
                    ),
                  ]),
                }),
              ]),
              deployment: pipe([
                () => live,
                get("deployments"),
                first,
                get("id"),
                (deploymentId) =>
                  pipe([
                    () => lives,
                    find(
                      and([
                        eq(get("groupType"), "APIGateway::Stage"),
                        eq(get("live.deploymentId"), deploymentId),
                      ])
                    ),
                    get("live.stageName"),
                  ])(),
                (stageName) => ({
                  stageName,
                }),
              ]),
            }),
          ])(),
      dependencies: {
        roles: {
          type: "Role",
          group: "IAM",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([
              get("schema.paths"),
              flattenObject({ filterKey: (key) => key === "credentials" }),
              map(
                pipe([
                  (id) =>
                    lives.getById({
                      id,
                      type: "Role",
                      group: "IAM",
                      providerName: config.providerName,
                    }),
                  get("id"),
                ])
              ),
              //TODO move uniq to flattenObject
              uniq,
            ]),
        },
      },
    },
    {
      type: "Stage",
      Client: Stage,
      omitProperties: [
        "deploymentId",
        "clientCertificateId",
        "createdDate",
        "lastUpdatedDate",
        "cacheClusterStatus",
        "webAclArn",
        "accessLogSettings",
        "restApiId",
        "restApiName",
      ],
      inferName: ({
        properties: { stageName },
        dependenciesSpec: { restApi },
      }) =>
        pipe([
          tap(() => {
            assert(stageName);
            assert(restApi);
          }),
          () => `${restApi}::${stageName}`,
          tap((name) => {
            assert(name);
          }),
        ])(),
      propertiesDefault: { cacheClusterEnabled: false, tracingEnabled: false },
      compare: compareAPIGateway({
        filterLive: () => pipe([omitIfEmpty(["methodSettings"])]),
      }),
      filterLive: () =>
        pipe([
          pick([
            "stageName",
            "description",
            "StageVariables",
            "methodSettings",
            "accessLogSettings",
            "cacheClusterEnabled",
            "cacheClusterSize",
            "tracingEnabled",
          ]),
          omitIfEmpty(["methodSettings"]),
          omit(["accessLogSettings.destinationArn"]),
        ]),
      dependencies: {
        restApi: {
          type: "RestApi",
          group: "APIGateway",
          parent: true,
          dependencyId: ({ lives, config }) => get("restApiId"),
        },
        // deployment: {
        //   type: "Deployment",
        //   group: "APIGateway",
        //   dependencyId: ({ lives, config }) => get(""),
        // },
        account: {
          type: "Account",
          group: "APIGateway",
          dependencyId:
            ({ lives, config }) =>
            () =>
              "default",
        },
      },
    },
    {
      type: "Authorizer",
      Client: Authorizer,
      inferName: get("properties.name"),
      omitProperties: ["id", "restApiId", "providerARNs"],
      dependencies: {
        restApi: {
          type: "RestApi",
          group: "APIGateway",
          parent: true,
          dependencyId: ({ lives, config }) => get("restApiId"),
        },
        lambdaFunction: {
          type: "Function",
          group: "Lambda",
          dependencyId: ({ lives, config }) => get("authorizerUri"),
        },
        userPools: {
          type: "UserPool",
          group: "CognitoIdentityServiceProvider",
          list: true,
          dependencyId: ({ lives, config }) => get("providerARNs"),
        },
      },
    },
    {
      type: "UsagePlan",
      Client: UsagePlan,
      omitProperties: ["id"],
      propertiesDefault: {},
      inferName: get("properties.name"),
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          assign({
            apiStages: pipe([
              get("apiStages"),
              map(
                assign({
                  apiId: pipe([
                    get("apiId"),
                    replaceWithName({
                      groupType: "APIGateway::RestApi",
                      path: "id",
                      pathLive: "live.id",
                      providerConfig,
                      lives,
                    }),
                  ]),
                })
              ),
            ]),
          }),
        ]),
      dependencies: {
        stages: {
          type: "Stage",
          group: GROUP,
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([
              get("apiStages"),
              map(({ apiId, stage }) =>
                pipe([
                  () =>
                    lives.getById({
                      id: `arn:aws:apigateway:${config.region}::/restapis/${apiId}/stages/${stage}`,
                      type: "Stage",
                      group: "APIGateway",
                      providerName: config.providerName,
                    }),
                  get("id"),
                ])()
              ),
            ]),
        },
      },
    },
    {
      type: "UsagePlanKey",
      Client: UsagePlanKey,
      omitProperties: ["id", "keyId", "usagePlanId"],
      inferName: pipe([get("properties.name")]),
      propertiesDefault: { keyType: "API_KEY" },
      dependencies: {
        usagePlan: {
          type: "UsagePlan",
          group: GROUP,
          parent: true,
          dependencyId: ({ lives, config }) => get("usagePlanId"),
        },
        apiKey: {
          type: "ApiKey",
          group: GROUP,
          dependencyId: ({ lives, config }) => get("keyId"),
        },
      },
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      tagsKey,
      compare: compareAPIGateway({}),
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.tags, config }),
    })
  ),
]);
