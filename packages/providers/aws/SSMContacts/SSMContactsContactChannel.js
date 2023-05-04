const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ ContactChannelArn }) => {
    assert(ContactChannelArn);
  }),
  ({ ContactChannelArn }) => ({ ContactChannelId: ContactChannelArn }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap(({ ContactArn }) => {
      assert(ContactArn);
    }),
    ({ ContactArn, ...other }) => ({ ContactId: ContactArn, ...other }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSMContacts.html
exports.SSMContactsContactChannel = () => ({
  type: "ContactChannel",
  package: "ssm-contacts",
  client: "SSMContacts",
  propertiesDefault: {},
  omitProperties: ["ContactChannelArn", "ContactId"],
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("ContactChannelArn"),
      tap((ContactChannelArn) => {
        assert(ContactChannelArn);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException", "ValidationException"],
  dependencies: {
    contact: {
      type: "Contact",
      group: "SSMContacts",
      parent: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("ContactId"),
          tap((ContactId) => {
            assert(ContactId);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSMContacts.html#getContactChannel-property
  getById: {
    method: "getContactChannel",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSMContacts.html#listContactChannels-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Contact", group: "SSMContacts" },
          pickKey: pipe([
            pick(["ContactId"]),
            tap((ContactId) => {
              assert(ContactId);
            }),
          ]),
          method: "listContactChannels",
          getParam: "ContactChannels",
          config,
          decorate: () => pipe([decorate()]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSMContacts.html#createContactChannel-property
  create: {
    method: "createContactChannel",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSMContacts.html#updateContactChannel-property
  update: {
    method: "updateContactChannel",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSMContacts.html#deleteContactChannel-property
  destroy: {
    method: "deleteContactChannel",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { contact },
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
    ])(),
});
