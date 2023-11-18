const assert = require("assert");
const { pipe, tap, get, switchCase, eq } = require("rubico");

const logger = require("@grucloud/core/logger")({ prefix: "EKSCluster" });
const { retryCall } = require("@grucloud/core/Retry");
const { shellRun } = require("@grucloud/core/utils/shellRun");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "resourceArn",
  TagsKey: "tags",
  UnTagsKey: "tagKeys",
});

exports.waitForUpdate =
  ({ endpoint }) =>
  (params) =>
    pipe([
      tap((params) => {
        assert(endpoint);
      }),
      () =>
        retryCall({
          name: `describeUpdate: ${JSON.stringify(params)}`,
          fn: pipe([
            () => params,
            tap((params) => {
              logger.debug(`describeUpdate:  ${JSON.stringify(params)}`);
            }),
            // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#describeUpdate-property
            endpoint().describeUpdate,
            get("update"),
            switchCase([
              eq(get("status"), "Failed"),
              () => {
                throw Error(`fail to update the cluster`);
              },
              eq(get("status"), "Cancelled"),
              () => {
                throw Error(`cluster update cancelled`);
              },
              eq(get("status"), "InProgress"),
              () => {
                logger.debug(`cluster InProgress`);
              },
              eq(get("status"), "Successful"),
              () => true,
              ({ status }) => {
                logger.debug(`cluster: not a known status: '${status}'`);
              },
            ]),
          ]),
          config: { retryCount: 12 * 20, retryDelay: 5e3 },
        }),
    ])();

exports.kubeConfigUpdate = ({ name, config }) =>
  pipe([
    tap(() => {
      assert(name);
      assert(config);
      logger.debug(`kubeConfigUpdate: ${name}, region ${config.region}`);
    }),
    tap.if(
      () => !process.env.CONTINUOUS_INTEGRATION,
      pipe([
        () =>
          `aws eks --region ${config.region} update-kubeconfig --name ${name}`,
        shellRun,
      ])
    ),
  ])();

exports.kubeConfigRemove =
  ({ endpoint }) =>
  ({ arn }) =>
    pipe([
      tap(() => {
        //assert(arn);
        logger.debug(`kubeConfigRemove: ${arn}`);
      }),
      tap.if(
        () => !process.env.CONTINUOUS_INTEGRATION && arn,
        pipe([
          () =>
            `kubectl config delete-context ${arn}; kubectl config delete-cluster ${arn}`,
          shellRun,
        ])
      ),
    ])();
