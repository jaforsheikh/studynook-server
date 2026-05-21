// auth.js
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { db } from "./services/mongodb.js";

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: "https://studynook-server-2.onrender.com",

  // Origin allow-list. Origin = scheme + host + port. Paths are ignored.
  trustedOrigins: [
    "http://localhost:3000",
    "https://studynook-eight.vercel.app",
  ],

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // DO NOT set redirectURI here.
      // Leave it default = baseURL + "/api/auth/callback/google".
    },
  },

  // === CRITICAL for cross-site cookies (Vercel ↔ Render) ===
  advanced: {
    // Forces the __Secure- prefix and the Secure flag in production.
    useSecureCookies: true,

    // Default attributes for EVERY cookie better-auth sets,
    // including the OAuth state cookie AND the session cookie.
    defaultCookieAttributes: {
      sameSite: "none",   // required for cross-site cookies
      secure:   true,     // required when SameSite=None
      httpOnly: true,
      partitioned: true,  // CHIPS — required by Chrome 3rd-party cookie policy
    },
  },
});