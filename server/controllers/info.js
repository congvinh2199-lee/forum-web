const asyncHandler = require("express-async-handler");
const { infoMiddleware } = require("../middlewares/info");

module.exports = {
  getWebsiteQuantityInfo: asyncHandler(async (req, res) => {
    const {fromDate, toDate} = req?.query
    const info = await infoMiddleware.getWebsiteQuantityInfo(fromDate, toDate)
    res.send(info)
  })
};
