const express=require("express");
const router=express.Router();
const passport=require("passport");
const { saveRedirectUrl} = require("../middleware");
const UserController=require("../controller/user")

router.route("/signup")
.get(UserController.signupForm)
.post(UserController.signup);
router.route("/login")
.get(UserController.loginFrom)
.post( saveRedirectUrl, passport.authenticate('local',{
    failureFlash:true,
    failureRedirect:"/login",
  }), UserController.login);
  
router.get('/logout',UserController.logout);


module.exports=router;