import categoryModel from "../../../DB/Models/Category.model.js";
import productModel from "../../../DB/Models/Product.model.js";
import subCategoryModel from "../../../DB/Models/SubCategory.model.js";
import { AppError } from "../../../GlobalError.js";
import { AppSuccess } from "../../../GlobalSuccess.js";
import cloudinary from "../../Utilities/Cloudinary.js";
import slugify from "slugify";

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
            req.body.slug = slugify(req.body.name);
            await subCategoryModel.create({ name: req.body.name, slug: req.body.slug, image: { secure_url, public_id }, createdBy: req.id, updatedBy: req.id, categoryId });
            return next(new AppSuccess("success", 201));
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
        return next(new AppSuccess("success", 200, { subCategory }));
    }
}

export const getActiveSubCategory = async (req, res, next) => {
    const { categoryId } = req.params;
    const category = await categoryModel.findById({ _id: categoryId });
    if (!category) {
        return next(new AppError("Invalid Category", 404));

    }
    const subCategory = await subCategoryModel.find({ categoryId, status: "Active" });
    if (!subCategory) {
        return next(new AppError("Invalid SubCategory", 404));
    }
    else {
        return next(new AppSuccess("success", 200, { subCategory }));
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
    return next(new AppSuccess("success", 200, { subCategory }));
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
    return next(new AppSuccess("success", 200, { subCategory }));
}

export const deleteSubCategory = async (req, res, next) => {
    const { categoryId, id } = req.params;
    const category = await categoryModel.findById(categoryId);
    if (!category) {
        return next(new AppError("Invalid Category", 404));
    }
    const subCategory = await subCategoryModel.findByIdAndDelete(id).populate([
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

    const products = await productModel.find({ subCategoryId: id });

    for (const product of products) {
        if (product.mainImage && product.mainImage.public_id) {
            await cloudinary.uploader.destroy(product.mainImage.public_id);
        }
        if (product.subImages && product.subImages.length > 0) {
            for (const image of product.subImages) {
                await cloudinary.uploader.destroy(image.public_id);
            }
        }
    }

    await productModel.deleteMany({ subCategoryId: id });
    await cloudinary.uploader.destroy(subCategory.image.public_id);
    return next(new AppSuccess("success", 200, { subCategory }));
}
