const assert = require("assert");
const { pipe, tap, get, pick, assign, map } = require("rubico");
const { defaultsDeep, identity, keys, first, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger, shieldDependencies } = require("./ShieldCommon");

const buildShieldDependencies = pipe([
  () => shieldDependencies,
  map(({ type, group }) => ({
    type,
    group,
    list: true,
    dependencyIds: ({ lives, config }) =>
      pipe([
        get("Members"),
        tap((ResourceArn) => {
          assert(ResourceArn);
        }),
        map(
          pipe([
            lives.getById({ type, group, providerName: config.providerName }),
            get("id"),
          ])
        ),
      ]),
  })),
]);

const buildArn = () =>
  pipe([
    get("ProtectionGroupArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ ProtectionGroupId }) => {
    assert(ProtectionGroupId);
  }),
  pick(["ProtectionGroupId"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Shield.html
exports.ShieldProtectionGroup = pipe([
  () => ({
    type: "ProtectionGroup",
    package: "shield",
    client: "Shield",
    propertiesDefault: {},
    omitProperties: ["Members"],
    inferName: () =>
      pipe([
        get("ProtectionGroupId"),
        tap((Name) => {
          assert(Name);
        }),
      ]),
    findName: () =>
      pipe([
        get("ProtectionGroupId"),
        tap((name) => {
          assert(name);
        }),
      ]),
    findId: () =>
      pipe([
        get("ProtectionGroupId"),
        tap((id) => {
          assert(id);
        }),
      ]),
    dependencies: {
      ...buildShieldDependencies(),
    },
    ignoreErrorCodes: ["ResourceNotFoundException"],
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Shield.html#describeProtectionGroup-property
    getById: {
      method: "describeProtectionGroup",
      getField: "ProtectionGroup",
      pickId,
      decorate,
    },
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Shield.html#listProtectionGroups-property
    getList: {
      method: "listProtectionGroups",
      getParam: "ProtectionGroups",
      decorate: ({ getById }) =>
        pipe([({ Id }) => ({ ProtectionGroupId: Id }), getById]),
    },
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Shield.html#createProtectionGroup-property
    create: {
      method: "createProtectionGroup",
      pickCreated: ({ payload }) => pipe([identity]),
    },
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Shield.html#deleteProtectionGroup-property
    destroy: {
      method: "deleteProtectionGroup",
      pickId,
    },
    getByName: getByNameCore,
    tagger: ({ config }) =>
      Tagger({
        buildArn: buildArn({ config }),
      }),
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { ...otherDependencies },
      config,
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        }),
        when(
          () => otherDependencies,
          assign({
            Members: pipe([
              () => otherDependencies,
              keys,
              first,
              (depKey) =>
                pipe([
                  tap((params) => {
                    assert(depKey);
                  }),
                  () => otherDependencies[depKey],
                  map((resource) =>
                    getField(
                      resource,
                      shieldDependencies[depKey].arnKey || "Arn"
                    )
                  ),
                ])(),
            ]),
          })
        ),
      ])(),
  }),
]);
