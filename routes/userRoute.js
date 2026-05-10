import express from "express";
import passport from "passport";
import multer from "multer";
import path from "path";
import { getSignup, postSignup, getLogin, isLoggedIn } from "../controllers/userController.js";
import User from "../models/userModel.js";
import { fileURLToPath } from "url";

console.log("userRoute file loaded");

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/signup", getSignup);
router.post("/signup", postSignup);

router.get("/login", getLogin);

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect("/selectMultiplayerPage");
  }
);

router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return next(err);

      res.redirect("/");
    });
  });
});

router.get("/perfilPage", isLoggedIn, (req, res) => {
  res.render("perfil", { user: req.user });
});


router.post("/perfilPage", isLoggedIn, async (req, res) => {
  console.log("POST /perfilPage in userRoute reached");

  try {
    const { nickname } = req.body;

    if (!nickname || !nickname.trim()) {
      return res.redirect("/perfilPage");
    }

    await User.findByIdAndUpdate(req.user._id, {
      nickname: nickname.trim()
    });

    res.redirect("/perfilPage");
  } catch (err) {
    console.log(err);
    res.redirect("/perfilPage");
  }
});


router.get("/alterarPalavraPasse", isLoggedIn, (req, res) => {
  res.render("alteraPalavraPasse", { error: null });
});

router.post("/alterarPassword", isLoggedIn, async (req, res) => {
    console.log("POST /alterarPassword reached");
  console.log("BODY:", req.body);
  try {
    const { atual, nova, confirmar } = req.body;

    if (!atual || !nova || !confirmar) {
      return res.render("alteraPalavraPasse", {
        error: "Preenche todos os campos."
      });
    }

    if (nova !== confirmar) {
      return res.render("alteraPalavraPasse", {
        error: "A nova palavra-passe e a confirmação não coincidem."
      });
    }

    await req.user.changePassword(atual, nova);

    res.redirect("/perfilPage");
  } catch (err) {
    console.log(err);
    res.render("alteraPalavraPasse", {
      error: "A palavra-passe atual está incorreta."
    });
  }
});


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads/avatars"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `user-${req.user._id}-${Date.now()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

router.post("/uploadAvatar", isLoggedIn, upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.redirect("/perfilPage");
    }

    const avatarPath = `/uploads/avatars/${req.file.filename}`;

    await User.findByIdAndUpdate(req.user._id, {
      avatar: avatarPath
    });

    res.redirect("/perfilPage");
  } catch (err) {
    console.log("Erro upload avatar:", err);
    res.redirect("/perfilPage");
  }
});


export default router;