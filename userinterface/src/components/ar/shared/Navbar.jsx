import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

import {
    clearTokens,
    getAccessToken,
    authFetch
} from "../../../utils/auth";

import { SlUserFollow } from "react-icons/sl";
import { MdDashboardCustomize } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";


const Navbar = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    // =========================================================
    // CHECK LOGIN
    // =========================================================

    const isLoggedIn = !!getAccessToken();


    // =========================================================
    // GET LOGGED-IN USER
    // =========================================================

    useEffect(() => {

        // -----------------------------------------------------
        // No access token
        // -----------------------------------------------------

        if (!isLoggedIn) {

            setUser(null);
            setLoading(false);

            return;

        }


        // -----------------------------------------------------
        // Fetch user
        // -----------------------------------------------------

        const fetchUser = async () => {

            try {

                setLoading(true);


                const BASE =
                    import.meta.env.VITE_DJANGO_BASE_URL;


                // authFetch automatically:
                //
                // 1. Sends access token
                // 2. If token expired → refresh token
                // 3. Gets new access token
                // 4. Retries /api/me/
                //
                const response =
                    await authFetch(
                        `${BASE}/api/me/`
                    );


                // ------------------------------------------------
                // If authFetch could not refresh the token
                // ------------------------------------------------

                if (response.status === 401) {

                    console.log(
                        "Authentication expired."
                    );


                    clearTokens();

                    setUser(null);


                    navigate(
                        "/login",
                        {
                            replace: true
                        }
                    );


                    return;

                }


                // ------------------------------------------------
                // Other API errors
                // ------------------------------------------------

                if (!response.ok) {

                    throw new Error(
                        `Failed to get user information: ${response.status}`
                    );

                }


                // ------------------------------------------------
                // Get user data
                // ------------------------------------------------

                const data =
                    await response.json();


                console.log(
                    "Logged-in user:",
                    data
                );


                setUser(data);


            } catch (error) {

                console.error(
                    "Error fetching user:",
                    error
                );


                clearTokens();

                setUser(null);


                navigate(
                    "/login",
                    {
                        replace: true
                    }
                );


            } finally {

                setLoading(false);

            }

        };


        // IMPORTANT:
        // Actually execute fetchUser()

        fetchUser();


    }, [isLoggedIn, navigate]);


    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = () => {

        clearTokens();

        setUser(null);

        navigate(
            "/login",
            {
                replace: true
            }
        );

    };


    // =========================================================
    // PAGE NAME
    // =========================================================

    const getPageName = () => {

        const path =
            location.pathname;


        // Dashboard

        if (
            path === "/ar-dashboard" ||
            path === "/dashboard"
        ) {

            return "قمة الرواسي";

        }


        // Authentication

        if (path === "/login") {

            return "تسجيل الدخول";

        }


        if (path === "/signup") {

            return "إنشاء حساب";

        }


        // Users

        if (
            path.includes("users")
        ) {

            return "المستخدمون";

        }


        // Categories

        if (
            path.includes("categories")
        ) {

            return "التصنيفات";

        }


        // Units

        if (
            path.includes("units")
        ) {

            return "الوحدات";

        }


        // Products

        if (
            path.includes("products")
        ) {

            return "المنتجات";

        }


        // Contacts

        if (
            path.includes("contacts")
        ) {

            return "جهات الاتصال";

        }


        // Orders

        if (
            path.includes("orders")
        ) {

            return "الطلبات";

        }


        // Finance

        if (
            path.includes("finance")
        ) {

            return "المالية";

        }


        return "الصفحة الرئيسية";

    };


    // =========================================================
    // USER IMAGE
    // =========================================================

    const getUserImage = () => {

        if (!user?.image) {

            return null;

        }


        const BASE =
            import.meta.env.VITE_DJANGO_BASE_URL;


        // If backend already returns full URL

        if (
            user.image.startsWith("http")
        ) {

            return user.image;

        }


        // If backend returns /media/...

        return `${BASE}${user.image}`;

    };


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <nav
            dir="rtl"
            className="
                fixed
                top-0
                left-0
                right-0

                h-13

                bg-gradient-to-r
                from-[#E2E8F0]
                via-[#F4F4F5]
                to-[#FFFFFF]

                border-b
                border-[#D4D4D8]

                shadow-[0_2px_8px_rgba(0,0,0,0.12)]

                z-50

                px-4
                sm:px-6
            "
        >

            <div
                className="
                    h-full

                    flex
                    items-center
                    justify-between

                    gap-4
                "
            >

                {/* ================================================= */}
                {/* PAGE NAME */}
                {/* ================================================= */}

                <div
                    className="
                        flex
                        items-center

                        min-w-0
                    "
                >

                    <h1
                        className="
                            text-base
                            sm:text-2xl

                            text-[#27272A]

                            truncate

                            font-extrabold
                        "
                    >

                        {getPageName()}

                    </h1>

                </div>


                {/* ================================================= */}
                {/* RIGHT SIDE */}
                {/* ================================================= */}

                <div
                    className="
                        flex
                        items-center

                        gap-3
                        sm:gap-5
                    "
                >

                    {/* ================================================= */}
                    {/* NOT LOGGED IN */}
                    {/* ================================================= */}

                    {!isLoggedIn ? (

                        <>

                            {/* Login */}

                            <Link
                                to="/login"
                                className="
                                    text-[#27272A]

                                    font-semibold

                                    hover:text-[#52525B]

                                    transition
                                "
                            >

                                تسجيل الدخول

                            </Link>


                            {/* Signup */}

                            <Link
                                to="/signup"
                                className="
                                    hidden
                                    sm:block

                                    text-[#52525B]

                                    font-semibold

                                    hover:text-[#27272A]

                                    transition
                                "
                            >

                                إنشاء حساب

                            </Link>

                        </>

                    ) : (

                        <>

                            {/* ================================================= */}
                            {/* USER INFORMATION */}
                            {/* ================================================= */}

                            {!loading && user && (

                                <div
                                    className="
                                        flex
                                        items-center

                                        gap-2
                                    "
                                >

                                    {/* ----------------------------------------- */}
                                    {/* USER IMAGE */}
                                    {/* ----------------------------------------- */}

                                    {getUserImage() ? (

                                        <img
                                            src={getUserImage()}
                                            alt={
                                                user.username
                                            }
                                            className="
                                                w-9
                                                h-9

                                                sm:w-10
                                                sm:h-10

                                                rounded-full

                                                object-cover

                                                border
                                                border-[#D4D4D8]

                                                shadow-sm
                                            "
                                        />

                                    ) : (

                                        <div
                                            className="
                                                w-9
                                                h-9

                                                sm:w-10
                                                sm:h-10

                                                rounded-full

                                                bg-[#E4E4E7]

                                                border
                                                border-[#D4D4D8]

                                                flex
                                                items-center
                                                justify-center

                                                shadow-sm
                                            "
                                        >

                                            <SlUserFollow
                                                size={20}
                                                className="
                                                    text-[#52525B]
                                                "
                                            />

                                        </div>

                                    )}


                                    {/* ----------------------------------------- */}
                                    {/* USERNAME */}
                                    {/* ----------------------------------------- */}

                                    <span
                                        className="
                                            hidden
                                            sm:block

                                            font-semibold

                                            text-[#27272A]

                                            max-w-[150px]

                                            truncate
                                        "
                                    >

                                        {user.username}

                                    </span>

                                </div>

                            )}


                            {/* ================================================= */}
                            {/* LOADING USER */}
                            {/* ================================================= */}

                            {loading && (

                                <div
                                    className="
                                        hidden
                                        sm:block

                                        w-24
                                        h-5

                                        bg-[#E4E4E7]

                                        rounded-md

                                        animate-pulse
                                    "
                                />

                            )}


                            {/* ================================================= */}
                            {/* ADMIN DASHBOARD */}
                            {/* ================================================= */}

                            {!loading &&
                                user?.role === "admin" && (

                                    <Link
                                        to="/dashboard"
                                        className="
                                            flex
                                            items-center

                                            gap-2

                                            text-[#27272A]

                                            font-semibold

                                            hover:text-[#52525B]

                                            transition
                                        "
                                    >

                                        <MdDashboardCustomize
                                            size={23}
                                        />

                                        <span
                                            className="
                                                hidden
                                                sm:block
                                            "
                                        >

                                            الرئيسية

                                        </span>

                                    </Link>

                                )}


                            {/* ================================================= */}
                            {/* LOGOUT */}
                            {/* ================================================= */}

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="
                                    flex
                                    items-center
                                    justify-center

                                    text-red-700

                                    hover:text-red-900

                                    cursor-pointer

                                    transition

                                    duration-200
                                "
                                title="تسجيل الخروج"
                                aria-label="تسجيل الخروج"
                            >

                                <IoMdLogOut
                                    size={24}
                                />

                            </button>

                        </>

                    )}

                </div>

            </div>

        </nav>

    );

};


export default Navbar;