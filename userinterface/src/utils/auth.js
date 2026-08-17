// Your backend uses: TokenObtainPairView, TokenRefreshView, IsAuthenticated
// =========================================================
// SAVE TOKENS
// =========================================================

// =========================================================
// SAVE TOKENS
// =========================================================

export const saveTokens = (tokens) => {

    localStorage.setItem(
        "access_token",
        tokens.access
    );

    if (tokens.refresh) {

        localStorage.setItem(
            "refresh_token",
            tokens.refresh
        );

    }

};


// =========================================================
// CLEAR TOKENS
// =========================================================

export const clearTokens = () => {

    localStorage.removeItem("access_token");

    localStorage.removeItem("refresh_token");

};


// =========================================================
// GET ACCESS TOKEN
// =========================================================

export const getAccessToken = () => {

    return localStorage.getItem(
        "access_token"
    );

};


// =========================================================
// GET REFRESH TOKEN
// =========================================================

export const getRefreshToken = () => {

    return localStorage.getItem(
        "refresh_token"
    );

};


// =========================================================
// REFRESH ACCESS TOKEN
// =========================================================

export const refreshAccessToken = async () => {

    const refreshToken = getRefreshToken();

    if (!refreshToken) {

        return null;

    }


    const BASE =
        import.meta.env.VITE_DJANGO_BASE_URL;


    try {

        const response = await fetch(
            `${BASE}/api/token/refresh/`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    refresh: refreshToken,
                }),
            }
        );


        if (!response.ok) {

            console.error(
                "Refresh token expired or invalid."
            );

            clearTokens();

            return null;

        }


        const data = await response.json();


        // Save new access token

        localStorage.setItem(
            "access_token",
            data.access
        );


        return data.access;


    } catch (error) {

        console.error(
            "Error refreshing access token:",
            error
        );

        clearTokens();

        return null;

    }

};


// =========================================================
// AUTH FETCH
// =========================================================

export const authFetch = async (
    url,
    options = {}
) => {

    let token = getAccessToken();


    const headers = {
        ...(options.headers || {}),
    };


    headers["Authorization"] =
        `Bearer ${token}`;


    // Only add JSON content type when needed

    if (
        !(options.body instanceof FormData)
    ) {

        headers["Content-Type"] =
            "application/json";

    }


    let response = await fetch(
        url,
        {
            ...options,
            headers,
        }
    );


    // =====================================================
    // ACCESS TOKEN EXPIRED
    // =====================================================

    if (response.status === 401) {

        console.log(
            "Access token expired. Refreshing..."
        );


        const newToken =
            await refreshAccessToken();


        // Refresh failed

        if (!newToken) {

            return response;

        }


        // =================================================
        // Retry original request
        // =================================================

        const retryHeaders = {
            ...(options.headers || {}),
            Authorization:
                `Bearer ${newToken}`,
        };


        if (
            !(options.body instanceof FormData)
        ) {

            retryHeaders["Content-Type"] =
                "application/json";

        }


        response = await fetch(
            url,
            {
                ...options,
                headers: retryHeaders,
            }
        );

    }


    return response;

};



// Why I changed this

// Your original code has:

// headers["Content-Type"] = "application/json";

// This works for your current JSON requests such as:

// authFetch(
//     `${BASE}/api/contacts/add/`,
//     {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//     }
// );

// But later, if you upload an image/file using:

// const formData = new FormData();

// you should not manually set:
                 // javascript
// Content-Type: application/json

// because the browser needs to set the multipart boundary automatically.

// The improved version handles both.

// Your login should work with this

// Your JWT endpoint is:
               // python
// path(
//     "token/",
//     TokenObtainPairView.as_view(),
//     name="token_obtain_pair"
// )

// So your frontend login should do:

// const respons