const assert = require("assert");
const { SSM } = require("@aws-sdk/client-ssm");
const fs = require("fs").promises;
const path = require("path");
const { pipe, tap, map } = require("rubico");
const { pluck, callProp } = require("rubico/x");

const ssm = new SSM({});

const listApi =
  ({ client, method, property }) =>
  async (payload) => {
    let NextToken;
    let data = [];
    do {
      const result = await client[method]({
        NextToken,
        ...payload,
      });
      NextToken = result.NextToken;
      data = [...data, ...result[property]];
    } while (NextToken);
    return data;
  };

// https://aws.amazon.com/blogs/aws/new-query-for-aws-regions-endpoints-and-more-using-aws-systems-manager-parameter-store/
const fetchServiceAvailability = () =>
  pipe([
    () => ({
      Path: `/aws/service/global-infrastructure/regions`,
    }),
    listApi({
      client: ssm,
      method: "getParametersByPath",
      property: "Parameters",
    }),
    pluck("Value"),
    map.pool(6, (region) =>
      pipe([
        () => region,
        fetchServiceAvailabilityPerRegion,
        (services) => ({ region, services }),
      ])()
    ),
    callProp("sort", (a, b) => a.region.localeCompare(b.region)),
  ])();

const fetchServiceAvailabilityPerRegion = (region) =>
  pipe([
    tap((params) => {
      assert(ssm);
      assert(region);
    }),
    () => ({
      Path: `/aws/service/global-infrastructure/regions/${region}/services`,
    }),
    listApi({
      client: ssm,
      method: "getParametersByPath",
      property: "Parameters",
    }),
    pluck("Value"),
    callProp("sort", (a, b) => a.localeCompare(b)),
  ])();

exports.fetchServiceAvailability = fetchServiceAvailability;

exports.saveFile =
  ({ filename }) =>
  (content) =>
    pipe([
      tap((params) => {
        assert(content);
        assert(filename);
      }),
      () => path.resolve(__dirname, filename),
      (filenameResolved) =>
        fs.writeFile(filenameResolved, JSON.stringify(content, null, 4)),
    ])();
