# Authentication API Testing Guide

This guide provides instructions and payloads for testing the real authentication system in EasyStock.

> [!NOTE]
> The server must be running on `http://localhost:5000`. You can start it using `npm run server`.

## 1. Register a New User

### Supplier Registration

**Endpoint:** `POST /api/auth/register`
**Payload (matches Supplier form):**

```json
{
  "businessEmail": "supplier_test@easystock.com",
  "password": "Password123!",
  "companyName": "Test Supplier Ltd",
  "phone": "0112223333",
  "address": "123 Supplier Road, Sandton",
  "primaryGoods": "Hardware",
  "role": "SUPPLIER"
}
```

### Small Business (Vendor) Registration

**Endpoint:** `POST /api/auth/register`
**Payload (matches Vendor form):**

```json
{
  "email": "vendor_test@easystock.com",
  "password": "Password123!",
  "companyName": "Joe's Hardware",
  "contactPersonName": "Joe Soap",
  "phone": "0114445555",
  "address": "45 Main Street, Johannesburg",
  "businessType": "Retailer",
  "role": "VENDOR"
}
```

---

## 2. Login

**Endpoint:** `POST /api/auth/login`
**Payload:**

```json
{
  "email": "supplier_test@easystock.com",
  "password": "Password123!"
}
```

**Expected Response:**

```json
{
  "user": {
    "id": "uuid-string",
    "email": "supplier_test@easystock.com",
    "name": "Test Supplier Ltd",
    "role": "SUPPLIER",
    ...
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 3. Test Scoped Inventory (Supplier View)

This API ensures that each supplier only sees their own stock. Perfect for testing data isolation.

### Postman Walkthrough:

1.  **Login as Supplier A**:
    - `POST http://localhost:5000/api/auth/login`
    - Body: `{"email": "supplier_test@easystock.com", "password": "Password123!"}`
    - **Result**: Copy the `token`. "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAxZDk2ZjNlLWQ5ZDMtNDI4Zi05ZGM4LWY2Yzk5YzE4MTlhMiIsImVtYWlsIjoic3VwcGxpZXJfdGVzdEBlYXN5c3RvY2suY29tIiwicm9sZSI6IlNVUFBMSUVSIiwiaWF0IjoxNzY4NzMwNDY5LCJleHAiOjE3Njg4MTY4Njl9.xCJbT2Hxz_dxjywM2CromEBmqKl3fge56kwosVCP2vM"

2.  **Fetch Inventory for Supplier A**:
    - `GET http://localhost:5000/api/inventory`
    - **Headers**: Add `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAxZDk2ZjNlLWQ5ZDMtNDI4Zi05ZGM4LWY2Yzk5YzE4MTlhMiIsImVtYWlsIjoic3VwcGxpZXJfdGVzdEBlYXN5c3RvY2suY29tIiwicm9sZSI6IlNVUFBMSUVSIiwiaWF0IjoxNzY4NzMwNDY5LCJleHAiOjE3Njg4MTY4Njl9.xCJbT2Hxz_dxjywM2CromEBmqKl3fge56kwosVCP2vM`
    - **Expected**: You see only Supplier A's products.

3.  **Login as Supplier B** (e.g., a newly registered supplier):
    - **Result**: Copy the `token`.

4.  **Fetch Inventory for Supplier B**:
    - `GET http://localhost:5000/api/inventory`
    - **Headers**: Add `Authorization: Bearer <TOKEN_B>`
    - **Expected**: You see only Supplier B's products (or an empty list if nothing has been seeded for them).

---

## 4. Troubleshooting: Empty Inventory?

If you register a new supplier and see `[]`, it's because the system correctly isolates data. I'm currently fixing the `seed.ts` script so it automatically populates data for your registered accounts.

---

## Testing Tools

You can use tools like:

- **Postman** or **Insomnia**
- **Thunder Client** (VS Code extension)
- **cURL** (Command line)

### Example cURL Login:

```bash
curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"supplier_test@easystock.com", "password":"Password123!"}'
```
