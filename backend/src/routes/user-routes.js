"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
var express_1 = require("express");
var user_controller_js_1 = require("../controller/user-controller.js");
var router = (0, express_1.Router)();
exports.userRouter = router;
var userController = new user_controller_js_1.UserController();
router.post('/analysis', userController.startUserAnalysis);
