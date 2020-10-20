const path = require("path");
const chance = require("chance")();

const { GoogleProvider } = require("@grucloud/core");

exports.createStack = async ({ config }) => {
  const bucketName = "gcp-grucloud";
  const domain = "gcp.grucloud.com";

  const provider = await GoogleProvider({ config });
  /*
  const myBucket = await provider.makeBucket({
    name: bucketName,
    properties: () => ({}),
  });
  
  const file = await provider.makeObject({
    name: `myfile`,
    dependencies: { bucket: myBucket },
    properties: () => ({
      path: "/",
      contentType: "text/json",
      source: path.join(process.cwd(), "package.json"),
    }),
  });

  const sslCertificate = await provider.makeSslCertificate({
    name: "ssl-certificate",
    properties: () => ({
      managed: {
        domains: [domain],
      },
    }),
  });

  const backendBucket = await provider.makeBackendBucket({
    name: "backend-bucket",
    properties: () => ({
      bucketName,
    }),
  });

  const urlMap = await provider.makeUrlMap({
    name: "url-map",
    dependencies: { service: backendBucket },
    properties: () => ({}),
  });

  const httpsTargetProxy = await provider.makeHttpsTargetProxy({
    name: "https-target-proxy",
    dependencies: { sslCertificate, urlMap },
    properties: () => ({}),
  });

  const globalForwardingRule = await provider.makeGlobalForwardingRule({
    name: "global-forwarding-rule",
    dependencies: { httpsTargetProxy },
    properties: () => ({}),
  });
*/
  const dnsManagedZone = await provider.makeDnsManagedZone({
    name: "dns-managed-zone",
    properties: () => ({ dnsName: `${domain}.` }),
  });

  const dnsResourceRecordSet = await provider.makeDnsResourceRecordSet({
    name: "resource-record-set",
    dependencies: { dnsManagedZone },
    properties: () => ({ dnsName: `${domain}.` }),
  });

  return {
    provider,
  };
};
