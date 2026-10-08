<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the uploaded TableRush artwork as a transparent app image, with a horizontal lockup and square symbol derived from it; this preserves consistent branding across navigation, intro, and favicon.
- Mount the one-per-browser-session intro only on the homepage; this keeps ordering and dashboards uninterrupted.
- Online payments go through Cashfree only via src/lib/payments.server.ts (server-side order creation, API re-verification, signed webhook at /api/public/webhooks/cashfree); the browser never decides PAID, so client tampering cannot fake payment.
