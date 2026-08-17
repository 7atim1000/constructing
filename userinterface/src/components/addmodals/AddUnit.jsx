import { useState } from "react";


const AddUnit = ({
    onClose,
    onUnitAdded
}) => {

    const BASE =
        import.meta.env.VITE_DJANGO_BASE_URL;

    const [name, setName] = useState("");

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");


    // =========================================================
    // CREATE UNIT
    // =========================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");


        // =====================================================
        // VALIDATION
        // =====================================================

        const unitName = name.trim();

        if (!unitName) {

            setError(
                "يرجى إدخال اسم الوحدة."
            );

            return;

        }


        setLoading(true);


        try {

            // =================================================
            // TOKEN
            // =================================================

            const token =
                localStorage.getItem(
                    "access_token"
                );


            // =================================================
            // POST
            // =================================================

            const response =
                await fetch(
                    `${BASE}/api/units/add/`,
                    {
                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`,

                        },

                        body: JSON.stringify({
                            name: unitName,
                        }),

                    }
                );


            // =================================================
            // READ RESPONSE
            // =================================================

            const data =
                await response.json();


            console.log(
                "Create unit response:",
                response.status,
                data
            );


            // =================================================
            // ERROR
            // =================================================

            if (!response.ok) {

                console.error(
                    "Create unit error:",
                    data
                );


                setError(

                    data?.name?.[0] ||

                    data?.detail ||

                    data?.message ||

                    "فشل إنشاء الوحدة."

                );

                return;

            }


            // =================================================
            // SUCCESS
            // =================================================

            console.log(
                "Unit created successfully:",
                data
            );


            setMessage(
                "تم إنشاء الوحدة بنجاح."
            );


            // =================================================
            // IMPORTANT
            // =================================================
            //
            // Send the newly-created unit
            // to Units.jsx immediately.
            //
            // This is the part that was missing
            // in your previous AddUnit.jsx.
            //
            // =================================================

            if (onUnitAdded) {

                onUnitAdded(data);

            }


            // Clear input

            setName("");


        } catch (error) {

            console.error(
                "Error creating unit:",
                error
            );


            setError(
                "حدث خطأ أثناء إنشاء الوحدة."
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div
            dir="rtl"
            className="
                fixed
                inset-0
                z-[100]
                flex
                items-center
                justify-center
                bg-black/30
                backdrop-blur-[2px]
                px-4
            "
        >

            {/* ================================================= */}
            {/* MODAL */}
            {/* ================================================= */}

            <div
                className="
                    w-full
                    max-w-md
                    bg-white
                    rounded-2xl
                    shadow-2xl
                    border
                    border-[#E2E8F0]
                    p-6
                "
            >

                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        mb-6
                    "
                >

                    <div>

                        <h2
                            className="
                                text-xl
                                font-extrabold
                                text-[#334155]
                            "
                        >
                            إضافة وحدة جديدة
                        </h2>

                        <p
                            className="
                                text-sm
                                text-[#64748B]
                                mt-1
                            "
                        >
                            أدخل اسم الوحدة
                        </p>

                    </div>


                    {/* CLOSE */}

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="
                            w-9
                            h-9
                            rounded-lg
                            flex
                            items-center
                            justify-center
                            text-[#64748B]
                            hover:bg-[#F1F5F9]
                            hover:text-[#334155]
                            transition
                            cursor-pointer
                            text-xl
                            disabled:opacity-50
                        "
                    >
                        ×
                    </button>

                </div>


                {/* ================================================= */}
                {/* FORM */}
                {/* ================================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* UNIT NAME */}

                    <div>

                        <label
                            className="
                                block
                                text-sm
                                font-extrabold
                                text-[#475569]
                                mb-2
                            "
                        >
                            اسم الوحدة
                        </label>


                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(
                                    e.target.value
                                )
                            }
                            placeholder="
                                مثال: كيلو، متر، قطعة
                            "
                            autoFocus
                            disabled={loading}
                            className="
                                w-full
                                rounded-lg
                                border
                                border-[#CBD5E1]
                                bg-[#F8FAFC]
                                px-4
                                py-3
                                text-[#334155]
                                placeholder:text-[#94A3B8]
                                outline-none
                                transition
                                focus:border-[#64748B]
                                focus:ring-2
                                focus:ring-[#CBD5E1]
                                disabled:opacity-60
                            "
                        />

                    </div>


                    {/* ================================================= */}
                    {/* ERROR */}
                    {/* ================================================= */}

                    {error && (

                        <div
                            className="
                                rounded-lg
                                border
                                border-red-200
                                bg-red-50
                                px-4
                                py-3
                            "
                        >

                            <p
                                className="
                                    text-sm
                                    text-red-600
                                    text-center
                                "
                            >
                                {error}
                            </p>

                        </div>

                    )}


                    {/* ================================================= */}
                    {/* SUCCESS */}
                    {/* ================================================= */}

                    {message && (

                        <div
                            className="
                                rounded-lg
                                border
                                border-green-200
                                bg-green-50
                                px-4
                                py-3
                            "
                        >

                            <p
                                className="
                                    text-sm
                                    text-green-700
                                    text-center
                                    font-medium
                                "
                            >
                                {message}
                            </p>

                        </div>

                    )}


                    {/* ================================================= */}
                    {/* BUTTONS */}
                    {/* ================================================= */}

                    <div
                        className="
                            flex
                            gap-3
                            pt-2
                        "
                    >

                        {/* CANCEL */}

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="
                                flex-1
                                border
                                border-[#CBD5E1]
                                bg-white
                                text-[#475569]
                                font-extrabold
                                py-3
                                rounded-lg
                                hover:bg-[#F8FAFC]
                                transition
                                cursor-pointer
                                disabled:opacity-50
                            "
                        >
                            إلغاء
                        </button>


                        {/* SAVE */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                flex-1
                                bg-[#475569]
                                hover:bg-[#334155]
                                text-white
                                font-extrabold
                                py-3
                                rounded-lg
                                transition
                                cursor-pointer
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                            "
                        >

                            {loading
                                ? "جاري الحفظ..."
                                : "حفظ الوحدة"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};


export default AddUnit;