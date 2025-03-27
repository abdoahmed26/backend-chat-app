import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2"
import { Strategy as GithubStrategy } from "passport-github2"

export const usePassportGoogle = () => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BASE_URL}/api/v1/auth/google/callback`,
        passReqToCallback: true
    }, (request,accessToken, refreshToken, profile, done) => {
        return done(null, profile)
    }))

    passport.serializeUser((user, done) => {
        done(null, user)
    })

    passport.deserializeUser((user, done) => {
        done(null, user)
    })
}

export const usePassportGithub = () => {
    passport.use(new GithubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env.BASE_URL}/api/v1/auth/github/callback`,
        passReqToCallback: true
    }, async(request,accessToken, refreshToken, profile, done) => {
        try {
            let emails = profile.emails;
            
            if (!emails) {
                const response = await fetch('https://api.github.com/user/emails', {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                const emailsData = await response.json();
                emails = emailsData.filter(email => email.primary && email.verified);
            }
    
            const user = {
                id: profile.id,
                displayName: profile.username,
                email: emails.length > 0 ? emails[0].email : null,
                avatar: profile.photos[0]?.value
            };
    
            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user)
    })
    passport.deserializeUser((user, done) => {
        done(null, user)
    })
}