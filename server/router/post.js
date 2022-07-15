const express =  require('express');
const postController = require('../controllers/post');
const router = express.Router();

router.get('/', postController.getAllPost);
router.get('/:postId/info', postController.getPostById);
router.post('/', postController.createNewPost);
router.delete('/:postId/info', postController.deletePostInfo);
router.put('/:postId/info', postController.updatePostData);
router.get('/review/:postId', postController.getReviewByPost);
router.get('/review', postController.getAllReview)
router.post('/review', postController.createNewPostReview)
router.get('/favourite', postController.getUserBlogFavourite)
router.put('/favourite', postController.changeUserFavouriteBlog)


module.exports = router;
