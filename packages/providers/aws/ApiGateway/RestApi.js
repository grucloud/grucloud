const assert = require("assert");
const fs = require("fs").promises;
const path = require("path");
const { map, pipe, tap, get, eq, pick, omit } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore, buildTagsObject } = require("@grucloud/core/Common");
const { AwsClient } = require("../AwsClient");
const { createEndpoint, shouldRetryOnException } = require("../AwsCommon");

const findId = get("live.id");
const findName = get("live.name");

const pickId = ({ id }) => ({ restApiId: id });

exports.RestApi = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const apiGateway = () =>
    createEndpoint({ endpointName: "APIGateway" })(config);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getRestApi-property
  const getById = client.getById({
    pickId,
    method: "getRestApi",
    ignoreErrorCodes: ["NotFoundException"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getRestApis-property
  const getList = client.getList({
    method: "getRestApis",
    getParam: "items",
  });

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#createRestApi-property
  const create = client.create({
    //TODO identity ?
    pickCreated: () => (result) => pipe([() => result])(),
    filterPayload: pipe([
      omit(["schemaFile"]),
      tap((params) => {
        assert(true);
      }),
    ]),
    method: "createRestApi",
    getById,
    pickId,
    config,
    postCreate:
      ({ name, payload, programOptions }) =>
      ({ id }) =>
        pipe([
          tap((params) => {
            assert(id);
            assert(programOptions);
          }),
          () => payload,
          get("schemaFile"),
          tap((schemaFile) => {
            assert(schemaFile);
          }),
          (schemaFile) =>
            fs.readFile(
              path.resolve(programOptions.workingDirectory, schemaFile),
              "utf-8"
            ),
          (body) => ({ body, restApiId: id, mode: "overwrite" }),
          tap((params) => {
            assert(true);
          }),
          apiGateway().putRestApi,
          tap((params) => {
            assert(true);
          }),
        ])(),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#updateRestApi-property
  const update = client.update({
    pickId,
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
    properties: { tags, schemaFile, ...otherProps },
    dependencies: {},
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
    shouldRetryOnException,
  };
};
