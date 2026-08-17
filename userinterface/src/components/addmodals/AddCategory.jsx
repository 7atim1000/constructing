import React, { useState } from "react";
import { authFetch } from "../../utils/auth";

const BASE = import.meta.env.VITE_DJANGO_BASE_URL;

const AddCategory = ({ onClose, onSuccess }) => {

    const [name, setName] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const getToken = () => {
        return localStorage.getItem("access");
    };

    
    // const handleSubmit = async (e) => {

    //     e.preventDefault();

    //     setError("");

    //     if (!name.trim()) {
    //         setError("يرجى إدخال اسم التصنيف");
    //         return;
    //     }

    //     setLoading(true);

    //     try {

    //         const token = getToken();

    //         const response = await fetch(
    //             `${BASE}/api/categories/add/`,
    //             {
    //                 method: "POST",

    //                 headers: {
    //                     "Authorization": `Bearer ${token}`,
    //                     "Content-Type": "application/json",
    //                 },

    //                 body: JSON.stringify({
    //                     name: name.trim(),
    //                 }),
    //             }
    //         );

    //         const data = await response.json();

    //         if (!response.ok) {

    //             if (typeof data === "object") {
    //                 const firstError =
    //                     Object.values(data)?.[0];

    //                 setError(
    //                     Array.isArray(firstError)
    //                         ? firstError[0]
    //                         : "حدث خطأ أثناء إضافة التصنيف"
    //                 );
    //             } else {
    //                 setError("حدث خطأ أثناء إضافة التصنيف");
    //             }

    //             return;
    //         }

    //         setName("");

    //         if (onSuccess) {
    //             onSuccess(data.category);
    //         }

    //     } catch (error) {

    //         console.error(
    //             "Add category error:",
    //             error
    //         );

    //         setError(
    //             "تعذر الاتصال بالخادم"
    //         );

    //     } finally {

    //         setLoading(false);

    //     }
    // };

    const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!name.trim()) {
        setError("يرجى إدخال اسم التصنيف");
        return;
    }

    setLoading(true);

    try {
        const response = await authFetch(
            `${BASE}/api/categories/add/`,
            {
                method: "POST",
                body: JSON.stringify({
                    name: name.trim(),
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error(
                "Create category error:",
                data
            );

            if (typeof data === "object") {
                const firstError =
                    Object.values(data)?.[0];

                setError(
                    Array.isArray(firstError)
                        ? firstError[0]
                        : "حدث خطأ أثناء إضافة التصنيف"
                );
            } else {
                setError(
                    "حدث خطأ أثناء إضافة التصنيف"
                );
            }

            return;
        }

        setName("");

        if (onSuccess) {
            onSuccess(data.category);
        }

    } catch (error) {
        console.error(
            "Add category error:",
            error
        );

        setError(
            "تعذر الاتصال بالخادم"
        );

    } finally {
        setLoading(false);
    }
};

    return (

        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/50
                p-4
            "
        >

            <div
                className="
                    w-full
                    max-w-md
                    bg-white
                    rounded-2xl
                    shadow-xl
                    overflow-hidden
                "
            >

                {/* HEADER */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        px-6
                        py-4
                        border-b
                    "
                >

                    <h2 className="text-lg font-bold text-gray-800">
                        إضافة تصنيف جديد
                    </h2>

                    <button
                        onClick={onClose}
                        className="
                            text-gray-400
                            hover:text-gray-700
                            text-xl
                        "
                    >
                        ×
                    </button>

                </div>

                {/* BODY */}

                <form
                    onSubmit={handleSubmit}
                    className="p-6"
                >

                    <label
                        className="
                            block
                            text-sm
                            font-medium
                            text-gray-700
                            mb-2
                        "
                    >
                        اسم التصنيف
                    </label>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        placeholder="مثال: مواد بناء"
                        className="
                            w-full
                            px-4
                            py-3
                            border
                            border-gray-300
                            rounded-lg
                            outline-none
                            focus:ring-2
                            focus:ring-blue-500
                            focus:border-blue-500
                        "
                    />

                    {error && (

                        <div
                            className="
                                mt-3
                                p-3
                                rounded-lg
                                bg-red-50
                                text-red-600
                                text-sm
                            "
                        >
                            {error}
                        </div>

                    )}

                    {/* ACTIONS */}

                    <div
                        className="
                            flex
                            justify-end
                            gap-3
                            mt-6
                        "
                    >

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                px-4
                                py-2.5
                                rounded-lg
                                bg-gray-100
                                text-gray-700
                                hover:bg-gray-200
                            "
                        >
                            إلغاء
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                px-5
                                py-2.5
                                rounded-lg
                                bg-blue-600
                                text-white
                                hover:bg-blue-700
                                disabled:opacity-50
                            "
                        >
                            {loading
                                ? "جاري الحفظ..."
                                : "إضافة التصنيف"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default AddCategory;