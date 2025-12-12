(function()
 {
  const url = new URL(location.href);
  const movieID = url.searchParams.get("id");
  const movieTitle = url.searchParams.get("title");
  console.log("movie.js loaded");
  console.log("movieID:", movieID);
  console.log("movieTitle:", movieTitle);
  const REVIEWS_API = "https://b01a5b6f-10f4-4de3-8891-4bed730df93f-00-14yqs6k92c233.sisko.replit.dev:3000/api/v1/reviews";
  const titleEl = document.getElementById("title");
  if (!titleEl) 
  {
    console.error("Missing element with id='title' in HTML");
  } 
  else 
  {
    titleEl.innerText = movieTitle || "Movie Title";
  }
  const main = document.getElementById("section");
  if (!main) console.error("Missing element with id='section' in HTML");
  const div_new = document.createElement('div');
  div_new.innerHTML = `
    <div class="row">
      <div class="column">
        <div class="card" id="addreview">
          <h3>Add New Review</h3>
          <p><strong>Review:</strong> <input type="text" id="new_review" /></p>
          <p><strong>User:</strong> <input type="text" id="new_user" /></p>
          <p><a href="#" id="save_link">Save</a></p>
        </div>
      </div>
    </div>
  `;
  function saveReview(id = "") 
  {
    const reviewip = document.getElementById("new_review")?.value || "";
    const userip = document.getElementById("new_user")?.value || "";
    if (!reviewip || !userip) 
    {
      alert("Please fill both fields.");
      return;
    }
    if (id) 
    {
      fetch(`${REVIEWS_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review: reviewip, user: userip })
      }).then(r => r.json()).then(() => location.reload());
      return;
    }
    fetch(`${REVIEWS_API}/new`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ review: reviewip, user: userip, movie_id: movieID })
    }).then(r => r.json()).then(() => location.reload());
  }
  div_new.addEventListener("click", (e) => {
    if (e.target && e.target.id === "save_link") {
      e.preventDefault();
      saveReview();
    }
  });
  function loadReviews(movieId) 
  {
    console.log("Fetching reviews from:", `${REVIEWS_API}/${movieId}`);
    fetch(`${REVIEWS_API}/${movieId}`)
      .then(res => {
        console.log("fetch status:", res.status);
        return res.json();
      })
      .then(reviews => {
        console.log("reviews payload:", reviews);
        if (!reviews || reviews.length === 0) 
        {
          main.innerHTML = "<p>No reviews yet.</p>";
        } 
        else 
        {
          main.innerHTML = `<div class="review-container">${reviews.map(r => `
            <div class="review-item" data-id="${r._id}">
              <h4>${r.user}</h4>
              <p class="review-text">${r.review}</p>
              <button class="edit-btn">Edit</button>
              <button class="delete-btn">Delete</button>
            </div>
          `).join("")}
          </div>`;
        }
        main.appendChild(div_new);
      })
      .catch(err => {
        console.error("loadReviews error:", err);
        main.innerHTML = "<p>Error loading reviews.</p>";
        main.appendChild(div_new);
      });
  }
  main.addEventListener("click", async (e) => {
    const reviewDiv = e.target.closest && e.target.closest(".review-item");
    if (!reviewDiv) return;
    const reviewId = reviewDiv.dataset.id;
    if (e.target.classList.contains("delete-btn")) 
    {
      console.log("Deleting:", reviewId);
      const res = await fetch(`${REVIEWS_API}/${reviewId}`, { method: "DELETE" });
      const json = await res.json();
      console.log("delete response:", json);
      if (json.status === "success") reviewDiv.remove();
      else alert("Delete failed");
      return;
    }
    if (e.target.classList.contains("edit-btn")) 
    {
      const textP = reviewDiv.querySelector(".review-text");
      const newText = prompt("Edit your review:", textP.innerText);
      if (!newText) return;
      await fetch(`${REVIEWS_API}/${reviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review: newText })
      });
      textP.innerText = newText;
    }
  });
  loadReviews(movieID);
})();