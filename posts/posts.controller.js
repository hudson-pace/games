const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const authorize = require('../middleware/authorize');
const validateRequest = require('../middleware/validate-request');
const { getById } = require('../users/user.service');
const postService = require('./post.service');
const { Post } = require('../helpers/db');
const Role = require('../helpers/role');

//routes
router.post('/', authorize(), createPostSchema, createPost);
router.post('/:id', authorize(), createCommentSchema, createComment);
router.post('/comments/:id', authorize(), createCommentSchema, createCommentReply);
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.get('/comments/:id', getChildrenOfComment);
router.delete('/:id', authorize(), deletePost);

module.exports = router;

function createPostSchema(req, res, next) {
    var schema = Joi.object({
        text: Joi.string().required(),
        tags: Joi.array().items(Joi.string())
    });
    validateRequest(req, next, schema);
}
function createPost(req, res, next) {
    getById(req.user.id)
        .then(user => {
            postService.createPost(user, req.body.text, req.body.tags)
                .then(post => {
                    if (post) {
                        return res.json('post successfully created');
                    }
                    return res.json("post could not be created");
                })
                .catch(next);
        })
        .catch(next);
}

function createCommentSchema(req, res, next) {
    var schema = Joi.object({
        text: Joi.string().required()
    });
    validateRequest(req, next, schema);
}
function createComment(req, res, next) {
    getById(req.user.id)
        .then(user => {
            postService.getRealPostId(req.params.id)
                .then(postId => {
                    postService.createComment(user, req.body.text, postId)
                        .then(success => res.json(success))
                        .catch(next);
                })
                .catch(next);
        })
        .catch(next);
}
function createCommentReply(req, res, next) {
    getById(req.user.id)
        .then(user => {
            postService.createComment(user, req.body.text, req.params.id)
                .then(success => res.json(success))
                .catch(next);
        })
        .catch(next);
}
function getChildrenOfComment(req, res, next) {
    postService.getChildrenOfComment(req.params.id)
        .then(comments => res.json(comments))
        .catch(next);
}

function getAllPosts(req, res, next) {
    postService.getAllPosts()
        .then(posts => res.json(posts))
        .catch(next);
}

function getPostById(req, res, next) {
    postService.getPostById(req.params.id)
        .then(post => res.json(post))
        .catch(next);
}

function deletePost(req, res, next) {
    postService.getPostById(req.params.id)
        .then(post => {
            if (post.author === req.user.username || req.user.role === Role.Admin) {
                postService.deletePost(req.params.id)
                    .then(({ success }) => res.json(success))
                    .catch(next);
            }
            else {
                return res.status(401).json({message: 'Unauthorized'});
            }
        })
        .catch(next);
}