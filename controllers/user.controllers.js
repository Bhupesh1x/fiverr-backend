import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";

export const register = async (req, res, next) => {
  try {
    const password = req.body.password.toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      ...req.body,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).send("User created successfully");
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const passwordInfo = req.body.password.toString();
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "Wrong email or password!"));
    const isPasswordCorrect = await bcrypt.compare(passwordInfo, user.password);

    if (!isPasswordCorrect)
      return next(createError(404, "Wrong email or password!"));

    const token = jwt.sign(
      {
        id: user?._id,
        isSeller: user?.isSeller,
      },
      process.env.JWT_KEY
    );

    const { password, ...result } = user?._doc;

    res
      .cookie("accessToken", token, { httpOnly: true })
      .status(200)
      .send(result);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res
      .clearCookie("accessToken", { sameSite: "none", secure: true })
      .status(200)
      .send("User has been logged out!");
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
};
