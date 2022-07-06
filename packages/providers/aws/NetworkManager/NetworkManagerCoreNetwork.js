const assert = require("assert");
const { pipe, tap, get, pick, eq, assign, tryCatch } = require("rubico");
const { defaultsDeep, includes, when } = require("rubico/x");
const util = require("util");

const { retryCall } = require("@grucloud/core/Retry");
const logger = require("@grucloud/core/logger")({ prefix: "CoreNetwork" });
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./NetworkManagerCommon");

const assignPolicyDocument = assign({
  PolicyDocument: pipe([get("PolicyDocument"), JSON.stringify]),
});

const createModel = ({ config }) => ({
  package: "networkmanager",
  client: "NetworkManager",
  region: "us-west-2",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  getById: {
    method: "getCoreNetwork",
    pickId: pipe([pick(["CoreNetworkId"])]),
    getField: "CoreNetwork",
    decorate:
      ({ endpoint }) =>
      (live) =>
        pipe([
          () => live,
          pick(["CoreNetworkId"]),
          endpoint().getCoreNetworkPolicy,
          get("CoreNetworkPolicy"),
          assign({
            PolicyDocument: pipe([get("PolicyDocument"), JSON.parse]),
          }),
          pick(["PolicyDocument", "PolicyVersionId"]),
          defaultsDeep(live),
        ])(),
  },
  getList: {
    method: "listCoreNetworks",
    getParam: "CoreNetworks",
    decorate: ({ endpoint, getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#createCoreNetwork-property
  create: {
    method: "createCoreNetwork",
    pickCreated: ({ payload }) => pipe([get("CoreNetwork")]),
    isInstanceUp: pipe([eq(get("State"), "AVAILABLE")]),
    filterPayload: pipe([assignPolicyDocument]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#deleteCoreNetwork-property
  destroy: {
    method: "deleteCoreNetwork",
    pickId: pipe([pick(["CoreNetworkId"])]),
  },
});

const findId = pipe([get("live.CoreNetworkId")]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#updateCoreNetwork-property
const updateCoreNetwork =
  ({ endpoint }) =>
  ({ payload, diff, live, lives }) =>
    pipe([
      () => live,
      pick(["CoreNetworkId"]),
      defaultsDeep({ Description: payload.Description }),
      endpoint().updateCoreNetwork,
    ])();

const updateCoreNetworkPolicy =
  ({ endpoint }) =>
  ({ payload, diff, live, lives }) =>
    pipe([
      () => live,
      pick(["CoreNetworkId"]),
      assign({
        PolicyDocument: pipe([
          () => payload,
          get("PolicyDocument"),
          JSON.stringify,
        ]),
      }),
      tryCatch(pipe([endpoint().putCoreNetworkPolicy]), (error) =>
        pipe([
          tap((params) => {
            logger.error(`putCoreNetworkPolicy:${util.inspect(error)} `);
          }),
        ])()
      ),
      () =>
        retryCall({
          name: `getCoreNetwork`,
          fn: pipe([
            () => live,
            pick(["CoreNetworkId"]),
            defaultsDeep({ Alias: "LATEST" }),
            endpoint().getCoreNetworkPolicy,
            get("CoreNetworkPolicy"),
          ]),
          config: { retryCount: 40, retryDelay: 5e3 },
          isExpectedResult: pipe([
            ({ ChangeSetState }) =>
              pipe([
                () => ["EXECUTION_SUCCEEDED", "READY_TO_EXECUTE"],
                includes(ChangeSetState),
              ])(),
          ]),
        }),
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#executeCoreNetworkChangeSet-property
      when(
        eq(get("ChangeSetState"), "READY_TO_EXECUTE"),
        pipe([
          pick(["CoreNetworkId", "PolicyVersionId"]),
          endpoint().executeCoreNetworkChangeSet,
          () =>
            retryCall({
              name: `getCoreNetwork`,
              fn: pipe([
                () => live,
                pick(["CoreNetworkId"]),
                defaultsDeep({ Alias: "LATEST" }),
                endpoint().getCoreNetworkPolicy,
                get("CoreNetworkPolicy"),
              ]),
              config: { retryCount: 40, retryDelay: 5e3 },
              isExpectedResult: pipe([
                tap(({ ChangeSetState }) => {
                  logger.info(
                    `putCoreNetworkPolicy: ChangeSetState: ${ChangeSetState} `
                  );
                }),
                eq(get("ChangeSetState"), "EXECUTION_SUCCEEDED"),
              ]),
            }),
        ])
      ),
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html
exports.NetworkManagerCoreNetwork = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName: findNameInTagsOrId({ findId }),
    findId,
    pickId: pipe([pick(["CoreNetworkArn"])]),
    findDependencies: ({ live }) => [
      {
        type: "GlobalNetwork",
        group: "NetworkManager",
        ids: [live.GlobalNetworkId],
      },
    ],
    update:
      ({ endpoint }) =>
      ({ payload, name, namespace, diff, live, lives }) =>
        pipe([
          () => ({ payload, diff, live }),
          tap.if(
            get("diff.liveDiff.updated.Description"),
            updateCoreNetwork({ endpoint })
          ),
          tap.if(
            get("diff.liveDiff.updated.PolicyDocument"),
            updateCoreNetworkPolicy({ endpoint })
          ),
        ])(),
    getByName: getByNameCore,
    tagResource: tagResource({ property: "CoreNetworkArn" }),
    untagResource: untagResource({ property: "CoreNetworkArn" }),
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { globalNetwork },
    }) =>
      pipe([
        tap((params) => {
          assert(globalNetwork);
        }),
        () => otherProps,
        defaultsDeep({
          GlobalNetworkId: getField(globalNetwork, "GlobalNetworkId"),
          Tags: buildTags({ config, namespace, name, UserTags: Tags }),
        }),
      ])(),
  });
