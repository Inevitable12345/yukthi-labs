"use client";

import { useEffect } from "react";
import Script from "next/script";

import { useConsent } from "@/components/consent/ConsentProvider";
import { configuredProvider, setAnalyticsConsent } from "@/lib/analytics/analytics";

/**
 * Mounts the configured analytics script — and only then.
 *
 * The script tag is not rendered at all until the reader has granted the analytics
 * category, so no request reaches a third party before consent. Revoking consent
 * stops further events immediately; the already-loaded script is inert because
 * `track()` refuses to call it.
 */
export function AnalyticsProvider() {
  const { consent } = useConsent();
  const provider = configuredProvider();
  const granted = consent.analytics === true;

  useEffect(() => {
    setAnalyticsConsent(granted);
  }, [granted]);

  if (!granted || provider === "none") return null;

  if (provider === "plausible") {
    const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
    const host = process.env.NEXT_PUBLIC_PLAUSIBLE_HOST ?? "https://plausible.io";
    if (!domain) return null;
    return (
      <Script strategy="afterInteractive" data-domain={domain} src={`${host}/js/script.js`} />
    );
  }

  if (provider === "ga4") {
    const id = process.env.NEXT_PUBLIC_GA_ID;
    if (!id) return null;
    return (
      <>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}',{anonymize_ip:true});`}
        </Script>
      </>
    );
  }

  if (provider === "posthog") {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com";
    if (!key) return null;
    return (
      <Script id="posthog-init" strategy="afterInteractive">
        {`!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);posthog.init('${key}',{api_host:'${host}',persistence:'localStorage',autocapture:false,capture_pageview:true,disable_session_recording:true});`}
      </Script>
    );
  }

  return null;
}
