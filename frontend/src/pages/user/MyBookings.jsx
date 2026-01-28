import { useEffect, useState } from "react";
import { getUserBookings } from "../../api/booking.api";
import { useAuth } from "../../auth/AuthContext";

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getUserBookings(user.id).then((res) => setBookings(res.data));
  }, []);

  return (
    <ul>
      {bookings.map((b) => (
        <li key={b._id}>{b.hostelName}</li>
      ))}
    </ul>
  );
};

export default MyBookings;
