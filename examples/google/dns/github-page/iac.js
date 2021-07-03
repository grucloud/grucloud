const assert = require("assert");
const { GoogleProvider } = require("@grucloud/provider-google");

exports.createStack = async () => {
  const provider = GoogleProvider({ config: require("./config") });

  const { domain } = provider.config;
  assert(domain, "missing domain");

  const dnsManagedZone = await provider.dns.makeManagedZone({
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
