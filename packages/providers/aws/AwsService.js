const assert = require("assert");
const { pipe, tap } = require("rubico");

const { createAwsResource } = require("./AwsClient");

exports.createAwsService = ({
  package,
  client,
  type,
  propertiesDefault,
  omitProperties,
  inferName,
  dependencies,
  cannotBeDeleted,
  managedByOther,
  filterLive,
  findName,
  findId,
  ignoreErrorCodes,
  ignoreErrorMessages,
  getById,
  getList,
  create,
  update,
  destroy,
  getByName,
  configDefault,
  compare,
  tagger = () => ({}),
  ...other
}) =>
  pipe([
    tap((params) => {
      assert(other);
    }),
    () => ({
      type,
      propertiesDefault,
      omitProperties,
      inferName,
      dependencies,
      filterLive,
      compare,
      Client: ({ spec, config }) =>
        createAwsResource({
          model: {
            package,
            client,
            getById,
            getList,
            create,
            update,
            destroy,
            ignoreErrorCodes,
            ignoreErrorMessages,
          },
          getById,
          spec,
          config,
          cannotBeDeleted,
          managedByOther,
          findName,
          findId,
          getList,
          create,
          update,
          destroy,
          getByName,
          configDefault,

          ...tagger({ config }),
        }),
    }),
    tap((params) => {
      assert(true);
    }),
  ])();
