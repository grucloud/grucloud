const assert = require("assert");
const { pipe, tap, get, pick, assign, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./SESV2Common");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const assignArn = ({ config }) =>
  pipe([
    tap(({ ContactListName }) => {
      assert(ContactListName);
    }),
    assign({
      Arn: pipe([
        ({ ContactListName }) =>
          `arn:${config.partition}:ses:${
            config.region
          }:${config.accountId()}:contact-list:${ContactListName}`,
      ]),
    }),
  ]);

const pickId = pipe([
  tap(({ ContactListName }) => {
    assert(ContactListName);
  }),
  pick(["ContactListName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignArn({ config }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESV2.html
exports.SESV2ContactList = () => ({
  type: "ContactList",
  package: "sesv2",
  client: "SESv2",
  propertiesDefault: {},
  omitProperties: ["Arn", "CreatedTimestamp", "LastUpdatedTimestamp"],
  inferName: () =>
    pipe([
      get("ContactListName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("ContactListName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("ContactListName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["NotFoundException"],
  dependencies: {
    snsTopics: {
      type: "Topic",
      group: "SNS",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("Topics"),
          map(
            pipe([
              get("TopicName"),
              lives.getByName({
                type: "Topic",
                group: "SNS",
                providerName: config.providerName,
              }),
              get("id"),
            ])
          ),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESV2.html#getContactList-property
  getById: {
    method: "getContactList",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESV2.html#listContactLists-property
  getList: {
    method: "listContactLists",
    getParam: "ContactLists",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESV2.html#createContactList-property
  create: {
    method: "createContactList",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESV2.html#updateContactList-property
  update: {
    method: "updateContactList",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESV2.html#deleteContactList-property
  destroy: {
    method: "deleteContactList",
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
      }),
    ])(),
});
