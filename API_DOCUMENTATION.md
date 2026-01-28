# API Documentation - Refactored Architecture

## Base URL

```
http://localhost:5000/api
```

---

## 🏢 HOSTELS ENDPOINTS

### Create Hostel (Owner Only)

```
POST /hostels
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "City View Hostel",
  "location": "Islamabad",
  "description": "Affordable hostel near university",
  "amenities": ["WiFi", "Mess", "AC"],
  "rules": "No smoking, quiet hours 10pm",
  "environmentScore": 75
}

Response 201:
{
  "_id": "h1",
  "ownerId": "u123",
  "name": "City View Hostel",
  ...
}
```

### Get All Hostels

```
GET /hostels

Response 200:
[
  {
    "_id": "h1",
    "name": "City View Hostel",
    "location": "Islamabad",
    ...
  }
]
```

### Get Specific Hostel

```
GET /hostels/:id

Response 200:
{
  "_id": "h1",
  "name": "City View Hostel",
  ...
}
```

### Get My Hostels (Owner Only)

```
GET /hostels/my
Authorization: Bearer {token}

Response 200:
[
  { hostel data... }
]
```

### Update Hostel (Owner Only)

```
PUT /hostels/:id
Authorization: Bearer {token}

{
  "name": "Updated Name",
  "amenities": ["WiFi", "Kitchen"]
}
```

### Delete Hostel (Owner Only)

```
DELETE /hostels/:id
Authorization: Bearer {token}

Response 200:
{ "msg": "Hostel deleted successfully" }
```

---

## 🛏️ ROOMS ENDPOINTS

### Add Room to Hostel (Owner Only)

```
POST /rooms/hostel/:hostelId
Authorization: Bearer {token}
Content-Type: application/json

{
  "roomType": "Shared",
  "totalBeds": 4,
  "pricePerBed": 5000,
  "gender": "Co-ed",
  "description": "Cozy shared room",
  "images": ["room1.jpg"]
}

Response 201:
{
  "_id": "r1",
  "hostelId": "h1",
  "roomType": "Shared",
  "totalBeds": 4,
  "availableBeds": 4,
  "pricePerBed": 5000,
  ...
}
```

### Get Rooms by Hostel

```
GET /rooms/hostel/:hostelId

Response 200:
[
  {
    "_id": "r1",
    "roomType": "Shared",
    "totalBeds": 4,
    "availableBeds": 3,
    "pricePerBed": 5000,
    ...
  }
]
```

### Get Specific Room

```
GET /rooms/:roomId

Response 200:
{
  "_id": "r1",
  "hostelId": "h1",
  "roomType": "Shared",
  ...
}
```

### Update Room (Owner Only)

```
PUT /rooms/:roomId
Authorization: Bearer {token}

{
  "pricePerBed": 6000,
  "gender": "Female"
}
```

### Delete Room (Owner Only)

```
DELETE /rooms/:roomId
Authorization: Bearer {token}

Response 200:
{ "msg": "Room deleted successfully" }
```

---

## 📅 BOOKINGS ENDPOINTS

### Create Booking (Student Only)

```
POST /bookings
Authorization: Bearer {token}
Content-Type: application/json

{
  "hostelId": "h1",
  "roomId": "r1",
  "startDate": "2026-02-01",
  "endDate": "2026-03-01",
  "bedsBooked": 1
}

Response 201:
{
  "_id": "b1",
  "userId": "u55",
  "hostelId": "h1",
  "roomId": "r1",
  "startDate": "2026-02-01",
  "endDate": "2026-03-01",
  "bedsBooked": 1,
  "totalPrice": 150000,
  "status": "confirmed"
}
```

### Get My Bookings (Student Only)

```
GET /bookings/my
Authorization: Bearer {token}

Response 200:
[
  {
    "_id": "b1",
    "hostelId": { "name": "City View Hostel", "location": "Islamabad" },
    "roomId": { "roomType": "Shared", "pricePerBed": 5000 },
    "startDate": "2026-02-01",
    "endDate": "2026-03-01",
    ...
  }
]
```

### Get Booking by ID

```
GET /bookings/:id
Authorization: Bearer {token}

Response 200:
{
  "_id": "b1",
  "userId": { "name": "Ali", "email": "ali@email.com" },
  "hostelId": { full hostel data },
  "roomId": { full room data },
  ...
}
```

### Cancel Booking (Student Only)

```
PUT /bookings/:id/cancel
Authorization: Bearer {token}

Response 200:
{
  "_id": "b1",
  "status": "cancelled",
  ...
}

Note: Cancellation restores availableBeds to the room
```

---

## 🔐 Error Responses

```
400 Bad Request:
{ "msg": "Not enough available beds" }

401 Unauthorized:
{ "msg": "No token provided" }

403 Forbidden:
{ "msg": "Unauthorized" }

404 Not Found:
{ "msg": "Hostel not found" }

500 Server Error:
{ "msg": "error message" }
```

---

## 📊 Data Model Relationships

```
User (owner) ──1──→ Hostel ──1──→ Room ──∞──→ Booking ←──1── User (student)
  (ownerId)        (hostelId)   (roomId)      (userId)
```

---

## 🔄 Booking Flow Example

1. **Owner creates hostel:**

   ```
   POST /hostels → Creates h1
   ```

2. **Owner adds rooms:**

   ```
   POST /rooms/hostel/h1 → Creates r1 (4 beds, available=4)
   ```

3. **Student views hostel:**

   ```
   GET /hostels/h1
   GET /rooms/hostel/h1 → See 4 available beds
   ```

4. **Student books 1 bed:**

   ```
   POST /bookings {hostelId: h1, roomId: r1, bedsBooked: 1}
   → Creates b1, r1.availableBeds becomes 3
   ```

5. **Student views their bookings:**

   ```
   GET /bookings/my → See b1 with all details
   ```

6. **Student cancels booking:**
   ```
   PUT /bookings/b1/cancel
   → b1.status = "cancelled", r1.availableBeds becomes 4 again
   ```

---

## 🧪 Testing with cURL/Postman

### Add Hostel

```bash
curl -X POST http://localhost:5000/api/hostels \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Hostel",
    "location": "Lahore",
    "amenities": ["WiFi"],
    "environmentScore": 80
  }'
```

### Get All Hostels

```bash
curl http://localhost:5000/api/hostels
```

### Add Room

```bash
curl -X POST http://localhost:5000/api/rooms/hostel/HOSTEL_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "roomType": "Shared",
    "totalBeds": 4,
    "pricePerBed": 5000,
    "gender": "Co-ed"
  }'
```

---

✅ This API now follows RESTful conventions and is production-ready!
