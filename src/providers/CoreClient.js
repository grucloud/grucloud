const _ = require("lodash");
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
  path = () => "/",
  pathList,
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
    logger.debug(`get ${toString({ type, id, canGet })}`);
    assert(id);

    if (_.isEmpty(id)) {
      throw Error(`get ${type}: invalid id`);
    }

    if (!canGet) return;

    try {
      const url = `/${id}${queryParameters()}`;
      const result = await axios.request(url, {
        method: "GET",
      });
      result.data = onResponseGet(result.data);
      logger.debug(`get ${toString(result.data)}`);

      return result;
    } catch (error) {
      logError("getById", error);
      const status = error.response?.status;
      if (status != 404) {
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
      const url = `${path({ name, dependencies })}${queryParameters()}`;
      const result = await axios.request(url, {
        method: verbCreate,
        data: payload,
      });
      const data = onResponseCreate(result.data);
      logger.debug(`create result: ${toString(data)}`);

      const id = findTargetId(data);
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
      const url = `${pathList ? pathList() : "/"}${queryParameters()}`;
      const result = await axios.request(url, {
        method: "GET",
      });
      result.data = onResponseList(result.data);
      return result;
    } catch (error) {
      logError(`list ${type}/${name}`, error);
      throw error;
    }
  };

  const destroy = async ({ id, name, dependencies }) => {
    logger.debug(`destroy ${toString({ type, name, id, canDelete })}`);
    if (!canDelete) return;

    if (_.isEmpty(id)) {
      throw Error(`destroy ${type}: invalid id`);
    }

    try {
      const url = `${path({ name, dependencies })}${queryParameters()}`;
      const result = await axios.request(url, {
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
