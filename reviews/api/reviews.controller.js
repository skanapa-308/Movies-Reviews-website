import ReviewsDAO from "../dao/reviewsDAO.js";

export default class ReviewsController {
  static async apiPostReview(req, res, next) {
    try {
      const movieId = req.body.movie_id; // keep as string
      const review = req.body.review;
      const user = req.body.user; // FIXED FIELD NAME
      const date = new Date();

      const ReviewResponse = await ReviewsDAO.addReview(
        movieId,
        user,
        review,
        date,
      );

      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiGetReviews(req, res, next) {
    try {
      const movieId = req.params.id;
      const reviewsList = await ReviewsDAO.getReviewsByMovieId(movieId);
      res.json(reviewsList);
    } catch (e) {
      console.error(`apiGetReviews error: ${e}`);
      res.status(500).json({ error: e.message });
    }
  }

  static async apiUpdateReview(req, res, next) {
    try {
      const reviewId = req.params.id;
      const review = req.body.review;
      const date = new Date();

      const reviewResponse = await ReviewsDAO.updateReview(
        reviewId,
        req.body.user,
        review,
        date,
      );

      if (reviewResponse.modifiedCount === 0) {
        throw new Error("unable to update review");
      }

      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiDeleteReview(req, res, next) {
    try {
      const reviewId = req.params.id;
      const reviewResponse = await ReviewsDAO.deleteReview(reviewId);
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
