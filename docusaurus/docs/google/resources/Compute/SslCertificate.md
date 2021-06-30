---
id: SslCertificate
title: SSL Certificate
---

Provides a managed SSL certificate.

```js
const sslCertificate = await provider.makeSslCertificate({
  name: "ssl-certificate",
  properties: () => ({
    managed: {
      domains: ["yourdomainhere.com"],
    },
  }),
});
```

### Examples

- [Https Website](https://github.com/grucloud/grucloud/blob/main/examples/google/storage/website-https)

![website-https/diagram-target.svg](https://raw.githubusercontent.com/grucloud/grucloud/main/examples/google/storage/website-https/diagram-target.svg)

### Properties

- [all properties](https://cloud.google.com/compute/docs/reference/rest/v1/sslCertificates/insert)

## Dependencies

## Used By

- [HttpsTargetProxy](./HttpsTargetProxy.md)

## List

List all SSL certificates with the **SslCertificate** type

```sh
gc l -t SslCertificate
```

```txt
Listing resources on 1 provider: google
✓ google
  ✓ Initialising
  ✓ Listing 1/1
┌────────────────────────────────────────────────────────────────────────────────┐
│ 1 SslCertificate from google                                                   │
├─────────────────┬───────────────────────────────────────────────────────┬──────┤
│ Name            │ Data                                                  │ Our  │
├─────────────────┼───────────────────────────────────────────────────────┼──────┤
│ ssl-certificate │ id: 6441474765553268206                               │ Yes  │
│                 │ creationTimestamp: 2021-06-30T03:44:17.991-07:00      │      │
│                 │ name: ssl-certificate                                 │      │
│                 │ description: Managed By GruCloud                      │      │
│                 │ selfLink: https://www.googleapis.com/compute/v1/proj… │      │
│                 │ certificate: -----BEGIN CERTIFICATE-----              │      │
│                 │ MIIFUTCCBDmgAwIBAgIRAPkAAOJC7+5VCgAAAADtDggwDQYJKoZI… │      │
│                 │ RjELMAkGA1UEBhMCVVMxIjAgBgNVBAoTGUdvb2dsZSBUcnVzdCBT… │      │
│                 │ TEMxEzARBgNVBAMTCkdUUyBDQSAxRDQwHhcNMjEwNjMwMDk0ODQy… │      │
│                 │ MTA0ODQyWjAXMRUwEwYDVQQDEwxncnVjbG91ZC5vcmcwggEiMA0G… │      │
│                 │ AQUAA4IBDwAwggEKAoIBAQCwg05xlwu+1ypsJgQ5WOL0B6Ux7LT3… │      │
│                 │ I6TrqTwTpTq8lIwpEBvksGz2w99nJ5lLiCBhH7MRWskpwZYVY4Y2… │      │
│                 │ 4z4l7D+s/u8xCe7XB2D/B6suXPdVpPjl21kHLQUQCYiHSlXBknsw… │      │
│                 │ dwrlJS4M3KfRYXhesJxZEeO3+PoXKw3wBkIpSRfvkJ/Y1BJqLoQc… │      │
│                 │ jqdpROyJRaJ/gH1/1Ixe9wxQ0xRf9jAZClyfL8M/DENERLJuXCE7… │      │
│                 │ aQiL+jB/x1AJYwuud04PPZuBNE3ouln8UnD5MD65C46BAgMBAAGj… │      │
│                 │ BgNVHQ8BAf8EBAMCBaAwEwYDVR0lBAwwCgYIKwYBBQUHAwEwDAYD… │      │
│                 │ ADAdBgNVHQ4EFgQUn0Lwt6ba79AHuJDIGAlW2310YfEwHwYDVR0j… │      │
│                 │ DrJXkZQq5dRdhpCD3lOzuJIwagYIKwYBBQUHAQEEXjBcMCcGCCsG… │      │
│                 │ dHRwOi8vb2NzcC5wa2kuZ29vZy9ndHMxZDQwMQYIKwYBBQUHMAKG… │      │
│                 │ a2kuZ29vZy9yZXBvL2NlcnRzL2d0czFkNC5kZXIwFwYDVR0RBBAw… │      │
│                 │ dWQub3JnMCEGA1UdIAQaMBgwCAYGZ4EMAQIBMAwGCisGAQQB1nkC… │      │
│                 │ BDUwMzAxoC+gLYYraHR0cDovL2NybHMucGtpLmdvb2cvZ3RzMWQ0… │      │
│                 │ V0NrLmNybDCCAQYGCisGAQQB1nkCBAIEgfcEgfQA8gB3APZclC/R… │      │
│                 │ Vo7jTRMZM7/fDC8gC8xO8WTjAAABelyN0mYAAAQDAEgwRgIhAJK3… │      │
│                 │ 64j1+EfMUP7z2a1r49DvMLeIKdM1AiEA/JSBRq8oPtE1kTbIARqS… │      │
│                 │ POCDVgsI/BQAdwDuwJXujXJkD5Ljw7kbxxKjaWoJe0tqGhQ45key… │      │
│                 │ jdKCAAAEAwBIMEYCIQDoxrQxCcEH2vVeg2AtstxI1HDtxUl4zYlz… │      │
│                 │ AOsmu4oulyYswA7MTs/Dy29W+nXk0D0mGAOzAHkCzlwIMA0GCSqG… │      │
│                 │ A4IBAQAoD2cok3xHy87yVKdF7NUtjVAS6/jB6/KUdxSoaeE8HtFI… │      │
│                 │ ZXvfhKYWZuc9WCaEUNZo45y582uuf/Wv1dBXSiH6vyD3F845XQB8… │      │
│                 │ fsiQzTeOA5+5EmnQLkvaSpfs1VgMwwc0w+bd3mhHaHX1Pot5PTbT… │      │
│                 │ NlSHP9oWk4Y4sk9ngaDu6p+nilPNXpKOXeVWchB5fkhW2BFNRyq5… │      │
│                 │ fSjfQ5lMpeZMQi68FPuiNkcaJ5CY0ntHcwenhUpewYd1QwFiigbW… │      │
│                 │ 7hT0UnMmPf21WKP4EdMmmw+4dHwx                          │      │
│                 │ -----END CERTIFICATE-----                             │      │
│                 │ -----BEGIN CERTIFICATE-----                           │      │
│                 │ MIIFjDCCA3SgAwIBAgINAgCOsgIzNmWLZM3bmzANBgkqhkiG9w0B… │      │
│                 │ CQYDVQQGEwJVUzEiMCAGA1UEChMZR29vZ2xlIFRydXN0IFNlcnZp… │      │
│                 │ MBIGA1UEAxMLR1RTIFJvb3QgUjEwHhcNMjAwODEzMDAwMDQyWhcN… │      │
│                 │ MDQyWjBGMQswCQYDVQQGEwJVUzEiMCAGA1UEChMZR29vZ2xlIFRy… │      │
│                 │ Y2VzIExMQzETMBEGA1UEAxMKR1RTIENBIDFENDCCASIwDQYJKoZI… │      │
│                 │ ggEPADCCAQoCggEBAKvAqqPCE27l0w9zC8dTPIE89bA+xTmDaG7y… │      │
│                 │ UebUQpK0yv2r678RJExK0HWDjeq+nLIHN1Em5j6rARZixmyRSjhI… │      │
│                 │ saztIIJ7O0g/82qj/vGDl//3t4tTqxiRhLQnTLXJdeB+2DhkdU6I… │      │
│                 │ H3Rcsejcqj8p5Sj19vBm6i1FhqLGymhMFroWVUGO3xtIH91dsgy4… │      │
│                 │ 2190Q0Lm/SiKmLbRJ5Au4y1euFJm2JM9eB84Fkqa3ivrXWUeVtye… │      │
│                 │ zvxtxvusLJzLWYHk55zcRAacDA2SeEtBbQfD1qsCAwEAAaOCAXYw… │      │
│                 │ DwEB/wQEAwIBhjAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUH… │      │
│                 │ AQH/BAgwBgEB/wIBADAdBgNVHQ4EFgQUJeIYDrJXkZQq5dRdhpCD… │      │
│                 │ VR0jBBgwFoAU5K8rJnEaK0gnhS9SZizv8IkTcT4waAYIKwYBBQUH… │      │
│                 │ CCsGAQUFBzABhhpodHRwOi8vb2NzcC5wa2kuZ29vZy9ndHNyMTAw… │      │
│                 │ AoYkaHR0cDovL3BraS5nb29nL3JlcG8vY2VydHMvZ3RzcjEuZGVy… │      │
│                 │ MCswKaAnoCWGI2h0dHA6Ly9jcmwucGtpLmdvb2cvZ3RzcjEvZ3Rz… │      │
│                 │ A1UdIARGMEQwCAYGZ4EMAQIBMDgGCisGAQQB1nkCBQMwKjAoBggr… │      │
│                 │ aHR0cHM6Ly9wa2kuZ29vZy9yZXBvc2l0b3J5LzANBgkqhkiG9w0B… │      │
│                 │ IVToy24jwXUr0rAPc924vuSVbKQuYw3nLflLfLh5AYWEeVl/Du18… │      │
│                 │ FZbhXkBH0PNcw97thaf2BeoDYY9Ck/b+UGluhx06zd4EBf7H9P84… │      │
│                 │ K+Xh3I0tqJy2rgOqNDflr5IMQ8ZTWA3yltakzSBKZ6XpF0PpqyCR… │      │
│                 │ uPCJvscp1/m2pVTtyBjYPRQ+QuCQGAJKjtN7R5DFrfTqMWvYgVlp… │      │
│                 │ 3cTIfzE7cmALskMKNLuDz+RzCcsYTsVaU7Vp3xL60OYhqFkuAOOx… │      │
│                 │ YgPmOT4X3+7L51fXJyRH9KfLRP6nT31D5nmsGAOgZ26/8T9hsBW1… │      │
│                 │ VS5H0HyIBMEKyGMIPhFWrlt/hFS28N1zaKI0ZBGD3gYgDLbiDT9f… │      │
│                 │ lVlWPzXe81vdoEnFbr5M272HdgJWo+WhT9BYM0Ji+wdVmnRffXgl… │      │
│                 │ 1dFpgJu8fF3LG0gl2ibSYiCi9a6hvU0TppjJyIWXhkJTcMJlPrWx… │      │
│                 │ JDwRjW/656r0KVB02xHRKvm2ZKI03TglLIpmVCK3kBKkKNpBNkFt… │      │
│                 │ x/9tpNFlQTl7B39rJlJWkR17QnZqVptFePFORoZmFzM=          │      │
│                 │ -----END CERTIFICATE-----                             │      │
│                 │ -----BEGIN CERTIFICATE-----                           │      │
│                 │ MIIFYjCCBEqgAwIBAgIQd70NbNs2+RrqIQ/E8FjTDTANBgkqhkiG… │      │
│                 │ MQswCQYDVQQGEwJCRTEZMBcGA1UEChMQR2xvYmFsU2lnbiBudi1z… │      │
│                 │ CxMHUm9vdCBDQTEbMBkGA1UEAxMSR2xvYmFsU2lnbiBSb290IENB… │      │
│                 │ OTAwMDA0MloXDTI4MDEyODAwMDA0MlowRzELMAkGA1UEBhMCVVMx… │      │
│                 │ GUdvb2dsZSBUcnVzdCBTZXJ2aWNlcyBMTEMxFDASBgNVBAMTC0dU… │      │
│                 │ MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAthECix7j… │      │
│                 │ ladAPKH9gvl9MgaCcfb2jH/76Nu8ai6Xl6OMS/kr9rH5zoQdsfnF… │      │
│                 │ iV6nqlKr+CMny6SxnGPb15l+8Ape62im9MZaRw1NEDPjTrETo8gY… │      │
│                 │ KSUjB6G00j0uYODP0gmHu81I8E3CwnqIiru6z1kZ1q+PsAewnjHx… │      │
│                 │ DrXYfiYaRQM9sHmklCitD38m5agI/pboPGiUU+6DOogrFZYJsuB6… │      │
│                 │ j5ZPaK49l8KEj8C8QMALXL32h7M1bKwYUH+E4EzNktMg6TO8Upmv… │      │
│                 │ cuHKZPfmghCN6J3Cioj6OGaK/GP5Afl4/Xtcd/p2h/rs37EOeZVX… │      │
│                 │ CruOC7XFxYpVq9Os6pFLKcwZpDIlTirxZUTQAs6qzkm06p98g7BA… │      │
│                 │ iYH6TKX/1Y7DzkvgtdizjkXPdsDtQCv9Uw+wp9U7DbGKogPeMa3M… │      │
│                 │ Eua++tgy/BBjFFFy3l3WFpO9KWgz7zpm7AeKJt8T11dleCfeXkkU… │      │
│                 │ sZWwpbkNFhHax2xIPEDgfg1azVY80ZcFuctL7TlLnMQ/0lUTbiSw… │      │
│                 │ 9f6BQdgAmD06yK56mDcYBZUCAwEAAaOCATgwggE0MA4GA1UdDwEB… │      │
│                 │ BgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTkrysmcRorSCeFL1Jm… │      │
│                 │ BgNVHSMEGDAWgBRge2YaRQ2XyolQL30EzTSo//z9SzBgBggrBgEF… │      │
│                 │ JQYIKwYBBQUHMAGGGWh0dHA6Ly9vY3NwLnBraS5nb29nL2dzcjEw… │      │
│                 │ MAKGHWh0dHA6Ly9wa2kuZ29vZy9nc3IxL2dzcjEuY3J0MDIGA1Ud… │      │
│                 │ oCOGIWh0dHA6Ly9jcmwucGtpLmdvb2cvZ3NyMS9nc3IxLmNybDA7… │      │
│                 │ MAgGBmeBDAECATAIBgZngQwBAgIwDQYLKwYBBAHWeQIFAwIwDQYL… │      │
│                 │ AwMwDQYJKoZIhvcNAQELBQADggEBADSkHrEoo9C0dhemMXoh6dFS… │      │
│                 │ NR3t5P+T4Vxfq7vqfM/b5A3Ri1fyJm9bvhdGaJQ3b2t6yMAYN/ol… │      │
│                 │ WprKASOshIArAoyZl+tJaox118fessmXn1hIVw41oeQa1v1vg4Fv… │      │
│                 │ 9U5pCZEt4Wi4wStz6dTZ/CLANx8LZh1J7QJVj2fhMtfTJr9w4z30… │      │
│                 │ +qduBmpvvYuR7hZL6Dupszfnw0Skfths18dG9ZKb59UhvmaSGZRV… │      │
│                 │ d0lIKO2d1xozclOzgjXPYovJJIultzkMu34qQb9Sz/yilrbCgj8=  │      │
│                 │ -----END CERTIFICATE-----                             │      │
│                 │                                                       │      │
│                 │ managed:                                              │      │
│                 │   domains:                                            │      │
│                 │     - "grucloud.org"                                  │      │
│                 │   status: ACTIVE                                      │      │
│                 │   domainStatus:                                       │      │
│                 │     grucloud.org: ACTIVE                              │      │
│                 │ type: MANAGED                                         │      │
│                 │ subjectAlternativeNames:                              │      │
│                 │   - "grucloud.org"                                    │      │
│                 │ expireTime: 2021-09-28T03:48:42.000-07:00             │      │
│                 │ kind: compute#sslCertificate                          │      │
│                 │                                                       │      │
└─────────────────┴───────────────────────────────────────────────────────┴──────┘


List Summary:
Provider: google
┌───────────────────────────────────────────────────────────────────────────────┐
│ google                                                                        │
├────────────────────┬──────────────────────────────────────────────────────────┤
│ SslCertificate     │ ssl-certificate                                          │
└────────────────────┴──────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t SslCertificate" executed in 2s
```
