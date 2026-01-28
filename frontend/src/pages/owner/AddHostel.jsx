import { useState } from "react";
import { addHostel } from "../../api/hostel.api";

const AddHostel = ({ onSuccess }) => {
  const [data, setData] = useState({
    name: "",
    location: "",
    description: "",
    amenities: "",
    rules: "",
    environmentScore: 50,
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewImages, setPreviewImages] = useState([]);

  const submit = async (e) => {
    e.preventDefault();
    if (!data.name || !data.location) {
      setError("Name and location are required");
      return;
    }

    if (data.images.length === 0) {
      setError("Please upload at least one image");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const submitData = {
        ...data,
        amenities: data.amenities
          ? data.amenities.split(",").map((f) => f.trim())
          : [],
      };
      await addHostel(submitData);
      setData({
        name: "",
        location: "",
        description: "",
        amenities: "",
        rules: "",
        environmentScore: 50,
        images: [],
      });
      setPreviewImages([]);
      alert("Hostel added successfully! Now add rooms to this hostel.");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Failed to add hostel. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData((prev) => ({
          ...prev,
          images: [...prev.images, reader.result],
        }));
        setPreviewImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={submit}>
      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
          ></button>
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="name" className="form-label fw-semibold">
          Hostel Name
        </label>
        <input
          id="name"
          type="text"
          className="form-control form-control-lg"
          placeholder="e.g., City Center Hostel"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="location" className="form-label fw-semibold">
          Location
        </label>
        <input
          id="location"
          type="text"
          className="form-control form-control-lg"
          placeholder="e.g., Downtown, Main Street"
          value={data.location}
          onChange={(e) => setData({ ...data, location: e.target.value })}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="description" className="form-label fw-semibold">
          Description
        </label>
        <textarea
          id="description"
          className="form-control form-control-lg"
          placeholder="Describe your hostel..."
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          rows="3"
        ></textarea>
      </div>

      <div className="mb-3">
        <label htmlFor="amenities" className="form-label fw-semibold">
          Amenities (comma-separated)
        </label>
        <input
          id="amenities"
          type="text"
          className="form-control form-control-lg"
          placeholder="e.g., WiFi, Parking, Kitchen, AC"
          value={data.amenities}
          onChange={(e) => setData({ ...data, amenities: e.target.value })}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="rules" className="form-label fw-semibold">
          House Rules
        </label>
        <textarea
          id="rules"
          className="form-control form-control-lg"
          placeholder="e.g., No smoking, quiet hours after 10pm..."
          value={data.rules}
          onChange={(e) => setData({ ...data, rules: e.target.value })}
          rows="3"
        ></textarea>
      </div>

      <div className="mb-3">
        <label htmlFor="environmentScore" className="form-label fw-semibold">
          Environment Score: {data.environmentScore}
        </label>
        <input
          id="environmentScore"
          type="range"
          className="form-range"
          min="0"
          max="100"
          value={data.environmentScore}
          onChange={(e) =>
            setData({ ...data, environmentScore: Number(e.target.value) })
          }
        />
      </div>

      <div className="mb-3">
        <label htmlFor="images" className="form-label fw-semibold">
          Upload Images (Featured + Gallery)
        </label>
        <input
          id="images"
          type="file"
          className="form-control form-control-lg"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
        />
        <small className="text-muted d-block mt-2">
          First image will be used as featured image. Upload multiple images for
          gallery.
        </small>
      </div>

      {previewImages.length > 0 && (
        <div className="mb-3">
          <label className="form-label fw-semibold">Uploaded Images</label>
          <div className="row g-2">
            {previewImages.map((img, idx) => (
              <div key={idx} className="col-6 col-md-3">
                <div className="position-relative">
                  <img
                    src={img}
                    alt={`Preview ${idx + 1}`}
                    className="img-fluid rounded"
                    style={{
                      height: "100px",
                      objectFit: "cover",
                      width: "100%",
                    }}
                  />
                  {idx === 0 && (
                    <span className="badge bg-warning text-dark position-absolute top-0 start-0 m-1">
                      Featured
                    </span>
                  )}
                  <button
                    type="button"
                    className="btn btn-sm btn-danger position-absolute bottom-0 end-0 m-1"
                    onClick={() => removeImage(idx)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="d-grid gap-2 mt-4">
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={loading}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              Adding...
            </>
          ) : (
            "Add Hostel"
          )}
        </button>
      </div>
    </form>
  );
};

export default AddHostel;
