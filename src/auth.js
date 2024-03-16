
import { SvelteKitAuth } from '@auth/sveltekit';
import Auth0Provider from '@auth/core/providers/auth0';
import { AUTH0_DOMAIN, AUTH0_ID, AUTH0_SECRET } from "$env/static/private";
//import GitHub from "@auth/sveltekit/providers/github"
//import { GITHUB_ID, GITHUB_SECRET } from "$env/static/private"

import { getDB } from '$db/mongo';
const db = getDB();

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
            let su = session.user
            await db.collection('users').updateOne({ id: su.id }, { $set: su }, { upsert: true});
            const user = await db.collection('users').findOne({ id: su.id });

            session.user = user;

            if (!user.userName) { 
              //try to make an user name. Let take an user name and de-accent it
              let userName = su.name;
              userName = userName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
              userName = userName.toLowerCase();
              userName = userName.replace(/\s+/g, "_");

              //isolate the "|nnn" part from su.id
              let sysid = su.id.split("|");
              userName+="_"+(sysid[1]?sysid[1]:"");

              //update the user name
              await db.collection('users').updateOne({ id: user.id }, { $set: { userName: userName } }, { upsert: true});
              session.user.userName = userName;
            }

            //console.log(user)

            

            return session
        }
    }
};
export const { handle, signIn, signOut } = SvelteKitAuth(config)