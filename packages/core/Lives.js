const assert = require("assert");
const { pipe, tap, map, get, any, eq, filter, not } = require("rubico");
const { size, isEmpty, find } = require("rubico/x");
const { tos } = require("./tos");
//const initSqlJs = require("sql.js");

const logger = require("./logger")({ prefix: "Lives" });

exports.createLives = (livesRaw = []) => {
  const livesToMap = map(({ providerName, results }) => [
    providerName,
    new Map(map((perProvider) => [perProvider.type, perProvider])(results)),
  ]);

  const mapPerProvider = new Map(livesToMap(livesRaw));

  const toJSON = () =>
    pipe([
      () => mapPerProvider,
      tap((results) => {
        logger.debug(`toJSON `);
      }),
      map.entries(([providerName, mapPerType]) => [
        providerName,
        {
          providerName,
          kind: "livesPerType",
          error: any(get("error"))([...mapPerType.values()]),
          results: [...mapPerType.values()],
        },
      ]),
      (resultMap) => [...resultMap.values()],
      tap((results) => {
        logger.debug(`toJSON `);
      }),
    ])();

  const getByType = ({ providerName, type }) =>
    pipe([
      () => mapPerProvider.get(providerName) || new Map(),
      (mapPerType) => mapPerType.get(type),
      tap.if(isEmpty, () => {
        logger.error(`cannot find type ${type} on provider ${providerName}`);
      }),
      get("resources", []),
      tap((resources) => {
        logger.debug(
          `getByType ${JSON.stringify({
            providerName,
            type,
            count: size(resources),
          })}`
        );
      }),
    ])();

  const getById = ({ providerName, type, id }) =>
    pipe([
      () => getByType({ providerName, type }),
      tap.if(isEmpty, () => {
        logger.error(`cannot find type ${type} on provider ${providerName}`);
      }),
      tap((resources) => {
        logger.debug(
          `live.getById ${type} ${id}, #resources ${size(resources)}`
        );
      }),
      find(eq(get("id"), id)),
      tap((result) => {
        assert(true);
      }),
    ])();

  const getByName = ({ providerName, type, name }) =>
    pipe([
      () => getByType({ providerName, type }),
      tap.if(isEmpty, () => {
        logger.error(`cannot find type ${type} on provider ${providerName}`);
      }),
      find(eq(get("name"), name)),
      tap((result) => {
        assert(true);
      }),
    ])();

  return {
    get error() {
      return any(get("error"))(toJSON());
    },
    addResource: ({ providerName, type, resource }) => {
      assert(providerName);
      assert(type);

      if (isEmpty(resource.live)) {
        logger.error(`live addResource no live for ${type}`);
        assert(true);
        return;
      }

      const mapPerType = mapPerProvider.get(providerName) || new Map();

      logger.debug(
        `live addResource ${JSON.stringify({
          providerName,
          type,
          mapPerTypeSize: mapPerType.size,
        })}`
      );
      logger.debug(`live addResource ${JSON.stringify(resource)}`);

      pipe([
        () => mapPerType.get(type) || { type, resources: [] },
        get("resources"),
        tap((resources) => {
          assert(Array.isArray(resources));
        }),
        filter(not(eq(get("id", ""), resource.id))),
        (resources) => [...resources, resource],
        tap((resources) => {
          mapPerType.set(type, {
            type,
            providerName,
            resources,
          });
        }),
        tap(() => {
          mapPerProvider.set(providerName, mapPerType);
        }),
      ])();
    },
    addResources: ({
      providerName,
      type,
      group,
      resources = [],
      error: latestError,
    }) => {
      assert(providerName);
      assert(type);
      assert(Array.isArray(resources) || latestError);
      logger.debug(
        `live addResources ${JSON.stringify({
          providerName,
          group,
          type,
          resourceCount: resources.length,
        })}`
      );

      const mapPerType = mapPerProvider.get(providerName) || new Map();
      mapPerType.set(type, { type, group, resources, error: latestError });
      mapPerProvider.set(providerName, mapPerType);
    },
    get json() {
      return toJSON();
    },
    toJSON,
    getByProvider: ({ providerName }) => {
      const mapPerType = mapPerProvider.get(providerName) || new Map();
      return [...mapPerType.values()];
    },
    setByProvider: ({ providerName, livesPerProvider }) => {
      const mapPerType = new Map(
        map((livesPerProvider) => [livesPerProvider.type, livesPerProvider])(
          livesPerProvider
        )
      );
      mapPerProvider.set(providerName, mapPerType);
    },
    getByType,
    getById,
    getByName,
  };
};
