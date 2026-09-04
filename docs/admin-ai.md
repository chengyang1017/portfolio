# Portfolio admin AI

The `/admin` repository assistant uses a same-origin Cloudflare Worker endpoint at `/api/portfolio-ai`.

## Required Cloudflare secret

Set `OPENAI_API_KEY` as a Worker secret for `lim-cheng-yang-portfolio`.

```bash
npx wrangler secret put OPENAI_API_KEY --name lim-cheng-yang-portfolio
```

The secret is read only by the Worker and is never included in the Vite client bundle.

## Optional model override

The Worker defaults to `gpt-5.6-luna`. Set `OPENAI_MODEL` as a Worker variable if a different model is desired.

## Access control

Requests to `/api/portfolio-ai` must include the same fine-grained GitHub token used to unlock `/admin`. Before calling OpenAI, the Worker verifies that the token has push, maintain, or admin access to `chengyang1017/portfolio`.

The GitHub token is used only for this verification request and is not sent to OpenAI.
