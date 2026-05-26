import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({ rating: "", comment: "" });

  useEffect(() => {
    axios
      .get("http://localhost:5000/reviews")
      .then((res) => setReviews(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/reviews", {
        user_id: localStorage.getItem("userId"),
        user_name: localStorage.getItem("userName"),
        role: localStorage.getItem("role"),
        rating: formData.rating,
        comment: formData.comment,
      });
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-200"}>★</span>
    ));
  };

  const getRoleBadgeStyle = (role) => {
    if (role === "student") return "bg-teal-100 text-teal-700";
    if (role === "client") return "bg-orange-100 text-orange-600";
    return "bg-gray-100 text-gray-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100">

      {/* Header */}
      <div className="bg-teal-600 py-10 px-6 text-center shadow-sm">
        <p className="text-teal-200 text-xs font-semibold uppercase tracking-widest mb-1">Community</p>
        <h1 className="text-3xl font-bold text-white">Website Reviews</h1>
        <p className="text-teal-100 text-sm mt-1">See what others are saying about us</p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Review Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-10"
        >
          <h2 className="text-lg font-bold text-gray-800 mb-5">Leave a Review</h2>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Rating (1–5)</label>
              <input
                type="number"
                min="1"
                max="5"
                placeholder="e.g. 4"
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-teal-400 bg-gray-50 transition"
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Your Comment</label>
              <textarea
                placeholder="Share your experience…"
                rows="4"
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-teal-400 bg-gray-50 transition resize-none"
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold py-3 rounded-xl text-sm transition shadow-sm"
            >
              Submit Review →
            </button>
          </div>
        </form>

        {/* Reviews count */}
        {reviews.length > 0 && (
          <p className="text-sm text-gray-400 mb-6">
            <span className="font-semibold text-gray-600">{reviews.length}</span> review{reviews.length !== 1 ? "s" : ""}
          </p>
        )}

        {/* Empty state */}
        {reviews.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">💬</p>
            <p className="text-lg font-medium text-gray-500">No reviews yet</p>
            <p className="text-sm mt-1">Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-5"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-gray-800 text-base">{review.user_name}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${getRoleBadgeStyle(review.role)}`}>
                      {review.role}
                    </span>
                  </div>
                  <div className="text-lg leading-none">{renderStars(review.rating)}</div>
                </div>

                <div className="border-t border-gray-100 mt-3 pt-3">
                  <p className="text-sm text-gray-500">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/" className="text-sm text-teal-600 font-semibold hover:underline">
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Reviews;
