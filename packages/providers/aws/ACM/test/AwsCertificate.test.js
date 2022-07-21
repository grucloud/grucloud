const assert = require("assert");
const { pipe, tap, get } = require("rubico");

const { AwsProvider } = require("../../AwsProvider");
const { getCommonNameFromCertificate } = require("../AwsCertificate");

const certificatePem = `-----BEGIN CERTIFICATE-----
MIICfzCCAegCCQDxxeXw914Y2DANBgkqhkiG9w0BAQsFADCBgzELMAkGA1UEBhMC
SU4xEzARBgNVBAgMCldlc3RiZW5nYWwxEDAOBgNVBAcMB0tvbGthdGExFDASBgNV
BAoMC1BhbmNvLCBJbmMuMRUwEwYDVQQDDAxSb2hpdCBQcmFzYWQxIDAeBgkqhkiG
9w0BCQEWEXJvZm9mb2ZAZ21haWwuY29tMB4XDTIwMDkwOTA1NTExN1oXDTIwMTAw
OTA1NTExN1owgYMxCzAJBgNVBAYTAklOMRMwEQYDVQQIDApXZXN0YmVuZ2FsMRAw
DgYDVQQHDAdLb2xrYXRhMRQwEgYDVQQKDAtQYW5jbywgSW5jLjEVMBMGA1UEAwwM
Um9oaXQgUHJhc2FkMSAwHgYJKoZIhvcNAQkBFhFyb2ZvZm9mQGdtYWlsLmNvbTCB
nzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEAt/EfcF3FG4TneOBWr4JhOUdyuCXm
Dhy5yO3VKtQfPxr+5d0joCSnn/5vYDNSr1MfedZmqVxrXFoMAdPCd71BNmDmeLVi
QK61WREtASP0ZhQMoUBT+R3Fpdy0jPS0YoT/fBd96CJCmgsQOS8Tq5IKVeB61MyC
kwAQ2Goe0T3sdVkCAwEAATANBgkqhkiG9w0BAQsFAAOBgQATe6ixdAjoV7BSHgRX
bXM2+IZLq8kq3s7ck0EZrRVhsivutcaZwDXRCCinB+OlPedbzXwNZGvVX0nwPYHG
BfiXwdiuZeVJ88ni6Fm6RhoPtu2QF1UExfBvSXuMBgR+evp+e3QadNpGx6Ppl1aC
hWF6W2H9+MAlU7yvtmCQQuZmfQ==
-----END CERTIFICATE-----`;

describe("AwsCertificate", async function () {
  let provider;
  let certificate;

  before(async function () {
    provider = AwsProvider({
      config: () => ({ projectName: "gru-test" }),
    });
    await provider.start();
    certificate = provider.getClient({ groupType: "ACM::Certificate" });
  });

  it(
    "X509Certificate subject",
    pipe([
      () => certificatePem,
      getCommonNameFromCertificate,
      tap((CN) => {
        assert.equal(CN, "Rohit Prasad");
      }),
    ])
  );

  it(
    "list",
    pipe([
      () => certificate.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "certificate getById not found",
    pipe([
      () =>
        certificate.getById({
          CertificateArn:
            "arn:aws:acm:us-east-1:840541460064:certificate/1ef2da5d-bcf6-4dcd-94c1-1532a8d64eff",
        }),
    ])
  );
  it(
    "certificate destroy not found",
    pipe([
      () =>
        certificate.destroy({
          live: {
            CertificateArn:
              "arn:aws:acm:us-east-1:840541460064:certificate/1ef2da5d-bcf6-4dcd-94c1-1532a8d64eff",
          },
        }),
    ])
  );
});
