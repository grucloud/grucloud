const assert = require("assert");
const { pipe, tap, get, pick, flatMap, assign, map } = require("rubico");
const { defaultsDeep, pluck, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { replaceWithName } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ ContactId }) => {
    assert(ContactId);
  }),
  pick(["ContactId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    pick(["ContactId", "Plan"]),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSMContacts.html
exports.SSMContactsPlan = () => ({
  type: "Plan",
  package: "ssm-contacts",
  client: "SSMContacts",
  propertiesDefault: { Plan: {} },
  omitProperties: ["ContactId", "Plan.RotationIds"],
  inferName:
    ({ dependenciesSpec: { contact } }) =>
    ({}) =>
      pipe([
        tap((params) => {
          assert(contact);
        }),
        () => `${contact}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ ContactId }) =>
      pipe([
        tap((params) => {
          assert(ContactId);
        }),
        () => ContactId,
        lives.getById({
          type: "Contact",
          group: "SSMContacts",
          providerName: config.providerName,
        }),
        get("name"),
        tap((name) => {
          assert(name);
        }),
      ])(),
  findId: () =>
    pipe([
      get("ContactId"),
      tap((ContactId) => {
        assert(ContactId);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException", "ValidationException"],
  dependencies: {
    contact: {
      type: "Contact",
      group: "SSMContacts",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("ContactId"),
          tap((ContactId) => {
            assert(ContactId);
          }),
        ]),
    },
    contactsTarget: {
      type: "Contact",
      group: "SSMContacts",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("Pan.Stages"),
          flatMap(pipe([get("Targets"), pluck("ContactTargetInfo.ContactId")])),
        ]),
    },
    contactChannelsTarget: {
      type: "ContactChannel",
      group: "SSMContacts",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("Plan.Stages"),
          pluck("Targets"),
          pluck("ChannelTargetInfo.ContactChannelId"),
        ]),
    },
    // TODO
    // rotations: {
    //   type: "Rotation",
    //   group: "SSMContacts",
    //   list: true,
    //   dependencyIds: ({ lives, config }) => pipe([get("Plan.RotationIds")]),
    // },
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        Plan: pipe([
          get("Plan"),
          assign({
            Stages: pipe([
              get("Stages"),
              map(
                assign({
                  Targets: pipe([
                    get("Targets"),
                    map(
                      assign({
                        ContactTargetInfo: pipe([
                          get("ContactTargetInfo"),
                          assign({
                            ContactId: pipe([
                              get("ContactId"),
                              replaceWithName({
                                groupType: "SSMContacts::Contact",
                                path: "id",
                                providerConfig,
                                lives,
                              }),
                            ]),
                          }),
                        ]),
                        ChannelTargetInfo: pipe([
                          get("ChannelTargetInfo"),
                          assign({
                            ContactChannelId: pipe([
                              get("ContactChannelId"),
                              replaceWithName({
                                groupType: "SSMContacts::ContactChannel",
                                path: "id",
                                providerConfig,
                                lives,
                              }),
                            ]),
                          }),
                        ]),
                      })
                    ),
                  ]),
                })
              ),
            ]),
          }),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSMContacts.html#getContact-property
  getById: {
    method: "getContact",
    pickId,
    decorate,
  },
  getList:
    ({ lives, client, endpoint, getById, config }) =>
    ({ lives }) =>
      pipe([
        lives.getByType({
          type: "Contact",
          group: "SSMContacts",
          providerName: config.providerName,
        }),
        map(pipe([get("live"), decorate({})])),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSMContacts.html#createPlan-property
  create: {
    method: "updateContact",
    pickCreated: ({ payload }) => pipe([() => ({ payload })]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSMContacts.html#updatePlan-property
  update: {
    method: "updateContact",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSMContacts.html#deletePlan-property
  destroy: {
    method: "updateContact",
    pickId: pipe([pickId, defaultsDeep({ Plan: {} })]),
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { contact, rotations },
    config,
  }) =>
    pipe([
      () => otherProps,
      tap(() => {
        assert(contact);
      }),
      defaultsDeep({
        ContactId: getField(contact, "ContactId"),
      }),
      when(
        () => rotations,
        defaultsDeep({
          Plan: {
            RotationIds: pipe([
              () => rotations,
              map((rotation) => getField(rotation, "RotationIds")),
            ])(),
          },
        })
      ),
    ])(),
});
