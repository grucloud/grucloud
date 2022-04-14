const assert = require("assert");
const { pipe, assign, map, tap, omit, pick, get, eq, and } = require("rubico");
const {
  defaultsDeep,
  first,
  find,
  prepend,
  append,
  callProp,
  last,
  when,
} = require("rubico/x");

const { omitIfEmpty } = require("@grucloud/core/Common");
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
const { Method } = require("./Method");
const { Resource } = require("./Resource");
const { Integration } = require("./Integration");
const { Deployment } = require("./Deployment");

const GROUP = "APIGateway";
const tagsKey = "tags";
const compareAPIGateway = compareAws({ tagsKey });

// const schemaFilePath = ({ programOptions, commandOptions, resource }) =>
//   path.resolve(programOptions.workingDirectory, `${resource.name}.oas30.json`);

// const writeRestApiSchema =
//   ({ programOptions, commandOptions }) =>
//   ({ lives, resource }) =>
//     pipe([
//       () => resource,
//       get("live.schema", {}),
//       (json) => JSON.stringify(json, null, 4),
//       tap((params) => {
//         assert(true);
//       }),
//       (content) => prettier.format(content, { parser: "json" }),
//       (content) =>
//         tryCatch(
//           pipe([
//             () => schemaFilePath({ programOptions, commandOptions, resource }),
//             tap((filePath) => {
//               console.log("Writing rest api schema:", filePath);
//             }),
//             (filePath) => fs.writeFile(filePath, content),
//           ]),
//           (error) => {
//             console.error("Error writing rest api schema", error);
//             throw error;
//           }
//         )(),
//     ])();

module.exports = pipe([
  () => [
    {
      type: "Account",
      Client: Account,
      isOurMinion: ({ live, config }) => true,
      omitProperties: ["apiKeyVersion", "throttleSettings"],
      propertiesDefault: {
        features: ["UsagePlans"],
      },
      filterLive: () => pipe([omit(["features", "cloudwatchRoleArn"])]),
      dependencies: {
        cloudwatchRole: { type: "Role", group: "IAM" },
      },
    },
    {
      type: "ApiKey",
      Client: ApiKey,
      omitProperties: [
        "name",
        "id",
        "createdDate",
        "lastUpdatedDate",
        "stageKeys",
      ],
      propertiesDefault: { enabled: true },
    },
    {
      type: "Deployment",
      Client: Deployment,
      ignoreResource: () => () => true,
      omitProperties: ["createdDate", "id", "restApiId", "restApiName"],
      propertiesDefault: {},
      dependencies: {
        restApi: { type: "RestApi", group: "APIGateway", parent: true },
      },
    },
    {
      type: "Integration",
      Client: Integration,
      ignoreResource: () => () => true,
      omitProperties: [
        "credentials",
        "restApiId",
        "restApiName",
        "resourceId",
        "resource",
        "cacheNamespace",
      ],
      compare: compareAPIGateway({
        filterAll: () =>
          pipe([
            omitIfEmpty(["cacheKeyParameters"]),
            omit(["integrationHttpMethod"]),
          ]),
      }),
      filterLive: () => pipe([omitIfEmpty(["cacheKeyParameters"])]),
      propertiesDefault: {
        //type: "AWS",
        timeoutInMillis: 29000,
        requestParameters: {},
        integrationResponses: {
          200: {
            responseParameters: {},
            responseTemplates: { "application/json": "{}" },
            statusCode: "200",
          },
        },
        passthroughBehavior: "WHEN_NO_TEMPLATES",
      },
      dependencies: {
        method: { type: "Method", group: "APIGateway", parent: true },
        lambdaFunction: { type: "Function", group: "Lambda" },
        role: { type: "Role", group: "IAM" },
        table: { type: "Table", group: "DynamoDB" },
      },
      inferName: ({ properties, dependenciesSpec }) =>
        pipe([
          () => dependenciesSpec,
          tap(({ method }) => {
            assert(method);
          }),
          get("method"),
          prepend("integration::"),
        ])(),
    },
    {
      type: "Resource",
      ignoreResource: () => () => true,
      Client: Resource,
      dependencies: {
        restApi: { type: "RestApi", group: "APIGateway", parent: true },
        parent: { type: "Resource", group: "APIGateway" },
      },
      includeDefaultDependencies: true,
      omitProperties: [
        "id",
        "parentId",
        "path",
        "restApiName",
        "restApiId",
        "resourceMethods",
      ],
      inferName: ({ properties, dependenciesSpec }) =>
        pipe([
          () => dependenciesSpec,
          tap(({ restApi }) => {
            assert(restApi);
            assert(properties);
          }),
          get("restApi"),
          append("::"),
          when(
            () => dependenciesSpec.parent,
            (name) =>
              append(
                pipe([
                  () => dependenciesSpec.parent,
                  callProp("split", "::"),
                  last,
                ])()
              )(name)
          ),
          append(properties.pathPart || "/"),
        ])(),
    },
    {
      type: "Method",
      ignoreResource: () => () => true,
      Client: Method,
      dependencies: {
        resource: { type: "Resource", group: "APIGateway", parent: true },
      },
      cannotBeDeleted: () => true,
      omitProperties: [
        "resource",
        "resourceId",
        "restApiName",
        "restApiId",
        "methodIntegration",
      ],
      filterLive: () =>
        pipe([
          omitIfEmpty([
            "description",
            "requestModels",
            "requestParameters",
            "methodResponses.200.responseModels",
            "methodResponses.200.responseParameters",
          ]),
        ]),
      propertiesDefault: {
        apiKeyRequired: false,
        authorizationType: "NONE",
        methodResponses: { 200: { statusCode: "200" } },
      },
      inferName: ({ properties, dependenciesSpec }) =>
        pipe([
          () => dependenciesSpec,
          tap(({ resource }) => {
            assert(resource);
            assert(properties.httpMethod);
          }),
          get("resource"),
          append("::"),
          append(properties.httpMethod),
        ])(),
    },
    {
      type: "RestApi",
      Client: RestApi,
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
            pick(["apiKeySource", "endpointConfiguration", "schema"]),
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
                    get("name"),
                  ])(),
                (stageName) => ({
                  stageName,
                }),
              ]),
            }),
          ])(),
      dependencies: {
        role: { type: "Role", group: "IAM" },
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
      ],
      propertiesDefault: { cacheClusterEnabled: false, tracingEnabled: false },
      compare: compareAPIGateway({
        filterLive: () => pipe([omitIfEmpty(["methodSettings"])]),
      }),
      filterLive: () =>
        pipe([
          pick([
            "description",
            "StageName",
            "StageVariables",
            "methodSettings",
            "accessLogSettings",
            "cacheClusterEnabled",
            "cacheClusterSize",
            "tracingEnabled",
          ]),
          omitIfEmpty(["methodSettings"]),
        ]),
      dependencies: {
        restApi: { type: "RestApi", group: "APIGateway", parent: true },
        deployment: { type: "Deployment", group: "APIGateway" },
      },
    },
    {
      type: "Authorizer",
      Client: Authorizer,
      omitProperties: ["id", "name", "restApiId", "providerARNs"],
      dependencies: {
        restApi: { type: "RestApi", group: "APIGateway", parent: true },
        lambdaFunction: { type: "Function", group: "Lambda" },
        userPools: {
          type: "UserPool",
          group: "CognitoIdentityServiceProvider",
          list: true,
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
