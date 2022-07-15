const asyncHandler = require("express-async-handler");
const { getTrendingTag, getListTag, getTotalTag } = require("../model/tag");

module.exports = {
  getTagTrending: asyncHandler(async (req, res) => {
    const {limit, offset} = req.query;
    const tag = await getTrendingTag(limit, offset)
    res.send({success: true, payload: tag})
  }),

  getAllTag: asyncHandler(async (req, res) => {
    const {limit, offset} = req.query;
    const tag = await getListTag(limit, offset)
    const total = await getTotalTag();
    res.send({success: true, payload: {tag, total}})
  })
};
