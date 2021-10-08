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
  and,
  switchCase,
  fork,
  reduce,
} = require("rubico");
const {
  defaultsDeep,
  identity,
  isEmpty,
  values,
  pluck,
  callProp,
  when,
  first,
  last,
  prepend,
  isObject,
  flatten,
  size,
} = require("rubico/x");

const { getByNameCore, buildTagsObject } = require("@grucloud/core/Common");
const { AwsClient } = require("../AwsClient");
const { createEndpoint, shouldRetryOnException } = require("../AwsCommon");
const logger = require("@grucloud/core/logger")({
  prefix: "RestApi",
});
const findId = get("live.id");
const findName = get("live.name");

const pickId = ({ id }) => ({ restApiId: id });

exports.RestApi = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const apiGateway = () =>
    createEndpoint({ endpointName: "APIGateway" })(config);

  const buildRequestParameters = ({ requestParameters }) =>
    pipe([
      () => requestParameters,
      map.entries(([key, value]) => [
        key,
        {
          name: pipe([() => key, callProp("split", "."), last])(),
          in: pipe([
            () => key,
            callProp("replace", "method.request.", ""),
            callProp("split", "."),
            first,
            callProp("replace", "querystring", "query"),
          ])(),
          required: value,
          type: "string",
        },
      ]),
      values,
    ])();

  const buildIntegrationRequestParameters = ({ requestParameters, extra }) =>
    pipe([
      () => requestParameters,
      map.entries(([key, value]) => [
        key,
        {
          name: pipe([() => key, callProp("split", "."), last])(),
          in: pipe([
            () => key,
            callProp("replace", "integration.request.", ""),
            callProp("split", "."),
            first,
            callProp("replace", "querystring", "query"),
            tap((params) => {
              assert(true);
            }),
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

  const generateSwagger2Schema =
    ({ name, description }) =>
    ({ resources, models }) =>
      pipe([
        tap(() => {
          assert(resources);
          assert(models);
          assert(name);
        }),
        () => ({
          swagger: "2.0",
          info: {
            description,
            title: name,
          },
          schemes: ["https"],
          paths: pipe([
            () => resources,
            tap((params) => {
              assert(true);
            }),
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
                            () => ({
                              ...(method.operationName && {
                                operationId: method.operationName,
                              }),
                              consumes: ["application/json"],
                              produces: pipe([
                                () => method,
                                get(
                                  "methodIntegration.integrationResponses",
                                  {}
                                ),
                                values,
                                pluck("responseParameters"),
                                filter(not(isEmpty)),
                                map(
                                  (param) =>
                                    param["method.response.header.Content-Type"]
                                ),
                                filter(not(isEmpty)),
                                map(callProp("replace", /'/g, "")),
                                when(isEmpty, () => ["application/json"]),
                              ])(),
                              ...(method.requestModels && {
                                parameters: [
                                  {
                                    in: "body",
                                    name: method.requestModels[
                                      "application/json"
                                    ],
                                    required: true,
                                    schema: {
                                      $ref: `#/definitions/${method.requestModels["application/json"]}`,
                                    },
                                  },
                                ],
                              }),
                              ...(method.requestParameters && {
                                parameters: buildRequestParameters({
                                  requestParameters: method.requestParameters,
                                }),
                              }),
                              ...(get("methodIntegration.requestParameters")(
                                method
                              ) && {
                                parameters: buildIntegrationRequestParameters({
                                  requestParameters:
                                    method.methodIntegration.requestParameters,
                                }),
                              }),
                              responses: pipe([
                                () => method,
                                get("methodResponses", {}),
                                map.entries(
                                  ([
                                    key,
                                    {
                                      statusCode,
                                      responseParameters,
                                      responseModels,
                                    },
                                  ]) => [
                                    key,
                                    {
                                      description: `${statusCode} response`,
                                      ...(responseModels && {
                                        schema: {
                                          $ref: `#/definitions/${responseModels["application/json"]}`,
                                        },
                                      }),
                                      ...(responseParameters && {
                                        headers: pipe([
                                          () => responseParameters,
                                          map.entries(([key, value]) => [
                                            pipe([
                                              () => key,
                                              callProp("split", "."),
                                              last,
                                            ])(),
                                            { type: "string" },
                                          ]),
                                        ])(),
                                      }),
                                    },
                                  ]
                                ),
                              ])(),
                              ...(method.methodIntegration && {
                                ["x-amazon-apigateway-integration"]: pipe([
                                  () => method,
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
                                  ({
                                    integrationResponses,
                                    ...otherProps
                                  }) => ({
                                    ...otherProps,
                                    ...(integrationResponses && {
                                      responses: {
                                        default: pipe([
                                          () => integrationResponses,
                                          values,
                                          first,
                                        ])(),
                                      },
                                    }),
                                  }),
                                ])(),
                              }),
                            }),
                          ])()
                        )(acc),
                      {}
                    ),
                  ])()
                )(acc),
              {}
            ),
          ])(),
          definitions: pipe([
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
                                prepend("#/definitions/"),
                              ])
                            ),
                          ])()
                        ),
                      ])(),
                  ])()
                )(acc),
              {}
            ),
          ])(),
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
                      eq(get("code"), "NotFoundException"),
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
        schema: ({ id: restApiId, name, description }) =>
          pipe([
            () => ({ restApiId }),
            fetchRestApiChilds,
            tap((params) => {
              assert(true);
            }),
            generateSwagger2Schema({ name, description }),
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
    filterPayload: pipe([
      omit(["schemaFile", "schema", "deployment"]),
      tap((params) => {
        assert(true);
      }),
    ]),
    method: "createRestApi",
    getById,
    pickId,
    config,
    postCreate: (params) =>
      pipe([
        tap((live) => {
          assert(true);
        }),
        tap(putRestApi(params)),
        tap((params) => {
          assert(true);
        }),
        ({ id }) => ({ restApiId: id, ...params.deployment }),
        omit(["stageName"]),
        apiGateway().createDeployment,
        tap((params) => {
          assert(true);
        }),
      ]),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#updateRestApi-property
  const diffToPatch = ({ diff }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      () => diff,
      fork({
        add: pipe([
          get("liveDiff.added", {}),
          map.entries(([key, value]) => [
            key,
            { op: "add", path: `/${key}`, value },
          ]),
          values,
        ]),
        //remove: pipe([]),
        replace: pipe([
          get("liveDiff.updated", {}),
          map.entries(([key, value]) => [
            key,
            { op: "replace", path: `/${key}`, value: `${value.toString()}` },
          ]),
          values,
        ]),
      }),
      values,
      flatten,
      filter(not(eq(get("path"), "/schema"))),
    ])();

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
        () => ({
          restApiId: live.id,
          patchOperations: diffToPatch({ diff }),
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
    ignoreError: eq(get("code"), "NotFoundException"),
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

  // const onDeployed = ({ resultCreate, lives }) =>
  //   pipe([
  //     tap(() => {
  //       logger.info(`onDeployed restApi`);
  //       logger.debug(`onDeployed ${JSON.stringify({ resultCreate }, null, 4)}`);
  //       assert(resultCreate);
  //       assert(lives);
  //     }),
  //     () => resultCreate.results,
  //     pluck("output"),
  //     filter(eq(get("groupType"), "APIGateway::RestApi")),
  //     tap((params) => {
  //       assert(true);
  //     }),
  //   ])();

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
    shouldRetryOnException,
    //onDeployed,
  };
};
