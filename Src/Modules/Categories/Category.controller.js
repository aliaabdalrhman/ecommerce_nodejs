import categoryModel from "../../../DB/Models/Category.model.js";
import productModel from "../../../DB/Models/Product.model.js";
import subCategoryModel from "../../../DB/Models/SubCategory.model.js";
import { AppError } from "../../../GlobalError.js";
import cloudinary from "../../Utilities/Cloudinary.js";

// get all category
export const getAllCategories = async (rea, res, next) => {
    // Retrieve all categories from the database, selecting only the 'name' field
    const categories = await categoryModel.find({}).select('name');
    // Return the list of categories in the response with a success message
    return res.status(200).json({ message: "success", categories });
}

// create category 
export const createCategory = async (req, res, next) => {
    req.body.name = req.body.name.toLowerCase();
    // Check if a category with the same name already exists
    const category = await categoryModel.findOne({ name: req.body.name });
    if (category) {
        // If the category exists, return a conflict error
        return next(new AppError("category already exists", 409));
    }
    else {
        // Upload the image to Cloudinary and get the secure URL
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APPNAME}/category` });
        req.body.image = { secure_url, public_id };
        req.body.createdBy = req.id;
        req.body.updatedBy = req.id;
        // If the category doesn't exist, create a new one
        await categoryModel.create(req.body);
        return res.status(201).json({ message: "success" });

    }
}

// Get category details by ID
export const getCategoryDetails = async (req, res, next) => {
    // Extract the category ID from the request parameters
    const { id } = req.params;
    // Find the category by its ID in the database
    const category = await categoryModel.findById({ _id: id });
    // If the category doesn't exist, return an error response
    if (!category) {
        return next(new AppError('Invalid category', 404));
    } else {
        // If the category exists, retrieve the full details
        // Populate the 'createdBy' and 'updatedBy' fields with their associated usernames
        const CategoryDetails = await categoryModel.findById({ _id: id }).populate([
            {
                path: 'createdBy',
                select: 'username'
            },
            {
                path: 'updatedBy',
                select: 'username'
            }
        ]);
        // Return the category details in the response with a success message
        return res.status(200).json({ message: "success", category: CategoryDetails });
    }
}

// update a category's details
export const updateCategory = async (req, res, next) => {
    // Extract the new 'name' and 'status' values from the request body
    const { name, status } = req.body;
    const updatedBy = req.id;
    // Extract the category ID from the request parameters
    const { id } = req.params;
    // Find the category by its ID and update it with the new 'name' and 'status'
    // The 'new: true' option returns the updated document
    // Populate the 'createdBy' and 'updatedBy' fields with their associated usernames
    const category = await categoryModel.findByIdAndUpdate({ _id: id }, { name, status, updatedBy }, { new: true }).populate([
        {
            path: 'createdBy',
            select: 'username'
        },
        {
            path: 'updatedBy',
            select: 'username'
        }
    ]);
    // Check if the category exists; if not, return an error response
    if (!category) {
        return next(new AppError('Invalid category', 404)); // Handle invalid category ID with a custom error
    } else {
        // If the update is successful, return the updated category with a success message
        return res.status(200).json({ message: "success", category });
    }
}

//  delete a category by its ID
export const deletCategory = async (req, res, next) => {
    // Extract the category ID from the request parameters
    const { id } = req.params;
    // Find the category by its ID and delete it from the database
    // Populate the 'createdBy' and 'updatedBy' fields with their associated usernames
    const category = await categoryModel.findByIdAndDelete({ _id: id }).populate([
        {
            path: 'createdBy',
            select: 'username'
        },
        {
            path: 'updatedBy',
            select: 'username'
        }
    ]);
    // Check if the category existed and was deleted; if not, return an error response
    if (!category) {
        return next(new AppError('Invalid category', 404)); // Handle case where the category ID is invalid or does not exist
    } else {
        // Delete the category image from Cloudinary
        await cloudinary.uploader.destroy(category.image.public_id);

        // Find all subcategories associated with the category
        const subCategories = await subCategoryModel.find({ categoryId: id });

        // Loop through each subcategory and delete its image from Cloudinary
        for (const subCategory of subCategories) {
            if (subCategory.image && subCategory.image.public_id) {
                await cloudinary.uploader.destroy(subCategory.image.public_id);
            }
        }
        // Find all products associated with the category
        const products = await productModel.find({ categoryId: id });

        // Loop through each product and delete its main and sub-images from Cloudinary
        for (const product of products) {
            // Delete the main image of the product
            if (product.mainImage && product.mainImage.public_id) {
                await cloudinary.uploader.destroy(product.mainImage.public_id);
            }

            // Delete all sub-images of the product
            if (product.subImages && product.subImages.length > 0) {
                for (const image of product.subImages) {
                    await cloudinary.uploader.destroy(image.public_id);
                }
            }
        }

        // Delete all subcategories related to the deleted category
        await subCategoryModel.deleteMany({ categoryId: id });
        await productModel.deleteMany({ categoryId: id });

        // If the deletion is successful, return a success message with the deleted category details
        return res.status(200).json({ message: "success", category });
    }
}
