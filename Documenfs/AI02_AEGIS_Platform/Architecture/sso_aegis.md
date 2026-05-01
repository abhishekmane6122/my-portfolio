# Azure AD Single Sign-On (SSO) & RBAC Architecture

This document describes the end-to-end Single Sign-On (SSO) implementation for the AEGIS Portal, integrated with Azure Active Directory (Azure AD).

## 1. Overview
The AEGIS Portal uses **OpenID Connect (OIDC)** and **OAuth 2.0** protocols for authentication. It integrates with Azure AD to provide a seamless login experience for organization members, while using a local **Role-Based Access Control (RBAC)** system for authorization.

## 2. Technical Stack
- **Identity Provider (IdP)**: Azure Active Directory (Microsoft Entra ID)
- **Protocol**: OpenID Connect (OIDC) / Authorization Code Flow
- **Token Type**: JSON Web Tokens (JWT)
- **Backend**: FastAPI (Python)
- **Frontend**: React (TypeScript)

## 3. End-to-End Authentication Flow

### Phase 1: Initiation
1. **User Request**: A user visits the AEGIS Portal and clicks the **"Sign in with Microsoft"** button.
2. **Login Initialization**: The frontend calls the backend endpoint `GET /api/auth/login`.
3. **Authorization Redirect**: The backend generates a secure `state` parameter and constructs the Azure AD Authorization URL:
   - `https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/authorize`
   - Parameters: `client_id`, `response_type=code`, `redirect_uri`, `scope=openid profile email`, `state`.

### Phase 2: Azure AD Interaction
4. **User Authentication**: The user is redirected to the Microsoft login page. They enter their credentials and perform MFA (if required).
5. **Authorization Code**: Upon successful login, Azure AD redirects the user back to the backend's callback endpoint: `GET /api/auth/callback?code=...&state=...`.

### Phase 3: Token Exchange & Validation
6. **Token Request**: The backend receives the `code` and exchanges it for tokens (ID Token, Access Token) by calling Microsoft's token endpoint:
   - `POST https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/token`
7. **JWT Validation**: The backend fetches the public keys (JWKS) from Microsoft:
   - `GET https://login.microsoftonline.com/{TENANT_ID}/v2.0/.well-known/openid-configuration`
   - It validates the `id_token` signature, issuer (`iss`), audience (`aud`), and expiration (`exp`).

### Phase 4: Authorization (RBAC)
8. **User Identification**: The backend extracts the user's `email`, `name`, and `oid` (Object ID) from the validated JWT.
9. **Role Lookup**: The backend checks the local `user_roles.json` file to find roles assigned to the user's email address.
   ```json
   {
       "user@adani.com": ["admin", "bse_manager"]
   }
   ```
10. **Session Token**: The backend generates a local `session_token` for the user session.

### Phase 5: Client-Side Completion
11. **Final Redirect**: The backend redirects the user back to the frontend with auth data in the URL fragment:
    - `/#auth_success=true&token={token}&user={json_encoded_user_info}`
12. **Session Storage**: The React application (`App.tsx`) parses the fragment, extracts the data, and stores it in `localStorage` via the `storeUserSession` utility.
13. **Application Access**: The user is redirected to the `/dashboard`.

## 4. Endpoints

### Backend (Aegis Backend)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | GET | Initiates the SSO flow, returns Azure AD redirect URL. |
| `/api/auth/callback` | GET | Handles the redirect from Azure AD, validates tokens, and assigns roles. |
| `/api/auth/logout` | POST | Provides the Azure AD logout URL and cleans up session. |
| `/api/auth/me` | GET | (Placeholder) Returns current user session info. |

### Microsoft Azure AD
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/authorize` | GET | Authorization endpoint for user login. |
| `/token` | POST | Token exchange endpoint. |
| `/.well-known/openid-configuration` | GET | Discovery document for OIDC configuration. |
| `/jwks` | GET | JSON Web Key Set containing public keys for token validation. |

## 5. Security & RBAC Enforcement

### Persistent RBAC
Authorization is handled locally via `Backend/aegis_backend/user_roles.json`. This allows administrators to manage application-specific permissions independently of Azure AD groups if needed.

### Frontend Enforcement
- **`isAuthenticated()`**: Checks if `adminToken` exists in `localStorage`.
- **`hasRole(role)`**: Checks if the user has the required permission (or is an `admin`).
- **Conditional UI**: Navigation items (like "User Management") and action buttons are rendered only if the user has the appropriate role.

### Backend Enforcement
- **Token Validation**: Every sensitive API request should ideally validate the session token.
- **Role Verification**: Critical operations (Add/Delete) check the user's role before processing.

## 6. Key Files
- **Backend Logic**: [Backend/aegis_backend/routes/auth.py](file:///d:/Adani_Project/aegis-portal/Backend/aegis_backend/routes/auth.py)
- **Role Storage**: [Backend/aegis_backend/user_roles.json](file:///d:/Adani_Project/aegis-portal/Backend/aegis_backend/user_roles.json)
- **Frontend Entry**: [src/App.tsx](file:///d:/Adani_Project/aegis-portal/src/App.tsx)
- **Auth Utilities**: [src/utils/adminAuth.ts](file:///d:/Adani_Project/aegis-portal/src/utils/adminAuth.ts)
