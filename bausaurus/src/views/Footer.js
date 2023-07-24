const footerLinks = [
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
];

export default function ({ bau, css }) {
  const { h4, footer, span, a, ul, li } = bau.tags;

  const className = css`
    grid-area: footer;
    min-height: 4rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: var(--font-color-secondary);
    box-shadow: var(--shadow-s);
    & ul {
      padding-left: 0;
      & li {
        list-style: none;
        padding: 0.2rem 2rem 0.2rem 0.1rem;
        display: inline;
        & a {
          text-decoration: none;
          color: var(--color-emphasis-700);
          &:hover {
            color: var(--color-primary);
            text-decoration: underline;
          }
        }
      }
    }
  `;

  return function Footer() {
    return footer(
      {
        class: className,
      },
      ul(
        {
          class: css`
            display: flex;
            flex-direction: row;
          `,
        },
        footerLinks.map((link) =>
          li(
            h4(link.title),
            ul(
              {
                class: css`
                  display: flex;
                  flex-direction: column;
                `,
              },
              link.items.map((item) =>
                li(
                  a(
                    {
                      href: item.href,
                      target: "_blank",
                      rel: "noopener noreferrer",
                    },
                    item.label
                  )
                )
              )
            )
          )
        )
      ),
      ul(
        {
          class: css`
            display: flex;
            flex-direction: row;
          `,
        },
        // span("Released under the MIT License."),
        li(span(`Copyright © ${new Date().getFullYear()} GruCloud`)),
        li(
          a(
            {
              href: "https://www.freeprivacypolicy.com/live/ada70892-c887-4a1d-8d0e-29801fe215b2",
            },
            "Privacy Policy"
          )
        )
      )
    );
  };
}
