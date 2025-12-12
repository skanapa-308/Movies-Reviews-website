import express from "express";
import ReviewsController from "./reviews.controller.js";
const router = express.Router();
router.post("/new", ReviewsController.apiPostReview);
router.get("/:id", ReviewsController.apiGetReviews);
router.put("/:id", ReviewsController.apiUpdateReview);
router.delete("/:id", ReviewsController.apiDeleteReview);
export default router;
