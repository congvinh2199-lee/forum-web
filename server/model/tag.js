const { postgresql } = require("../config/connect");
const { getByLimitAndOffset } = require("../utils/utils");

module.exports = {
  getTagByName: async (name) => {
    try {
      const tagRes = await postgresql.query(
        `SELECT tag_id, tag_title FROM tag WHERE tag_title='${name}'`
      );
      if (tagRes?.rows?.length)
        return { success: true, payload: tagRes?.rows[0] };
      return {};
    } catch (error) {
      console.log("getTagByName error >>> ", error);
      return {};
    }
  },

  createTag: async (name) => {
    try {
      const createRes = await postgresql.query(
        `INSERT INTO tag(tag_title, created_day) VALUES('${name}', Now()) RETURNING tag_id`
      );
      if (createRes?.rows?.length)
        return {
          success: true,
          payload: createRes?.rows[0]?.tag_id || "",
        };
      return { success: false };
    } catch (error) {
      console.log("createTag error >>> ", error);
      return { success: false };
    }
  },

  createQuestionTag: async (tag_id, questionId) => {
    try {
      const createRes = await postgresql.query(
        `INSERT INTO question_tag(tag_id, question_id) VALUES(${Number(
          tag_id
        )}, ${Number(questionId)})`
      );
      if (createRes?.rows) {
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.log("createQuestionTag error >>> ", error);
      return { success: false };
    }
  },

  getTrendingTag: async (limit, offset) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset)
      const trendingTag = await postgresql.query(
        `SELECT t.tag_title, qt.tag_id, COUNT(qt.tag_id) AS tag_quantity FROM question_tag qt JOIN tag t ON qt.tag_id = t.tag_id GROUP BY t.tag_title, qt.tag_id ORDER BY COUNT(qt.tag_id) DESC ${limitOffset}`
      );
      if (trendingTag?.rows) return trendingTag?.rows;
      return [];
    } catch (error) {
      console.log("getTrendingTag error >>> ", error);
      return [];
    }
  },

  getListTag: async (limit, offset) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset)
      const tag = await postgresql.query(
        `SELECT t.*, (SELECT COUNT(qt.question_id) AS tag_quantity FROM  question_tag qt WHERE qt.tag_id = t.tag_id) FROM tag t ${limitOffset}`
      );

      if (tag.rows) {
        return tag.rows;
      }
      return [];
    } catch (error) {
      console.log("getListTag error >>> ", error);
      return [];
    }
  },

  getTotalTag: async () => {
    try{
      const total = await postgresql.query(`SELECT COUNT(tag_id) as count_tag FROM tag`)
      if ( total?.rows?.length ) return total?.rows[0]?.count_tag
      return 0
    }catch (error) {
      console.log("getTotalTag error >>> ", error);
      return 0;
    }
  }
};
