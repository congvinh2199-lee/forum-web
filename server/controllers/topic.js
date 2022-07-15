const asyncHandler = require("express-async-handler");
const { getAllTopic, createTopicData, updateTopicData, deleteTopicData, getTotalTopic } = require("../model/topic");

module.exports = {
  getAllTopic: asyncHandler(async (req, res) => {
    const {limit, offset} = req?.query
    const topicList = await getAllTopic(limit, offset);
    const totalTopic = await getTotalTopic();
    res.send({ success: true, payload: {topic: topicList, total: totalTopic} });
  }),

  createNewTopic: asyncHandler(async (req, res) => {
    const {topicData} = req.body
    const {name, image, topic_description} = topicData
    const createRes = await createTopicData(name, image, topic_description)
    res.send({ success: createRes });
  }),

  updateTopicData: asyncHandler(async (req, res) => {
    const {topicData} = req.body
    const {topicId} = req.params
    const {name, image, topic_description} = topicData

    const updateRes = await updateTopicData(name, image, topic_description, topicId)
    res.send({ success: updateRes });
  }),

  deleteTopicData: asyncHandler(async (req, res) => {
    const {topicId} = req.params
    const deleteRes = await deleteTopicData(topicId)
    res.send({ success: deleteRes });
  })
};
