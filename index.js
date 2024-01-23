if(process.env.NODE_ENV !="production"){
  require('dotenv').config()
}
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const ejsMate = require("ejs-mate");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter=require("./routes/user.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');

const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./model/user.js");
const db_url=process.env.clouddb_url;
const store= MongoStore.create({
  mongoUrl:db_url,
  crypto:{ secret:  process.env.secret},
  tochAfter: 24*3600,
});
store.on("error",(err)=>{
  console.log("Error in Mongo session store",err);
})
const sessionOptions = session({
  store:store,
  secret: process.env.secret ,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now() + 7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true, 
  }
});




app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);

// connection with database
// const Mongo_url = "mongodb://127.0.0.1:27017/WanderWise";

const mongoose = require("mongoose");
main()
  .then((res) => {
    console.log("connection successfull");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(db_url);
}



  
app.use(sessionOptions);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

  app.get("/",(req,res)=>{
    res.redirect("/listings");
  })

  // middleware for flash
  app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
  })

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/",userRouter);

// middleware
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found!"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong!" } = err;
  res.render("listings/error.ejs", { message });
});



app.listen("8080", () => {
  console.log("server is listening to port 8080");
});
