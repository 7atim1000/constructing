import { useState, useRef } from "react";

import { useNavigate } from "react-router-dom";

import { saveTokens } from "../../utils/auth";

import logo from "../../assets/images/logo.png";

import { FaEye, FaEyeSlash } from "react-icons/fa";


function Login() {

    const BASE = import.meta.env.VITE_DJANGO_BASE_URL;


    const [form, setForm] = useState({
        username: "",
        password: "",
    });


    const [loginMode, setLoginMode] = useState(null);

    const [msg, setMsg] = useState("");

    const navigate = useNavigate();


    const [showPassword, setShowPassword] = useState(false);

    const passwordRef = useRef(null);


    // =========================================================
    // HANDLE INPUT CHANGES
    // =========================================================

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

    };


    // =========================================================
    // SELECT QUICK LOGIN USER
    // =========================================================

    const handleUserLogin = (username) => {

        setLoginMode(username);

        setForm({
            username: username,
            password: "",
        });

        setMsg("");


        setTimeout(() => {

            passwordRef.current?.focus();

        }, 0);

    };


    // =========================================================
    // RETURN TO NORMAL LOGIN
    // =========================================================

    const handleNormalLogin = () => {

        setLoginMode(null);

        setForm({
            username: "",
            password: "",
        });

        setMsg("");

    };


    // =========================================================
    // LOGIN
    // =========================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMsg("");


        try {

            const response = await fetch(
                `${BASE}/api/token/`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify(form),
                }
            );


            console.log("Login status:", response.status);


            const data = await response.json();


            if (response.ok) {

                saveTokens(data);


                setMsg(
                    "تم تسجيل الدخول بنجاح! جاري التحويل..."
                );


                setTimeout(() => {

                    navigate("/dashboard");

                }, 800);


            } else {

                setMsg(
                    data.detail ||
                    "فشل تسجيل الدخول. يرجى المحاولة مرة أخرى."
                );

            }


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            setMsg(
                "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى."
            );

        }

    };


    return (

        <div
            dir="rtl"
            className="
                min-h-screen
                bg-gradient-to-r
                from-[#E2E8F0]
                via-[#F4F4F5]
                to-[#FFFFFF]
                flex
                items-center
                justify-center
                px-6
                py-10
            "
        >


            {/* ================================================= */}
            {/* LOGIN CARD */}
            {/* ================================================= */}

            <div
                className="
                    w-full
                    max-w-md
                    bg-white
                    rounded-2xl
                    shadow-xl
                    border
                    border-[#CBD5E1]
                    p-6
                "
            >


                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div className="text-center mb-8">


                    <img
                        src={logo}
                        alt="Logo"
                        className="
                            mx-auto
                            w-15
                            h-15
                            object-contain
                            rounded-lg
                            mb-4
                        "
                    />


                    <h1
                        className="
                            text-3xl
                            font-extrabold
                            text-[#1E293B]
                        "
                    >
                        الاولى للمقاولات
                    </h1>


                    <p
                        className="
                            text-[#64748B]
                            mt-2
                        "
                    >
                        مرحبا بك .. رجاء قم بتسجيل الدخول الى حسابك
                    </p>


                </div>


                {/* ================================================= */}
                {/* QUICK LOGIN BUTTONS */}
                {/* ================================================= */}

                {!loginMode && (

                    <div className="space-y-3 mb-5">


                        {/* ADMIN */}

                        <button
                            type="button"
                            onClick={() =>
                                handleUserLogin("admin")
                            }
                            className="
                                w-full
                                bg-[#334155]
                                hover:bg-[#1E293B]
                                border
                                border-[#CBD5E1]
                                text-white
                                py-3
                                rounded-lg
                                transition
                                duration-200
                                cursor-pointer
                                shadow-sm
                            "
                        >

                            <span
                                className="
                                    font-extrabold
                                    text-sm
                                "
                            >
                                السيد
                            </span>


                            <span
                                className="
                                    text-xs
                                    text-[#CBD5E1]
                                "
                            >
                                {" / "}
                            </span>


                            <span
                                className="
                                    font-extrabold
                                    text-lg
                                "
                            >
                                المدير العام
                            </span>

                        </button>


                        {/*  */}

                        <button
                            type="button"
                            onClick={() =>
                                handleUserLogin("accountant")
                            }
                            className="
                                w-full
                                bg-[#334155]
                                hover:bg-[#1E293B]
                                border
                                border-[#CBD5E1]
                                text-white
                                py-3
                                rounded-lg
                                transition
                                duration-200
                                cursor-pointer
                                shadow-sm
                            "
                        >

                            <span
                                className="
                                    font-extrabold
                                    text-sm
                                "
                            >
                                السيد
                            </span>


                            <span
                                className="
                                    text-xs
                                    text-[#CBD5E1]
                                "
                            >
                                {" / "}
                            </span>


                            <span
                                className="
                                    font-extrabold
                                    text-lg
                                "
                            >
                                المدير المالي
                            </span>

                        </button>


                        {/* */}

                        <button
                            type="button"
                            onClick={() =>
                                handleUserLogin("accountant-1")
                            }
                            className="
                                w-full
                                bg-[#334155]
                                hover:bg-[#1E293B]
                                border
                                border-[#CBD5E1]
                                text-white
                                py-3
                                rounded-lg
                                transition
                                duration-200
                                cursor-pointer
                                shadow-sm
                            "
                        >

                            <span
                                className="
                                    font-extrabold
                                    text-sm
                                "
                            >
                                السيد
                            </span>


                            <span
                                className="
                                    text-xs
                                    text-[#CBD5E1]
                                "
                            >
                                {" / "}
                            </span>


                            <span
                                className="
                                    font-extrabold
                                    text-lg
                                "
                            >
                                رئيس الحسابات
                            </span>

                        </button>


                    </div>

                )}


                {/* ================================================= */}
                {/* SELECTED USER */}
                {/* ================================================= */}

                {loginMode && (

                    <div
                        className="
                            mb-5
                            rounded-lg
                            bg-[#F1F5F9]
                            border
                            border-[#CBD5E1]
                            px-4
                            py-3
                            text-center
                        "
                    >

                        <p
                            className="
                                text-sm
                                text-[#334155]
                                font-bold
                            "
                        >

                            {loginMode === "admin"
                                ? "تسجيل دخول المدير العام"
                                : loginMode === "accountant"
                                ? "تسجيل دخول المدير المالي"
                                : "تسجيل دخول رئيس الحسابات"}

                        </p>


                        <p
                            className="
                                text-xs
                                text-[#64748B]
                                mt-1
                            "
                        >
                            المستخدم: {loginMode}
                        </p>


                    </div>

                )}


                {/* ================================================= */}
                {/* LOGIN FORM */}
                {/* ================================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >


                    {/* ================================================= */}
                    {/* USERNAME */}
                    {/* ================================================= */}

                    {!loginMode && (

                        <div>

                            <label
                                className="
                                    block
                                    text-sm
                                    font-medium
                                    text-[#334155]
                                    mb-2
                                "
                            >
                                اسم المستخدم
                            </label>


                            <input
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                placeholder="أدخل اسم المستخدم"
                                required
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    bg-[#F8FAFC]
                                    border-[#CBD5E1]
                                    px-4
                                    py-3
                                    text-[#1E293B]
                                    placeholder:text-[#94A3B8]
                                    outline-none
                                    focus:ring-2
                                    focus:ring-[#94A3B8]
                                    focus:border-[#64748B]
                                    transition
                                "
                            />

                        </div>

                    )}


                    {/* ================================================= */}
                    {/* PASSWORD */}
                    {/* ================================================= */}

                    <div>

                        <label
                            className="
                                block
                                text-sm
                                font-medium
                                text-[#334155]
                                mb-2
                            "
                        >
                            كلمة المرور
                        </label>


                        <div className="relative">

                            <input
                                ref={passwordRef}
                                name="password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={form.password}
                                onChange={handleChange}
                                placeholder="أدخل كلمة المرور"
                                required
                                className="
                                    w-full
                                    rounded-lg
                                    bg-[#F8FAFC]
                                    border
                                    border-[#CBD5E1]
                                    px-4
                                    py-3
                                    pl-12
                                    text-[#1E293B]
                                    placeholder:text-[#94A3B8]
                                    outline-none
                                    focus:ring-2
                                    focus:ring-[#94A3B8]
                                    focus:border-[#64748B]
                                    transition
                                "
                            />


                            {/* SHOW PASSWORD */}

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        (prev) => !prev
                                    )
                                }
                                className="
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-[#94A3B8]
                                    hover:text-[#334155]
                                    cursor-pointer
                                    transition
                                "
                                aria-label={
                                    showPassword
                                        ? "إخفاء كلمة المرور"
                                        : "إظهار كلمة المرور"
                                }
                            >

                                {showPassword ? (
                                    <FaEyeSlash size={18} />
                                ) : (
                                    <FaEye size={18} />
                                )}

                            </button>


                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* LOGIN BUTTON */}
                    {/* ================================================= */}

                    <button
                        type="submit"
                        className="
                            w-full
                            bg-[#334155]
                            hover:bg-[#1E293B]
                            text-white
                            font-extrabold
                            py-3
                            rounded-lg
                            transition
                            duration-200
                            cursor-pointer
                            shadow-sm
                        "
                    >
                        تسجيل الدخول
                    </button>


                </form>


                {/* ================================================= */}
                {/* BACK TO NORMAL LOGIN */}
                {/* ================================================= */}

                {loginMode && (

                    <button
                        type="button"
                        onClick={handleNormalLogin}
                        className="
                            w-full
                            mt-4
                            text-sm
                            text-[#64748B]
                            hover:text-[#1E293B]
                            transition
                            cursor-pointer
                        "
                    >
                        العودة إلى تسجيل الدخول العادي
                    </button>

                )}


                {/* ================================================= */}
                {/* MESSAGE */}
                {/* ================================================= */}

                {msg && (

                    <div
                        className="
                            mt-6
                            rounded-lg
                            bg-[#F1F5F9]
                            border
                            border-[#CBD5E1]
                            px-4
                            py-3
                        "
                    >

                        <p
                            className="
                                text-sm
                                text-[#334155]
                                text-center
                            "
                        >
                            {msg}
                        </p>

                    </div>

                )}


                {/* ================================================= */}
                {/* SIGNUP */}
                {/* ================================================= */}

                {!loginMode && (

                    <div
                        className="
                            mt-8
                            text-center
                            text-sm
                            text-[#64748B]
                        "
                    >

                        ليس لديك حساب؟


                        <a
                            href="/signup"
                            className="
                                mr-2
                                font-semibold
                                text-[#334155]
                                hover:text-[#1E293B]
                                underline
                            "
                        >
                            إنشاء حساب
                        </a>


                    </div>

                )}


            </div>

        </div>

    );

}


export default Login;