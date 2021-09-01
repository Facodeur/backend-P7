const postModel = require("../models").Post;
const userModel = require("../models").User;

exports.getAllPosts = (req, res) => {
  postModel
    .findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: userModel,
          attributes: ["username"],
        },
      ],
    })
    .then((posts) => {
      res.status(200).json({ status: 1, data: posts });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.createPost = (req, res) => {
  const user_id = req.data.id;

  userModel
    .findOne({ where: { id: user_id } })
    .then((user) => {
      if (req.body.content === "" || req.body.content === undefined) {
        res.status(400).json({ message: "Veuillez écrire quelque chose" });
      }
      if (user) {
        postModel
          .create({
            content: req.body.content,
            picture: req.file !== undefined ? `./images/${req.file.filename}` : "",
            userId: user.id
          })
          .then(() => {
            res.status(201).json({ status: 1, message: "Post enregistré" });
          })
          .catch((err) => {
            res.status(500).json({ message: err.message });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.updatePost = (req, res) => {
  const user_id = req.data.id;

  postModel
    .findOne({ where: { id: req.params.id } })
    .then((post) => {
      if (post.userId === user_id) {
        postModel
          .update(
            {
              content: req.body.content,
              picture: post.picture,
            },
            { where: { id: req.params.id } }
          )
          .then((post) => {
            if (post == 1) {
              res.status(200).json({ message: "Le post a été modifié" });
            }
          });
      } else {
        res
          .status(401)
          .json({ status: 0, message: "Vous n'êtes pas autorisé" });
      }
    })
    .catch(() => {
      res.status(500).json({ message: "Erreur lors de la mise à jour" });
    });
};

exports.deletePost = (req, res) => {
  const user_id = req.data.id;

  postModel
    .findOne({ where: { id: req.params.id } })
    .then((post) => {

      if (post.userId === user_id) {
        postModel
          .destroy({ where: { id: req.params.id } })
          .then((post) => {
            if (post === 1) {
              res.status(200).json({ message: "Post supprimé avec succés" });
            }
          });
      } else {
        res.status(401).json({ message: "Vous n'êtes pas autorisé" });
      }
    })
    .catch((err) => {
      res.status(404).json({ message: "Ce post n'existe pas" });
    });
};