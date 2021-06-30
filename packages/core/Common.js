const assert = require("assert");
const md5File = require("md5-file");
const {
  pipe,
  tap,
  omit,
  get,
  map,
  switchCase,
  and,
  eq,
  pick,
} = require("rubico");
const {
  find,
  isEmpty,
  groupBy,
  values,
  first,
  pluck,
  isDeepEqual,
} = require("rubico/x");
const logger = require("./logger")({ prefix: "Common" });
const { tos } = require("./tos");

const KeyName = "Name";
exports.KeyName = KeyName;

exports.mapPoolSize = 20;
exports.TitleDeploying = "Deploying";
exports.TitleDestroying = "Destroying";
exports.TitleQuery = "Querying";
exports.TitleListing = "Listing";

exports.HookType = {
  ON_DEPLOYED: "onDeployed",
  ON_DESTROYED: "onDestroyed",
};

const typeFromResources = pipe([first, get("type")]);
exports.typeFromResources = typeFromResources;

exports.planToResourcesPerType = ({ providerName, plans = [] }) =>
  pipe([
    tap(() => {
      logger.debug("planToResourcesPerType");
      assert(providerName);
    }),
    () => plans,
    pluck("resource"),
    groupBy("type"),
    values,
    map((resources) => ({
      type: typeFromResources(resources),
      provider: providerName,
      resources,
    })),
    tap((obj) => {
      logger.debug("planToResourcesPerType");
    }),
  ])();

exports.axiosErrorToJSON = (error) => ({
  isAxiosError: error.isAxiosError,
  message: error.message,
  name: error.name,
  config: pick(["url", "method", "baseURL"])(error.config),
  code: error.code,
  stack: error.stack,
  response: {
    status: error.response?.status,
    data: error.response?.data,
  },
});

const safeJsonParse = (json) => {
  try {
    return JSON.parse(json);
  } catch (error) {
    return json;
  }
};

exports.convertError = ({ error, name, procedure, params }) => {
  assert(error, "error");
  if (error.config) {
    const { baseURL = "", url, method } = error.config;
    return {
      Command: name,
      Message: `${error.message} ${get("response.data.error.message", "")(error)}`,
      Status: error.response?.status,
      Code: error.code,
      Output: error.response?.data,
      Input: {
        url: `${method} ${baseURL}${url}`,
        data: safeJsonParse(error.config?.data),
      },
    };
  } else if (error.requestId) {
    return {
      Command: name,
      name: error.name,
      code: error.code,
      statusCode: error.statusCode,
      procedure,
      params,
      message: error.message,
      region: error.region,
      requestId: error.requestId,
      retryable: error.retryable,
      retryDelay: error.retryDelay,
      time: error.time,
    };
  } else if (error.stack) {
    return {
      Command: name,
      name: error.name,
      code: error.code,
      message: error.message,
      stack: error.stack,
    };
  } else {
    return error;
  }
};

exports.getByNameCore = async ({
  name,
  findName,
  getList,
  resources,
  deep = true,
  //TODO meta ?
  lives,
}) =>
  pipe([
    tap(() => {
      logger.info(`getByName ${name}`);
      assert(name, "name");
      assert(findName, "findName");
      assert(getList, "getList");
    }),
    () => getList({ deep, lives, resources }),
    get("items"),
    find((item) => isDeepEqual(name, findName(item))), //TODO check on meta
    tap((instance) => {
      logger.info(`getByName ${name}: ${instance ? "UP" : "DOWN"}`);
      logger.debug(`getByName ${name}: ${tos({ instance })}`);
    }),
  ])();

//TODO merge with getByNameCore
const getByIdCore = async ({ type, name, id, findId, getList }) => {
  logger.info(`getById ${JSON.stringify({ type, name, id })}`);
  assert(id, "getByIdCore id");
  assert(findId, "getByIdCore findId");
  assert(getList, "getByIdCore getList");
  //TODO KEY
  const { items } = await getList();
  const instance = items.find((item) => findId(item) === id);
  logger.debug(`getById ${id}: ${tos({ instance })}`);

  return instance;
};

exports.getByIdCore = getByIdCore;

exports.isUpByIdCore = ({ isInstanceUp, getById }) => async ({
  id,
  name,
  type,
  live,
}) => {
  logger.debug(`isUpById ${JSON.stringify({ type, name, id })}`);
  assert(id || live, "isUpByIdCore id");
  assert(getById, "isUpByIdCore getById");
  let up = false;
  const instance = await getById({ type, name, id, deep: false, live });
  if (instance) {
    //TODO use default isInstanceUp
    if (isInstanceUp) {
      up = await isInstanceUp(instance);
    } else {
      up = true;
    }
  }
  logger.info(
    `isUpById ${JSON.stringify({ type, name, id })} ${up ? "UP" : "NOT UP"}`
  );
  return up ? instance : undefined;
};

exports.isDownByIdCore = ({
  type,
  name,
  isInstanceDown,
  getById,
  getList,
  findId,
}) => async ({ id, live }) => {
  logger.debug(`isDownById ${id}`);
  assert(id || live, "isDownByIdCore id");
  assert(getById, "isDownByIdCore getById");

  let down = false;

  const theGet = getList ? getByIdCore : getById;
  const instance = await theGet({
    type,
    name,
    id,
    getList,
    findId,
    deep: false,
    live,
  });
  if (instance) {
    if (isInstanceDown) {
      down = isInstanceDown(instance);
    }
  } else {
    down = true;
  }

  logger.info(
    `isDownById ${JSON.stringify({ type, name, id })} ${
      down ? "DOWN" : "NOT DOWN"
    }`
  );
  return down;
};

const errorToString = (error) => {
  try {
    return JSON.stringify(error);
  } catch (error) {
    return error.toString();
  }
};

exports.logError = (prefix, error) => {
  logger.error(`${prefix} error:${errorToString(error)}`);
  error.stack && logger.error(error.stack);

  if (error.response) {
    if (error.response.data) {
      logger.error(`data: ${tos(error.response.data)}`);
    }
    if (error.config) {
      const { baseURL = "", url, method } = error.config;
      logger.error(`config: ${method} ${baseURL}${url}`);
    }
    if (error.message) {
      logger.error(`message: ${error.message}`);
    }
  }
  //logger.error(`${prefix} stack:${error.stack}`);
};

exports.md5FileBase64 = pipe([
  (source) => md5File(source),
  (md5) => new Buffer.from(md5, "hex").toString("base64"),
]);

exports.buildTagsObject = ({ name, namespace, config }) => {
  const {
    managedByKey,
    managedByValue,
    stageTagKey,
    createdByProviderKey,
    stage,
    providerName,
    projectName,
    namespaceKey,
  } = config;

  assert(name);
  assert(providerName);
  assert(stage);
  return {
    [KeyName]: name,
    [managedByKey]: managedByValue,
    [createdByProviderKey]: providerName,
    ...(namespace && {
      [namespaceKey]: namespace,
    }),
    [stageTagKey]: stage,
    ...(projectName && {
      projectName,
    }),
  };
};

exports.isOurMinionObject = ({ tags, config }) => {
  const { stage, projectName, providerName, createdByProviderKey } = config;
  return pipe([
    () => tags,
    tap(() => {
      assert(stage);
      //TODO
      //assert(projectName);
      assert(providerName);
    }),
    switchCase([
      and([
        //eq(get("projectName"), projectName),
        eq(get("stage"), stage),
        eq(get(createdByProviderKey), providerName),
      ]),
      () => true,
      () => false,
    ]),
    tap((minion) => {
      logger.debug(
        `isOurMinionObject ${minion}, ${JSON.stringify({
          stage,
          projectName,
          tags,
        })}`
      );
    }),
  ])();
};
