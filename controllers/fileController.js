import asyncHandler from 'express-async-handler';
import generatePreSignedUrlService from '../utils/generatePreSignedUrl.js';
import FileModel from '../models/fileModel.js';
import mongoose from 'mongoose';
import { getFileType } from '../utils/generateFileType.js';
import UserModel from '../models/userModel.js';
import { createFile } from '../services/fileServices.js';

export const createPresignedUrlController = asyncHandler(async (req, res) => {
    const userId = req.userId;
    
    // Calculate the total file size from the uploaded files
    const totalFileSize = req.files.reduce((acc, value) => acc + value.size, 0) || 0;

    if (!req.files || !userId) {
        return res.status(400).json({ message: "No files selected", success: false });
    }

    const user = await UserModel.findById(userId);

    if (user.storageUsed + parseFloat(totalFileSize) >= user.storageLimit) {

        return res.status(409).json({ message: "Storage limit exceeded", success: false });
    }

    // Generate presigned URLs for the files
    const presignedUrl = await generatePreSignedUrlService(req.files);

    if (presignedUrl.length === 0) {
        return res.status(400).json({ message: "Error in uploading files", success: false });
    }

    res.status(201).json({
        message: "Successfully generated URL(s)",
        success: true,
        data: presignedUrl
    });
});

export const fileUploadController = asyncHandler(async (req, res) => {

    const { name, url, size, type } = req.body
    const userId = new mongoose.Types.ObjectId(req.userId)

    if (!name || !url || !size || !type) return res.status(400).json({ message: "all fields required", success: false })

    const ext = type.split('/')[1]
    const newUrl = url.split(ext)[0] + ext


    const fileType = getFileType(name)


    const newFile = await createFile({
        name,
        url: newUrl,
        type: fileType.type,
        extension: fileType.extension,
        size: size,
        userId: userId
    })

    const updateStorage = await UserModel.updateOne({ _id: userId }, { $inc: { storageUsed: size } })

    const data = await FileModel.findOne({ _id: newFile._id })
        .populate({ path: 'userId', select: 'fullName' });


    if (!newFile || !updateStorage) return res.status(400).json({ message: "Error in uploading file", success: false })

    res.status(200).json({ message: "File uploaded sucessfully ", success: true, data })

});


export const getFilesController = asyncHandler(async (req, res) => {

    const userId = new mongoose.Types.ObjectId(req.userId)
    let { type, query, sort } = req.query

    let limit = 10
    let skip = 0


    const matchQuery = { userId: userId }
    let sortQuery = { createdAt: -1 }

    if (type) {
        matchQuery.type = type
    }

    if (query) {

        matchQuery.name = { $regex: query, $options: 'i' };  // 'i' for case-insensitive
    }


    if (sort) {
        let [field, direction] = sort.split('-');
        let sortOrder = direction === 'desc' ? -1 : 1;

        sortQuery = { [field]: sortOrder };
    }



    const files = await FileModel.aggregate([
        {
            $match: matchQuery
        },
        {
            $facet: {
                files: [
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'userId',
                            foreignField: '_id',
                            as: 'user'
                        }
                    },
                    {
                        $unwind: {
                            path: '$user',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $project: {
                            name: 1,
                            url: 1,
                            type: 1,
                            extension: 1,
                            size: 1,
                            userId: 1,
                            username: '$user.fullName',
                            storageUsed: '$user.storageUsed',
                            createdAt: 1,
                            updatedAt: 1
                        }
                    }, {
                        $sort: sortQuery
                    }
                ],
                totalSize: [
                    { $group: { _id: null, totalSize: { $sum: '$size' } } }
                ]
            }
        }
    ])


    if (!files) return res.status(404).json({ message: "No files found", success: false })

    const data = { files: files[0]?.files || [], totalSize: files[0]?.totalSize[0]?.totalSize || 0 }


    res.status(200).json({ message: "Files fetched succesfully", success: true, data })



});

export const renameFileController = asyncHandler(async (req, res) => {

    const userId = new mongoose.Types.ObjectId(req.userId)
    const id = new mongoose.Types.ObjectId(req.params.id)

    const newFile = await FileModel.findOneAndUpdate(
        { userId, _id: id },
        { $set: { name: req.body.name } },
        { new: true }
    );


    if (!newFile) return res.status(404).json({ message: "No files found", success: false })

    res.status(200).json({ message: "Files renamed succesfully", success: true, data: newFile })


});

export const deleteFileController = asyncHandler(async (req, res) => {

    const userId = new mongoose.Types.ObjectId(req.userId)
    const id = new mongoose.Types.ObjectId(req.params.id)
    const size = req.params.size || 0

    const file = await FileModel.deleteOne({ userId, _id: id })

    const updateStorage = await UserModel.updateOne({ _id: userId }, { $inc: { storageUsed: -size } })

    if (!file || !updateStorage) return res.status(404).json({ message: "No files found", success: false })

    res.status(200).json({ message: "Files deleted succesfully", success: true, data: id })


});


export const getFilesSpace = asyncHandler(async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.userId)

    const totalSpace = await FileModel.aggregate([
        {
            $match: { userId: userId }
        },
        {
            $facet: {
                totalSpace: [
                    {
                        $group: {
                            _id: null,
                            totalSpace: { $sum: "$size" }
                        }
                    }
                ],
                filesSpace: [
                    {
                        $group: {
                            _id: "$type",
                            size: { $sum: "$size" }
                        }
                    }

                ],
                recentFiles: [
                    {
                        $sort: { createdAt: -1 },

                    },
                    {
                        $limit: 9
                    }
                ]
            }
        }
    ])

    if (!totalSpace) return res.status(404).json({ message: "No files found", success: false })

    res.status(200).json({ message: "Data fetched succesfully", success: true, data: totalSpace[0] })

})