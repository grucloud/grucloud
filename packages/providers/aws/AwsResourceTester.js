const assert = require("assert");
const { tap, map, pipe } = require("rubico");
const { when, callProp } = require("rubico/x");

const { AwsProvider } = require("./AwsProvider");

const testList = ({ provider, client }) =>
  pipe([
    () => ({ lives: provider.lives, config: provider.getConfig() }),
    client.getList,
    tap(({ items }) => {
      assert(items);
    }),
  ]);

const testDelete = ({ provider, client, livesNotFound }) =>
  pipe([
    () => ({ config: provider.getConfig() }),
    livesNotFound,
    map.series(
      pipe([
        (live) => ({ live }),
        client.destroy,
        tap((result) => {
          assert(result == undefined, "destroy");
        }),
      ])
    ),
  ]);

const testGetById = ({ provider, client, livesNotFound }) =>
  pipe([
    () => ({ config: provider.getConfig() }),
    livesNotFound,
    map.series(
      pipe([
        client.getById({ lives: provider.lives, config: provider.getConfig() }),
        tap((result) => {
          assert(result == undefined);
        }),
      ])
    ),
  ])();

const testGetByName = ({ client, provider }) =>
  pipe([
    () => ({
      name: "pipo",
      lives: provider.lives,
      config: provider.getConfig(),
    }),
    client.getByName,
    tap((result) => {
      assert(result == undefined);
    }),
  ]);

exports.awsResourceTest = ({
  groupType,
  config,
  livesNotFound,
  skipDelete,
  skipList,
  skipGetById,
  skipGetByName,
}) =>
  pipe([
    tap((params) => {
      assert(groupType);
    }),
    () => ({ config }),
    AwsProvider,
    (provider) =>
      pipe([
        () => provider.start(),
        () => ({
          groupType,
        }),
        provider.getClient,
        (client) =>
          pipe([
            when(() => !skipList, testList({ provider, client })),
            when(() => !skipGetByName, testGetByName({ provider, client })),
            when(
              () => !skipDelete && livesNotFound,
              testDelete({ provider, client, livesNotFound })
            ),
            when(
              () => !skipGetById && livesNotFound,
              () => testGetById({ provider, client, livesNotFound })
            ),
          ])(),
      ])(),
  ])();
