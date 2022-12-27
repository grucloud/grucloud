"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[6335],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>m});var r=n(67294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var s=r.createContext({}),u=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=u(e.components);return r.createElement(s.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},c=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),c=u(n),m=i,g=c["".concat(s,".").concat(m)]||c[m]||d[m]||a;return n?r.createElement(g,o(o({ref:t},p),{},{components:n})):r.createElement(g,o({ref:t},p))}));function m(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,o=new Array(a);o[0]=c;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:i,o[1]=l;for(var u=2;u<a;u++)o[u]=n[u];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}c.displayName="MDXCreateElement"},46948:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>d,frontMatter:()=>a,metadata:()=>l,toc:()=>u});var r=n(87462),i=(n(67294),n(3905));const a={id:"UserPool",title:"User Pool"},o=void 0,l={unversionedId:"aws/resources/CognitoIdentityServiceProvider/UserPool",id:"aws/resources/CognitoIdentityServiceProvider/UserPool",title:"User Pool",description:"Manages a Cognito User Pool.",source:"@site/docs/aws/resources/CognitoIdentityServiceProvider/UserPool.md",sourceDirName:"aws/resources/CognitoIdentityServiceProvider",slug:"/aws/resources/CognitoIdentityServiceProvider/UserPool",permalink:"/docs/aws/resources/CognitoIdentityServiceProvider/UserPool",draft:!1,tags:[],version:"current",frontMatter:{id:"UserPool",title:"User Pool"},sidebar:"docs",previous:{title:"Identity Provider",permalink:"/docs/aws/resources/CognitoIdentityServiceProvider/IdentityProvider"},next:{title:"User Pool Client",permalink:"/docs/aws/resources/CognitoIdentityServiceProvider/UserPoolClient"}},s={},u=[{value:"Sample code",id:"sample-code",level:2},{value:"Properties",id:"properties",level:2},{value:"Dependencies",id:"dependencies",level:2},{value:"Used By",id:"used-by",level:2},{value:"Full Examples",id:"full-examples",level:2},{value:"List",id:"list",level:2}],p={toc:u};function d(e){let{components:t,...n}=e;return(0,i.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Manages a ",(0,i.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/cognito/v2/idp/user-pools"},"Cognito User Pool"),"."),(0,i.kt)("h2",{id:"sample-code"},"Sample code"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "UserPool",\n    group: "CognitoIdentityServiceProvider",\n    properties: () => ({\n      PoolName: "my-user-pool",\n      Tags: {\n        mykey1: "myvalue",\n      },\n    }),\n  },\n];\n')),(0,i.kt)("h2",{id:"properties"},"Properties"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cognito-identity-provider/interfaces/createuserpoolcommandinput.html"},"CreateUserPoolCommandInput"))),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/aws/resources/CognitoIdentityServiceProvider/IdentityProvider"},"Identity Provider"))),(0,i.kt)("h2",{id:"used-by"},"Used By"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/aws/resources/CognitoIdentityServiceProvider/UserPoolClient"},"User Pool Client"))),(0,i.kt)("h2",{id:"full-examples"},"Full Examples"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/CognitoIdentityServiceProvider/identity-provider"},"Simple user pool")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/cognito-httpapi"},"serverless-patterns cognito-httpapi"))),(0,i.kt)("h2",{id:"list"},"List"),(0,i.kt)("p",null,"The user pools can be filtered with the ",(0,i.kt)("em",{parentName:"p"},"UserPool")," type:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t UserPool\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws\n  \u2713 Initialising\n  \u2713 Listing 1/1\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 CognitoIdentityServiceProvider::UserPool from aws                 \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: my-user-pool                                                  \u2502\n\u2502 managedByUs: Yes                                                    \u2502\n\u2502 live:                                                               \u2502\n\u2502   AccountRecoverySetting:                                           \u2502\n\u2502     RecoveryMechanisms:                                             \u2502\n\u2502       - Name: verified_email                                        \u2502\n\u2502         Priority: 1                                                 \u2502\n\u2502       - Name: verified_phone_number                                 \u2502\n\u2502         Priority: 2                                                 \u2502\n\u2502   AdminCreateUserConfig:                                            \u2502\n\u2502     AllowAdminCreateUserOnly: false                                 \u2502\n\u2502     UnusedAccountValidityDays: 7                                    \u2502\n\u2502   Arn: arn:aws:cognito-idp:us-east-1:840541460064:userpool/us-east\u2026 \u2502\n\u2502   AutoVerifiedAttributes:                                           \u2502\n\u2502     - "email"                                                       \u2502\n\u2502   CreationDate: 2022-03-13T15:49:14.632Z                            \u2502\n\u2502   EmailConfiguration:                                               \u2502\n\u2502     EmailSendingAccount: COGNITO_DEFAULT                            \u2502\n\u2502   EstimatedNumberOfUsers: 0                                         \u2502\n\u2502   Id: us-east-1_fQ74O4Y78                                           \u2502\n\u2502   LambdaConfig:                                                     \u2502\n\u2502   LastModifiedDate: 2022-03-13T15:49:14.632Z                        \u2502\n\u2502   MfaConfiguration: OFF                                             \u2502\n\u2502   Name: my-user-pool                                                \u2502\n\u2502   Policies:                                                         \u2502\n\u2502     PasswordPolicy:                                                 \u2502\n\u2502       MinimumLength: 8                                              \u2502\n\u2502       RequireLowercase: true                                        \u2502\n\u2502       RequireNumbers: true                                          \u2502\n\u2502       RequireSymbols: true                                          \u2502\n\u2502       RequireUppercase: true                                        \u2502\n\u2502       TemporaryPasswordValidityDays: 7                              \u2502\n\u2502   SchemaAttributes:                                                 \u2502\n\u2502     - AttributeDataType: String                                     \u2502\n\u2502       DeveloperOnlyAttribute: false                                 \u2502\n\u2502       Mutable: false                                                \u2502\n\u2502       Name: sub                                                     \u2502\n\u2502       Required: true                                                \u2502\n\u2502       StringAttributeConstraints:                                   \u2502\n\u2502         MaxLength: 2048                                             \u2502\n\u2502         MinLength: 1                                                \u2502\n\u2502     - AttributeDataType: String                                     \u2502\n\u2502       DeveloperOnlyAttribute: false                                 \u2502\n\u2502       Mutable: true                                                 \u2502\n\u2502       Name: name                                                    \u2502\n\u2502       Required: false                                               \u2502\n\u2502       StringAttributeConstraints:                                   \u2502\n\u2502         MaxLength: 2048                                             \u2502\n\u2502         MinLength: 0                                                \u2502\n\u2502     - AttributeDataType: String                                     \u2502\n\u2502       DeveloperOnlyAttribute: false                                 \u2502\n\u2502       Mutable: true                                                 \u2502\n\u2502       Name: given_name                                              \u2502\n\u2502       Required: false                                               \u2502\n\u2502       StringAttributeConstraints:                                   \u2502\n\u2502         MaxLength: 2048                                             \u2502\n\u2502         MinLength: 0                                                \u2502\n\u2502     - AttributeDataType: String                                     \u2502\n\u2502       DeveloperOnlyAttribute: false                                 \u2502\n\u2502       Mutable: true                                                 \u2502\n\u2502       Name: family_name                                             \u2502\n\u2502       Required: false                                               \u2502\n\u2502       StringAttributeConstraints:                                   \u2502\n\u2502         MaxLength: 2048                                             \u2502\n\u2502         MinLength: 0                                                \u2502\n\u2502     - AttributeDataType: String                                     \u2502\n\u2502       DeveloperOnlyAttribute: false                                 \u2502\n\u2502       Mutable: true                                                 \u2502\n\u2502       Name: middle_name                                             \u2502\n\u2502       Required: false                                               \u2502\n\u2502       StringAttributeConstraints:                                   \u2502\n\u2502         MaxLength: 2048                                             \u2502\n\u2502         MinLength: 0                                                \u2502\n\u2502     - AttributeDataType: String                                     \u2502\n\u2502       DeveloperOnlyAttribute: false                                 \u2502\n\u2502       Mutable: true                                                 \u2502\n\u2502       Name: nickname                                                \u2502\n\u2502       Required: false                                               \u2502\n\u2502       StringAttributeConstraints:                                   \u2502\n\u2502         MaxLength: 2048                                             \u2502\n\u2502         MinLength: 0                                                \u2502\n\u2502     - AttributeDataType: String                                     \u2502\n\u2502       DeveloperOnlyAttribute: false                                 \u2502\n\u2502       Mutable: true                                                 \u2502\n\u2502       Name: preferred_username                                      \u2502\n\u2502       Required: false                                               \u2502\n\u2502       StringAttributeConstraints:                                   \u2502\n\u2502         MaxLength: 2048                                             \u2502\n\u2502         MinLength: 0                                                \u2502\n\u2502     - AttributeDataType: String                                     \u2502\n\u2502       DeveloperOnlyAttribute: false                                 \u2502\n\u2502       Mutable: true                                                 \u2502\n\u2502       Name: profile                                                 \u2502\n\u2502       Required: false                                               \u2502\n\u2502       StringAttributeConstraints:                                   \u2502\n\u2502         MaxLength: 2048                                             \u2502\n\u2502         MinLength: 0                                                \u2502\n\u2502     - AttributeDataType: String                                     \u2502\n\u2502       DeveloperOnlyAttribute: false                                 \u2502\n\u2502       Mutable: true                                                 \u2502\n\u2502       Name: picture                                                 \u2502\n\u2502       Required: false                                               \u2502\n\u2502       StringAttributeConstraints:                                   \u2502\n\u2502         MaxLength: 2048                                             \u2502\n\u2502         MinLength: 0                                                \u2502\n\u2502     - AttributeDataType: String                                     \u2502\n\u2502       DeveloperOnlyAttribute: false                                 \u2502\n\u2502       Mutable: true                                                 \u2502\n\u2502       Name: website                                                 \u2502\n\u2502       Required: false                                               \u2502\n\u2502       StringAttributeConstraints:                                   \u2502\n\u2502         MaxLength: 2048                                             \u2502\n\u2502         MinLength: 0                                                \u2502\n\u2502     - AttributeDataType: String                                     \u2502\n\u2502       DeveloperOnlyAttribute: false                                 \u2502\n\u2502       Mutable: true                                                 \u2502\n\u2502       Name: email                                                   \u2502\n\u2502       Required: false                                               \u2502\n\u2502       StringAttributeConstraints:                                   \u2502\n\u2502         MaxLength: 2048                                             \u2502\n\u2502         MinLength: 0                                                \u2502\n\u2502     - AttributeDataType: Boolean                                    \u2502\n\u2502       DeveloperOnlyAttribute: false                                 \u2502\n\u2502       Mutable: true                                                 \u2502\n\u2502       Name: email_verified                                          \u2502\n\u2502       Required: false                                               \u2502\n\u2502     - AttributeDataType: String                                     \u2502\n\u2502       DeveloperOnlyAttribute: false                                 \u2502\n\u2502       Mutable: true                                                 \u2502\n\u2502       Name: gender                                                  \u2502\n\u2502       Required: false                                               \u2502\n\u2502       StringAttributeConstraints:                                   \u2502\n\u2502         MaxLength: 2048                                             \u2502\n\u2502         MinLength: 0                                                \u2502\n\u2502     - AttributeDataType: String                                     \u2502\n\u2502       DeveloperOnlyAttribute: false                                 \u2502\n\u2502       Mutable: true                                                 \u2502\n\u2502       Name: birthdate                                               \u2502\n\u2502       Required: false                                               \u2502\n\u2502       StringAttributeConstraints:                                   \u2502\n\u2502         MaxLength: 10                                               \u2502\n\u2502         MinLength: 10                                               \u2502\n\u2502     - AttributeDataType: String                                     \u2502\n\u2502       DeveloperOnlyAttribute: false                                 \u2502\n\u2502       Mutable: true                                                 \u2502\n\u2502       Name: zoneinfo                                                \u2502\n\u2502       Required: false                                               \u2502\n\u2502       StringAttributeConstraints:                                   \u2502\n\u2502         MaxLength: 2048                                             \u2502\n\u2502         MinLength: 0                                                \u2502\n\u2502     - AttributeDataType: String                                     \u2502\n\u2502       DeveloperOnlyAttribute: false                                 \u2502\n\u2502       Mutable: true                                                 \u2502\n\u2502       Name: locale                                                  \u2502\n\u2502       Required: false                                               \u2502\n\u2502       StringAttributeConstraints:                                   \u2502\n\u2502         MaxLength: 2048                                             \u2502\n\u2502         MinLength: 0                                                \u2502\n\u2502     - AttributeDataType: String                                     \u2502\n\u2502       DeveloperOnlyAttribute: false                                 \u2502\n\u2502       Mutable: true                                                 \u2502\n\u2502       Name: phone_number                                            \u2502\n\u2502       Required: false                                               \u2502\n\u2502       StringAttributeConstraints:                                   \u2502\n\u2502         MaxLength: 2048                                             \u2502\n\u2502         MinLength: 0                                                \u2502\n\u2502     - AttributeDataType: Boolean                                    \u2502\n\u2502       DeveloperOnlyAttribute: false                                 \u2502\n\u2502       Mutable: true                                                 \u2502\n\u2502       Name: phone_number_verified                                   \u2502\n\u2502       Required: false                                               \u2502\n\u2502     - AttributeDataType: String                                     \u2502\n\u2502       DeveloperOnlyAttribute: false                                 \u2502\n\u2502       Mutable: true                                                 \u2502\n\u2502       Name: address                                                 \u2502\n\u2502       Required: false                                               \u2502\n\u2502       StringAttributeConstraints:                                   \u2502\n\u2502         MaxLength: 2048                                             \u2502\n\u2502         MinLength: 0                                                \u2502\n\u2502     - AttributeDataType: Number                                     \u2502\n\u2502       DeveloperOnlyAttribute: false                                 \u2502\n\u2502       Mutable: true                                                 \u2502\n\u2502       Name: updated_at                                              \u2502\n\u2502       NumberAttributeConstraints:                                   \u2502\n\u2502         MinValue: 0                                                 \u2502\n\u2502       Required: false                                               \u2502\n\u2502   Tags:                                                             \u2502\n\u2502     Name: my-user-pool                                              \u2502\n\u2502     gc-created-by-provider: aws                                     \u2502\n\u2502     gc-managed-by: grucloud                                         \u2502\n\u2502     gc-project-name: identity-provider                              \u2502\n\u2502     gc-stage: dev                                                   \u2502\n\u2502     mykey: myvalue                                                  \u2502\n\u2502   UsernameConfiguration:                                            \u2502\n\u2502     CaseSensitive: false                                            \u2502\n\u2502   VerificationMessageTemplate:                                      \u2502\n\u2502     DefaultEmailOption: CONFIRM_WITH_CODE                           \u2502\n\u2502                                                                     \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 CognitoIdentityServiceProvider::UserPool \u2502 my-user-pool            \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 1 type, 1 provider\nCommand "gc l -t UserPool" executed in 4s, 213 MB\n')))}d.isMDXComponent=!0}}]);