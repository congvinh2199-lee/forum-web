const { postgresql } = require("../config/connect");

module.exports = {
  getAllContact: async () => {
    try {
      const contactData = await postgresql.query(`SELECT * FROM contact ORDER BY created_day DESC`);
      if (contactData?.rows) {
        return contactData?.rows;
      }
      return [];
    } catch (error) {
      console.log("getAllHelper error >>>> ", error);
      return [];
    }
  },

  createContactData: async (
    customer_name,
    customer_email,
    customer_phone,
    contact_subject,
    contact_description
  ) => {
    try {
      const createRes = await postgresql.query(
        `INSERT INTO contact(customer_name, customer_email, customer_phone, contact_subject, contact_description, created_day) 
        VALUES('${customer_name}', '${customer_email}', '${customer_phone}', '${contact_subject}', '${contact_description}', Now())`
      );
      if (createRes?.rows) {
        return true;
      }
      return false;
    } catch (error) {
      console.log("createContactData error >>>> ", error);
      return false;
    }
  },

  deleteContactData: async (contactId) => {
    try {
      const deleteRes = await postgresql.query(
        `DELETE FROM contact WHERE contact_id=${Number(contactId)}`
      );
      if (deleteRes?.rows) {
        return true;
      }
      return false;
    } catch (error) {
      console.log("deleteContactData error >>>> ", error);
      return false;
    }
  },
};
