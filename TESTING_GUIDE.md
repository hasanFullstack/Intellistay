# Testing Guide - New Architecture

## ✅ Quick Test Checklist

### Backend Setup

- [ ] All 4 models exist: User, Hostel, Room, Booking
- [ ] Room routes registered in server.js
- [ ] Database migrations done (if applicable)
- [ ] Test with Postman or Thunder Client

### Frontend Setup

- [ ] room.api.js exists
- [ ] AddRoom.jsx component exists
- [ ] OwnerDashboard uses getRoomsByHostel()
- [ ] Home.jsx fetches rooms separately

---

## 🧪 Manual Testing Steps

### 1. Test Hostel Creation (Owner)

**Login as owner**, go to Owner Dashboard

1. Click "Add New Hostel"
2. Fill form:
   - Name: "Test Hostel"
   - Location: "Islamabad"
   - Amenities: "WiFi, Kitchen, AC"
   - Rules: "No smoking"
3. Click "Add Hostel"
4. ✅ Expect: Modal closes, hostel appears in list

### 2. Test Room Addition (Owner)

In OwnerDashboard, on the newly created hostel:

1. Expand hostel (click accordion)
2. Click "Add Room"
3. Fill form:
   - Room Type: "Shared"
   - Total Beds: 4
   - Price per Bed: 5000
   - Gender: "Co-ed"
4. Click "Add Room"
5. ✅ Expect: Room table shows 1 room with 4 available beds

### 3. Test Multiple Rooms

Add another room:

1. Click "Add Room" again
2. Fill different data (Single, 1 bed, 8000, Male)
3. Submit
4. ✅ Expect: 2 rooms in table with different stats

### 4. Test Owner Dashboard Stats

In dashboard top area:

- ✅ Total Hostels: 1
- ✅ Total Rooms: 2
- ✅ Total Beds: 5 (4+1)
- ✅ Available Beds: 5

### 5. Test Home Page

Go to Home (public page):

1. ✅ Should see hostel card
2. ✅ Card shows "2 rooms" badge
3. ✅ Card shows "2 available" badge
4. ✅ Card shows "From Rs 5000 per bed"
5. ✅ Card shows amenities
6. ✅ No errors in console

### 6. Test Booking Creation (Student)

**Login as student**:

1. Go to Home page
2. Click "View Details" on hostel
3. ✅ Should show room options
4. Click on a room
5. Fill booking form:
   - Check-in: 2026-02-01
   - Check-out: 2026-03-01
   - Beds: 1
6. Submit
7. ✅ Expect: Booking created successfully

### 7. Test Room Availability Update

Go back to Owner Dashboard:

1. Expand hostel
2. Check Shared room
3. ✅ Should show "3 available" (was 4, now 3)
4. Other room should still show "1 available"

### 8. Test Booking View (Student)

**As student**, go to MyBookings:

1. ✅ See booking for hostel
2. ✅ Shows hostel name, location
3. ✅ Shows room type (Shared)
4. ✅ Shows dates, beds, total price
5. ✅ Shows status (confirmed)

### 9. Test Booking Cancellation

In MyBookings:

1. Click "Cancel Booking"
2. Confirm
3. ✅ Status changes to "cancelled"
4. Go to Owner Dashboard
5. ✅ Available beds restored to 4 for Shared room

### 10. Test Room Deletion

In Owner Dashboard:

1. Expand hostel
2. In room table, find room
3. Click delete button
4. Confirm
5. ✅ Room removed from table

---

## 🐛 Common Issues & Fixes

### Issue 1: Room API returns 404

**Cause:** Routes not registered in server.js
**Fix:** Check server.js has:

```javascript
import roomRoutes from "./routes/room.routes.js";
app.use("/api/rooms", roomRoutes);
```

### Issue 2: req.user is undefined in controllers

**Cause:** Auth middleware not applied
**Fix:** Add middleware to protected routes:

```javascript
router.post("/", authMiddleware, addRoom);
```

### Issue 3: Rooms don't load in OwnerDashboard

**Cause:** getRoomsByHostel() call fails or slow
**Fix:** Check browser console, verify room endpoints work in Postman

### Issue 4: Frontend can't find room.api.js

**Cause:** File not created properly
**Fix:** Create at: `frontend/src/api/room.api.js`

### Issue 5: Booking fails with "Not enough beds"

**Cause:** availableBeds is incorrect
**Fix:** Verify room's totalBeds >= bedsBooked

---

## 📋 API Tests with Postman/Thunder Client

### 1. Get All Hostels (Public)

```
GET http://localhost:5000/api/hostels
✅ Should return array of hostels
```

### 2. Get Rooms by Hostel (Public)

```
GET http://localhost:5000/api/rooms/hostel/{hostel_id}
✅ Should return array of rooms for that hostel
```

### 3. Create Booking (Protected)

```
POST http://localhost:5000/api/bookings
Headers: Authorization: Bearer {token}

{
  "hostelId": "{hostel_id}",
  "roomId": "{room_id}",
  "startDate": "2026-02-01",
  "endDate": "2026-03-01",
  "bedsBooked": 1
}

✅ Should create booking with totalPrice calculated
```

### 4. Get My Bookings (Protected)

```
GET http://localhost:5000/api/bookings/my
Headers: Authorization: Bearer {token}

✅ Should return user's bookings with room/hostel populated
```

### 5. Cancel Booking (Protected)

```
PUT http://localhost:5000/api/bookings/{booking_id}/cancel
Headers: Authorization: Bearer {token}

✅ Should change status to "cancelled"
✅ Room availability should increase
```

---

## 🔍 Database Inspection

### MongoDB Compass / mongosh

Check collections exist:

```
use your_db_name

db.hostels.findOne()
db.rooms.findOne()
db.bookings.findOne()
```

Verify relationships:

```
// Find hostel with ID
db.hostels.findOne({_id: ObjectId("xxx")})

// Find rooms for that hostel
db.rooms.find({hostelId: ObjectId("xxx")})

// Find bookings for that room
db.bookings.find({roomId: ObjectId("xxx")})
```

---

## ✨ Success Indicators

All working if:

- ✅ Owner can create hostel → add rooms → manage them
- ✅ Student can see hostels with room info → book → view booking
- ✅ Availability updates in real-time after booking
- ✅ Cancel booking restores availability
- ✅ All stats show correct numbers
- ✅ No console errors
- ✅ Database shows 3 separate collections

---

## 🎯 Performance Check

After 10 hostels with 50 total rooms:

- ✅ Home page loads in < 2 seconds
- ✅ Owner dashboard expands hostel in < 1 second
- ✅ Booking creation in < 1 second

If slow: Check for N+1 queries, use `.populate()` efficiently

---

## 📞 Debugging Tips

1. **Check browser console** - Frontend errors
2. **Check server terminal** - Backend errors
3. **Check Network tab** - Request/response details
4. **Check Postman** - Test API directly
5. **Check database** - Verify data saved correctly

---

You're all set! Happy testing! 🚀
