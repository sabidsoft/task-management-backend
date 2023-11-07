const router = require("express").Router();
const isAuthUser = require("../middlewares/isAuthUser");
const {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask

} = require("../controllers/task.controller");

router.get("/", isAuthUser, getTasks);
router.get("/:taskId", isAuthUser, getTask);
router.post("/", isAuthUser, createTask);
router.patch("/:taskId", isAuthUser, updateTask);
router.delete("/:taskId", isAuthUser, deleteTask);

module.exports = router;