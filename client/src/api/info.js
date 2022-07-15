import AxiosClient from "./axiosClient";

const InfoAPI = {
  getWebsiteInfo(fromDate, toDate) {
    const url = `/info/quantity?fromDate=${fromDate}&toDate=${toDate}`;
    return AxiosClient.get(url);
  },
};
export default InfoAPI;
