// import passport from 'passport';
// import session from 'express-session';
// import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';

// app.use(
//   session({
//     secret: 'secret',
//     resave: false,
//     saveUninitialized: true,
//   })
// );

// // تهيئة Passport
// app.use(passport.initialize());
// app.use(passport.session());

// // استراتيجية Google OAuth
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_OATUTH_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_OATUTH_CLIENT_SECRET!,
//       callbackURL: 'http://localhost:3000/auth/google/callback',
//     },
//     (
//       accessToken: string,
//       refreshToken: string,
//       profile: Profile,
//       done: (err: any, user?: Profile) => void
//     ) => {
//       return done(null, profile);
//     }
//   )
// );

// // passport.serializeUser((user: Profile, done) => done(null, user));

// // دالة لإلغاء تسلسل المستخدم
// // passport.deserializeUser((user: Profile, done) => done(null, user));

// // نقطة البداية
// app.get('/', (req: Request, res: Response) => {
//   res.send("<a href='/auth/google'>Login with Google</a>");
// });

// // نقطة الدخول لتسجيل الدخول عبر Google
// app.get(
//   '/auth/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// );

// // نقطة العودة بعد تسجيل الدخول
// app.get(
//   '/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/' }),
//   (req: Request, res: Response) => {
//     res.redirect('/profile');
//   }
// );

// // app.get("/profile", (req: Request, res: Response) => {
// //   res.send(`Welcome ${req.user?.displayName}`);
// // });

// // app.get("/logout", (req: Request, res: Response) => {
// //   req.logout(() => {
// //     res.redirect("/");
// //   });
// // });

// export default app;
