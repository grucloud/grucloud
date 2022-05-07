const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  eq,
  and,
  switchCase,
  or,
  not,
  map,
  assign,
} = require("rubico");
const {
  defaultsDeep,
  values,
  size,
  isDeepEqual,
  append,
  find,
  isEmpty,
} = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./EC2Common");

const createModel = ({ config }) => ({
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: [
    "InvalidDhcpOptionID.NotFound",
    "InvalidDhcpOptionsID.NotFound",
  ],

  getById: {
    pickId: pipe([
      tap(({ DhcpOptionsId }) => {
        assert(DhcpOptionsId);
      }),
      ({ DhcpOptionsId }) => ({ DhcpOptionsIds: [DhcpOptionsId] }),
    ]),
    method: "describeDhcpOptions",
    decorate: ({ endpoint }) =>
      pipe([
        tap((params) => {
          assert(endpoint);
        }),
      ]),
  },
  getList: {
    method: "describeDhcpOptions",
    getParam: "DhcpOptions",
    decorate: ({ endpoint, getById }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        assign({
          DhcpConfigurations: pipe([
            get("DhcpConfigurations"),
            map(
              assign({
                Values: pipe([
                  get("Values"),
                  tap((params) => {
                    assert(true);
                  }),
                  map(
                    pipe([
                      tap((params) => {
                        assert(true);
                      }),
                      get("Value"),
                      tap((params) => {
                        assert(true);
                      }),
                    ])
                  ),
                ]),
              })
            ),
            tap((params) => {
              assert(true);
            }),
          ]),
        }),
      ]),
  },
  create: {
    method: "createDhcpOptions",
    pickCreated: ({ payload }) => pipe([get("DhcpOptions")]),
  },
  destroy: {
    method: "deleteDhcpOptions",
    pickId: pipe([
      tap(({ DhcpOptionsId }) => {
        assert(DhcpOptionsId);
      }),
      pick(["DhcpOptionsId"]),
    ]),
  },
});

const findId = pipe([
  get("live.DhcpOptionsId"),
  tap((DhcpOptionsId) => {
    assert(DhcpOptionsId);
  }),
]);

const domainNameByRegion = pipe([
  tap(({ region }) => {
    assert(region);
  }),
  switchCase([
    eq(get("region"), "us-east-1"),
    () => "ec2.internal",
    pipe([get("region"), append(".compute.internal")]),
  ]),
]);

const managedByOther = (config) =>
  pipe([
    get("live"),
    or([
      and([
        pipe([get("Tags"), isEmpty]),
        pipe([
          get("DhcpConfigurations"),
          and([
            eq(size, 2),
            pipe([
              find(eq(get("Key"), "domain-name")),
              ({ Values }) => isDeepEqual(Values, [domainNameByRegion(config)]),
            ]),
            pipe([
              find(eq(get("Key"), "domain-name-servers")),
              ({ Values }) => isDeepEqual(Values, ["AmazonProvidedDNS"]),
            ]),
          ]),
        ]),
      ]),
      not(eq(get("OwnerId"), config.accountId())),
    ]),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkDhcpOptions.html
exports.EC2DhcpOptions = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName: findNameInTagsOrId({ findId }),
    findId,
    cannotBeDeleted: managedByOther(config),
    managedByOther: managedByOther(config),
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: {},
    }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => otherProps,
        defaultsDeep({
          TagSpecifications: [
            {
              ResourceType: "dhcp-options",
              Tags: buildTags({ config, namespace, name, UserTags: Tags }),
            },
          ],
        }),
        tap((params) => {
          assert(true);
        }),
      ])(),
  });
