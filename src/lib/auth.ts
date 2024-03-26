// import { NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

// function getGoogleCredientials() {
//     const clientId = process.env.GOOGLE_CLIENT_ID;
//     const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
//     if(!clientId || clientId.length === 0 || !clientSecret || clientSecret.length === 0) {
//         throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in environment.");
//     }
//     return { clientId, clientSecret };
// }
// const googleCredientials = getGoogleCredientials();

// export const authOptions: NextAuthOptions = {
//     session: {
//         strategy: "jwt",
//     },
//     pages: {
//         signIn: "/login",
//     },
//     providers: [
//         GoogleProvider({
//             clientId: googleCredientials.clientId,
//             clientSecret: googleCredientials.clientSecret,
//         })
//     ],
//     callbacks: {
//         async jwt(token, user, account, profile, isNewUser) {
//             if (account?.accessToken) {
//                 token.accessToken = account.accessToken;
//             }
//             return token;
//         },
//         async session(session, token) {
//             session.accessToken = token.accessToken;
//             return session;
//         },
//     },
// }