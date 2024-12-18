import categoryModel from "../../../DB/Models/Category.model.js";
import productModel from "../../../DB/Models/Product.model.js";
import subCategoryModel from "../../../DB/Models/SubCategory.model.js";
import { AppError } from "../../../GlobalError.js";
import { AppSuccess } from "../../../GlobalSuccess.js";
import cloudinary from "../../Utilities/Cloudinary.js";
import slugify from "slugify";
import { pagination } from "../../Utilities/Pagination.js";

export const createProduct = async (req, res, next) => {
    const { price, description, stock, colors, sizes, categoryId, subCategoryId, discount } = req.body;
    let parsedColors, parsedSizes;
    if (colors) {
        parsedColors = JSON.parse(colors);    //convert string to array
    }
    if (sizes) {
        parsedSizes = JSON.parse(sizes);
    }
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
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImage[0].path,
        { folder: `${process.env.APPNAME}/products/${req.body.name}` });

    let subImages = [];
    if (req.files.subImages) {
        for (const file of req.files.subImages) {
            const upload = await cloudinary.uploader.upload(file.path,
                { folder: `${process.env.APPNAME}/Products/${req.body.name}/subImages` });
            subImages.push({
                secure_url: upload.secure_url,
                public_id: upload.public_id,
            });
        }
    }

    let priceAfterDiscount = price - (price * (discount || 0) / 100);
    req.body.slug = slugify(req.body.name);
    await productModel.create({
        name: req.body.name,
        description,
        price,
        slug: req.body.slug,
        discount,
        priceAfterDiscount,
        stock,
        colors: parsedColors || [],
        sizes: parsedSizes || [],
        mainImage: { secure_url, public_id },
        subImages,
        createdBy: req.id,
        updatedBy: req.id,
        categoryId,
        subCategoryId
    })
    return next(new AppSuccess("success", 201));
};

export const getAllProduct = async (req, res, next) => {
    const { skip, limit } = pagination(req.query.page, req.query.limit);
    let queryObject = { ...req.query };
    const execQuery = ['skip', 'limit', 'page', 'sort', 'search', 'fileds'];
    execQuery.map((ele) => {
        delete queryObject[ele];
    });
    queryObject = JSON.stringify(queryObject);
    queryObject = queryObject.replace(/lt|lte|gt|gte|in|nin|neq|eq/g, match => `$${match}`);
    queryObject = JSON.parse(queryObject);
    const mongooseQuery = productModel.find(queryObject).limit(limit).skip(skip);
    if (req.query.search) {
        mongooseQuery.find({
            $or: [
                { name: { $regex: (req.query.search), $options: 'i' } },
                { description: { $regex: (req.query.search), $options: 'i' } }
            ]
        })
    }
    const count = await productModel.estimatedDocumentCount();
    mongooseQuery.select(req.query.fileds?.replaceAll(',', ' '));
    let products = await mongooseQuery.sort(req.query.sort);

    products = products.map(product => {
        return {
           ...product.toObject(),
            mainImage: product.mainImage.secure_url,
            subImages: product.subImages.map(img => img.secure_url,
            ),

        }
    })
    return next(new AppSuccess("success", 200, { count, products }));
}

export const getProductById = async (req, res, next) => {
    const { id } = req.params;
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
        },
        {
            path: 'reviews',
            populate: {
                path: 'userId',
                select: 'username -_id',
            }
        }
    ]);
    if (!product) {
        return next(new AppError("Invalid Product", 404));
    }
    return next(new AppSuccess("success", 200, { product }));
}

export const deleteProduct = async (req, res, next) => {
    const { id } = req.params;
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
    const subImagesFolder = `${process.env.APPNAME}/Products/${product.name}/subImages`;
    await cloudinary.api.delete_resources_by_prefix(subImagesFolder);

    const mainImageFolder = `${process.env.APPNAME}/Products/${product.name}`;
    await cloudinary.api.delete_resources_by_prefix(mainImageFolder);

    await cloudinary.api.delete_folder(subImagesFolder);
    await cloudinary.api.delete_folder(mainImageFolder);

    return next(new AppSuccess("success", 200, { product }));
}
