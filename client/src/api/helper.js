import AxiosClient from "./axiosClient";

const HelperAPI = {
  getAllHelper() {
    const url = `/helper`;
    return AxiosClient.get(url);
  },

  createNewHelper(helperData) {
    const url = `/helper`;
    return AxiosClient.post(url, {helperData});
  },

  updateHelperData(helperData, helperId) {
    const url = `/helper/${helperId}`;
    return AxiosClient.put(url, {helperData});
  },

  deleteHelper(helperId) {
    const url = `/helper/${helperId}`;
    return AxiosClient.delete(url);
  }
};
export default HelperAPI;
