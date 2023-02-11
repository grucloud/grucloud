const assert = require("assert");
const {
  map,
  pipe,
  tap,
  get,
  set,
  eq,
  assign,
  omit,
  filter,
  tryCatch,
  not,
  or,
  switchCase,
  fork,
  reduce,
  and,
} = require("rubico");
const {
  flatten,
  uniq,
  find,
  defaultsDeep,
  identity,
  isEmpty,
  values,
  callProp,
  when,
  first,
  last,
  prepend,
  isObject,
  size,
  isIn,
  unless,
} = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");
const { replaceWithName } = require("@grucloud/core/Common");

const logger = require("@grucloud/core/logger")({
  prefix: "RestApi",
});

const {
  getByNameCore,
  buildTagsObject,
  omitIfEmpty,
} = require("@grucloud/core/Common");

const { flattenObject } = require("@grucloud/core/Common");
const { replaceAccountAndRegion } = require("../AwsCommon");

const { throwIfNotAwsError } = require("../AwsCommon");
const { diffToPatch, ignoreErrorCodes, Tagger } = require("./ApiGatewayCommon");

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

// https://kpqhd4gd6e.execute-api.us-east-1.amazonaws.com
const assignUrl = ({ config }) =>
  pipe([
    assign({
      url: pipe([
        tap(({ id }) => {
          assert(id);
        }),
        ({ id }) => `https://${id}.execute-api.${config.region}.amazonaws.com`,
      ]),
    }),
  ]);

const assignEndpoint = ({ config }) =>
  pipe([
    assign({
      endpoint: pipe([
        tap(({ id }) => {
          assert(id);
        }),
        ({ id }) => `${id}.execute-api.${config.region}.amazonaws.com`,
      ]),
    }),
  ]);

const assignArn = ({ config }) =>
  pipe([
    tap((params) => {
      assert(config.region);
    }),
    assign({
      arn: pipe([
        tap(({ id }) => {
          assert(id);
        }),
        ({ id }) => `arn:aws:apigateway:${config.region}::/restapis/${id}`,
      ]),
    }),
  ]);

const assignArnV2 = ({ config }) =>
  pipe([
    assign({
      arnv2: pipe([
        ({ id }) =>
          `arn:aws:execute-api:${config.region}:${config.accountId()}:${id}`,
      ]),
    }),
  ]);

const findId = () => get("id");
const findName = () => get("name");

const pickId = pipe([({ id }) => ({ restApiId: id })]);

const buildName = pipe([callProp("split", "."), last]);

const buildRequestParameters = ({ requestParameters, extra }) =>
  pipe([
    () => requestParameters,
    map.entries(([key, value]) => [
      key,
      {
        name: buildName(key),
        in: pipe([
          () => key,
          callProp("replace", "method.request.", ""),
          callProp("split", "."),
          first,
          callProp("replace", "querystring", "query"),
        ])(),
        required: value,
        ...extra,
        //type: "string", //Swagger 2.0
        schema: { type: "string" },
      },
    ]),
    values,
  ])();

const buildIntegrationRequestParameters = ({ integrationRequestParameters }) =>
  pipe([
    () => integrationRequestParameters,
    map.entries(([key, value]) => [
      key,
      {
        name: buildName(key),
        in: pipe([
          () => key,
          callProp("replace", "integration.request.", ""),
          callProp("split", "."),
          first,
          callProp("replace", "querystring", "query"),
        ])(),
        required: true,
        schema: {
          type: "string",
        },
      },
    ]),
    values,
  ])();

const updateObject = (update) =>
  pipe([
    switchCase([
      isObject,
      map.entries(([key, value]) => [
        key,
        pipe([
          () => value,
          switchCase([
            Array.isArray,
            identity,
            isObject,
            updateObject(update),
            () => update(key, value),
          ]),
        ])(),
      ]),
      identity,
    ]),
  ]);

const assignSecurity = ({ method, authorizers }) =>
  pipe([
    when(
      () => method.authorizerId,
      assign({
        security: pipe([
          () => authorizers,
          find(eq(get("id"), method.authorizerId)),
          get("name"),
          tap((name) => {
            assert(name);
          }),
          (name) => [{ [name]: [] }],
        ]),
      })
    ),
  ]);

const assignMethodIntegration = ({ method }) =>
  pipe([
    when(
      () => method.methodIntegration,
      assign({
        ["x-amazon-apigateway-integration"]: pipe([
          () => method,
          get("methodIntegration", {}),
          omitIfEmpty(["requestParameters", "requestTemplates"]),
          omit([
            "timeoutInMillis",
            "cacheNamespace",
            "cacheKeyParameters",
            "connectionType",
          ]),
          ({ integrationResponses, ...otherProps }) => ({
            ...otherProps,
            ...(integrationResponses && {
              responses: {
                default: pipe([() => integrationResponses, values, first])(),
              },
            }),
          }),
        ]),
      })
    ),
  ]);

const assignAuth = ({ method }) =>
  pipe([
    unless(
      () => method.authorizationType == "NONE",
      assign({
        ["x-amazon-apigateway-auth"]: () => ({
          type: method.authorizationType,
        }),
      })
    ),
  ]);

const buildOpenApiMethodResponses = ({ method }) =>
  pipe([
    () => method,
    get("methodResponses", {}),
    map.entries(([key, { statusCode, responseParameters, responseModels }]) => [
      key,
      {
        description: `${statusCode} response`,
        ...(responseParameters && {
          headers: pipe([
            () => responseParameters,
            map.entries(([key, value]) => [
              pipe([() => key, callProp("split", "."), last])(),
              { schema: { type: "string" } },
            ]),
          ])(),
        }),
        ...(responseModels && {
          content: pipe([
            () => responseModels,
            map.entries(([key, value]) => [
              key,
              {
                schema: {
                  $ref: `#/components/schemas/${value}`,
                },
              },
            ]),
            tap((params) => {
              assert(true);
            }),
          ])(),
        }),
      },
    ]),
  ])();

// const swaggerPath = ({ resources }) =>
//   pipe([
//     () => resources,
//     reduce(
//       (acc, resource) =>
//         set(
//           resource.path,
//           pipe([
//             () => resource.methods,
//             reduce(
//               (acc, method) =>
//                 set(
//                   method.httpMethod.toLowerCase(),
//                   pipe([
//                     () => ({}),
//                     when(
//                       () => method.operationName,
//                       assign({ operationId: () => method.operationName })
//                     ),
//                     assign({ consumes: () => ["application/json"] }),
//                     assign({ produces: () => methodProduces({ method }) }),
//                     when(
//                       () => method.requestModels,
//                       assign({
//                         parameters: () =>
//                           buildSwaggerRequestModelParameters(method),
//                       })
//                     ),
//                     when(
//                       () => method.requestParameters,
//                       assign({
//                         parameters: () => buildRequestParameters(method),
//                       })
//                     ),
//                     when(
//                       () =>
//                         get("methodIntegration.requestParameters")(method),
//                       assign({
//                         parameters: () =>
//                           buildIntegrationRequestParameters({
//                             requestParameters:
//                               method.methodIntegration.requestParameters,
//                           }),
//                       })
//                     ),
//                     assign({
//                       responses: () =>
//                         buildSwaggerMethodResponses({ method }),
//                     }),
//                     assignMethodIntegration({ method }),
//                   ])()
//                 )(acc),
//               {}
//             ),
//           ])()
//         )(acc),
//       {}
//     ),
//   ])();

const buildOpenApiRequestBody = ({ requestModels }) =>
  pipe([
    when(
      () => requestModels,
      assign({
        requestBody: pipe([
          () => requestModels,
          map.entries(([contentType, type]) => [
            contentType,
            {
              content: {
                [contentType]: {
                  schema: {
                    $ref: `#/components/schemas/${type}`,
                  },
                },
              },
              required: true,
            },
          ]),
          values,
          first,
        ]),
      })
    ),
  ]);
const buildHttpMethod = pipe([
  switchCase([
    eq(get("httpMethod"), "ANY"),
    () => "x-amazon-apigateway-any-method",
    pipe([get("httpMethod"), callProp("toLowerCase")]),
  ]),
]);

const buildOpenApiPath = ({ resources, authorizers }) =>
  pipe([
    () => resources,
    reduce(
      (acc, resource) =>
        set(
          resource.path,
          pipe([
            () => resource.methods,
            reduce(
              (acc, method) =>
                pipe([
                  () => acc,
                  set(
                    buildHttpMethod(method),
                    pipe([
                      () => ({}),
                      when(
                        () => method.operationName,
                        assign({ operationId: () => method.operationName })
                      ),
                      buildOpenApiRequestBody(method),
                      when(
                        () => method.requestParameters,
                        assign({
                          parameters: () => buildRequestParameters(method),
                        })
                      ),
                      when(
                        () =>
                          get("methodIntegration.requestParameters")(method),
                        assign({
                          parameters: () =>
                            buildIntegrationRequestParameters({
                              integrationRequestParameters:
                                method.methodIntegration.requestParameters,
                            }),
                        })
                      ),
                      assign({
                        responses: () =>
                          buildOpenApiMethodResponses({ method }),
                      }),
                      omitIfEmpty(["parameters", "responses"]),
                      assignAuth({ method }),
                      assignSecurity({ method, authorizers }),
                      assignMethodIntegration({ method }),
                    ])()
                  ),
                ])(),
              {}
            ),
          ])()
        )(acc),
      {}
    ),
  ])();

const buildModelSchema = ({ models, refPrefix }) =>
  pipe([
    () => models,
    reduce(
      (acc, model) =>
        set(
          model.name,
          pipe([
            () => model.schema,
            JSON.parse,
            (schema) =>
              pipe([
                () => schema,
                updateObject((key, value) =>
                  pipe([
                    () => value,
                    when(
                      () => key === "$ref",
                      pipe([
                        callProp("split", "/"),
                        last,
                        prepend(`#/${refPrefix}/`),
                      ])
                    ),
                  ])()
                ),
              ])(),
          ])()
        )(acc),
      {}
    ),
  ])();

// openapi v3
const buildSecuritySchemes = ({ authorizers }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    () => authorizers,
    reduce(
      (acc, { name, token, authType, id, ...other }) =>
        pipe([
          () => other,
          omitIfEmpty([
            "authorizerCredentials",
            "authorizerUri",
            "providerARNs",
          ]),
          (props) => ({
            ...acc,
            [name]: {
              type: "apiKey", // Required and the value must be "apiKey" for an API Gateway API.
              name: "Authorization", // The name of the header containing the authorization token.
              in: "header", // Required and the value must be "header" for an API Gateway API.
              "x-amazon-apigateway-authtype": authType, // Specifies the authorization mechanism for the client.
              "x-amazon-apigateway-authorizer": {
                // An API Gateway Lambda authorizer definition
                type: "token", // Required property and the value must "token"
                ...props,
              },
            },
          }),
        ])(),
      {}
    ),
    tap((params) => {
      assert(true);
    }),
  ])();

// const generateSwagger2Schema =
//   ({ name, description }) =>
//   ({ resources, models }) =>
//     pipe([
//       tap(() => {
//         assert(resources);
//         assert(models);
//         assert(name);
//       }),
//       () => ({
//         swagger: "2.0",
//         info: {
//           description,
//           title: name,
//         },
//         schemes: ["https"],
//         paths: swaggerPath({ resources }),
//         definitions: buildModelSchema({ models, refPrefix: "definitions" }),
//       }),
//       tap((params) => {
//         assert(true);
//       }),
//     ])();

const generateOpenApi2Schema =
  ({ name, description }) =>
  ({ resources, models, authorizers }) =>
    pipe([
      tap(() => {
        assert(resources);
        assert(models);
        assert(name);
      }),
      () => ({
        openapi: "3.0.1",
        info: {
          description,
          title: name,
          version: "1",
        },
        paths: buildOpenApiPath({ resources, authorizers }),
        components: {
          securitySchemes: buildSecuritySchemes({
            authorizers,
          }),
          schemas: buildModelSchema({
            models,
            refPrefix: "components/schemas",
          }),
        },
      }),
      omitIfEmpty(["components.securitySchemes"]),
      tap((params) => {
        assert(true);
      }),
    ])();

const fetchRestApiChilds =
  ({ endpoint }) =>
  ({ restApiId }) =>
    pipe([
      () => ({ restApiId }),
      fork({
        resources: pipe([
          endpoint().getResources,
          get("items"),
          callProp("sort", (a, b) => a.path.localeCompare(b.path)),
          map(
            assign({
              methods: ({ id: resourceId }) =>
                pipe([
                  () => [
                    "ANY",
                    "GET",
                    "POST",
                    "PUT",
                    "PATCH",
                    "DELETE",
                    "OPTIONS",
                  ],
                  map((httpMethod) =>
                    tryCatch(
                      pipe([
                        () => ({
                          restApiId,
                          resourceId,
                          httpMethod,
                        }),
                        endpoint().getMethod,
                      ]),
                      throwIfNotAwsError("NotFoundException")
                    )()
                  ),
                  filter(not(isEmpty)),
                  callProp("sort", (a, b) =>
                    a.httpMethod.localeCompare(b.httpMethod)
                  ),
                ])(),
            })
          ),
        ]),
        models: pipe([
          endpoint().getModels,
          get("items"),
          callProp("sort", (a, b) => a.name.localeCompare(b.name)),
        ]),
        authorizers: pipe([endpoint().getAuthorizers, get("items")]),
      }),
    ])();

const decorate = ({ endpoint, config }) =>
  pipe([
    assignArn({ config }),
    assignArnV2({ config }),
    assignUrl({ config }),
    assignEndpoint({ config }),
    assign({
      deployments: ({ id: restApiId }) =>
        pipe([
          () => ({ restApiId }),
          endpoint().getDeployments,
          get("items"),
          tap((deployments) => {
            logger.debug(`restApi #deployments ${size(deployments)}`);
          }),
        ])(),
      schema: ({ id: restApiId, name, description }) =>
        pipe([
          () => ({ restApiId }),
          fetchRestApiChilds({ endpoint }),
          generateOpenApi2Schema({ name, description }),
        ])(),
    }),
    tap((params) => {
      assert(true);
    }),
  ]);

const putRestApi =
  ({ endpoint, payload }) =>
  ({ id }) =>
    pipe([
      tap((params) => {
        assert(id);
      }),
      () => payload,
      get("schema"),
      tap((schema) => {
        assert(schema, "missing schema");
      }),
      JSON.stringify,
      (body) => ({ body, restApiId: id, mode: "overwrite" }),
      endpoint().putRestApi,
    ])();

const createVpcEndpoints = ({ endpoint, live }) =>
  pipe([
    get("endpointConfiguration.vpcEndpointIds"),
    unless(
      isEmpty,
      pipe([
        map((value) => ({
          op: "add",
          path: "/endpointConfiguration/vpcEndpointIds",
          value,
        })),
        (patchOperations) => ({
          restApiId: live.id,
          patchOperations,
        }),
        endpoint().updateRestApi,
      ])
    ),
  ]);

const createDeployment = ({ endpoint, live }) =>
  pipe([
    () => live,
    ({ id }) => ({ restApiId: id }),
    omit(["stageName"]),
    endpoint().createDeployment,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MyModule.html
exports.RestApi = ({ compare }) => ({
  type: "RestApi",
  package: "api-gateway",
  client: "APIGateway",
  inferName: () => get("name"),
  findName,
  findId,
  getByName: getByNameCore,
  omitProperties: [
    "id",
    "arn",
    "arnv2",
    "endpoint",
    "url",
    "createdDate",
    "deployments",
    "version",
    "endpointConfiguration.vpcEndpointIds",
    "policy",
  ],
  propertiesDefault: { disableExecuteApiEndpoint: false },
  compare: compare({
    filterTarget: () => pipe([omit(["deployment"])]),
  }),
  ignoreErrorCodes,
  getById: {
    method: "getRestApi",
    pickId,
    decorate,
  },
  getList: {
    method: "getRestApis",
    getParam: "items",
    decorate,
  },
  create: {
    filterPayload: pipe([omit(["schemaFile", "schema", "deployment"])]),
    method: "createRestApi",
    postCreate:
      ({ endpoint, payload }) =>
      (live) =>
        pipe([
          tap((params) => {
            assert(live.id);
          }),
          () => live,
          putRestApi({ endpoint, payload }),
          () => payload,
          createVpcEndpoints({ endpoint, live }),
          () => payload,
          createDeployment({ endpoint, live }),
        ])(),
  },
  update: {
    postUpdate:
      ({ endpoint, name, payload, diff, programOptions }) =>
      (live) =>
        pipe([
          tap((params) => {
            assert(endpoint);
            assert(live.id);
          }),
          () => diff,
          when(
            or([
              get("liveDiff.updated.schema"),
              get("liveDiff.added.schema"),
              get("liveDiff.deleted.schema"),
            ]),
            pipe([
              //TODO
              () => ({ restApiId: live.id, ...payload.deployment }),
              tap(() => {
                logger.info(`createDeployment ${name}`);
              }),
              endpoint().createDeployment,
            ])
          ),
        ])(),
    method: "updateRestApi",
    filterParams: ({ payload, live, diff, endpoint }) =>
      pipe([
        () => ({ payload, live, diff, endpoint }),
        fork({
          other: pipe([
            diffToPatch, //
            filter(not(pipe([get("path"), isIn(["/schema"])]))),
          ]),
        }),
        ({ other }) => ({
          restApiId: live.id,
          patchOperations: [...other],
        }),
      ])(),
  },
  destroy: {
    method: "deleteRestApi",
    pickId,
  },
  filterLive:
    ({ providerConfig, lives }) =>
    (live) =>
      pipe([
        tap(() => {
          assert(providerConfig);
        }),
        () => live,
        assign({
          schema: pipe([
            get("schema"),
            when(
              get("components"),
              assign({
                components: pipe([
                  get("components"),
                  when(
                    get("securitySchemes"),
                    assign({
                      securitySchemes: pipe([
                        get("securitySchemes"),
                        map(
                          assign({
                            ["x-amazon-apigateway-authorizer"]: pipe([
                              get("x-amazon-apigateway-authorizer"),
                              tap((params) => {
                                assert(true);
                              }),

                              when(
                                get("authorizerCredentials"),
                                assign({
                                  authorizerCredentials: pipe([
                                    get("authorizerCredentials"),
                                    replaceAccountAndRegion({
                                      providerConfig,
                                      lives,
                                    }),
                                  ]),
                                })
                              ),
                              when(
                                get("authorizerUri"),
                                assign({
                                  authorizerUri: pipe([
                                    get("authorizerUri"),
                                    replaceAccountAndRegion({
                                      providerConfig,
                                      lives,
                                    }),
                                  ]),
                                })
                              ),
                              when(
                                get("providerARNs"),
                                assign({
                                  providerARNs: pipe([
                                    get("providerARNs"),
                                    map(
                                      replaceWithName({
                                        groupType:
                                          "CognitoIdentityServiceProvider::UserPool",
                                        path: "live.Arn",
                                        pathLive: "live.Arn",
                                        providerConfig,
                                        lives,
                                      })
                                    ),
                                  ]),
                                })
                              ),
                            ]),
                          })
                        ),
                      ]),
                    })
                  ),
                ]),
              })
            ),
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
                              when(
                                get("requestTemplates"),
                                assign({
                                  requestTemplates: pipe([
                                    get("requestTemplates"),
                                    map(
                                      replaceAccountAndRegion({
                                        providerConfig,
                                        lives,
                                      })
                                    ),
                                  ]),
                                })
                              ),
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
                    or([
                      eq(get("live.deploymentId"), deploymentId),
                      eq(get("live.canarySettings.deploymentId"), deploymentId),
                    ]),
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
              lives.getById({
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
    vpcEndpoints: {
      type: "VpcEndpoint",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("endpointConfiguration.vpcEndpointIds")]),
    },
    userPools: {
      type: "UserPool",
      group: "CognitoIdentityServiceProvider",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("schema.components.securitySchemes"),
          map(pipe([get("x-amazon-apigateway-authorizer.providerARNs")])),
          values,
          flatten,
          map((Arn) =>
            pipe([
              lives.getByType({
                type: "UserPool",
                group: "CognitoIdentityServiceProvider",
                providerName: config.providerName,
              }),
              find(eq(get("live.Arn"), Arn)),
              get("id"),
            ])()
          ),
        ]),
    },
  },
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { vpcEndpoints },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        name,
        tags: buildTagsObject({ config, namespace, name, userTags: tags }),
      }),
      assign({
        description: pipe([get("schema.info.description")]),
      }),
      when(
        () => vpcEndpoints,
        defaultsDeep({
          endpointConfiguration: {
            vpcEndpointIds: pipe([
              () => vpcEndpoints,
              map((vpcEndpoint) => getField(vpcEndpoint, "VpcEndpointId")),
            ])(),
          },
        })
      ),
    ])(),
});
