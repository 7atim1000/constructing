import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {

    const BASE = import.meta.env.VITE_DJANGO_BASE_URL;

    const navigate = useNavigate();


    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        password2: "",
        role: "user",
        image: null,
    });


    const [preview, setPreview] = useState(null);

    const [msg, setMsg] = useState("");

    const [loading, setLoading] = useState(false);


    // =========================================================
    // HANDLE INPUT CHANGE
    // =========================================================

    const handleChange = (e) => {

        const {
            name,
            value,
            files
        } = e.target;


        // -----------------------------------------------------
        // IMAGE
        // -----------------------------------------------------

        if (name === "image") {

            const file = files[0];


            setForm((prev) => ({
                ...prev,
                image: file,
            }));


            if (file) {

                setPreview(
                    URL.createObjectURL(file)
                );

            }

        }


        // -----------------------------------------------------
        // NORMAL INPUT
        // -----------------------------------------------------

        else {

            setForm((prev) => ({
                ...prev,
                [name]: value,
            }));

        }

    };


    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        setLoading(true);

        setMsg("");


        const formData = new FormData();


        formData.append(
            "username",
            form.username
        );

        formData.append(
            "email",
            form.email
        );

        formData.append(
            "password",
            form.password
        );

        formData.append(
            "password2",
            form.password2
        );

        formData.append(
            "role",
            form.role
        );


        if (form.image) {

            formData.append(
                "image",
                form.image
            );

        }


        try {

            const res = await fetch(
                `${BASE}/api/register/`,
                {
                    method: "POST",
                    body: formData,
                }
            );


            const data = await res.json();


            console.log(
                "Register response:",
                data
            );


            if (res.ok) {

                setMsg(
                    "تم إنشاء الحساب بنجاح. جاري الانتقال إلى تسجيل الدخول..."
                );


                setTimeout(() => {

                    navigate("/login");

                }, 1200);

            }


            else {

                setMsg(
                    data.detail ||
                    JSON.stringify(data)
                );

            }


        }


        catch (err) {

            console.error(
                "Registration error:",
                err
            );


            setMsg(
                "حدث خطأ أثناء إنشاء الحساب."
            );

        }


        finally {

            setLoading(false);

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
            {/* SIGNUP CARD */}
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
                    p-8
                "
            >


                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div className="text-center mb-7">


                    <h1
                        className="
                            text-3xl
                            font-extrabold
                            text-[#1E293B]
                            mb-2
                        "
                    >
                        إنشاء حساب
                    </h1>


                    <p
                        className="
                            text-[#64748B]
                        "
                    >
                        أنشئ حسابك للانضمام إلى منصتنا
                    </p>


                </div>


                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >


                    {/* ================================================= */}
                    {/* PROFILE IMAGE */}
                    {/* ================================================= */}

                    <div className="flex justify-center mb-5">


                        <label
                            className="
                                cursor-pointer
                                group
                            "
                        >


                            <div
                                className="
                                    w-24
                                    h-24
                                    rounded-full
                                    bg-[#F8FAFC]
                                    overflow-hidden
                                    border-4
                                    border-[#CBD5E1]
                                    group-hover:border-[#64748B]
                                    transition
                                    duration-200
                                    shadow-sm
                                "
                            >


                                {preview ? (

                                    <img
                                        src={preview}
                                        alt="Profile preview"
                                        className="
                                            w-full
                                            h-full
                                            object-cover
                                        "
                                    />

                                ) : (

                                    <div
                                        className="
                                            w-full
                                            h-full
                                            flex
                                            items-center
                                            justify-center
                                            text-[#64748B]
                                            text-sm
                                            font-medium
                                        "
                                    >
                                        صورة
                                    </div>

                                )}


                            </div>


                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                hidden
                                onChange={handleChange}
                            />


                        </label>


                    </div>


                    {/* ================================================= */}
                    {/* USERNAME */}
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
                            اسم المستخدم
                        </label>


                        <input
                            type="text"
                            name="username"
                            placeholder="أدخل اسم المستخدم"
                            value={form.username}
                            onChange={handleChange}
                            required
                            className="
                                w-full
                                border
                                border-[#CBD5E1]
                                bg-[#F8FAFC]
                                rounded-lg
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


                    {/* ================================================= */}
                    {/* EMAIL */}
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
                            البريد الإلكتروني
                        </label>


                        <input
                            type="email"
                            name="email"
                            placeholder="أدخل البريد الإلكتروني"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="
                                w-full
                                border
                                border-[#CBD5E1]
                                bg-[#F8FAFC]
                                rounded-lg
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


                        <input
                            type="password"
                            name="password"
                            placeholder="أدخل كلمة المرور"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="
                                w-full
                                border
                                border-[#CBD5E1]
                                bg-[#F8FAFC]
                                rounded-lg
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


                    {/* ================================================= */}
                    {/* CONFIRM PASSWORD */}
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
                            تأكيد كلمة المرور
                        </label>


                        <input
                            type="password"
                            name="password2"
                            placeholder="أعد إدخال كلمة المرور"
                            value={form.password2}
                            onChange={handleChange}
                            required
                            className="
                                w-full
                                border
                                border-[#CBD5E1]
                                bg-[#F8FAFC]
                                rounded-lg
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


                    {/* ================================================= */}
                    {/* ACCOUNT TYPE */}
                    {/* ================================================= */}

                    <div className="pt-1">


                        <p
                            className="
                                text-sm
                                font-medium
                                text-[#334155]
                                mb-2
                            "
                        >
                            نوع الحساب
                        </p>


                        <div
                            className="
                                grid
                                grid-cols-2
                                gap-3
                            "
                        >


                            {/* USER */}

                            <button
                                type="button"
                                onClick={() =>
                                    setForm({
                                        ...form,
                                        role: "user",
                                    })
                                }
                                className={`
                                    rounded-lg
                                    p-3
                                    border
                                    cursor-pointer
                                    transition
                                    duration-200
                                    font-semibold
                                    ${
                                        form.role === "user"
                                            ? `
                                                bg-[#334155]
                                                text-white
                                                border-[#334155]
                                                shadow-md
                                            `
                                            : `
                                                bg-white
                                                text-[#64748B]
                                                border-[#CBD5E1]
                                                hover:bg-[#F8FAFC]
                                                hover:border-[#94A3B8]
                                            `
                                    }
                                `}
                            >
                                مستخدم
                            </button>


                            {/* Admin */}

                            <button
                                type="button"
                                onClick={() =>
                                    setForm({
                                        ...form,
                                        role: "admin",
                                    })
                                }
                                className={`
                                    rounded-lg
                                    p-3
                                    cursor-pointer
                                    border
                                    transition
                                    duration-200
                                    font-semibold
                                    ${
                                        form.role === "admin"
                                            ? `
                                                bg-[#334155]
                                                text-white
                                                border-[#334155]
                                                shadow-md
                                            `
                                            : `
                                                bg-white
                                                text-[#64748B]
                                                border-[#CBD5E1]
                                                hover:bg-[#F8FAFC]
                                                hover:border-[#94A3B8]
                                            `
                                    }
                                `}
                            >
                                الاداره
                            </button>


                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* CREATE ACCOUNT */}
                    {/* ================================================= */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full
                            bg-[#334155]
                            hover:bg-[#1E293B]
                            cursor-pointer
                            text-white
                            rounded-lg
                            py-3
                            font-extrabold
                            transition
                            duration-200
                            shadow-sm
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                            mt-2
                        "
                    >

                        {loading
                            ? "جاري إنشاء الحساب..."
                            : "إنشاء الحساب"
                        }

                    </button>


                    {/* ================================================= */}
                    {/* BACK TO LOGIN */}
                    {/* ================================================= */}

                    <a
                        href="/login"
                        className="
                            block
                            text-center
                            font-normal
                            text-sm
                            text-[#64748B]
                            hover:text-[#1E293B]
                            underline
                            mt-3
                            transition
                        "
                    >
                        العودة إلى تسجيل الدخول
                    </a>


                </form>


                {/* ================================================= */}
                {/* MESSAGE */}
                {/* ================================================= */}

                {msg && (

                    <p
                        className="
                            text-sm
                            text-[#334155]
                            text-center
                            mt-5
                            bg-[#F1F5F9]
                            border
                            border-[#CBD5E1]
                            rounded-lg
                            py-3
                            px-3
                        "
                    >
                        {msg}
                    </p>

                )}


            </div>


        </div>

    );

}


export default Signup;