# Registration API Integration

## Overview
This document describes the integration of the registration API endpoint with the React frontend using Formik and Yup for form validation.

## API Endpoint
- **URL**: `http://127.0.0.1:8000/api/auth/register`
- **Method**: POST
- **Content-Type**: application/json

## Required Fields
The registration form collects the following data:

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `name` | string | Full name of the user | Min 2 chars, max 50 chars, required |
| `email` | string | User's email address | Valid email format, required |
| `password` | string | User's password | Min 8 chars, contains uppercase, lowercase, and number |
| `password_confirmation` | string | Password confirmation | Must match password field |
| `role` | string | User role | Must be one of: "admin", "seller", "user" |
| `phone` | string | Phone number | Valid phone format, required |

## Implementation Details

### 1. API Service (`src/lib/api.ts`)
- Created a dedicated API service file for authentication endpoints
- Includes TypeScript interfaces for type safety
- Handles error responses and network errors gracefully
- Returns structured response objects

### 2. Form Validation (`src/pages/Register.tsx`)
- Uses **Formik** for form state management
- Uses **Yup** for schema validation
- Real-time validation with error messages
- Handles both client-side and server-side validation errors

### 3. Form Features
- **Role Selection**: Radio buttons for admin, seller, and user roles
- **Password Requirements**: Enforces strong password policy
- **Phone Validation**: Accepts international phone number formats
- **Error Handling**: Displays validation errors below each field
- **Loading States**: Shows loading indicator during API calls
- **Success/Error Toasts**: User feedback for registration results

## Usage

### Starting the Development Server
```bash
npm run dev
```

### Testing the Registration
1. Navigate to `/register` in your browser
2. Fill out the registration form with valid data
3. Select a role (admin, seller, or user)
4. Submit the form
5. Check the browser's network tab to see the API request

### API Response Format
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "phone": "+1234567890"
    },
    "token": "optional_auth_token"
  }
}
```

## Error Handling
The integration handles various error scenarios:
- **Validation Errors**: Server-side validation errors are displayed in the form
- **Network Errors**: Connection issues show appropriate error messages
- **Server Errors**: Generic error handling for unexpected server responses

## Dependencies Added
- `formik`: Form state management
- `yup`: Schema validation

## Files Modified/Created
- `src/lib/api.ts` - New API service file
- `src/pages/Register.tsx` - Updated with Formik/Yup integration
- `package.json` - Added formik and yup dependencies 