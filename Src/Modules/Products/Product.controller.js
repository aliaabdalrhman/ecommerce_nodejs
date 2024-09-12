import categoryModel from "../../../DB/Models/Category.model.js";
import productModel from "../../../DB/Models/Product.model.js";
import subCategoryModel from "../../../DB/Models/SubCategory.model.js";
import { AppError } from "../../../GlobalError.js";
import cloudinary from "../../Utilities/Cloudinary.js";

export const createProduct = async (req, res, next) => {
    const { categoryId, subCategoryId } = req.params;
    const { price, description, stock, colors, sizes } = req.body;
    const parsedColors = JSON.parse(colors);    //convert string to array
    const parsedSizes = JSON.parse(sizes);
    req.body.name = req.body.name.toLowerCase();
    const category = await categoryModel.findById(categoryId);
    if (!category) {
        return next(new AppError("Invalid Category", 404));
    }
    const subCategory = await subCategoryModel.findById(subCategoryId);
    if (!subCategory) {
        return next(new AppError("Invalid SubCategory", 404));
    }
    if (!subCategory.categoryId.equals(categoryId)) {
        return next(new AppError("SubCategory does not belong to this Category", 400));
    }
    const product = await productModel.findOne({ name: req.body.name });
    if (product) {
        return next(new AppError("Product already exists", 400));
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImage[0].path, { folder: `${process.env.APPNAME}/subCategory/products` });

    let subImages = [];
    if (req.files.subImages) {
        for (const file of req.files.subImages) {
            const upload = await cloudinary.uploader.upload(file.path, { folder: `${process.env.APPNAME}/subCategory/products/subImages` });
            subImages.push({
                secure_url: upload.secure_url,
                public_id: upload.public_id,
            });
        }
    }
    const products = await productModel.create({ name: req.body.name, description, price, colors: parsedColors, sizes: parsedSizes, stock, mainImage: { secure_url, public_id }, subImages, createdBy: req.id, updatedBy: req.id, categoryId, subCategoryId })
    return res.status(201).json({ message: "success", products });
};

export const getAllProduct = async (req, res, next) => {
    const { categoryId, subCategoryId } = req.params;
    const category = await categoryModel.findById({ _id: categoryId });
    if (!category) {
        return next(new AppError("Invalid Category", 404));
    }
    const subCategory = await subCategoryModel.findById({ _id: subCategoryId });
    if (!subCategory) {
        return next(new AppError("Invalid SubCategory", 404));
    }
    if (!subCategory.categoryId.equals(categoryId)) {
        return next(new AppError("SubCategory does not belong to this Category", 400));
    }
    const products = await productModel.find({ categoryId, subCategoryId }).select("name");
    return res.status(200).json({ message: "success", products });
}

export const getProductById = async (req, res, next) => {
    const { categoryId, subCategoryId, id } = req.params;
    const category = await categoryModel.findById(categoryId);
    if (!category) {
        return next(new AppError("Invalid Category", 404));
    }
    const subCategory = await subCategoryModel.findById(subCategoryId);
    if (!subCategory) {
        return next(new AppError("Invalid SubCategory", 404));
    }

    if (!subCategory.categoryId.equals(categoryId)) {
        return next(new AppError("SubCategory does not belong to this Category", 400));
    }
    const product = await productModel.findById(id).populate([
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
        },
        {
            path: 'subCategoryId',
            select: 'name'
        }
    ]);
    if (!product) {
        return next(new AppError("Invalid Product", 404));
    }
    if (!product.subCategoryId.equals(subCategoryId)) {
        return next(new AppError("Product does not belong to this SubCategory", 400));
    }

    return res.status(200).json({ message: "success", product });

}

export const deleteProduct = async (req, res, next) => {
    const { categoryId, subCategoryId, id } = req.params;
    const category = await categoryModel.findById(categoryId);
    if (!category) {
        return next(new AppError("Invalid Category", 404));
    }
    const subCategory = await subCategoryModel.findById(subCategoryId);
    if (!subCategory) {
        return next(new AppError("Invalid SubCategory", 404));
    }
    if (!subCategory.categoryId.equals(categoryId)) {
        return next(new AppError("SubCategory does not belong to this Category", 400));
    }
    const product = await productModel.findByIdAndDelete({ _id: id }).populate([
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
        },
        {
            path: 'subCategoryId',
            select: 'name'
        }
    ]);
    if (!product) {
        return next(new AppError("Invalid product", 404));
    }
    if (!product.subCategoryId.equals(subCategoryId)) {
        return next(new AppError("Product does not belong to this SubCategory", 400));
    }
    
    await cloudinary.uploader.destroy(product.mainImage.public_id);

    for (const image of product.subImages) {
        await cloudinary.uploader.destroy(image.public_id);
    }

    return res.status(200).json({ message: "success", product });
}
