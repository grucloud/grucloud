const assert = require("assert");
const { GoogleProvider } = require("@grucloud/core");

exports.createStack = async ({ config }) => {
  const { domain } = config;
  assert(domain, "missing domain");

  const provider = await GoogleProvider({ config });

  const dnsManagedZone = await provider.makeDnsManagedZone({
    name: "domain",
    properties: ({}) => {
      return {
        dnsName: `${domain}`,
        recordSet: [
          {
            name: `${domain}`,
            rrdatas: ["185.199.108.153", "185.199.109.153"],
            ttl: 86400,
            type: "A",
          },
          {
            name: `www.${domain}`,
            rrdatas: ["grucloud.github.io."],
            ttl: 86400,
            type: "CNAME",
          },
          {
            name: `${domain}`,
            rrdatas: [
              "google-site-verification=tj8w3suJVy6A375rFuxETx1DkLSVRJzbX_0XUAjNhog",
            ],
            ttl: 86400,
            type: "TXT",
          },
          {
            name: `${domain}`,
            rrdatas: ["1 ASPMX.L.GOOGLE.COM.", "5 ALT1.ASPMX.L.GOOGLE.COM."],
            ttl: 86400,
            type: "MX",
          },
        ],
      };
    },
  });

  return {
    provider,
  };
};
