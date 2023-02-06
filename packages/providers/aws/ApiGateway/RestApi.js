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
  pick,
  and,
} = require("rubico");
const {
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

const logger = require("@grucloud/core/logger")({
  prefix: "RestApi",
});

const { getByNameCore, buildTagsObject } = require("@grucloud/core/Common");
const { updateResourceObject } = require("@grucloud/core/updateResourceObject");
const { assignPolicyAccountAndRegion } = require("../AwsCommon");

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

const assignMethodIntegration = ({ method }) =>
  when(
    () => method.methodIntegration,
    assign({
      ["x-amazon-apigateway-integration"]: pipe([
        () => method,
        get("methodIntegration", {}),
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
  );

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

const buildOpenApiPath = ({ resources }) =>
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
                set(
                  method.httpMethod.toLowerCase(),
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
                      () => get("methodIntegration.requestParameters")(method),
                      assign({
                        parameters: () =>
                          buildIntegrationRequestParameters({
                            integrationRequestParameters:
                              method.methodIntegration.requestParameters,
                          }),
                      })
                    ),
                    assign({
                      responses: () => buildOpenApiMethodResponses({ method }),
                    }),
                    assignMethodIntegration({ method }),
                  ])()
                )(acc),
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
  ({ resources, models }) =>
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
        paths: buildOpenApiPath({ resources }),
        components: {
          schemas: buildModelSchema({
            models,
            refPrefix: "components/schemas",
          }),
        },
      }),
      tap((params) => {
        assert(true);
      }),
    ])();

const fetchRestApiChilds =
  ({ endpoint }) =>
  ({ restApiId }) =>
    fork({
      resources: pipe([
        () => ({ restApiId }),
        endpoint().getResources,
        get("items"),
        callProp("sort", (a, b) => a.path.localeCompare(b.path)),
        map(
          assign({
            methods: ({ id: resourceId }) =>
              pipe([
                () => ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
                map((httpMethod) =>
                  tryCatch(
                    pipe([
                      () => ({
                        restApiId,
                        resourceId,
                        httpMethod,
                      }),
                      endpoint().getMethod,
                      tap((params) => {
                        assert(true);
                      }),
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
        () => ({ restApiId }),
        endpoint().getModels,
        get("items"),
        callProp("sort", (a, b) => a.name.localeCompare(b.name)),
      ]),
    })();

const assignPolicy = () =>
  pipe([
    when(
      get("policy"),
      pipe([
        assign({
          policy: pipe([
            get("policy"),
            callProp("replaceAll", "\\", ""),
            JSON.parse,
          ]),
        }),
      ])
    ),
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    assignArn({ config }),
    assignUrl({ config }),
    assignPolicy(),
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

const createPolicy = ({ endpoint, live }) =>
  pipe([
    get("policy"),
    unless(
      isEmpty,
      pipe([
        JSON.stringify,
        (value) => ({ op: "replace", path: "/policy", value }),
        (patchOperation) => ({
          restApiId: live.id,
          patchOperations: [patchOperation],
        }),
        endpoint().updateRestApi,
      ])
    ),
  ]);

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
    "url",
    "createdDate",
    "deployments",
    "version",
    "endpointConfiguration.vpcEndpointIds",
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
    filterPayload: pipe([
      omit(["schemaFile", "schema", "deployment"]),
      when(
        get("policy"),
        assign({ policy: pipe([get("policy"), JSON.stringify]) })
      ),
    ]),
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
          createPolicy({ endpoint, live }),
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
          policy: pipe([
            updateResourceObject({
              path: "policy",
              onDeleted: () => () => ({
                op: "replace",
                path: "/policy",
                value: "",
              }),
              onAdded:
                () =>
                ({ policy }) => ({
                  op: "replace",
                  path: "/policy",
                  value: JSON.stringify(policy),
                }),
              onUpdated:
                () =>
                ({ policy }) => ({
                  op: "replace",
                  path: "/policy",
                  value: JSON.stringify(policy),
                }),
            }),
          ]),
          other: pipe([
            diffToPatch, //
            filter(not(pipe([get("path"), isIn(["/schema", "/policy"])]))),
          ]),
        }),
        ({ policy, other }) => ({
          restApiId: live.id,
          patchOperations: [policy, ...other],
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
        pick([
          "name",
          "apiKeySource",
          "endpointConfiguration",
          "schema",
          "policy",
        ]),
        when(
          get("policy"),
          assign({
            policy: pipe([
              get("policy"),
              assignPolicyAccountAndRegion({ providerConfig, lives }),
            ]),
          })
        ),
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
