const assert = require("assert");
const { pipe, tap, get, switchCase, eq } = require("rubico");

const logger = require("@grucloud/core/logger")({ prefix: "EKSCluster" });
const { retryCall } = require("@grucloud/core/Retry");

const { EKS } = require("@aws-sdk/client-eks");
const { createEndpoint } = require("../AwsCommon");

exports.createEKS = createEndpoint(EKS);

exports.waitForUpdate =
  ({ eks }) =>
  (params) =>
    pipe([
      () =>
        retryCall({
          name: `describeUpdate: ${JSON.stringify(params)}`,
          fn: pipe([
            () => params,
            tap((params) => {
              logger.debug(`describeUpdate:  ${JSON.stringify(params)}`);
            }),
            // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#describeUpdate-property
            eks().describeUpdate,
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
