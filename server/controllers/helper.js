const asyncHandler = require("express-async-handler");
const { getAllHelper, createHelperData, updateHelperData, deleteHelperData } = require("../model/helper");

module.exports = {
  getAllHelper: asyncHandler(async (req, res) => {
    const topicList = await getAllHelper();
    res.send({ success: true, payload: topicList });
  }),

  createNewHelper: asyncHandler(async (req, res) => {
    const {helperData} = req.body
    const {helperText, helperDescription} = helperData
    const createRes = await createHelperData(helperText, helperDescription)
    res.send({ success: createRes });
  }),

  updateHelperData: asyncHandler(async (req, res) => {
    const {helperData} = req.body
    const {helperId} = req.params
    const {helperText, helperDescription} = helperData

    const updateRes = await updateHelperData(helperText, helperDescription, helperId)
    res.send({ success: updateRes });
  }),

  deleteHelperData: asyncHandler(async (req, res) => {
    const {helperId} = req.params
    const deleteRes = await deleteHelperData(helperId)
    res.send({ success: deleteRes });
  })
};
