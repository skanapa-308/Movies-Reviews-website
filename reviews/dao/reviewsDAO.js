import { ObjectId } from "mongodb";
let reviews;
export default class ReviewsDAO {
  static async injectDB(conn) {
    if (reviews) return;
    try {
      reviews = conn.db("reviewsDB").collection("reviews");
      console.log("Reviews collection initialized.");
    } catch (e) {
      console.error(`Unable to connect in ReviewsDAO: ${e}`);
    }
  }
  static async addReview(movieId, user, review, date) {
    try {
      const reviewDoc = {
        movie_id: movieId,
        user: user,
        review: review,
        date: date,
      };

      return await reviews.insertOne(reviewDoc);
    } catch (e) {
      console.error(`Unable to add review: ${e}`);
      return { error: e };
    }
  }
  static async getReviews(id) {
    try {
      if (!id) {
        return await reviews.find({}).toArray();
      }
      return await reviews.find({ movie_id: id }).toArray();
    } catch (e) {
      console.error(`Unable to get reviews: ${e}`);
      return [];
    }
  }
  static async updateReview(reviewId, userName, review, date) {
    try {
      return await reviews.updateOne(
        { _id: new ObjectId(reviewId) },
        { $set: { review: review, date: date } },
      );
    } catch (e) {
      console.error(`Unable to update review: ${e}`);
      return { error: e };
    }
  }
  static async deleteReview(reviewId) {
    try {
      return await reviews.deleteOne({ _id: new ObjectId(reviewId) });
    } catch (e) {
      console.error(`Unable to delete review: ${e}`);
      return { error: e };
    }
  }
  static async getReviewsByMovieId(movieId) {
    try {
      return await reviews.find({ movie_id: movieId }).toArray();
    } catch (e) {
      console.error(`Unable to get reviews: ${e}`);
      return [];
    }
  }
}
