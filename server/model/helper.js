const { postgresql } = require("../config/connect");

module.exports = {
  getAllHelper: async () => {
    try {
      const helperData = await postgresql.query(`SELECT * FROM helper`);
      if (helperData?.rows) {
        return helperData?.rows;
      }
      return [];
    } catch (error) {
      console.log("getAllHelper error >>>> ", error);
      return [];
    }
  },

  createHelperData: async (helperText, helperDescription) => {
    try {
      const createRes = await postgresql.query(
        `INSERT INTO helper(helper_text, helper_description, create_at) VALUES('${helperText}', '${helperDescription}', Now())`
      );
      if (createRes?.rows) {
        return true;
      }
      return false;
    } catch (error) {
      console.log("createHelperData error >>>> ", error);
      return false;
    }
  },

  updateHelperData: async (helperText, helperDescription, helperId) => {
    try {
      const updateRes = await postgresql.query(
        `UPDATE helper SET helper_text='${helperText}', helper_description='${helperDescription}' WHERE helper_id=${Number(
          helperId
        )}`
      );
      if (updateRes?.rows) {
        return true;
      }
      return false;
    } catch (error) {
      console.log("updateTopicData error >>>> ", error);
      return false;
    }
  },

  deleteHelperData: async (helperId) => {
    try {
      const deleteRes = await postgresql.query(
        `DELETE FROM helper WHERE helper_id=${Number(helperId)}`
      );
      if (deleteRes?.rows) {
        return true;
      }
      return false;
    } catch (error) {
      console.log("deleteHelperData error >>>> ", error);
      return false;
    }
  },
};
