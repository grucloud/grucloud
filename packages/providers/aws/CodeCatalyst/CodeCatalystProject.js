const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  eq,
  assign,
  map,
  and,
  or,
  not,
  filter,
  fork,
} = require("rubico");
const {
  defaultsDeep,
  isIn,
  first,
  pluck,
  callProp,
  when,
  isEmpty,
  unless,
  identity,
} = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");
const { buildTagsObject } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");

// const {
//   Tagger,
//   //assignTags,
// } = require("./CodeCatalystCommon");

// const buildArn = () =>
//   pipe([
//     get("Arn"),
//     tap((arn) => {
//       assert(arn);
//     }),
//   ]);

const pickId = pipe([
  tap(({ name, spaceName }) => {
    assert(name);
    assert(spaceName);
  }),
  pick(["name", "spaceName"]),
]);

const decorate = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
  ]);

const findName = () =>
  pipe([
    tap(({ spaceName, name }) => {
      assert(spaceName);
      assert(name);
    }),
    ({ spaceName, name }) => `${spaceName}::${name}`,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeCatalyst.html
exports.CodeCatalystProject = () => ({
  type: "Project",
  package: "codecatalyst",
  client: "CodeCatalyst",
  propertiesDefault: {},
  omitProperties: ["spaceName"],
  inferName:
    ({ dependenciesSpec: { space } }) =>
    ({ name }) =>
      pipe([
        tap((params) => {
          assert(space);
          assert(name);
        }),
        () => `${space}::${name}`,
      ])(),
  findName,
  findId: findName,
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    space: {
      type: "Space",
      group: "CodeCatalyst",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("spaceName"),
          tap((spaceName) => {
            assert(spaceName);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeCatalyst.html#getProject-property
  getById: {
    method: "getProject",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeCatalyst.html#listProjects-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Space", group: "CodeCatalyst" },
          pickKey: pipe([
            tap(({ name }) => {
              assert(name);
            }),
            ({ name }) => ({ spaceName: name }),
          ]),
          method: "listProjects",
          getParam: "items",
          config,
          decorate: ({ parent }) =>
            pipe([
              tap((params) => {
                assert(parent.name);
              }),
              defaultsDeep({ spaceName: parent.name }),
              getById({}),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeCatalyst.html#createProject-property
  create: {
    method: "createProject",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeCatalyst.html#updateProject-property
  // TODO no delete or update API from AWS, on the 20230512
  //   update: {
  //     method: "updateProject",
  //     filterParams: ({ payload, diff, live }) =>
  //       pipe([() => payload, defaultsDeep(pickId(live))])(),
  //   },
  //   // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeCatalyst.html#deleteProject-property
  //   destroy: {
  //     method: "deleteProject",
  //     pickId,
  //   },
  getByName: getByNameCore,
  //   tagger: ({ config }) =>
  //     Tagger({
  //       buildArn: buildArn({ config }),
  //     }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { space },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(space);
      }),
      () => otherProps,
      defaultsDeep({
        //tags: buildTags({ name, config, namespace, UserTags: tags }),
        spaceName: space.config.name,
      }),
    ])(),
});
