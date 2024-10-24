// import { createAuthProvider } from "react-token-auth";
// import { makePostRequest } from "../services/api";

// export const [useAuth, authFetch, login, logout] = createAuthProvider(
//     {
//         accessTokenKey: 'access_token',
//         onUpdateToken: (token) => makePostRequest(
//             "/account_management/refresh",
//             {
//                 method: "POST",
//                 body: token.access_token
//             }
//         ).then(r => r.json())
//     }
// )