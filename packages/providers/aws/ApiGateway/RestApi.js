const assert = require("assert");
const fs = require("fs").promises;
const path = require("path");
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
} = require("rubico");
const {
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
} = require("rubico/x");

const logger = require("@grucloud/core/logger")({
  prefix: "RestApi",
});
const { getByNameCore, buildTagsObject } = require("@grucloud/core/Common");
const { AwsClient } = require("../AwsClient");

const { createAPIGateway, diffToPatch } = require("./ApiGatewayCommon");

const findId = get("live.id");
const findName = get("live.name");

const pickId = ({ id }) => ({ restApiId: id });

exports.RestApi = ({ spec, config }) => {
  const apiGateway = createAPIGateway(config);

  const client = AwsClient({ spec, config })(apiGateway);

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

  const buildIntegrationRequestParameters = ({
    integrationRequestParameters,
  }) =>
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

  // const buildSwaggerRequestModelParameters = ({ requestModels }) =>
  //   pipe([
  //     () => [
  //       {
  //         in: "body",
  //         name: requestModels["application/json"],
  //         required: true,
  //         schema: {
  //           $ref: `#/definitions/${requestModels["application/json"]}`,
  //         },
  //       },
  //     ],
  //   ])();

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
          tap((params) => {
            assert(true);
          }),
          get("methodIntegration", {}),
          omit([
            "timeoutInMillis",
            "cacheNamespace",
            "cacheKeyParameters",
            "connectionType",
          ]),
          tap((params) => {
            assert(true);
          }),
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

  // const methodProduces = ({ method }) =>
  //   pipe([
  //     () => method,
  //     get("methodIntegration.integrationResponses", {}),
  //     values,
  //     pluck("responseParameters"),
  //     filter(not(isEmpty)),
  //     map((param) => param["method.response.header.Content-Type"]),
  //     filter(not(isEmpty)),
  //     map(callProp("replace", /'/g, "")),
  //     when(isEmpty, () => ["application/json"]),
  //   ])();

  // const buildSwaggerMethodResponses = ({ method }) =>
  //   pipe([
  //     () => method,
  //     get("methodResponses", {}),
  //     map.entries(
  //       ([key, { statusCode, responseParameters, responseModels }]) => [
  //         key,
  //         {
  //           description: `${statusCode} response`,
  //           ...(responseModels && {
  //             schema: {
  //               $ref: `#/definitions/${responseModels["application/json"]}`,
  //             },
  //           }),
  //           ...(responseParameters && {
  //             headers: pipe([
  //               () => responseParameters,
  //               map.entries(([key, value]) => [
  //                 pipe([() => key, callProp("split", "."), last])(),
  //                 { type: "string" },
  //               ]),
  //             ])(),
  //           }),
  //         },
  //       ]
  //     ),
  //   ])();

  const buildOpenApiMethodResponses = ({ method }) =>
    pipe([
      () => method,
      get("methodResponses", {}),
      tap((params) => {
        assert(true);
      }),
      map.entries(
        ([key, { statusCode, responseParameters, responseModels }]) => [
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
        ]
      ),
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
                      tap((params) => {
                        assert(true);
                      }),
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
                      tap((params) => {
                        assert(true);
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
                        eq(key, "$ref"),
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

  const fetchRestApiChilds = ({ restApiId }) =>
    fork({
      resources: pipe([
        () => ({ restApiId }),
        apiGateway().getResources,
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
                      apiGateway().getMethod,
                    ]),
                    switchCase([
                      eq(get("name"), "NotFoundException"),
                      () => undefined,
                      (error) => {
                        throw error;
                      },
                    ])
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
        apiGateway().getModels,
        get("items"),
        tap((params) => {
          assert(true);
        }),
        callProp("sort", (a, b) => a.name.localeCompare(b.name)),
      ]),
    })();

  const decorate = () =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      assign({
        deployments: ({ id: restApiId }) =>
          pipe([
            () => ({ restApiId }),
            apiGateway().getDeployments,
            get("items"),
            tap((deployments) => {
              logger.debug(`restApi #deployments ${size(deployments)}`);
            }),
          ])(),
        // schemaSwagger: ({ id: restApiId, name, description }) =>
        //   pipe([
        //     () => ({ restApiId }),
        //     fetchRestApiChilds,
        //     tap((params) => {
        //       assert(true);
        //     }),
        //     generateSwagger2Schema({ name, description }),
        //     tap((params) => {
        //       assert(true);
        //     }),
        //   ])(),
        schema: ({ id: restApiId, name, description }) =>
          pipe([
            () => ({ restApiId }),
            fetchRestApiChilds,
            tap((params) => {
              assert(true);
            }),
            generateOpenApi2Schema({ name, description }),
            tap((params) => {
              assert(true);
            }),
          ])(),
      }),
    ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getRestApi-property
  const getById = client.getById({
    pickId,
    method: "getRestApi",
    ignoreErrorCodes: ["NotFoundException"],
    decorate,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getRestApis-property
  const getList = client.getList({
    method: "getRestApis",
    getParam: "items",
    decorate,
  });

  const getByName = getByNameCore({ getList, findName });

  const putRestApi =
    ({ name, payload }) =>
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
        tap((params) => {
          assert(true);
        }),
        apiGateway().putRestApi,
        tap((params) => {
          assert(true);
        }),
      ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#createRestApi-property
  const create = client.create({
    //TODO identity ?
    pickCreated: () => (result) => pipe([() => result])(),
    filterPayload: pipe([omit(["schemaFile", "schema", "deployment"])]),
    method: "createRestApi",
    getById,
    pickId,
    config,
    postCreate: (params) =>
      pipe([
        tap(putRestApi(params)),
        ({ id }) => ({ restApiId: id, ...params.deployment }),
        omit(["stageName"]),
        apiGateway().createDeployment,
      ]),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#updateRestApi-property
  const update = client.update({
    preUpdate: ({ name, payload, live, diff, programOptions }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => diff,
        tap((params) => {
          assert(true);
        }),
        when(
          or([
            get("liveDiff.updated.schema"),
            get("liveDiff.added.schema"),
            get("liveDiff.deleted.schema"),
          ]),
          pipe([
            tap((params) => {
              assert(true);
            }),
            () => ({ id: live.id }),
            putRestApi({ name, payload }),
            tap(() => {
              logger.info(`updated restApi ${name}`);
            }),
            () => ({ restApiId: live.id, ...payload.deployment }),
            tap(() => {
              logger.info(`createDeployment ${name}`);
            }),
            apiGateway().createDeployment,
          ])
        ),
      ]),
    pickId,
    filterParams: ({ payload, live, diff }) =>
      pipe([
        tap((params) => {
          assert(diff);
        }),
        () => ({ diff }),
        diffToPatch,
        filter(not(eq(get("path"), "/schema"))),
        (patchOperations) => ({
          restApiId: live.id,
          patchOperations,
        }),
      ])(),
    method: "updateRestApi",
    getById,
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#deleteRestApi-property
  const destroy = client.destroy({
    pickId,
    method: "deleteRestApi",
    getById,
    ignoreErrorCodes: ["NotFoundException"],
    config,
  });

  const configDefault = ({
    name,
    namespace,
    properties: { tags, description, schemaFile, ...otherProps },
    dependencies: {},
    programOptions,
  }) =>
    pipe([
      tap(() => {
        assert(schemaFile, "missing 'schemaFile' property");
      }),
      () => otherProps,
      defaultsDeep({
        name,
        schemaFile,
        tags: buildTagsObject({ config, namespace, name, userTags: tags }),
      }),
      assign({
        schema: pipe([
          () => path.resolve(programOptions.workingDirectory, schemaFile),
          (schemaFileFull) =>
            tryCatch(
              pipe([() => fs.readFile(schemaFileFull, "utf-8"), JSON.parse]),
              (error) => {
                console.error(
                  `Problem reading or parsing ${schemaFileFull}, error:`,
                  error
                );
                throw error;
              }
            )(),
        ]),
      }),
      assign({
        description: pipe([get("schema.info.description", description)]),
      }),
    ])();

  return {
    spec,
    findName,
    findId,
    getById,
    create,
    update,
    destroy,
    getByName,
    getList,
    configDefault,
  };
};
