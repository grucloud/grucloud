/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import clsx from "clsx";

import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

function FooterLink({ to, href, label, prependBaseUrlToHref, ...props }) {
  const toUrl = useBaseUrl(to);
  const normalizedHref = useBaseUrl(href, { forcePrependBaseUrl: true });

  return (
    <Link
      className="footer__link-item"
      {...(href
        ? {
            target: "_blank",
            rel: "noopener noreferrer",
            href: prependBaseUrlToHref ? normalizedHref : href,
          }
        : {
            to: toUrl,
          })}
      {...props}
    >
      {label}
    </Link>
  );
}

function Footer() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  const { themeConfig = {} } = siteConfig;
  const { footer } = themeConfig;

  const { copyright, links = [] } = footer || {};

  return (
    <footer
      className={clsx("footer", {
        "footer--dark": footer.style === "dark",
      })}
    >
      <div>
        <div
          css={css`
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-content: center;
          `}
        >
          {links.map((linkItem, i) => (
            <div
              css={css`
                margin: 20px;
              `}
              key={i}
            >
              {linkItem.title != null ? (
                <h4 className="footer__title">{linkItem.title}</h4>
              ) : null}
              <ul
                css={css`
                  padding: 0 30px 0 00px;
                  list-style: none;
                `}
              >
                {linkItem.items.map((item, key) => (
                  <li key={item.href || item.to}>
                    <FooterLink {...item} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          css={css`
            display: flex;
            flex-direction: row;
            justify-content: center;
            > div {
              padding-right: 30px;
            }
          `}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: copyright,
            }}
          />
          <a href="https://www.freeprivacypolicy.com/live/ada70892-c887-4a1d-8d0e-29801fe215b2">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
