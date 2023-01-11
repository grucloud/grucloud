const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, find, first } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  pick(["DomainName", "ServiceArn"]),
  tap(({ DomainName, ServiceArn }) => {
    assert(DomainName);
    assert(ServiceArn);
  }),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
  ]);

const findName = () =>
  pipe([
    get("DomainName"),
    tap((name) => {
      assert(name);
    }),
  ]);

exports.AppRunnerCustomDomain = ({ compare }) => ({
  type: "CustomDomain",
  package: "apprunner",
  client: "AppRunner",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  findName,
  inferName: findName,
  findId: () =>
    pipe([
      get("DomainName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    service: {
      type: "Service",
      group: "AppRunner",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("ServiceArn"),
          tap((id) => {
            assert(id);
          }),
        ]),
    },
  },
  propertiesDefault: { EnableWWWSubdomain: false },
  omitProperties: ["ServiceArn", "Status", "CertificateValidationRecords"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppRunner.html#describeCustomDomain-property
  getById: {
    method: "describeCustomDomains",
    pickId: pipe([
      pick(["ServiceArn"]),
      tap(({ ServiceArn }) => {
        assert(ServiceArn);
      }),
    ]),
    decorate: ({ live }) =>
      pipe([
        tap((params) => {
          assert(live.DomainName);
        }),
        get("CustomDomains"),
        find(eq(get("DomainName"), live.DomainName)),
      ]),
  },
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Service", group: "AppRunner" },
          pickKey: pipe([
            pick(["ServiceArn"]),
            tap(({ ServiceArn }) => {
              assert(ServiceArn);
            }),
          ]),
          method: "describeCustomDomains",
          getParam: "CustomDomains",
          config,
          decorate: ({ parent }) =>
            pipe([
              defaultsDeep({ ServiceArn: parent.ServiceArn }),
              decorate({ endpoint, live: parent }),
            ]),
        }),
    ])(),
  create: {
    method: "associateCustomDomain",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([
      get("CertificateValidationRecords"),
      first,
      get("Name"),
    ]),
  },
  // No Update
  destroy: {
    method: "disassociateCustomDomain",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { service },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(service);
      }),
      () => otherProps,
      defaultsDeep({ ServiceArn: getField(service, "ServiceArn") }),
    ])(),
});
