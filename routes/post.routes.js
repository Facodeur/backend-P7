const express = require("express");
const postController = require("../controllers/post.controller");
const authJwt = require("../middleware/authJwt");
const multer = require("../middleware/multer-config");

const router = express.Router();

router.get("/", authJwt, postController.getAllPosts);
router.post("/", authJwt, multer, postController.createPost);
router.put("/:id", authJwt, postController.updatePost);
router.delete("/:id", authJwt, postController.deletePost);

module.exports = router;