const { postgresql } = require("../config/connect");
const { getByLimitAndOffset } = require("../utils/utils");

module.exports = {
  getAllPost: async (limit, offset, search) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset)
      const getQuery = await postgresql.query(
        `SELECT blog_id, blog_title, blog_desc, blog_image, create_at, 
        (SELECT COUNT(br.review_id) FROM blog_review br WHERE br.blog_id = blog.blog_id ) AS count_review,
        (SELECT COUNT(bf.user_id) FROM blog_favourite bf WHERE bf.blog_id = blog.blog_id ) AS count_favourite
        FROM blog WHERE ${
          search && search !== "undefined"
            ? `blog_title LIKE '%${search}%'`
            : `blog_title != ''`
        } ${limitOffset}`
      );

      if (getQuery?.rows) return getQuery?.rows;
    } catch (error) {
      console.log("getAllPost error >>>> ", error);
      return [];
    }
  },

  getPostInfo: async (postId) => {
    try {
      if (postId){
        const getQuery = await postgresql.query(
          `SELECT blog_id, blog_title, blog_desc, blog_image, blog_view, create_at,
          (SELECT COUNT(br.review_id) FROM blog_review br WHERE br.blog_id = blog.blog_id ) AS count_review,
          (SELECT COUNT(bf.user_id) FROM blog_favourite bf WHERE bf.blog_id = blog.blog_id ) AS count_favourite
          FROM blog WHERE blog_id=${Number(
            postId
          )}`
        );
  
        if (getQuery?.rows?.length) return getQuery?.rows[0];
      }
      return {};
    } catch (error) {
      console.log("getPostInfo error >>>> ", error);
      return {};
    }
  },

  createNewPost: async (title, desc, image) => {
    try {
      const insertQuery = await postgresql.query(
        `INSERT INTO blog(blog_title, blog_desc, blog_image, create_at, blog_view) VALUES('${title}', '${desc}', '${image}', Now(), 0)`
      );

      if (insertQuery?.rows) return true;
      return false;
    } catch (error) {
      console.log("createNewPost error >>>> ", error);
      return false;
    }
  },

  deletePostInfo: async (postId) => {
    try {
      const deletePost = await postgresql.query(
        `DELETE FROM blog WHERE blog_id = ${postId}`
      );
      if (deletePost?.rows) return true;
      return false;
    } catch (error) {
      console.log("deletePostInfo error >>>> ", error);
      return false;
    }
  },

  updatePostData: async (title, desc, image, postId) => {
    try {
      const updateRes = await postgresql.query(
        `UPDATE blog SET blog_title='${title}', blog_desc='${desc}', blog_image='${image}' WHERE blog_id=${Number(
          postId
        )}`
      );
      if (updateRes?.rows) return true;
      return false;
    } catch (error) {
      console.log("updatePostData error >>>> ", error);
      return false;
    }
  },

  getReviewByPost: async (postId, limit, offset) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset)
      const queryRes = await postgresql.query(
        `SELECT r.*, u.last_name, u.first_name FROM blog_review r JOIN users u ON r.user_id = u.user_id WHERE r.blog_id=${Number(
          postId
        )} ${limitOffset}`
      );

      const totalReview = await postgresql.query(
        `select COUNT(blog_review.review_id) as total_item from blog_review`
      );

      if (queryRes?.rows)
        return {
          review: queryRes?.rows,
          totalItem: totalReview?.rows[0].total_item,
        };
      return {};
    } catch (error) {
      console.log("getReviewByPost error >>>> ", error);
      return {};
    }
  },

  createBlogReview: async (user_id, review, blog_id, status) => {
    try {
      const insertRes = await postgresql.query(
        `INSERT INTO blog_review(review_date, user_id, review, blog_id, status) VALUES(Now(), ${Number(
          user_id
        )}, '${review}', ${Number(blog_id)}, ${status})`
      );

      if (insertRes?.rows) return true;
      return false;
    } catch (error) {
      console.log("createBlogReview error >>>> ", error);
      return false;
    }
  },

  getUserBlogFavourite: async (userId, blogId) => {
    try {
      const userFavourite = await postgresql.query(
        `SELECT * FROM blog_favourite WHERE blog_id=${Number(
          blogId
        )} AND user_id=${Number(userId)}`
      );
      if (userFavourite?.rows?.length) return true;
      return false;
    } catch (error) {
      console.log("getUserBlogFavourite error >>>> ", error);
      return false;
    }
  },

  changeUserFavouriteBlog: async (userId, blogId, status) => {
    try {
      if (status) {
        const changeRes = await postgresql.query(
          `INSERT INTO blog_favourite(user_id, blog_id) VALUES(${Number(
            userId
          )}, ${Number(blogId)})`
        );
        if (changeRes?.rows) return true;
        return false;
      }

      const deleteRes = await postgresql.query(
        `DELETE FROM blog_favourite WHERE blog_id=${Number(
          blogId
        )} AND user_id=${Number(userId)}`
      );
      if (deleteRes?.rows) return true;
      return false;
    } catch (error) {
      console.log("changeUserFavouriteBlog error >>>> ", error);
      return false;
    }
  },
};
