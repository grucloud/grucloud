const assert = require("assert");
const { map, pipe, tap, get, switchCase, pick, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { AwsClient } = require("../AwsClient");

const logger = require("@grucloud/core/logger")({ prefix: "EKSNodeGroup" });
const { tos } = require("@grucloud/core/tos");

const { getByNameCore, buildTagsObject } = require("@grucloud/core/Common");
const { findNamespaceInTagsObject } = require("../AwsCommon");

const { getField } = require("@grucloud/core/ProviderCommon");
const {
  createEKS,
  waitForUpdate,
  tagResource,
  untagResource,
} = require("./EKSCommon");
const findName = get("live.nodegroupName");
const findId = get("live.nodegroupArn");
const pickId = pick(["nodegroupName", "clusterName"]);
const ignoreErrorCodes = ["ResourceNotFoundException"];

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html
exports.EKSNodeGroup = ({ spec, config }) => {
  const eks = createEKS(config);
  const client = AwsClient({ spec, config })(eks);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#describeNodegroup-property
  const getById = client.getById({
    pickId,
    method: "describeNodegroup",
    getField: "nodegroup",
    ignoreErrorCodes,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#listNodegroups-property
  const getList = client.getListWithParent({
    parent: { type: "Cluster", group: "EKS" },
    pickKey: ({ name }) => ({ clusterName: name }),
    method: "listNodegroups",
    getParam: "nodegroups",
    config,
    decorate: ({ lives, parent: { name } }) =>
      pipe([
        tap(() => {
          assert(name);
        }),
        (nodegroupName) => ({ clusterName: name, nodegroupName }),
        getById,
      ]),
  });

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#createNodegroup-property
  const create = client.create({
    method: "createNodegroup",
    pickId,
    pickCreated: () => get("nodegroup"),
    isInstanceError: eq(get("status"), "CREATE_FAILED"),
    isInstanceUp: eq(get("status"), "ACTIVE"),
    getById,
    configIsUp: { retryCount: 12 * 25, retryDelay: 5e3 },
  });

  //TODO
  /*
    labels: {
    addOrUpdateLabels: {
      '<labelKey>': 'STRING_VALUE',
       '<labelKey>': ... 
    },
    removeLabels: [
      'STRING_VALUE',
       more items 
    ]
  },
  */

  // TODO instanceTypes needs a destroy

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#updateNodegroupConfig-property
  // TODO update
  const update = ({ name, payload, diff, live }) =>
    pipe([
      tap(() => {
        logger.info(`updateNodegroupConfig: ${name}`);
        logger.debug(tos({ payload, diff, live }));
      }),
      () => payload,
      pick([
        "clusterName",
        "nodegroupName",
        //"labels", //TODO
        "scalingConfig",
        //"taints", //TODO
        "updateConfig",
      ]),
      eks().updateNodegroupConfig,
      get("update"),
      tap((result) => {
        logger.info(`updateNodegroupConfig: ${tos({ result })}`);
      }),
      get("id"),
      (updateId) =>
        waitForUpdate({ eks })({
          name: live.clusterName,
          nodegroupName: live.nodegroupName,
          updateId,
        }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#deleteNodegroup-property
  const destroy = client.destroy({
    pickId,
    method: "deleteNodegroup",
    getById,
    ignoreErrorCodes,
    config,
  });

  const configDefault = ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { cluster, role, subnets, launchTemplate },
  }) =>
    pipe([
      () => otherProps,
      tap((params) => {
        assert(cluster, "missing 'cluster' dependency");
        assert(role, "missing 'role' dependency");
        assert(subnets, "missing 'subnets' dependency");
      }),
      defaultsDeep({
        subnets: map((subnet) => getField(subnet, "SubnetId"))(subnets),
        nodeRole: getField(role, "Arn"),
        clusterName: cluster.config.name,
        nodegroupName: name,
        capacityType: "ON_DEMAND",
        scalingConfig: {
          minSize: 1,
          maxSize: 1,
          desiredSize: 1,
        },
        tags: buildTagsObject({ config, namespace, name, userTags: tags }),
      }),
      switchCase([
        () => launchTemplate,
        defaultsDeep({
          launchTemplate: {
            id: getField(launchTemplate, "LaunchTemplateId"),
          },
        }),
        defaultsDeep({
          amiType: "AL2_x86_64",
          instanceTypes: ["t3.medium"],
          diskSize: 20,
        }),
      ]),
    ])();

  return {
    spec,
    findId,
    findNamespace: findNamespaceInTagsObject(config),
    getById,
    getByName,
    findName,
    update,
    create,
    destroy,
    getList,
    configDefault,
    tagResource: tagResource({ eks }),
    untagResource: untagResource({ eks }),
  };
};
