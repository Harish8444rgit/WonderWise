const User=require("../model/user");

module.exports.signup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const registerUser=await User.register(newUser,password);
    req.login(registerUser,(err)=>{ 
      if(err){
      return next(err);
    }
    req.flash("success","Welcome to WanderWise!");
    res.redirect("/listings");
    })
    
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/listings");
    }
  };

module.exports.signupForm=(req,res)=>{
    res.render("users/signup.ejs");
  };

module.exports.loginFrom=(req,res)=>{
    res.render("users/login.ejs");
  };
module.exports.login=async(req,res)=>{
    req.flash("success","Welcome back to WanderWise");
    let redirectUrl=res.locals.redirectUrl ||"/listings"
    res.redirect(redirectUrl);
    }
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
      if(err){
        return next(err);
      }
      req.flash("success","logged you out!");
      res.redirect("/listings");
    })
  }