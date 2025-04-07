const { request, response } = require('express')
const CategorySchema = require('../model/CategorySchema')

//save(POST)
const createCategory = async (request, response) => {
  //client side must send the file resource
  //you must upload the icon into the s3 bucket and then you can get the response body
  //the client send the ids of all the available countries, the system must find all the countries for the request
  try {
    const { categoryName, file, countries } = request.body
    if (!categoryName || !file || !countries) {
      return response
        .status(400)
        .json({ code: 400, message: 'some fields are missing..', data: null })
    }

    const category = new CategorySchema({
      categoryName: categoryName,
      icon: {
        hash: 'Temp Hash',
        resourceUrl:
          'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.timeforpaws.co.uk%2Fblogs%2Farticles%2Fsiberian-husky&psig=AOvVaw1UeDZu4u2xuCsPH1kVr0dU&ust=1743890209201000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCLiZpLyvv4wDFQAAAAAdAAAAABAE',
        fileName: 'Temp File Name',
        directory: 'Temp Directory',
      }, //assume that you have send the images to the s3
      availableCountries: [
        {
          countryId: 'Temp-Id-1',
          countryName: 'Sri lanka',
        },
        {
          countryId: 'Temp-Id-2',
          countryName: 'USA',
        },
      ],
    })

    const saveData = await category.save()
    return response
      .status(201)
      .json({ code: 201, message: 'customer has been saved..', data: saveData })
  } catch (e) {
    response.status(500).json({
      code: 500,
      message: 'Something went wrong..',
      error: e,
    })
  }
}

//update(PUT)
const updateCategory = async (request, response) => {
  try {
    const { categoryName } = request.body
    if (!categoryName) {
      return response
        .status(400)
        .json({ code: 400, message: 'some fields are missing..', data: null })
    }

    const updateData = await CategorySchema.findOneAndUpdate(
      { _id: request.params.id },
      {
        $set: {
          categoryName: categoryName,
        },
      },
      { new: true }
    )
    return response.status(200).json({
      code: 200,
      message: 'customer has been updated..',
      data: updateData,
    })
  } catch (e) {
    response.status(500).json({
      code: 500,
      message: 'Something went wrong..',
      error: e,
    })
  }
}

//delete(DELETE)
const deleteCategory = async (request, response) => {
  try {
    if (!request.params.id) {
      return response
        .status(400)
        .json({ code: 400, message: 'some fields are missing..', data: null })
    }

    const deletedData = await CategorySchema.findOneAndDelete({
      _id: request.params.id,
    })
    return response.status(204).json({
      code: 204,
      message: 'customer has been deleted..',
      data: deletedData,
    })
  } catch (e) {
    response.status(500).json({
      code: 500,
      message: 'Something went wrong..',
      error: e,
    })
  }
}

const findCategoryById = async (request, response) => {
  try {
    if (!request.params.id) {
      return response
        .status(400)
        .json({ code: 400, message: 'some fields are missing..', data: null })
    }

    const categorydData = await CategorySchema.findById({
      _id: request.params.id,
    })
    if (categorydData) {
      return response.status(200).json({
        code: 204,
        message: 'catogery data foundd..',
        data: categorydData,
      })
    }
    return response.status(404).json({
      code: 404,
      message: 'catogery data not foundd..',
      data: categorydData,
    })
  } catch (e) {
    response.status(500).json({
      code: 500,
      message: 'Something went wrong..',
      error: e,
    })
  }
}

const findAllCategories = async (request, response) => {
  try {
    const { searchText, page = 1, size = 10 } = request.query
    const pageIndex = parseInt(page)
    const pageSize = parseInt(size)

    const query = {}
    if (searchText) {
      query.$text = { $search: searchText }
    }

    const skip = (pageIndex - 1) * pageSize
    const categoryList = await CategorySchema.find(query)
      .limit(pageSize)
      .skip(skip)

    const categoryListCount = await CategorySchema.countDocuments(query)

    return response.status(200).json({
      code: 200,
      message: 'catogery data',
      data: { list: categoryList, dataCount: categoryListCount },
    })
  } catch (e) {
    response.status(500).json({
      code: 500,
      message: 'Something went wrong..',
      error: e,
    })
  }
}

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  findCategoryById,
  findAllCategories,
}
