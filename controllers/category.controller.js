import Category from "../models/category.model.js";
import createError from "../utils/createError.js";

export const createCategories = async (req, res, next) => {
  if (!req.isSeller)
    return next(createError(403, "Only seller can create Categories!"));
  const category = new Category({
    userId: req.userId,
    ...req.body,
  });
  try {
    const result = await category.save();
    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const category = await Category.find().sort({ updatedAt: -1 });
    res.status(200).send(category);
  } catch (error) {
    next(error);
  }
};

export const deleteCategories = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category.userId !== req.userId)
      return next(createError(403, "Only seller can delete Category!"));

    await Category.findByIdAndDelete(req.params.id);

    res.status(201).send("Category deleted successfully");
  } catch (error) {
    next(error);
  }
};
