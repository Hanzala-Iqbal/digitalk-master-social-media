import User from "../models/User.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Cookies from "cookies";
import express from "express";
import http from "http";
import UserOTPVerification from "../models/UserOTPVerification.js";

// import { useNavigate } from "react-router-dom";
// const navigate = useNavigate();
// mongodb user model
// const User = require("../models/User.js");

// mongodb user verification model

//Nodemailer

dotenv.config();

// user registration
export const register = async (req, res) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const dateOfBirth = req.body.dateOfBirth;
    const extension = email.split("@")[1];
    console.log("extension");
    console.log(extension);
    console.log("Inside register");

    if (username == "" || email == "" || password == "" || dateOfBirth == "") {
      throw Error("Empty Input Fields!");
    } else if (!new Date(dateOfBirth).getTime()) {
      throw Error("Invalid date of birth!");
    } else if (password.length < 8) {
      throw Error(
        "Password is too short (it should be at least 8 characters)!"
      );
    } else {
      // Checking if user exists already
      User.find({ email }).then((result) => {
        if (result.length) {
          // User exists already
          res.json({
            status: "FAILED",
            message: "User with this Email Exists Already!",
          });
        } else {
          // TRY TO CREATE A NEW USER
          const saltRounds = 10;
          bcrypt
            .hash(password, saltRounds)
            .then((hashedPassword) => {
              const newUser = new User({
                username,
                email,
                password: hashedPassword,
                dateOfBirth,
                verified: false,
                extension: extension,
              });
              console.log("New user-------");
              console.log(newUser);

              newUser
                .save()
                .then((result) => {
                  // Handle Account Verification
                  //sendVerificationEmail(result,res);
                  console.log("Register ussssssssssssssssssssssssss");
                  // console.log(result);

                  res.cookie("userId", result._id);

                  
                  sendOTPVerificationEmail(result, res);

                  res.json({
                    status: "OK",
                    redirectUrl: "/otpVerification",
                  });
                })
                .catch((err) => {
                  console.log(err);
                  res.json({
                    status: "FAILED",
                    message: "An error occurred while saving user account!",
                  });
                });
            })
            .catch((err) => {
              res.json({
                status: "FAILED",
                message: "An error occurred while hashing password!",
              });
            });
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//user login
export const login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    // console.log("Bodddyyy");
    // console.log(req.body);
    // console.log("Request receive-----------");
    // console.log("Request receive-----------");
    // console.log(email);
    // console.log("Request receive-----------");

    if (!email || !password) {
      // console.log("Request receiqe434ve-----------");

      res.status(4001).json({
        status: "FAILED",
        message: "Email or Password Not Entered!",
      });
    }
    // console.log("outsides");

    const userLogin = await User.findOne({ email: email });
    console.log(userLogin);

    if (userLogin && userLogin.verified === true) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      const token = await userLogin.generateAuthToken();
      // console.log(token);

      res.cookie("jwttoken", token);

      if (!isMatch) {
        res.json({
          status: "FAILED",
          message: "Invalid Credentials!",
        });
      } else {
        // const cookies = new Cookies(req, res);

        // // Set a cookie
        // cookies.set("userEmail", email, { httpOnly: true });
        res.cookie("userEmail", email);
        res.json({
          message: "User Signin Successfully",
          user: {
            id: userLogin._id,
            email,
          },
        });
      }
    } else {
      res.json({
        status: "FAILED",
        message: "Invalid Credentials!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
export const registerGet = (req, res) => {
  res.redirect("/register");
};
export const loginGet = (req, res) => {
  res.redirect("/login");
};

export const getENV = (req, res) => {
  res.json({
    PROJECTID: process.env.PROJECTID,
    PROJECTSECRET: process.env.PROJECTSECRET,
    // Add other required configuration values
  });
};

export const sendOTPVerificationEmail = async ({ _id, email }, res) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    //mail options
    const mailOptions = {
      from: "asadshah1341@gmail.com",
      to: email,
      subject: "Verify Your Email",
      html: `<p>Enter <b>${otp}</b> in the app to verify your email and complete the signup process</p> <p>This otp will expire in 1 hour.</p>`,
    };

    //hash the otp
    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otp, saltRounds);
    const newOTPVerification = await new UserOTPVerification({
      userId: _id,
      userEmail: email,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });
    //save otp record
    await newOTPVerification.save();
    await transporter.sendMail(mailOptions);
    // const cookies = new Cookies(req, res);

    // Set a cookie
    // cookies.set("userEmail", email, { httpOnly: true });
    // res.statuscookie("userId", _id);

    // console.log("Redirectiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");

    // res.status(301).redirect("http://localhost:5173/otpVerification");
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
};

export const registeruser = async (req, res) => {
  const user = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    dob: req.body.dob,
    extension: extension,
  };
  // new User(user).save();
  // console.log(user.username);
  // console.log(user.email);
  // console.log(user.password);
  // console.log(user.dob);
  const cookies = new Cookies(req, res);

  res.redirect("/");
};

export const verifyOTP = async (req, res) => {
  try {
    // console.log("eidjwifuuuuuuuuuuuuuuuuuuuuuuuuuu");
    const email = req.body.email;
    const otp = req.body.otp;
    // const email = req.body.email;

    // console.log("Inside verify-----------------");

    if (!email || !otp) {
      throw Error("Empty otp details are not allowed!");
    } else {
      const UserOTPVerificationRecords = await UserOTPVerification.find({
        email,
      });
      if (UserOTPVerificationRecords.length <= 0) {
        // no record found
        throw new Error(
          "Account record doesn't exist or has been verified already. Please sign up or log in."
        );
      } else {
        // user otp record exists
        const { expiresAt } = UserOTPVerificationRecords[0];
        const hashedOTP = UserOTPVerificationRecords[0].otp;

        if (expiresAt < Date.now()) {
          await UserOTPVerification.deleteMany({ email });
          throw new Error("Code has expired. Please request again.");
        } else {
          const validOTP = await bcrypt.compare(otp, hashedOTP);
          console.log("Valid otp");
          console.log(validOTP);
          // console.log("inside compare");
          if (!validOTP) {
            // otp is wrong
            throw new Error("Invalid code passed. Check your inbox.");
          } else {
            // console.log("Inside verifieeedd-----------------");
            //success
            await User.updateOne({ email: email }, { verified: true });
            await UserOTPVerification.deleteMany({ email });
            res.json({
              status: "VERIFIED",
              message: "User email verified successfully.",
            });
          }
        }
      }
    }
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
};

export const resendOTPVerificationCode = async (req, res) => {
  try {
    const {email} = req.params;
    console.log("email from body: ", email);

    if (!email) {
      throw Error("Empty email is not allowed");
    } else {
      const user = await User.findOne({ email });
      if (!user) {
        throw Error("User not found");
      }

      await UserOTPVerification.deleteMany({ userId: user._id });
      sendOTPVerificationEmail({ _id: user._id, email }, res);
    }
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
};

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});
