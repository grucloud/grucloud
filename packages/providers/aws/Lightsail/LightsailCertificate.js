const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./LightsailCommon");

const buildArn = () =>
  pipe([
    get("certificateName"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ certificateName }) => {
    assert(certificateName);
  }),
  pick(["certificateName"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html
exports.LightsailCertificate = () => ({
  type: "Certificate",
  package: "lightsail",
  client: "Lightsail",
  propertiesDefault: {},
  inferName: () => get("certificateName"),
  omitProperties: [
    "createdAt",
    "arn",
    "supportCode",
    "resourceType",
    "issuedAt",
    "notBefore",
    "notAfter",
    "renewalSummary",
    "revokedAt",
    "revocationReason",
  ],
  findName: () =>
    pipe([
      get("certificateName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("certificateName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ certificateName: name }), getById({})]),
  update:
    ({ endpoint, getById }) =>
    async ({ payload, live, diff }) =>
      pipe([
        tap((params) => {
          assert(false, "cannot update certificate");
        }),
      ])(),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: {},
    config,
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

  ignoreErrorCodes: ["NotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#getCertificate-property
  getById: {
    method: "getCertificates",
    getField: "certificates",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#getCertificates-property
  getList: {
    enhanceParams: () => () => ({ includeCertificateDetails: true }),
    method: "getCertificates",
    getParam: "certificates",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#createCertificate-property
  create: {
    method: "createCertificate",
    pickCreated: ({ payload }) => pipe([get("certificate")]),

    // isInstanceUp: pipe([eq(get("certificateDetail.status"), "PENDING_VALIDATION")]),
    // isInstanceError: pipe([eq(get("certificateDetail.status"), "FAILED")]),
    // getErrorMessage: get("requestFailureReason", "error"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#deleteCertificate-property
  destroy: {
    method: "deleteCertificate",
    pickId,
  },
});
