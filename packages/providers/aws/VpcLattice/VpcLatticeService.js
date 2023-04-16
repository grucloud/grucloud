const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, isIn, when, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const toServiceIdentifier = pipe([
  tap(({ id }) => {
    assert(id);
  }),
  ({ id, ...other }) => ({
    serviceIdentifier: id,
    ...other,
  }),
]);

const { Tagger, assignTags } = require("./VpcLatticeCommon");

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ serviceIdentifier }) => {
    assert(serviceIdentifier);
  }),
  pick(["serviceIdentifier"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    toServiceIdentifier,
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html
exports.VpcLatticeService = () => ({
  type: "Service",
  package: "vpc-lattice",
  client: "VPCLattice",
  propertiesDefault: {},
  omitProperties: [
    "arn",
    "certificateArn",
    "serviceIdentifier",
    "status",
    "failureMessage",
    "failureCode",
    "dnsEntry",
    "lastUpdatedAt",
    "createdAt",
  ],
  inferName: () =>
    pipe([
      get("name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("name"),
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
  dependencies: {
    certificate: {
      type: "Certificate",
      group: "ACM",
      dependencyId: ({ lives, config }) => get("certificateArn"),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#getService-property
  getById: {
    method: "getService",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#listServices-property
  getList: {
    method: "listServices",
    getParam: "items",
    decorate: ({ getById }) => pipe([toServiceIdentifier, getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#createService-property
  create: {
    method: "createService",
    pickCreated: ({ payload }) => pipe([toServiceIdentifier]),
    isInstanceUp: pipe([get("status"), isIn(["ACTIVE"])]),
    isInstanceError: pipe([get("status"), isIn(["CREATE_FAILED"])]),
    getErrorMessage: pipe([get("failureMessage", "CREATE_FAILED")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#updateService-property
  update: {
    method: "updateService",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, toServiceIdentifier, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#deleteService-property
  destroy: {
    method: "deleteService",
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
    properties: { tags, ...otherProps },
    dependencies: { certificate },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
      when(
        () => certificate,
        defaultsDeep({
          certificateArn: getField(certificate, "CertificateArn"),
        })
      ),
    ])(),
});
