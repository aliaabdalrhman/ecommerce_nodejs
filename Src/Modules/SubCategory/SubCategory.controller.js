import categoryModel from "../../../DB/Models/Category.model.js";
import subCategoryModel from "../../../DB/Models/SubCategory.model.js";
import { AppError } from "../../../GlobalError.js";
import cloudinary from "../../Utilities/Cloudinary.js";

export const createSubCategory = async (req, res, next) => {
    req.body.name = req.body.name.toLowerCase();
    const { categoryId } = req.params;
    const category = await categoryModel.findById({ _id: categoryId });
    if (!category) {
        return next(new AppError("Invalid Category", 404));

    }
    else {
        const subCategory = await subCategoryModel.findOne({ name: req.body.name });
        if (subCategory) {
            return next(new AppError("SubCategory already exists", 409));
        }
        else {
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APPNAME}/subCategory` });
            await subCategoryModel.create({ name: req.body.name, image: { secure_url, public_id }, createdBy: req.id, updatedBy: req.id, categoryId });
            return res.status(201).json({ message: "success" });
        }
    }

}

export const getAllSubCategoryByCategoryId = async (req, res, next) => {
    const { categoryId } = req.params;
    const category = await categoryModel.findById({ _id: categoryId });
    if (!category) {
        return next(new AppError("Invalid Category", 404));

    }
    const subCategory = await subCategoryModel.find({ categoryId }).select('name');
    if (!subCategory) {
        return next(new AppError("Invalid SubCategory", 404));
    }
    else {
        return res.status(200).json({ message: "success", subCategory });
    }
}

export const getSubCategoryDetails = async (req, res, next) => {
    const { categoryId, id } = req.params;
    const category = await categoryModel.findById({ _id: categoryId });
    if (!category) {
        return next(new AppError("Invalid Category", 404));

    }
    const subCategory = await subCategoryModel.findById({ _id: id }).populate([
        {
            path: 'createdBy',
            select: 'username'
        },
        {
            path: 'updatedBy',
            select: 'username'
        },
        {
            path: 'categoryId',
            select: 'name'
        }
    ]);
    if (!subCategory) {
        return next(new AppError("Invalid SubCategory", 404));
    }
    if (!subCategory.categoryId.equals(categoryId)) {
        return next(new AppError("SubCategory does not belong to this Category", 400));
    }
    return res.status(200).json({ message: "success", subCategory });


}

export const updateSubCategory = async (req, res, next) => {
    const { categoryId, id } = req.params;
    const { name, status } = req.body;
    const updatedBy = req.id;
    const category = await categoryModel.findById({ _id: categoryId });
    if (!category) {
        return next(new AppError("Invalid Category", 404));

    }
    const subCategory = await subCategoryModel.findByIdAndUpdate({ _id: id }, { name, status, updatedBy }, { new: true }).populate([
        {
            path: 'createdBy',
            select: 'username'
        },
        {
            path: 'updatedBy',
            select: 'username'
        },
        {
            path: 'categoryId',
            select: 'name'
        }
    ]);
    if (!subCategory) {
        return next(new AppError("Invalid SubCategory", 404));
    }
    if (!subCategory.categoryId.equals(categoryId)) {
        return next(new AppError("SubCategory does not belong to this Category", 400));
    }
    return res.status(200).json({ message: "success", subCategory });

}

export const deleteSubCategory = async (req, res, next) => {
    const { categoryId, id } = req.params;
    const category = await categoryModel.findById({ _id: categoryId });
    if (!category) {
        return next(new AppError("Invalid Category", 404));
    }
    const subCategory = await subCategoryModel.findByIdAndDelete({ _id: id }).populate([
        {
            path: 'createdBy',
            select: 'username'
        },
        {
            path: 'updatedBy',
            select: 'username'
        },
        {
            path: 'categoryId',
            select: 'name'
        }
    ]);
    if (!subCategory) {
        return next(new AppError("Invalid SubCategory", 404));
    }
    if (!subCategory.categoryId.equals(categoryId)) {
        return next(new AppError("SubCategory does not belong to this Category", 400));
    }
    await cloudinary.uploader.destroy(subCategory.image.public_id);
    return res.status(200).json({ message: "success", subCategory });

}
