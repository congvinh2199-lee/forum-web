import AxiosClient from "./axiosClient";

const PostAPI = {
  getAll(limit, offset, search) {
    const url = `/post?limit=${limit}&offset=${offset}&search=${search}`;
    return AxiosClient.get(url);
  },

  getPostById(postId) {
    const url = `/post/${postId}/info`;
    return AxiosClient.get(url);
  },

  createNewPost({ title, desc, image }) {
    const url = `/post`;
    return AxiosClient.post(url, { title, desc, image });
  },

  deletePostData(postId) {
    const url = `/post/${postId}/info`;
    return AxiosClient.delete(url);
  },

  updatePostData({ id, title, desc, image }) {
    const url = `/post/${id}/info`;
    return AxiosClient.put(url, { title, desc, image });
  },

  getReviewByBlog({ postId, limit, page }) {
    const url = `/post/review/${postId}?limit=${limit}&offset=${page}`;
    return AxiosClient.get(url);
  },

  createBlogReview({ user_id, review, blog_id }) {
    const url = `/post/review`;
    return AxiosClient.post(url, { user_id, review, blog_id });
  },

  getAllBlogReview() {
    const url = `/post/review`;
    return AxiosClient.get(url);
  },

  updateReviewStatus(reviewId, status) {
    const url = `/post/review/${reviewId}/status`;
    return AxiosClient.put(url, { status });
  },

  getUserFavouriteBlog(userId, blogId){
    const url = `/post/favourite?userId=${userId}&blogId=${blogId}`
    return AxiosClient.get(url)
  },

  changeUserFavouriteBlog(userId, blogId, status){
    const url = `/post/favourite?userId=${userId}&blogId=${blogId}`
    return AxiosClient.put(url, {status})
  },

};
export default PostAPI;
