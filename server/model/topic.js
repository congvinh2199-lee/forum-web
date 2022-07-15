const { postgresql } = require("../config/connect");
const { getByLimitAndOffset } = require("../utils/utils");

module.exports = {
  getAllTopic: async (limit, offset) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);
      const topicData = await postgresql.query(`SELECT t.*, (SELECT COUNT(q.question_id) FROM question q WHERE q.topic_id = t.topic_id) AS total_question FROM topic t ${limitOffset}`);
      if (topicData?.rows) {
        return topicData?.rows;
      }
      return [];
    } catch (error) {
      console.log("get all topic error >>>> ", error);
      return [];
    }
  },

  getTotalTopic: async() => {
    try{
      const total = await postgresql.query(`SELECT COUNT(topic_id) as count_topic FROM topic`)
      if ( total?.rows?.length ) return total?.rows[0]?.count_topic
      return 0
    }catch (error) {
      console.log("getTotalTopic error >>>> ", error);
      return 0;
    }
  },

  createTopicData: async (name, image, topic_description) => {
    try {
      const createRes = await postgresql.query(
        `INSERT INTO topic(topic_name, topic_description, topic_image, created_day) VALUES('${name}', '${topic_description}', '${image}', Now())`
      );
      if (createRes?.rows) {
        return true;
      }
      return false;
    } catch (error) {
      console.log("create topic error >>>> ", error);
      return false;
    }
  },

  updateTopicData: async (name, image, topic_description, topicId) => {
    try {
      const updateRes = await postgresql.query(
        `UPDATE topic SET topic_name='${name}', topic_description='${topic_description}', topic_image='${image}' WHERE topic_id=${Number(
          topicId
        )}`
      );
      if (updateRes?.rows) {
        return true;
      }
      return false;
    } catch (error) {
      console.log("update topic error >>>> ", error);
      return false;
    }
  },

  deleteTopicData: async (topicId) => {
    try {
      const deleteRes = await postgresql.query(
        `DELETE FROM topic WHERE topic_id=${Number(topicId)}`
      );
      if (deleteRes?.rows) {
        return true;
      }
      return false;
    } catch (error) {
      console.log("update topic error >>>> ", error);
      return false;
    }
  },
};
