import { useState } from "react";
import { addRoom } from "../../api/room.api";

const AddRoom = ({ hostelId, onSuccess }) => {
  const [data, setData] = useState({
    roomType: "Shared",
    totalBeds: 4,
    pricePerBed: 5000,
    gender: "Co-ed",
    description: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!data.roomType || !data.totalBeds || !data.pricePerBed) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await addRoom(hostelId, data);
      setData({
        roomType: "Shared",
        totalBeds: 4,
        pricePerBed: 5000,
        gender: "Co-ed",
        description: "",
        images: [],
      });
      alert("Room added successfully!");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Failed to add room. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
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
        <label htmlFor="roomType" className="form-label fw-semibold">
          Room Type
        </label>
        <select
          id="roomType"
          className="form-select form-select-lg"
          value={data.roomType}
          onChange={(e) => setData({ ...data, roomType: e.target.value })}
        >
          <option>Single</option>
          <option>Shared</option>
          <option>Deluxe</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="totalBeds" className="form-label fw-semibold">
          Total Beds
        </label>
        <input
          id="totalBeds"
          type="number"
          className="form-control form-control-lg"
          min="1"
          value={data.totalBeds}
          onChange={(e) =>
            setData({ ...data, totalBeds: Number(e.target.value) })
          }
        />
      </div>

      <div className="mb-3">
        <label htmlFor="pricePerBed" className="form-label fw-semibold">
          Price Per Bed (Rs)
        </label>
        <input
          id="pricePerBed"
          type="number"
          className="form-control form-control-lg"
          min="0"
          value={data.pricePerBed}
          onChange={(e) =>
            setData({ ...data, pricePerBed: Number(e.target.value) })
          }
        />
      </div>

      <div className="mb-3">
        <label htmlFor="gender" className="form-label fw-semibold">
          Gender
        </label>
        <select
          id="gender"
          className="form-select form-select-lg"
          value={data.gender}
          onChange={(e) => setData({ ...data, gender: e.target.value })}
        >
          <option>Male</option>
          <option>Female</option>
          <option>Co-ed</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="description" className="form-label fw-semibold">
          Description
        </label>
        <textarea
          id="description"
          className="form-control form-control-lg"
          placeholder="Describe this room type..."
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          rows="2"
        ></textarea>
      </div>

      <div className="d-grid gap-2 mt-4">
        <button
          type="submit"
          className="btn btn-success btn-lg"
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
            "Add Room"
          )}
        </button>
      </div>
    </form>
  );
};

export default AddRoom;
