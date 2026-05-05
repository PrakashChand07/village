# Village Help - Admin & Deployment Guide (Pro)

This document explains how to set up the website on a VPS and manage data using Postman.

## 1. Setup on VPS

1.  **Backend**:
    *   Upload the `backend` folder.
    *   Run `npm install`.
    *   Create a `.env` file (copy from local).
    *   Start server: `pm2 start src/server.js --name "village-backend"`.
2.  **Frontend**:
    *   Update `API_URL` in `frontend/src/services/api.ts` to your VPS IP/Domain.
    *   Run `npm run build`.
    *   Serve the `dist` folder using Nginx.

---

## 2. Initial Setup: Create Admin Account

Since the database is new, you first need to create an Admin account.

### Register Admin (First Time Only)
*   **Method**: `POST`
*   **URL**: `http://YOUR_VPS_IP:5000/api/auth/register`
*   **Body (JSON)**:
    ```json
    {
      "name": "Admin Name",
      "email": "admin@villagehelp.in",
      "password": "YourStrongPassword123"
    }
    ```
*   **Action**: Once registered, you can use these credentials to Login.

---

## 3. Login & Authentication

### Admin Login
*   **Method**: `POST`
*   **URL**: `http://YOUR_VPS_IP:5000/api/auth/login`
*   **Body (JSON)**:
    ```json
    {
      "email": "admin@villagehelp.in",
      "password": "YourStrongPassword123"
    }
    ```
*   **Response**: Copy the `token` from the response.

### Using the Token in Postman
1.  Go to the **Authorization** tab.
2.  Select **Type**: `Bearer Token`.
3.  Paste the token. **Now you can use all Admin APIs.**

---

## 4. Managing Website Data

### A. Add Categories (Must do this first)
*   **POST**: `/api/categories`
*   **Body**: `{"name": "Railway", "type": "job"}`
*   *Types can be: `job`, `result`, `scholarship`, `scheme`*

### B. Add Government Job
*   **POST**: `/api/jobs`
*   **Body**:
    ```json
    {
      "title": "SSC CGL 2026",
      "organization": "SSC",
      "category": "Govt Exam",
      "posts": "12000",
      "lastDate": "30 June 2026",
      "location": "All India",
      "salary": "₹45,000+",
      "qualification": "Graduate",
      "applyLink": "https://ssc.nic.in",
      "isNewPost": true
    }
    ```

### C. Add Result
*   **POST**: `/api/results`
*   **Body**:
    ```json
    {
      "title": "Bihar Board 10th Result",
      "organization": "BSEB",
      "category": "Board",
      "date": "20 May 2026",
      "status": "Declared",
      "resultLink": "https://result.biharboard.ac.in",
      "isNewPost": true
    }
    ```

---

## 5. Other Operations
*   **Delete**: `DELETE /api/jobs/:id` (Use the `_id` from the list).
*   **Toggle Active**: `PATCH /api/jobs/:id/toggle` (Hide/Show a post).
*   **Get Profile**: `GET /api/auth/me` (Check if logged in).

---

## Pro Tip for Client
*   Keep the **Admin App** (Frontend) password-protected or restricted to your IP for extra security.
*   Always use `https://` in production for API calls.
