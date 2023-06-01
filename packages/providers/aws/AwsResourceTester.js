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
        tap((params) => {
          assert(true);
        }),
        (live) => ({
          live,
          lives: provider.lives,
          config: provider.getConfig(),
        }),
        client.destroy,
        tap((result) => {
          //assert(result == undefined, "destroy result not empty");
        }),
      ])
    ),
  ])();

const testGetById = ({ provider, client, livesNotFound }) =>
  pipe([
    () => ({ config: provider.getConfig() }),
    livesNotFound,
    map.series(
      pipe([
        tap((params) => {
          assert(true);
        }),
        client.getById({ lives: provider.lives, config: provider.getConfig() }),
        tap((result) => {
          assert(result == undefined, "getById");
        }),
      ])
    ),
  ])();

const testGetByName = ({ client, provider, nameNotFound }) =>
  pipe([
    () => ({
      name: nameNotFound,
      lives: provider.lives,
      config: provider.getConfig(),
      properties: ({}) => ({}),
      resolvedDependencies: {},
    }),
    client.getByName,
    tap((result) => {
      assert(result == undefined);
    }),
  ])();

exports.awsResourceTest = ({
  groupType,
  config = () => ({
    includeAllResources: true,
    excludeGroups: ["MediaConvert"],
  }),
  livesNotFound,
  nameNotFound = "idonotexist",
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
        tap((params) => {
          assert(true);
        }),
        (client) =>
          pipe([
            when(() => !skipList, testList({ provider, client })),
            tap((params) => {
              assert(true);
            }),
            when(
              () => !skipGetByName,
              () => testGetByName({ provider, client, nameNotFound })
            ),
            tap((params) => {
              assert(true);
            }),
            when(
              () => !skipDelete && livesNotFound,
              () => testDelete({ provider, client, livesNotFound })
            ),
            tap((params) => {
              assert(true);
            }),
            when(
              () => !skipGetById && livesNotFound,
              () => testGetById({ provider, client, livesNotFound })
            ),
          ])(),
      ])(),
  ])();
