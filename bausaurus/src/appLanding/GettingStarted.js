import button from "@grucloud/bau-ui/button/button";

export default function (context) {
  const { bau, css, config } = context;
  const { div, h1, section, p } = bau.tags;

  const { svg, use } = bau.tagsNS("http://www.w3.org/2000/svg");

  const Button = button(context);

  const ButtonLogo = ({ href, svgHref, viewBox, ariaLabel }) =>
    Button(
      { raised: true, href, "aria-label": ariaLabel },
      svg({ width: "300px", height: "75px", viewBox }, use({ href: svgHref }))
    );

  const className = css`
    text-align: center;
    padding: 30px;
  `;

  return function GettingStarted() {
    return section(
      {
        class: className,
      },
      h1("Getting Started"),
      div(
        {
          class: css`
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            gap: 30px 30px;
            grid-template-areas:
              ". ."
              ". .";

            @media (max-width: 600px) {
              grid-template-columns: 1fr;
              grid-template-rows: 1fr 1fr 1fr 1fr;
              gap: 10px 10px;
              grid-template-areas:
                "."
                "."
                "."
                ".";
            }
            > a {
              margin: 0.5rem 0 0.5rem 0;
              padding: 1rem;
            }
          `,
        },
        ButtonLogo({
          ariaLabel: "AWS",
          href: "/docs/Providers/AWS/AwsGettingStarted",
          svgHref: `aws.svg#aws`,
          viewBox: "0 0 118 70",
        }),
        ButtonLogo({
          ariaLabel: "Azure",
          href: "/docs/Providers/Azure/AzureGettingStarted",
          svgHref: `azure.svg#azure`,
          viewBox: "0 0 261 75",
        }),
        ButtonLogo({
          ariaLabel: "Gcp",
          href: "/docs/Providers/Google/GoogleGettingStarted",
          svgHref: `gcp.svg#gcp`,
          viewBox: "0 0 473 75",
        }),
        ButtonLogo({
          ariaLabel: "Kubernetes",
          href: "/docs/Providers/Kubernetes/K8sGettingStarted",
          svgHref: `k8s.svg#k8s`,
          viewBox: "0 0 397 68",
        })
      )
    );
  };
}
