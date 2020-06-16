const _ = require("lodash");
const urljoin = require("url-join");
const npath = require("path");
const assert = require("assert");
const logger = require("../logger")({ prefix: "CoreClient" });
const toString = (x) => JSON.stringify(x, null, 4);
const identity = (x) => x;
const { retryExpectOk } = require("./Retry");
const {
  getByNameCore,
  findField,
  isUpByIdCore,
  isDownByIdCore,
  logError,
} = require("./Common");
module.exports = CoreClient = ({
  spec,
  type,
  axios,
  methods, //TODO use defaults
  pathBase = "/",
  pathSuffix = () => "/",
  pathSuffixList,
  queryParameters = () => "",
  verbCreate = "POST",
  configDefault = async ({ name, properties }) => ({
    name,
    ...properties,
  }),
  findName = (item) => findField({ item, field: "name" }),
  findId = (item) => item.id,
  findTargetId = (item) => item.id,
  onResponseGet = identity,
  onResponseList = identity,
  onResponseCreate = identity,
  onResponseDelete = identity,
}) => {
  assert(spec);
  assert(type);
  const canGet = !methods || methods.get;
  const canCreate = !methods || methods.create;
  const canDelete = !methods || methods.del;
  const canList = !methods || methods.list;

  const getByName = ({ name }) => getByNameCore({ name, list, findName });

  const getById = async ({ id }) => {
    logger.debug(`getById ${toString({ type, id, canGet })}`);
    assert(id);

    if (_.isEmpty(id)) {
      throw Error(`getById ${type}: invalid id`);
    }

    if (!canGet) return;

    try {
      const path = npath.join(`/${id}`, queryParameters());
      logger.debug(`getById path: ${path}`);

      const result = await axios.request(path, {
        method: "GET",
      });
      result.data = onResponseGet(result.data);
      logger.debug(`get ${toString(result.data)}`);
      return result;
    } catch (error) {
      const status = error.response?.status;
      logger.debug(`getById status: ${status}`);
      if (status != 404) {
        logError("getById", error);
        throw error;
      }
    }
  };

  const isUpById = isUpByIdCore({ getById });
  const isDownById = isDownByIdCore({ getById });

  const create = async ({ name, payload, dependencies }) => {
    logger.debug(`create ${type}/${name}, payload: ${toString(payload)}`);
    assert(name);
    assert(payload);
    if (!canCreate) return;

    try {
      const path = urljoin(
        pathBase,
        pathSuffix({ name, dependencies }),
        queryParameters()
      );
      logger.debug(`create url: ${path}`);

      const result = await axios.request(path, {
        method: verbCreate,
        data: payload,
      });
      const data = onResponseCreate(result.data);
      logger.debug(`create result: ${toString(data)}`);

      const id = findTargetId(data);
      logger.debug(`create findTargetId: ${id}`);

      assert(id, "no target id from result");
      await retryExpectOk({
        name: `create ${name}`,
        fn: () => isUpById({ id }),
        isOk: (result) => result,
      });
      const resource = await getById({ id });
      logger.debug(`created ${type}/${name}`);
      return onResponseGet(resource.data);
    } catch (error) {
      logError(`create ${type}/${name}`, error);
      throw error;
    }
  };

  const list = async () => {
    logger.debug(`list type ${type}`);

    if (!canList) return;

    try {
      const path = urljoin(
        pathBase,
        pathSuffixList ? pathSuffixList() : "",
        queryParameters()
      );
      logger.debug(`list url: ${path}`);
      const result = await axios.request(path, {
        method: "GET",
      });
      result.data = onResponseList(result.data);
      return result;
    } catch (error) {
      logError(`list ${type}`, error);
      throw error;
    }
  };

  const destroy = async ({ id, name }) => {
    logger.debug(`destroy ${toString({ type, name, id, canDelete })}`);
    if (!canDelete) return;

    if (_.isEmpty(id)) {
      throw Error(`destroy ${type}: invalid id`);
    }

    try {
      const path = npath.join(`/${id}`, queryParameters());
      logger.debug(`destroy url: ${path}`);

      const result = await axios.request(path, {
        method: "DELETE",
      });
      result.data = onResponseDelete(result.data);
      logger.debug(
        `destroy ${toString({ name, type, id })} should be destroyed`
      );

      return result;
    } catch (error) {
      logError(`delete ${type}/${name}`, error);
      throw error;
    }
  };

  return {
    spec,
    type,
    methods,
    findId,
    getById,
    getByName,
    findName,
    findName,
    cannotBeDeleted: () => false,
    isUpById,
    isDownById,
    create,
    destroy,
    list,
    configDefault,
  };
};
