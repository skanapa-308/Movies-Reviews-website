const REVIEWS_API =
  "https://b01a5b6f-10f4-4de3-8891-4bed730df93f-00-14yqs6k92c233.sisko.replit.dev:3000/api/v1/reviews";
function loadReviews(movieId, card) 
{
  fetch(`${REVIEWS_API}/${movieId}`)
    .then(res => res.json())
    .then(reviews => {
      const reviewBox = document.createElement("div");
      reviewBox.classList.add("review-box");
      if (!reviews.length) 
      {
        reviewBox.innerHTML = "<p>No reviews yet.</p>";
      } 
      else 
      {
        reviewBox.innerHTML = reviews
          .map(r => `<p><strong>User: </strong>${r.user}</p><p><strong>Review: </strong>${r.review}</p><br>`)
          .join("");
      }
      card.appendChild(reviewBox);
    })
    .catch(err => console.error(err));
}