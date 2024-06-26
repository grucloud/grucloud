const assert = require("assert");
const { authorize } = require("../GoogleAuthorize");

describe("GoogleAuth", function () {
  before(async function () {});

  it("auth ko: account not found", async function () {
    try {
      await authorize({
        credentials: {
          type: "service_account",
          project_id: "grucloud-test",
          private_key_id: "f35e5f0a014ae0dd9dbf7adb498de220fb6b9f2b",
          private_key:
            "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDqp/iI5We2LwY8\npAIUdKdErVOMBVaN1x7nL+POpuRm7RVGJ5EK2YdgfdVe7YzvWe0gu5zfMrxzXOxz\nZ8PZnHdeGfJxmDkWCWX5WQ95PGCtc14PHonbGVyPfyDeKOvBSnAExf35zDclClg8\nZT3LpK7OvSAHIve+sLi7jHh8//IfeJba/yQgzX6Iuus6td+uqvreFXVva2lQPZqb\nAzB/++V7TQQQWQGGfkKmbFonb/HfSIE7sJL2PF3OmLdHHF5ZYEti7e69lYnUQssX\n0qU97JSV0DFiMvua7KiE5PIr3pRsYauNzyYiQb25eSHZGDO2hqnrcyE1VCQKeYAb\nZjMQ9YUdAgMBAAECggEABsj6l8LCX/M2I/S+FqdU2tiELO1OlmVdAGRTGvuaaRt7\n3P5x5DVsA68/xzHpPFaGU8b4/z8xUcijEaczc4xhqzfm2cAEDo4RA8e+ecv0I6/N\nTXSdmdc+5OtRIPtf7cPgP1MWR+3OvmRxLrXitou5fkLbtTkensXvYYTrSvn/n0dI\nL7ZkF7sH+Jo/IBJEgF9moizFxU/1QYHVf579jf2H1RmYAMluQIxFnw+mdDD+HGib\nzWdDDcQkMAUCMa4ZhNgw3zbb9J8xCFUFXSbttiNF4omlxmXfCwP8c4nng9QhrhVX\nd7oJWsu+fd4CMr16JZKxQYOarhMeccU1PCUbIykjQQKBgQD7RIY9YkwhyjtcvsIt\nhswoVNHET28uL2zOSMqyJU9Cpt45OFiWP0YEVCF2/fBT1YW+X6LCsa07oeVS+TBN\nDySljQqOByzKTZ5VGu7fjoT6r73klPRuRSB/Jyxv+59C9RM7Sc0+Qb215hza9C9w\nd/E0NlNRACTCp5KwYYFdY6FCkQKBgQDvE1rNVJOBRMAq4NAW2R/vo2rgQr2bQEet\nupS855Bs+lYOeT5JPOHC7+ibC1AGI98aIKwUfFNtzfl5030hPQh8cUfdEU5zqxwx\nm5Vv5H+CaxDFkXI7npu8RpJnvxZznYjb7M4E8ctSCziajN904lZlEDIGSb8MbZ7x\nC9lQTg1HzQKBgCmIlSv2YKFBPXjCK3S9EGgmRRpPCxC2VCTxEVhLJIPe82K/9py3\nTsqOYY26wgwJgncKdev61KjDxRVnDV3ff+5BlxoNA5FZLS/iKNQZSc/qVtg+6vyD\nPrDl98l27UdzHT+ynlOJKGO16tUigej0WpGH3VPJU0o9ytiO9YRLYK+RAoGAboWb\nD5tOyY7X67qcWEOt8OGyMdSIxPHVcSn1QtMmQEsGZ5CDS+Y6VB0Ggk6bgwsoQ3Lh\nOmMzSmrTLw+nJCuL9cOEvl0W0IBE+2X6koymqcsHKN6RWaB8THCvlAiRv4cPUuRJ\nZZ3GKbqIQ2JmlylfWT9AcQm8qWkv9i1NHEPI/e0CgYB7CmFAUryHvnuxW9OgWpo+\n0wXn5rYoNpbRV3MZ7+C1NgYM9I2A31EFMM+BavnQqwy36gWS4an1sgcc1eA7Igq2\n1keNT9bYpO7VPyWwSBGexY1tIfh/w/eCpII0OehmEAxZFe/JBR+nHzTzQg1jE/52\nD7J2WZWwVWR7SSSB+N12Jw==\n-----END PRIVATE KEY-----\n",
          client_email: "sa@grucloud-test.iam.gserviceaccount.com",
          client_id: "113803627204509846400",
          auth_uri: "https://accounts.google.com/o/oauth2/auth",
          token_uri: "https://oauth2.googleapis.com/token",
          auth_provider_x509_cert_url:
            "https://www.googleapis.com/oauth2/v1/certs",
          client_x509_cert_url:
            "https://www.googleapis.com/robot/v1/metadata/x509/sa-test1%40grucloud-test.iam.gserviceaccount.com",
        },
      });
    } catch (error) {
      assert.equal(error.response.data.error, "invalid_grant");
    }
  });
});
