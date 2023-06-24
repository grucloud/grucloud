// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/** @type {import('@docusaurus/types').Config} */
const config = {
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  trailingSlash: false,
  title: "GruCloud",
  tagline: "Infrastructure as Code",
  url: "https://grucloud.github.io/",
  baseUrl: "/",
  favicon: "img/cloud.svg",
  organizationName: "grucloud", // Usually your GitHub org/user name.
  projectName: "grucloud", // Usually your repo name.
  //plugins: ["@docusaurus/plugin-google-gtag"],
  themeConfig: {
    colorMode: { disableSwitch: true },

    navbar: {
      title: "GruCloud",
      logo: {
        alt: "GruCloud Logo",
        src: "img/cloud.svg",
      },
      items: [
        {
          to: "docs/Introduction",
          activeBasePath: "docs",
          label: "Docs",
          position: "left",
        },
        /*{ to: "blog", label: "Blog", position: "left" },*/
        {
          href: "https://github.com/grucloud/grucloud",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      links: [
        {
          title: "Community",
          items: [
            {
              label: "Github",
              href: "https://github.com/grucloud/grucloud",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/grucloud_iac",
            },
            {
              label: "YouTube",
              href: "https://www.youtube.com/channel/UC9gB2acQaqKFkZaZ5q4QfJQ",
            },
            {
              label: "Stack Overflow",
              href: "https://stackoverflow.com/questions/tagged/grucloud",
            },
          ],
        },
        {
          title: "Documentation",
          items: [
            {
              label: "AWS",
              href: "/docs/aws/AwsGettingStarted",
            },
            {
              label: "Google Cloud",
              href: "/docs/google/GoogleGettingStarted",
            },
            {
              label: "Microsoft Azure",
              href: "/docs/azure/AzureGettingStarted",
            },
            {
              label: "Kubernetes",
              href: "/docs/k8s/K8sGettingStarted",
            },
          ],
        },
        /*{
          title: "More",
          items: [
            {
              label: "Blog",
              to: "blog",
            },
            {
              label: "GitHub",
              href: "https://github.com/facebook/docusaurus",
            },
          ],
        },*/
      ],
      copyright: `Copyright © ${new Date().getFullYear()} GruCloud`,
    },
  },

  presets: [
    [
      "@docusaurus/preset-classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
        },
        gtag: {
          trackingID: "UA-179962442-1",
          anonymizeIP: true,
        },
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   editUrl:
        //     "https://github.com/facebook/docusaurus/edit/main/website/blog/",
        // },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],
};

module.exports = config;
