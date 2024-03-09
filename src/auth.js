
import { SvelteKitAuth } from '@auth/sveltekit';
import Auth0Provider from '@auth/core/providers/auth0';
import { AUTH0_DOMAIN, AUTH0_ID, AUTH0_SECRET } from "$env/static/private";
//import GitHub from "@auth/sveltekit/providers/github"
//import { GITHUB_ID, GITHUB_SECRET } from "$env/static/private"

const config = {
    providers: [
        Auth0Provider({
            id: "auth0",
            name: "Auth 0",
            clientId: AUTH0_ID,
            clientSecret: AUTH0_SECRET,
            issuer: `https://${AUTH0_DOMAIN}/`,
            wellKnown: `https://${AUTH0_DOMAIN}/.well-known/openid-configuration`,

        }),
       // GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET })
    ],
    secret: "AnyRandomStringMyFriend",
    debug: true,
    session: {
        maxAge: 1800
    },
    callbacks: { 
          jwt({ token, account, user }) {
            //console.log('jwt',token, account, user)
            if (account) {
              token.accessToken = account.access_token
              token.id = user?.id
              token.accountId = account?.providerAccountId
            }
            return token
          },
        async session({ session, token }) { 
            //console.log('session',session, token)
            session.user.id = token.accountId;
            //session.user = { id: user.id,name: user.name,email: user.email,image: user.image}; 
            return session
        }
    }
};
export const { handle, signIn, signOut } = SvelteKitAuth(config)