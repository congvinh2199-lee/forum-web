const asyncHandler = require("express-async-handler");
const {
  getUserList,
  getAdminList,
  deleteUserInfo,
  deleteAdminInfo,
  updateUserStatus,
  updateAdminStatus,
  getUserById,
  updateUserName,
  countTotalUser,
  updateUserAvatar,
} = require("../model/user");

module.exports = {
  getUserList: asyncHandler(async (req, res) => {
    const { role, limit, offset, sort } = req.query;
    let listData = [];

    if (Number(role) === 1) {
      listData = await getUserList(limit, offset, sort);
      const totalUser = await countTotalUser();
      res.send({ success: true, payload: {user: listData, total: totalUser} });
    }

    if (Number(role) === 2) {
      listData = await getAdminList(limit, offset, sort);
      res.send({ success: true, payload: {user: listData} });
    }
    
  }),

  getUserById: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const userInfp = await getUserById(userId);
    res.send({ success: true, payload: userInfp });
  }),

  deleteUserInfo: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { role } = req.query;
    let deleteRes = false;
    if (Number(role) === 1) {
      deleteRes = await deleteUserInfo(userId);
    }

    if (Number(role) === 2) {
      deleteRes = await deleteAdminInfo(userId);
    }
    res.send({ success: deleteRes });
  }),

  updateUserStatus: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { role, status } = req.query;
    let updateRes = false;
    if (Number(role) === 1) {
      updateRes = await updateUserStatus(userId, status);
    }

    if (Number(role) === 2) {
      updateRes = await updateAdminStatus(userId, status);
    }
    res.send({ success: updateRes });
  }),

  updateUserName: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const {first_name, last_name} = req.body
    const updateRes = await updateUserName(first_name, last_name, userId)
    res.send({ success: updateRes });
  }),

  updateUserAvatar: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const {avatar} = req.body
    const updateRes = await updateUserAvatar(avatar, userId)
    res.send({ success: updateRes });
  })
};
