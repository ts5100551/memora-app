# Memora — Public API Reference

> REST API for programmatic access to Memora. Designed for future bot integrations.

## Authentication

All API endpoints require a valid Supabase JWT token in the `Authorization` header:

```
Authorization: Bearer <supabase-jwt-token>
```

## Base URL

- **Local**: `http://localhost:3000/api`
- **Production**: `https://<your-vercel-domain>/api`

---

## Links

### List Links

```
GET /api/links
```

**Query Parameters:**

| Param    | Type    | Description                          |
| -------- | ------- | ------------------------------------ |
| `search` | string  | Search by title (optional)           |
| `tag`    | string  | Filter by tag ID (optional)          |
| `unread` | boolean | Filter unread only (optional)        |
| `limit`  | number  | Number of results (default: 20)      |
| `offset` | number  | Pagination offset (default: 0)       |

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "uuid",
      "url": "https://example.com/article",
      "title": "Article Title",
      "description": "Article description...",
      "thumbnail_url": "https://...",
      "source": "web",
      "is_read": false,
      "created_at": "2026-03-01T00:00:00Z",
      "tags": [{ "id": "uuid", "name": "Tech", "color": "#6366F1" }]
    }
  ],
  "count": 42
}
```

### Create Link

```
POST /api/links
```

**Body:**
```json
{
  "url": "https://example.com/article",
  "source": "web",
  "tag_ids": ["uuid", "uuid"]
}
```

The server automatically fetches metadata (title, description, thumbnail) from the URL.

**Response:** `201 Created`

### Get Link Detail

```
GET /api/links/:id
```

**Response:** `200 OK`

### Update Link

```
PATCH /api/links/:id
```

**Body (partial update):**
```json
{
  "is_read": true,
  "tag_ids": ["uuid"]
}
```

**Response:** `200 OK`

### Delete Link

```
DELETE /api/links/:id
```

**Response:** `204 No Content`

---

## Tags

### List Tags

```
GET /api/tags
```

**Response:** `200 OK`
```json
{
  "data": [
    { "id": "uuid", "name": "Tech", "color": "#6366F1", "link_count": 12 }
  ]
}
```

### Create Tag

```
POST /api/tags
```

**Body:**
```json
{
  "name": "Tech",
  "color": "#6366F1"
}
```

**Response:** `201 Created`

### Update Tag

```
PATCH /api/tags/:id
```

**Body:**
```json
{
  "name": "Technology",
  "color": "#8B5CF6"
}
```

**Response:** `200 OK`

### Delete Tag

```
DELETE /api/tags/:id
```

**Response:** `204 No Content`

---

## Metadata

### Fetch URL Metadata

```
POST /api/metadata
```

> ⚠️ **Requires authentication.** A valid Supabase JWT token must be provided in the
> `Authorization` header. Unauthenticated requests return `401 Unauthorized`.

**Body:**
```json
{
  "url": "https://example.com/article"
}
```

**Response:** `200 OK`
```json
{
  "title": "Article Title",
  "description": "A brief description of the article...",
  "thumbnail_url": "https://example.com/og-image.jpg",
  "site_name": "Example"
}
```

**Metadata Fetch Strategy (3-tier fallback):**

| Priority | Method | Condition |
|----------|--------|-----------|
| 1st | Extract `og:title`, `og:description`, `og:image` meta tags | Site provides Open Graph tags |
| 2nd | Fallback to HTML `<title>` tag; other fields set to `null` | No OG tags present |
| 3rd | Return all fields as `null` | Fetch blocked or page unreachable |

This endpoint **never returns a 5xx error** due to metadata fetch failure. If metadata
cannot be retrieved, all fields are returned as `null` so the user can fill them in manually.

---

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing authentication token"
  }
}
```

| Status | Code | Description |
| ------ | ---- | ----------- |
| 400 | `BAD_REQUEST` | Missing or invalid request body |
| 401 | `UNAUTHORIZED` | Missing or invalid auth token |
| 404 | `NOT_FOUND` | Resource not found |
| 409 | `CONFLICT` | Duplicate link URL |
| 500 | `INTERNAL_ERROR` | Server error |
