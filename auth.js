import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import client from "./services/mongodb.js";

export const auth = betterAuth({
  database: mongodbAdapter(client.db("studynookDB")),

  trustedOrigins: [process.env.FRONTEND_URL],

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
});