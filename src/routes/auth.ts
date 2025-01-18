import express from "express";
import passport from "passport";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.redirect(`${process.env.CLIENT_URL}/login`);
      }
      res.redirect(`${process.env.CLIENT_URL}/dashboard`);
    });
  }
);

router.get("/current-user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie("connect.sid");
      res.status(200).json({ status: "ok" });
    });
  });
});

export default router;
