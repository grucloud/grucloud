const assert = require("assert");
const { pipe, tap, get, pick, map, or } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");

const { Tagger } = require("./LightsailCommon");

const buildArn = () =>
  pipe([
    get("domainName"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ domainName }) => {
    assert(domainName);
  }),
  pick(["domainName"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    ({ name, ...other }) => ({ domainName: name, ...other }),
  ]);

const model = ({ config }) => ({
  package: "lightsail",
  client: "Lightsail",
  ignoreErrorCodes: ["DoesNotExist"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#getDomain-property
  getById: {
    method: "getDomain",
    getField: "domain",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#getDomains-property
  getList: {
    method: "getDomains",
    getParam: "domains",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#createDomain-property
  create: {
    method: "createDomain",
    pickCreated: ({ payload }) => pipe([() => payload]),
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#createDomainEntry-property
    postCreate: ({ endpoint, payload, created }) =>
      pipe([
        () => payload,
        get("domainEntries"),
        map(
          pipe([
            tap((params) => {
              assert(true);
            }),
            pick(["id", "isAlias", "name", "target", "type"]),
            (domainEntry) => ({
              domainEntry,
              domainName: payload.domainName,
            }),
            endpoint().createDomainEntry,
            tap((params) => {
              assert(true);
            }),
          ])
        ),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#deleteDomain-property
  destroy: {
    method: "deleteDomain",
    pickId,
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html
exports.LightsailDomain = ({ compare }) => ({
  type: "Domain",
  propertiesDefault: {},
  omitProperties: [
    "arn",
    "supportCode",
    "resourceType",
    "createdAt",
    "state",
    "registeredDomainDelegationInfo",
    //TODO,
    //"domainEntries[].id"
  ],
  inferName: get("properties.domainName"),
  // compare: compare({
  //   filterTarget: () => pipe([omit(["compare"])]),
  // }),
  Client: ({ spec, config }) =>
    createAwsResource({
      model: model({ config }),
      spec,
      config,
      findName: () =>
        pipe([
          get("domainName"),
          tap((name) => {
            assert(name);
          }),
        ]),
      findId: () =>
        pipe([
          get("arn"),
          tap((id) => {
            assert(id);
          }),
        ]),
      getByName: ({ getById }) =>
        pipe([({ name }) => ({ domainName: name }), getById({})]),
      ...Tagger({ buildArn: buildArn(config) }),
      update:
        ({ endpoint, getById }) =>
        async ({ payload, live, diff }) =>
          pipe([
            tap((params) => {
              assert(payload.domainName);
            }),
            () => diff,
            //TODO updated
            get("liveDiff"),
            tap.if(
              or([get("added.domainEntries")]),
              pipe([
                get("added.domainEntries"),
                tap((params) => {
                  assert(true);
                }),
                map(
                  pipe([
                    tap((params) => {
                      assert(true);
                    }),
                    (domainEntry) => ({
                      domainEntry,
                      domainName: payload.domainName,
                    }),
                    endpoint().createDomainEntry,
                  ])
                ),
              ])
            ),
            tap.if(
              or([get("deleted.domainEntries")]),
              pipe([
                get("deleted.domainEntries"),
                tap((params) => {
                  assert(true);
                }),
                map(
                  pipe([
                    tap((params) => {
                      assert(true);
                    }),
                    (domainEntry) => ({
                      domainEntry,
                      domainName: payload.domainName,
                    }),
                    endpoint().deleteDomainEntry,
                  ])
                ),
              ])
            ),
          ])(),
      configDefault: ({
        name,
        namespace,
        properties: { Tags, ...otherProps },
        dependencies: {},
      }) =>
        pipe([
          () => otherProps,
          defaultsDeep({
            tags: buildTags({
              name,
              config,
              namespace,
              UserTags: tags,
              key: "key",
              value: "value",
            }),
          }),
        ])(),
    }),
});
