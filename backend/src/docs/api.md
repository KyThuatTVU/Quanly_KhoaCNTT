# API Documentation

## Base URL
`http://localhost:5000/api/v1/admin`

## Endpoints

### GET /:entity
Returns all records for the given entity.

**Example:** `GET /api/v1/admin/staff`

### POST /:entity
Creates a new record.

**Example:** `POST /api/v1/admin/news`

### PUT /:entity/:id
Updates a record by ID.

**Example:** `PUT /api/v1/admin/staff/1`

### DELETE /:entity/:id
Deletes a record by ID.

**Example:** `DELETE /api/v1/admin/news/5`

### POST /upload
Uploads an image file. Returns relative URL path.

**Form field:** `image` (file)

**Response:** `{ success: true, imageUrl: "assets/images/uploads/upload-xxx.jpg" }`

## Valid Entity Keys
See `src/constants/index.js` → `TABLE_MAP` for full list.
