import AxiosClient from "./axiosClient";

const TagAPI = {
  getTrendingTag(limit, offset) {
    const url = `/tag/trending?limit=${limit}&offset=${offset}`;
    return AxiosClient.get(url);
  },

  getTag(limit, offset){
    const url = `/tag?limit=${limit}&offset=${offset}`
    return AxiosClient.get(url);
  }
};
export default TagAPI;
