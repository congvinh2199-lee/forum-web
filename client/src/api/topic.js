import AxiosClient from "./axiosClient";

const TopicAPI = {
  getAllTopic(limit, offset) {
    const url = `/topic?limit=${limit}&offset=${offset}`;
    return AxiosClient.get(url, {limit, offset});
  },

  createNewTopic(topicData) {
    const url = `/topic`;
    return AxiosClient.post(url, {topicData});
  },

  updateTopicData(topicData, topicId) {
    const url = `/topic/${topicId}`;
    return AxiosClient.put(url, {topicData});
  },

  deleteTopic(topicId) {
    const url = `/topic/${topicId}`;
    return AxiosClient.delete(url);
  }
};
export default TopicAPI;
