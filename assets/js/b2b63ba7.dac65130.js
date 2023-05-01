"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[37248],{3905:(e,t,n)=>{n.d(t,{Zo:()=>d,kt:()=>g});var i=n(67294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,i,o=function(e,t){if(null==e)return{};var n,i,o={},r=Object.keys(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var a=i.createContext({}),c=function(e){var t=i.useContext(a),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},d=function(e){var t=c(e.components);return i.createElement(a.Provider,{value:t},e.children)},h="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return i.createElement(i.Fragment,{},t)}},l=i.forwardRef((function(e,t){var n=e.components,o=e.mdxType,r=e.originalType,a=e.parentName,d=p(e,["components","mdxType","originalType","parentName"]),h=c(n),l=o,g=h["".concat(a,".").concat(l)]||h[l]||u[l]||r;return n?i.createElement(g,s(s({ref:t},d),{},{components:n})):i.createElement(g,s({ref:t},d))}));function g(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var r=n.length,s=new Array(r);s[0]=l;var p={};for(var a in t)hasOwnProperty.call(t,a)&&(p[a]=t[a]);p.originalType=e,p[h]="string"==typeof e?e:o,s[1]=p;for(var c=2;c<r;c++)s[c]=n[c];return i.createElement.apply(null,s)}return i.createElement.apply(null,n)}l.displayName="MDXCreateElement"},24517:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>a,contentTitle:()=>s,default:()=>u,frontMatter:()=>r,metadata:()=>p,toc:()=>c});var i=n(87462),o=(n(67294),n(3905));const r={id:"WebAppAuthSettingsV2WithoutSecrets",title:"WebAppAuthSettingsV2WithoutSecrets"},s=void 0,p={unversionedId:"azure/resources/Web/WebAppAuthSettingsV2WithoutSecrets",id:"azure/resources/Web/WebAppAuthSettingsV2WithoutSecrets",title:"WebAppAuthSettingsV2WithoutSecrets",description:"Provides a WebAppAuthSettingsV2WithoutSecrets from the Web group",source:"@site/docs/azure/resources/Web/WebAppAuthSettingsV2WithoutSecrets.md",sourceDirName:"azure/resources/Web",slug:"/azure/resources/Web/WebAppAuthSettingsV2WithoutSecrets",permalink:"/docs/azure/resources/Web/WebAppAuthSettingsV2WithoutSecrets",draft:!1,tags:[],version:"current",frontMatter:{id:"WebAppAuthSettingsV2WithoutSecrets",title:"WebAppAuthSettingsV2WithoutSecrets"},sidebar:"docs",previous:{title:"WebApp",permalink:"/docs/azure/resources/Web/WebApp"},next:{title:"WebAppAuthSettingsV2WithoutSecretsSlot",permalink:"/docs/azure/resources/Web/WebAppAuthSettingsV2WithoutSecretsSlot"}},a={},c=[{value:"Examples",id:"examples",level:2},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],d={toc:c},h="wrapper";function u(e){let{components:t,...n}=e;return(0,o.kt)(h,(0,i.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"WebAppAuthSettingsV2WithoutSecrets")," from the ",(0,o.kt)("strong",{parentName:"p"},"Web")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Web/WebApp"},"WebApp"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json"},"{\n  description: 'Configuration settings for the Azure App Service Authentication / Authorization V2 feature.',\n  type: 'object',\n  allOf: [\n    {\n      description: 'Azure proxy only resource. This resource is not tracked by Azure Resource Manager.',\n      type: 'object',\n      properties: {\n        id: { description: 'Resource Id.', type: 'string', readOnly: true },\n        name: {\n          description: 'Resource Name.',\n          type: 'string',\n          readOnly: true\n        },\n        kind: { description: 'Kind of resource.', type: 'string' },\n        type: {\n          description: 'Resource type.',\n          type: 'string',\n          readOnly: true\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    properties: {\n      description: 'SiteAuthSettingsV2 resource specific properties',\n      type: 'object',\n      properties: {\n        platform: {\n          description: 'The configuration settings of the platform of App Service Authentication/Authorization.',\n          type: 'object',\n          properties: {\n            enabled: {\n              description: '<code>true</code> if the Authentication / Authorization feature is enabled for the current app; otherwise, <code>false</code>.',\n              type: 'boolean'\n            },\n            runtimeVersion: {\n              description: 'The RuntimeVersion of the Authentication / Authorization feature in use for the current app.\\n' +\n                'The setting in this value can control the behavior of certain features in the Authentication / Authorization module.',\n              type: 'string'\n            },\n            configFilePath: {\n              description: 'The path of the config file containing auth settings if they come from a file.\\n' +\n                \"If the path is relative, base will the site's root directory.\",\n              type: 'string'\n            }\n          }\n        },\n        globalValidation: {\n          description: 'The configuration settings that determines the validation flow of users using App Service Authentication/Authorization.',\n          type: 'object',\n          properties: {\n            requireAuthentication: {\n              description: '<code>true</code> if the authentication flow is required any request is made; otherwise, <code>false</code>.',\n              type: 'boolean'\n            },\n            unauthenticatedClientAction: {\n              description: 'The action to take when an unauthenticated client attempts to access the app.',\n              enum: [\n                'RedirectToLoginPage',\n                'AllowAnonymous',\n                'Return401',\n                'Return403'\n              ],\n              type: 'string',\n              'x-ms-enum': {\n                name: 'UnauthenticatedClientActionV2',\n                modelAsString: false\n              }\n            },\n            redirectToProvider: {\n              description: 'The default authentication provider to use when multiple providers are configured.\\n' +\n                'This setting is only needed if multiple providers are configured and the unauthenticated client\\n' +\n                'action is set to \"RedirectToLoginPage\".',\n              type: 'string'\n            },\n            excludedPaths: {\n              description: 'The paths for which unauthenticated flow would not be redirected to the login page.',\n              type: 'array',\n              items: { type: 'string' }\n            }\n          }\n        },\n        identityProviders: {\n          description: 'The configuration settings of each of the identity providers used to configure App Service Authentication/Authorization.',\n          type: 'object',\n          properties: {\n            azureActiveDirectory: {\n              description: 'The configuration settings of the Azure Active directory provider.',\n              type: 'object',\n              properties: {\n                enabled: {\n                  description: '<code>false</code> if the Azure Active Directory provider should not be enabled despite the set registration; otherwise, <code>true</code>.',\n                  type: 'boolean'\n                },\n                registration: {\n                  description: 'The configuration settings of the Azure Active Directory app registration.',\n                  type: 'object',\n                  properties: {\n                    openIdIssuer: {\n                      description: 'The OpenID Connect Issuer URI that represents the entity which issues access tokens for this application.\\n' +\n                        'When using Azure Active Directory, this value is the URI of the directory tenant, e.g. https://login.microsoftonline.com/v2.0/{tenant-guid}/.\\n' +\n                        'This URI is a case-sensitive identifier for the token issuer.\\n' +\n                        'More information on OpenID Connect Discovery: http://openid.net/specs/openid-connect-discovery-1_0.html',\n                      type: 'string'\n                    },\n                    clientId: {\n                      description: 'The Client ID of this relying party application, known as the client_id.\\n' +\n                        'This setting is required for enabling OpenID Connection authentication with Azure Active Directory or \\n' +\n                        'other 3rd party OpenID Connect providers.\\n' +\n                        'More information on OpenID Connect: http://openid.net/specs/openid-connect-core-1_0.html',\n                      type: 'string'\n                    },\n                    clientSecretSettingName: {\n                      description: 'The app setting name that contains the client secret of the relying party application.',\n                      type: 'string'\n                    },\n                    clientSecretCertificateThumbprint: {\n                      description: 'An alternative to the client secret, that is the thumbprint of a certificate used for signing purposes. This property acts as\\n' +\n                        'a replacement for the Client Secret. It is also optional.',\n                      type: 'string'\n                    },\n                    clientSecretCertificateSubjectAlternativeName: {\n                      description: 'An alternative to the client secret thumbprint, that is the subject alternative name of a certificate used for signing purposes. This property acts as\\n' +\n                        'a replacement for the Client Secret Certificate Thumbprint. It is also optional.',\n                      type: 'string'\n                    },\n                    clientSecretCertificateIssuer: {\n                      description: 'An alternative to the client secret thumbprint, that is the issuer of a certificate used for signing purposes. This property acts as\\n' +\n                        'a replacement for the Client Secret Certificate Thumbprint. It is also optional.',\n                      type: 'string'\n                    }\n                  }\n                },\n                login: {\n                  description: 'The configuration settings of the Azure Active Directory login flow.',\n                  type: 'object',\n                  properties: {\n                    loginParameters: {\n                      description: 'Login parameters to send to the OpenID Connect authorization endpoint when\\n' +\n                        'a user logs in. Each parameter must be in the form \"key=value\".',\n                      type: 'array',\n                      items: { type: 'string' }\n                    },\n                    disableWWWAuthenticate: {\n                      description: '<code>true</code> if the www-authenticate provider should be omitted from the request; otherwise, <code>false</code>.',\n                      type: 'boolean'\n                    }\n                  }\n                },\n                validation: {\n                  description: 'The configuration settings of the Azure Active Directory token validation flow.',\n                  type: 'object',\n                  properties: {\n                    jwtClaimChecks: {\n                      description: 'The configuration settings of the checks that should be made while validating the JWT Claims.',\n                      type: 'object',\n                      properties: {\n                        allowedGroups: {\n                          description: 'The list of the allowed groups.',\n                          type: 'array',\n                          items: { type: 'string' }\n                        },\n                        allowedClientApplications: {\n                          description: 'The list of the allowed client applications.',\n                          type: 'array',\n                          items: { type: 'string' }\n                        }\n                      }\n                    },\n                    allowedAudiences: {\n                      description: 'The list of audiences that can make successful authentication/authorization requests.',\n                      type: 'array',\n                      items: { type: 'string' }\n                    },\n                    defaultAuthorizationPolicy: {\n                      description: 'The configuration settings of the default authorization policy.',\n                      type: 'object',\n                      properties: {\n                        allowedPrincipals: {\n                          description: 'The configuration settings of the Azure Active Directory allowed principals.',\n                          type: 'object',\n                          properties: {\n                            groups: {\n                              description: 'The list of the allowed groups.',\n                              type: 'array',\n                              items: { type: 'string' }\n                            },\n                            identities: {\n                              description: 'The list of the allowed identities.',\n                              type: 'array',\n                              items: { type: 'string' }\n                            }\n                          }\n                        },\n                        allowedApplications: {\n                          description: 'The configuration settings of the Azure Active Directory allowed applications.',\n                          type: 'array',\n                          items: { type: 'string' }\n                        }\n                      }\n                    }\n                  }\n                },\n                isAutoProvisioned: {\n                  description: 'Gets a value indicating whether the Azure AD configuration was auto-provisioned using 1st party tooling.\\n' +\n                    'This is an internal flag primarily intended to support the Azure Management Portal. Users should not\\n' +\n                    'read or write to this property.',\n                  type: 'boolean'\n                }\n              }\n            },\n            facebook: {\n              description: 'The configuration settings of the Facebook provider.',\n              type: 'object',\n              properties: {\n                enabled: {\n                  description: '<code>false</code> if the Facebook provider should not be enabled despite the set registration; otherwise, <code>true</code>.',\n                  type: 'boolean'\n                },\n                registration: {\n                  description: 'The configuration settings of the app registration for the Facebook provider.',\n                  type: 'object',\n                  properties: {\n                    appId: {\n                      description: 'The App ID of the app used for login.',\n                      type: 'string'\n                    },\n                    appSecretSettingName: {\n                      description: 'The app setting name that contains the app secret.',\n                      type: 'string'\n                    }\n                  }\n                },\n                graphApiVersion: {\n                  description: 'The version of the Facebook api to be used while logging in.',\n                  type: 'string'\n                },\n                login: {\n                  description: 'The configuration settings of the login flow.',\n                  type: 'object',\n                  properties: {\n                    scopes: {\n                      description: 'A list of the scopes that should be requested while authenticating.',\n                      type: 'array',\n                      items: { type: 'string' }\n                    }\n                  }\n                }\n              }\n            },\n            gitHub: {\n              description: 'The configuration settings of the GitHub provider.',\n              type: 'object',\n              properties: {\n                enabled: {\n                  description: '<code>false</code> if the GitHub provider should not be enabled despite the set registration; otherwise, <code>true</code>.',\n                  type: 'boolean'\n                },\n                registration: {\n                  description: 'The configuration settings of the app registration for the GitHub provider.',\n                  type: 'object',\n                  properties: {\n                    clientId: {\n                      description: 'The Client ID of the app used for login.',\n                      type: 'string'\n                    },\n                    clientSecretSettingName: {\n                      description: 'The app setting name that contains the client secret.',\n                      type: 'string'\n                    }\n                  }\n                },\n                login: {\n                  description: 'The configuration settings of the login flow.',\n                  type: 'object',\n                  properties: {\n                    scopes: {\n                      description: 'A list of the scopes that should be requested while authenticating.',\n                      type: 'array',\n                      items: { type: 'string' }\n                    }\n                  }\n                }\n              }\n            },\n            google: {\n              description: 'The configuration settings of the Google provider.',\n              type: 'object',\n              properties: {\n                enabled: {\n                  description: '<code>false</code> if the Google provider should not be enabled despite the set registration; otherwise, <code>true</code>.',\n                  type: 'boolean'\n                },\n                registration: {\n                  description: 'The configuration settings of the app registration for the Google provider.',\n                  type: 'object',\n                  properties: {\n                    clientId: {\n                      description: 'The Client ID of the app used for login.',\n                      type: 'string'\n                    },\n                    clientSecretSettingName: {\n                      description: 'The app setting name that contains the client secret.',\n                      type: 'string'\n                    }\n                  }\n                },\n                login: {\n                  description: 'The configuration settings of the login flow.',\n                  type: 'object',\n                  properties: {\n                    scopes: {\n                      description: 'A list of the scopes that should be requested while authenticating.',\n                      type: 'array',\n                      items: { type: 'string' }\n                    }\n                  }\n                },\n                validation: {\n                  description: 'The configuration settings of the Azure Active Directory token validation flow.',\n                  type: 'object',\n                  properties: {\n                    allowedAudiences: {\n                      description: 'The configuration settings of the allowed list of audiences from which to validate the JWT token.',\n                      type: 'array',\n                      items: { type: 'string' }\n                    }\n                  }\n                }\n              }\n            },\n            legacyMicrosoftAccount: {\n              description: 'The configuration settings of the legacy Microsoft Account provider.',\n              type: 'object',\n              properties: {\n                enabled: {\n                  description: '<code>false</code> if the legacy Microsoft Account provider should not be enabled despite the set registration; otherwise, <code>true</code>.',\n                  type: 'boolean'\n                },\n                registration: {\n                  description: 'The configuration settings of the app registration for the legacy Microsoft Account provider.',\n                  type: 'object',\n                  properties: {\n                    clientId: {\n                      description: 'The Client ID of the app used for login.',\n                      type: 'string'\n                    },\n                    clientSecretSettingName: {\n                      description: 'The app setting name that contains the client secret.',\n                      type: 'string'\n                    }\n                  }\n                },\n                login: {\n                  description: 'The configuration settings of the login flow.',\n                  type: 'object',\n                  properties: {\n                    scopes: {\n                      description: 'A list of the scopes that should be requested while authenticating.',\n                      type: 'array',\n                      items: { type: 'string' }\n                    }\n                  }\n                },\n                validation: {\n                  description: 'The configuration settings of the legacy Microsoft Account provider token validation flow.',\n                  type: 'object',\n                  properties: {\n                    allowedAudiences: {\n                      description: 'The configuration settings of the allowed list of audiences from which to validate the JWT token.',\n                      type: 'array',\n                      items: { type: 'string' }\n                    }\n                  }\n                }\n              }\n            },\n            twitter: {\n              description: 'The configuration settings of the Twitter provider.',\n              type: 'object',\n              properties: {\n                enabled: {\n                  description: '<code>false</code> if the Twitter provider should not be enabled despite the set registration; otherwise, <code>true</code>.',\n                  type: 'boolean'\n                },\n                registration: {\n                  description: 'The configuration settings of the app registration for the Twitter provider.',\n                  type: 'object',\n                  properties: {\n                    consumerKey: {\n                      description: 'The OAuth 1.0a consumer key of the Twitter application used for sign-in.\\n' +\n                        'This setting is required for enabling Twitter Sign-In.\\n' +\n                        'Twitter Sign-In documentation: https://dev.twitter.com/web/sign-in',\n                      type: 'string'\n                    },\n                    consumerSecretSettingName: {\n                      description: 'The app setting name that contains the OAuth 1.0a consumer secret of the Twitter\\n' +\n                        'application used for sign-in.',\n                      type: 'string'\n                    }\n                  }\n                }\n              }\n            },\n            apple: {\n              description: 'The configuration settings of the Apple provider.',\n              type: 'object',\n              properties: {\n                enabled: {\n                  description: '<code>false</code> if the Apple provider should not be enabled despite the set registration; otherwise, <code>true</code>.',\n                  type: 'boolean'\n                },\n                registration: {\n                  description: 'The configuration settings of the Apple registration.',\n                  type: 'object',\n                  properties: {\n                    clientId: {\n                      description: 'The Client ID of the app used for login.',\n                      type: 'string'\n                    },\n                    clientSecretSettingName: {\n                      description: 'The app setting name that contains the client secret.',\n                      type: 'string'\n                    }\n                  }\n                },\n                login: {\n                  description: 'The configuration settings of the login flow.',\n                  type: 'object',\n                  properties: {\n                    scopes: {\n                      description: 'A list of the scopes that should be requested while authenticating.',\n                      type: 'array',\n                      items: { type: 'string' }\n                    }\n                  }\n                }\n              }\n            },\n            azureStaticWebApps: {\n              description: 'The configuration settings of the Azure Static Web Apps provider.',\n              type: 'object',\n              properties: {\n                enabled: {\n                  description: '<code>false</code> if the Azure Static Web Apps provider should not be enabled despite the set registration; otherwise, <code>true</code>.',\n                  type: 'boolean'\n                },\n                registration: {\n                  description: 'The configuration settings of the Azure Static Web Apps registration.',\n                  type: 'object',\n                  properties: {\n                    clientId: {\n                      description: 'The Client ID of the app used for login.',\n                      type: 'string'\n                    }\n                  }\n                }\n              }\n            },\n            customOpenIdConnectProviders: {\n              description: 'The map of the name of the alias of each custom Open ID Connect provider to the\\n' +\n                'configuration settings of the custom Open ID Connect provider.',\n              type: 'object',\n              additionalProperties: {\n                description: 'The configuration settings of the custom Open ID Connect provider.',\n                type: 'object',\n                properties: {\n                  enabled: {\n                    description: '<code>false</code> if the custom Open ID provider provider should not be enabled; otherwise, <code>true</code>.',\n                    type: 'boolean'\n                  },\n                  registration: {\n                    description: 'The configuration settings of the app registration for the custom Open ID Connect provider.',\n                    type: 'object',\n                    properties: {\n                      clientId: {\n                        description: 'The client id of the custom Open ID Connect provider.',\n                        type: 'string'\n                      },\n                      clientCredential: {\n                        description: 'The authentication credentials of the custom Open ID Connect provider.',\n                        type: 'object',\n                        properties: {\n                          method: {\n                            description: 'The method that should be used to authenticate the user.',\n                            enum: [ 'ClientSecretPost' ],\n                            type: 'string',\n                            'x-ms-enum': {\n                              name: 'ClientCredentialMethod',\n                              modelAsString: false\n                            }\n                          },\n                          clientSecretSettingName: {\n                            description: 'The app setting that contains the client secret for the custom Open ID Connect provider.',\n                            type: 'string'\n                          }\n                        }\n                      },\n                      openIdConnectConfiguration: {\n                        description: 'The configuration settings of the endpoints used for the custom Open ID Connect provider.',\n                        type: 'object',\n                        properties: {\n                          authorizationEndpoint: {\n                            description: 'The endpoint to be used to make an authorization request.',\n                            type: 'string'\n                          },\n                          tokenEndpoint: {\n                            description: 'The endpoint to be used to request a token.',\n                            type: 'string'\n                          },\n                          issuer: {\n                            description: 'The endpoint that issues the token.',\n                            type: 'string'\n                          },\n                          certificationUri: {\n                            description: 'The endpoint that provides the keys necessary to validate the token.',\n                            type: 'string'\n                          },\n                          wellKnownOpenIdConfiguration: {\n                            description: 'The endpoint that contains all the configuration endpoints for the provider.',\n                            type: 'string'\n                          }\n                        }\n                      }\n                    }\n                  },\n                  login: {\n                    description: 'The configuration settings of the login flow of the custom Open ID Connect provider.',\n                    type: 'object',\n                    properties: {\n                      nameClaimType: {\n                        description: 'The name of the claim that contains the users name.',\n                        type: 'string'\n                      },\n                      scopes: {\n                        description: 'A list of the scopes that should be requested while authenticating.',\n                        type: 'array',\n                        items: { type: 'string' }\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        },\n        login: {\n          description: 'The configuration settings of the login flow of users using App Service Authentication/Authorization.',\n          type: 'object',\n          properties: {\n            routes: {\n              description: 'The routes that specify the endpoints used for login and logout requests.',\n              type: 'object',\n              properties: {\n                logoutEndpoint: {\n                  description: 'The endpoint at which a logout request should be made.',\n                  type: 'string'\n                }\n              }\n            },\n            tokenStore: {\n              description: 'The configuration settings of the token store.',\n              type: 'object',\n              properties: {\n                enabled: {\n                  description: '<code>true</code> to durably store platform-specific security tokens that are obtained during login flows; otherwise, <code>false</code>.\\n' +\n                    ' The default is <code>false</code>.',\n                  type: 'boolean'\n                },\n                tokenRefreshExtensionHours: {\n                  format: 'double',\n                  description: 'The number of hours after session token expiration that a session token can be used to\\n' +\n                    'call the token refresh API. The default is 72 hours.',\n                  type: 'number'\n                },\n                fileSystem: {\n                  description: 'The configuration settings of the storage of the tokens if a file system is used.',\n                  type: 'object',\n                  properties: {\n                    directory: {\n                      description: 'The directory in which the tokens will be stored.',\n                      type: 'string'\n                    }\n                  }\n                },\n                azureBlobStorage: {\n                  description: 'The configuration settings of the storage of the tokens if blob storage is used.',\n                  type: 'object',\n                  properties: {\n                    sasUrlSettingName: {\n                      description: 'The name of the app setting containing the SAS URL of the blob storage containing the tokens.',\n                      type: 'string'\n                    }\n                  }\n                }\n              }\n            },\n            preserveUrlFragmentsForLogins: {\n              description: '<code>true</code> if the fragments from the request are preserved after the login request is made; otherwise, <code>false</code>.',\n              type: 'boolean'\n            },\n            allowedExternalRedirectUrls: {\n              description: 'External URLs that can be redirected to as part of logging in or logging out of the app. Note that the query string part of the URL is ignored.\\n' +\n                'This is an advanced setting typically only needed by Windows Store application backends.\\n' +\n                'Note that URLs within the current domain are always implicitly allowed.',\n              type: 'array',\n              items: { type: 'string' }\n            },\n            cookieExpiration: {\n              description: \"The configuration settings of the session cookie's expiration.\",\n              type: 'object',\n              properties: {\n                convention: {\n                  description: \"The convention used when determining the session cookie's expiration.\",\n                  enum: [ 'FixedTime', 'IdentityProviderDerived' ],\n                  type: 'string',\n                  'x-ms-enum': {\n                    name: 'CookieExpirationConvention',\n                    modelAsString: false\n                  }\n                },\n                timeToExpiration: {\n                  description: 'The time after the request is made when the session cookie should expire.',\n                  type: 'string'\n                }\n              }\n            },\n            nonce: {\n              description: 'The configuration settings of the nonce used in the login flow.',\n              type: 'object',\n              properties: {\n                validateNonce: {\n                  description: '<code>false</code> if the nonce should not be validated while completing the login flow; otherwise, <code>true</code>.',\n                  type: 'boolean'\n                },\n                nonceExpirationInterval: {\n                  description: 'The time after the request is made when the nonce should expire.',\n                  type: 'string'\n                }\n              }\n            }\n          }\n        },\n        httpSettings: {\n          description: 'The configuration settings of the HTTP requests for authentication and authorization requests made against App Service Authentication/Authorization.',\n          type: 'object',\n          properties: {\n            requireHttps: {\n              description: '<code>false</code> if the authentication/authorization responses not having the HTTPS scheme are permissible; otherwise, <code>true</code>.',\n              type: 'boolean'\n            },\n            routes: {\n              description: 'The configuration settings of the paths HTTP requests.',\n              type: 'object',\n              properties: {\n                apiPrefix: {\n                  description: 'The prefix that should precede all the authentication/authorization paths.',\n                  type: 'string'\n                }\n              }\n            },\n            forwardProxy: {\n              description: 'The configuration settings of a forward proxy used to make the requests.',\n              type: 'object',\n              properties: {\n                convention: {\n                  description: 'The convention used to determine the url of the request made.',\n                  enum: [ 'NoProxy', 'Standard', 'Custom' ],\n                  type: 'string',\n                  'x-ms-enum': {\n                    name: 'ForwardProxyConvention',\n                    modelAsString: false\n                  }\n                },\n                customHostHeaderName: {\n                  description: 'The name of the header containing the host of the request.',\n                  type: 'string'\n                },\n                customProtoHeaderName: {\n                  description: 'The name of the header containing the scheme of the request.',\n                  type: 'string'\n                }\n              }\n            }\n          }\n        }\n      },\n      'x-ms-client-flatten': true\n    }\n  }\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2022-03-01"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2022-03-01/WebApps.json"},"here"),"."))}u.isMDXComponent=!0}}]);