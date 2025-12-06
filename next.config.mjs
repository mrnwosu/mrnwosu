// @ts-check

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  // i18n is not compatible with App Router
  // App Router has built-in internationalization support
  // See: https://nextjs.org/docs/app/building-your-application/routing/internationalization
};
export default config;
