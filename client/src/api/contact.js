import AxiosClient from "./axiosClient";

const ContactAPI = {
  createNewContact(contactData) {
    const url = `/contact`;
    return AxiosClient.post(url, {contactData});
  },

  getListContact() {
    const url = `/contact`;
    return AxiosClient.get(url);
  },

  deleteContact(contactId) {
    const url = `/contact/${contactId}`;
    return AxiosClient.delete(url);
  },

};
export default ContactAPI;
