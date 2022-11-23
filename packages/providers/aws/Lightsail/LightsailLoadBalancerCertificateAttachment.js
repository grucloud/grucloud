const assert = require("assert");
const { pipe, tap, get, pick, switchCase } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsResource } = require("../AwsClient");

const findName = () => pipe([get("loadBalancerName")]);

const pickId = pipe([
  tap(({ loadBalancerName, instanceName }) => {
    assert(loadBalancerName);
    assert(instanceName);
  }),
  ({ loadBalancerName, instanceName }) => ({
    loadBalancerName,
    instanceNames: [instanceName],
  }),
]);
const decorate = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(live);
    }),
    switchCase([
      get("isAttached"),
      ({ name, loadBalancerName }) => ({
        certificateName: name,
        loadBalancerName,
      }),
      () => undefined,
    ]),
  ]);

const model = ({ config }) => ({
  package: "lightsail",
  client: "Lightsail",
  ignoreErrorCodes: ["DoesNotExist"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#getLoadBalancer-property
  getById: {
    method: "getLoadBalancerTlsCertificates",
    getField: "tlsCertificates",
    pickId: pipe([
      tap(({ loadBalancerName }) => {
        assert(loadBalancerName);
      }),
      pick(["loadBalancerName"]),
    ]),
    decorate: ({ endpoint, live }) =>
      pipe([
        tap((params) => {
          assert(live);
        }),
        switchCase([
          get("isAttached"),
          ({ name, loadBalancerName }) => ({
            certificateName: name,
            loadBalancerName,
          }),
          () => undefined,
        ]),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#attachLoadBalancerTlsCertificate-property
  create: {
    filtePayload: pickId,
    method: "attachLoadBalancerTlsCertificate",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // No detach API
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html
exports.LightsailLoadBalancerCertificateAttachment = ({ compare }) => ({
  type: "LoadBalancerCertificateAttachment",
  propertiesDefault: {},
  omitProperties: ["loadBalancerName"],
  inferName: ({ dependenciesSpec: { certificate } }) =>
    pipe([
      tap((params) => {
        assert(certificate);
      }),
      () => certificate,
    ]),
  cannotBeDeleted: () => () => true,
  dependencies: {
    loadBalancer: {
      type: "LoadBalancer",
      group: "Lightsail",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("loadBalancerName")]),
    },
    certificate: {
      type: "Certificate",
      group: "Lightsail",
      dependencyId: ({ lives, config }) => pipe([get("certificateName")]),
    },
  },
  Client: ({ spec, config }) =>
    createAwsResource({
      model: model({ config }),
      spec,
      config,
      findName,
      findId: findName,
      getByName: ({ getById }) =>
        pipe([
          ({ name, resolvedDependencies: { certificate } }) => ({
            loadBalancerName: certificate.live.loadbalancerName,
            certificateName: certificate.live.certificateName,
          }),
          tap((params) => {
            assert(true);
          }),
          getById({}),
        ]),
      getList: ({ client, endpoint, getById, config }) =>
        pipe([
          () =>
            client.getListWithParent({
              parent: { type: "LoadBalancerCertificate", group: "Lightsail" },
              pickKey: pipe([pick(["loadBalancerName"])]),
              method: "getLoadBalancerTlsCertificates",
              getParam: "tlsCertificates",
              config,
              decorate,
            }),
        ])(),
      configDefault: ({
        properties: { ...otherProps },
        dependencies: { loadBalancer, certificate },
      }) =>
        pipe([
          tap((params) => {
            assert(loadBalancer);
            assert(certificate);
          }),
          () => otherProps,
          defaultsDeep({
            loadBalancerName: loadBalancer.config.loadBalancerName,
            certificateName: certificate.config.certificateName,
          }),
          tap(({ loadBalancerName, certificateName }) => {
            assert(loadBalancerName);
            assert(certificateName);
          }),
        ])(),
    }),
});
