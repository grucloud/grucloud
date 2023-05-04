const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./SSMContactsCommon");

const buildArn = () =>
  pipe([
    get("ContactId"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ ContactId }) => {
    assert(ContactId);
  }),
  pick(["ContactId"]),
]);

const toContactId = pipe([
  tap(({ ContactArn }) => {
    assert(ContactArn);
  }),
  ({ ContactArn, ...other }) => ({
    ContactId: ContactArn,
    ...other,
  }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn({ config }), endpoint }),
    toContactId,
  ]);

const filterPayload = pipe([assign({ Plan: () => ({}) })]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSMContacts.html
exports.SSMContactsContact = () => ({
  type: "Contact",
  package: "ssm-contacts",
  client: "SSMContacts",
  propertiesDefault: {},
  omitProperties: ["ContactId", "Plan"],
  inferName: () =>
    pipe([
      get("Alias"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Alias"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("ContactId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException", "ValidationException"],
  dependencies: {},
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSMContacts.html#getContact-property
  getById: {
    method: "getContact",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSMContacts.html#listContacts-property
  getList: {
    method: "listContacts",
    getParam: "Contacts",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSMContacts.html#createContact-property
  create: {
    filterPayload,
    method: "createContact",
    pickCreated: ({ payload }) => pipe([toContactId]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSMContacts.html#updateContact-property
  update: {
    method: "updateContact",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, filterPayload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSMContacts.html#deleteContact-property
  destroy: {
    method: "deleteContact",
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
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        Plan: {},
      }),
    ])(),
});
