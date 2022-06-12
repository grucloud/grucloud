const assert = require("assert");
const { pipe, tap, map, get, any, eq, filter, not, fork } = require("rubico");
const {
  size,
  isEmpty,
  find,
  when,
  callProp,
  isString,
  values,
  groupBy,
  pluck,
  flatten,
} = require("rubico/x");
const defaultsDeep = require("rubico/x/defaultsDeep");

const logger = require("./logger")({ prefix: "Lives" });

const toGroupType = ({ group, type }) => `${group}::${type}`;

exports.createLives = () => {
  const mapPerType = new Map();

  const getMapByIdByGroupType = (groupType) =>
    mapPerType.get(groupType) || new Map();

  const getResourcesAll = pipe([
    () => mapPerType,
    map((mapById) => [...mapById.values()]),
    values,
    flatten,
    callProp("sort", (a, b) =>
      `${a.providerName}${a.groupType}${a.name}`.localeCompare(
        `${b.providerName}${b.groupType}${b.name}`
      )
    ),
  ]);

  const toJSON = () =>
    pipe([
      tap(() => {
        logger.debug(`toJSON `);
      }),
      getResourcesAll,
      groupBy("providerName"),
      map.entries(([providerName, resourcesPerType]) => [
        providerName,
        pipe([
          () => resourcesPerType,
          fork({
            error: any(get("error")),
            results: pipe([
              groupBy("groupType"),
              map.entries(([groupType, resources]) => [
                groupType,
                { groupType, resources },
              ]),
              values,
            ]),
          }),
          defaultsDeep({ providerName, kind: "livesPerType" }),
        ])(),
      ]),
      values,
      tap((params) => {
        logger.debug(`toJSON done`);
      }),
    ])();

  const getByType = ({ type, group, providerName }) =>
    pipe([
      tap(() => {
        assert(type);
      }),
      () => ({ group, type }),
      toGroupType,
      getMapByIdByGroupType,
      (mapById) => [...mapById.values()],
      when(() => providerName, filter(eq(get("providerName"), providerName))),
      // tap((resources) => {
      //   logger.debug(
      //     `getByType ${JSON.stringify({
      //       type,
      //       group,
      //       count: size(resources),
      //     })}`
      //   );
      // }),
    ])();

  const getById = ({ providerName, type, group, id = "" }) =>
    pipe([
      tap(() => {
        if (!isString(id)) {
          assert(isString(id));
        }
      }),
      // tap(() => {
      //   logger.debug(`getById ${group}::${type}, id: ${id}`);
      // }),
      // no providerName for cross account dependencies
      () => getByType({ type, group }),
      //TODO map.get
      find(pipe([get("id"), eq(callProp("toUpperCase"), id.toUpperCase())])),
    ])();

  const getByName = ({ providerName, type, group, name }) =>
    pipe([
      // tap(() => {
      //   logger.debug(`getByName ${group}::${type}, name: ${name}`);
      // }),
      () => getByType({ providerName, type, group }),
      find(eq(get("name"), name)),
    ])();

  return {
    get error() {
      logger.info("get error");
      return any(get("error"))(toJSON());
    },
    addResource: ({ groupType, resource }) =>
      pipe([
        tap((params) => {
          if (!groupType) {
            assert(groupType);
          }
          logger.info(
            `live addResource ${groupType}, ${JSON.stringify({
              providerName: resource.providerName,
              mapPerTypeSize: mapPerType.size,
            })}`
          );
          if (isEmpty(resource.live)) {
            logger.error(`live addResource no live for ${groupType}`);
            assert(false);
          }
        }),
        () => groupType,
        getMapByIdByGroupType,
        tap((mapById) => {
          logger.info(
            `live addResource ${JSON.stringify({
              providerName: resource.providerName,
              groupType,
              mapSize: mapById.size,
            })}`
          );
        }),
        tap((mapById) => mapById.set(resource.id, resource)),
        tap((mapById) => {
          mapPerType.set(groupType, mapById);
        }),
      ])(),
    addResources: ({
      providerName,
      groupType,
      resources = [],
      error: latestError,
    }) => {
      assert(groupType);
      assert(Array.isArray(resources) || latestError);
      logger.info(
        `live addResources ${JSON.stringify({
          providerName,
          groupType,
          resourceCount: size(resources),
        })}`
      );

      if (isEmpty(resources)) {
        return;
      }
      const mapById = getMapByIdByGroupType(groupType);

      return pipe([
        () => resources,
        map((resource) =>
          pipe([
            () => resource,
            get("id"),
            tap((id) => {
              if (mapById.get(id)) {
                logger.info(
                  `live addResources ${groupType}, id: '${id}' already exists`
                );
              }
              mapById.set(id, resource);
            }),
          ])()
        ),
        tap((params) => {
          mapPerType.set(groupType, mapById);
        }),
      ])();
    },
    get json() {
      return toJSON();
    },
    // remove
    toJSON,
    getByProvider: ({ providerName }) =>
      pipe([
        getResourcesAll,
        filter(eq(get("providerName"), providerName)),
        groupBy("groupType"),
        map.entries(([groupType, resources]) => [
          groupType,
          { groupType, resources },
        ]),
        values,
        tap((params) => {
          assert(true);
        }),
      ])(),
    getByType,
    getById,
    getByName,
  };
};
