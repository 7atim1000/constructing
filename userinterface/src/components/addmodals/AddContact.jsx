import { useState } from "react";

const AddContact = ({
    onClose,
    onContactAdded
}) => {

    const BASE =
        import.meta.env.VITE_DJANGO_BASE_URL;


    // =========================================================
    // FORM STATE
    // =========================================================

    const [name, setName] = useState("");

    const [address, setAddress] = useState("");

    const [phone, setPhone] = useState("");

    const [balance, setBalance] = useState("0");


    // =========================================================
    // CONTACT TYPES
    // =========================================================

    const [owner, setOwner] = useState(false);

    const [supplier, setSupplier] = useState(false);

    const [company, setCompany] = useState(false);

    const [individual, setIndividual] = useState(false);


    // =========================================================
    // UI STATE
    // =========================================================

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");


    // =========================================================
    // CREATE CONTACT
    // =========================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");

        setError("");


        // =====================================================
        // VALIDATION
        // =====================================================

        if (!name.trim()) {

            setError(
                "يرجى إدخال اسم جهة الاتصال."
            );

            return;

        }


        if (!address.trim()) {

            setError(
                "يرجى إدخال العنوان."
            );

            return;

        }


        if (!phone.trim()) {

            setError(
                "يرجى إدخال رقم الهاتف."
            );

            return;

        }


        // =====================================================
        // CONTACT TYPE VALIDATION
        // =====================================================

        if (
            !owner &&
            !supplier &&
            !company &&
            !individual
        ) {

            setError(
                "يجب اختيار نوع جهة اتصال واحد على الأقل."
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
            // REQUEST BODY
            // =================================================

            const body = {

                name: name.trim(),

                address: address.trim(),

                phone: phone.trim(),

                balance:
                    balance.trim() === ""
                        ? "0"
                        : balance.trim(),

                owner: owner,

                supplier: supplier,

                company: company,

                individual: individual,

            };


            console.log(
                "Creating contact:",
                body
            );


            // =================================================
            // POST REQUEST
            // =================================================

            const response =
                await fetch(
                    `${BASE}/api/contacts/add/`,
                    {
                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`,

                        },

                        body:
                            JSON.stringify(body),

                    }
                );


            // =================================================
            // RESPONSE
            // =================================================

            const data = await response.json();

            console.log("CREATE CONTACT RESPONSE:", data);

            if (!response.ok) {

            }

            onContactAdded?.(data);


            // =================================================
            // ERROR
            // =================================================

            if (!response.ok) {

                console.error(
                    "Create contact error:",
                    data
                );


                if (
                    data?.name?.[0]
                ) {

                    setError(
                        data.name[0]
                    );

                } else if (
                    data?.address?.[0]
                ) {

                    setError(
                        data.address[0]
                    );

                } else if (
                    data?.phone?.[0]
                ) {

                    setError(
                        data.phone[0]
                    );

                } else if (
                    data?.balance?.[0]
                ) {

                    setError(
                        data.balance[0]
                    );

                } else if (
                    data?.contact_type?.[0]
                ) {

                    setError(
                        data.contact_type[0]
                    );

                } else if (
                    data?.detail
                ) {

                    setError(
                        data.detail
                    );

                } else {

                    setError(
                        "فشل إنشاء جهة الاتصال."
                    );

                }


                return;

            }


            // =================================================
            // SUCCESS
            // =================================================

            console.log(
                "Contact created successfully:",
                data
            );


            setMessage(
                "تم إنشاء جهة الاتصال بنجاح."
            );


            // =================================================
            // IMPORTANT
            // =================================================
            //
            // Send created contact to Contacts.jsx
            // immediately.
            //
            // =================================================

            if (onContactAdded) {

                onContactAdded(data);

            }


            // =================================================
            // RESET FORM
            // =================================================

            setName("");

            setAddress("");

            setPhone("");

            setBalance("0");

            setOwner(false);

            setSupplier(false);

            setCompany(false);

            setIndividual(false);


        } catch (error) {

            console.error(
                "Error creating contact:",
                error
            );


            setError(
                "حدث خطأ أثناء إنشاء جهة الاتصال."
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
                py-6
            "
        >

            {/* ================================================= */}
            {/* MODAL */}
            {/* ================================================= */}

            <div
                className="
                    w-full
                    max-w-2xl
                    max-h-[90vh]
                    overflow-y-auto
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
                                sm:text-2xl
                                font-extrabold
                                text-[#334155]
                            "
                        >
                            إضافة جهة اتصال جديدة
                        </h2>


                        <p
                            className="
                                text-sm
                                text-[#64748B]
                                mt-1
                            "
                        >
                            أدخل بيانات جهة الاتصال
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

                    {/* ================================================= */}
                    {/* NAME */}
                    {/* ================================================= */}

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
                            الاسم
                        </label>


                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(
                                    e.target.value
                                )
                            }
                            placeholder="اسم جهة الاتصال"
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
                    {/* ADDRESS */}
                    {/* ================================================= */}

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
                            العنوان
                        </label>


                        <input
                            type="text"
                            value={address}
                            onChange={(e) =>
                                setAddress(
                                    e.target.value
                                )
                            }
                            placeholder="عنوان جهة الاتصال"
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
                    {/* PHONE + BALANCE */}
                    {/* ================================================= */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            gap-4
                        "
                    >

                        {/* PHONE */}

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
                                الهاتف
                            </label>


                            <input
                                type="text"
                                value={phone}
                                onChange={(e) =>
                                    setPhone(
                                        e.target.value
                                    )
                                }
                                placeholder="رقم الهاتف"
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


                        {/* BALANCE */}

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
                                الرصيد
                            </label>


                            <input
                                type="number"
                                step="0.01"
                                value={balance}
                                onChange={(e) =>
                                    setBalance(
                                        e.target.value
                                    )
                                }
                                placeholder="0.00"
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

                    </div>


                    {/* ================================================= */}
                    {/* CONTACT TYPES */}
                    {/* ================================================= */}

                    <div>

                        <label
                            className="
                                block
                                text-sm
                                font-extrabold
                                text-[#475569]
                                mb-3
                            "
                        >
                            نوع جهة الاتصال
                        </label>


                        <div
                            className="
                                grid
                                grid-cols-2
                                sm:grid-cols-2
                                gap-3
                            "
                        >

                            {/* OWNER */}

                            <label
                                className={`
                                    flex
                                    items-center
                                    gap-2
                                    p-3
                                    rounded-lg
                                    border
                                    cursor-pointer
                                    transition

                                    ${
                                        owner
                                            ? "border-[#606C38] bg-[#E7E9D5] text-[#4F5A2E]"
                                            : "border-[#CBD5E1] bg-[#F8FAFC] text-[#475569] hover:bg-[#F1F5F9]"
                                    }
                                `}
                            >

                                <input
                                    type="checkbox"
                                    checked={owner}
                                    onChange={(e) =>
                                        setOwner(
                                            e.target.checked
                                        )
                                    }
                                    disabled={loading}
                                    className="
                                        w-4
                                        h-4
                                        accent-[#606C38]
                                    "
                                />

                                <span
                                    className="
                                        font-semibold
                                        text-sm
                                    "
                                >
                                    مالك
                                </span>

                            </label>


                            {/* SUPPLIER */}

                            <label
                                className={`
                                    flex
                                    items-center
                                    gap-2
                                    p-3
                                    rounded-lg
                                    border
                                    cursor-pointer
                                    transition

                                    ${
                                        supplier
                                            ? "border-[#606C38] bg-[#E7E9D5] text-[#4F5A2E]"
                                            : "border-[#CBD5E1] bg-[#F8FAFC] text-[#475569] hover:bg-[#F1F5F9]"
                                    }
                                `}
                            >

                                <input
                                    type="checkbox"
                                    checked={supplier}
                                    onChange={(e) =>
                                        setSupplier(
                                            e.target.checked
                                        )
                                    }
                                    disabled={loading}
                                    className="
                                        w-4
                                        h-4
                                        accent-[#606C38]
                                    "
                                />

                                <span
                                    className="
                                        font-semibold
                                        text-sm
                                    "
                                >
                                    مورد
                                </span>

                            </label>


                            {/* COMPANY */}

                            <label
                                className={`
                                    flex
                                    items-center
                                    gap-2
                                    p-3
                                    rounded-lg
                                    border
                                    cursor-pointer
                                    transition

                                    ${
                                        company
                                            ? "border-[#606C38] bg-[#E7E9D5] text-[#4F5A2E]"
                                            : "border-[#CBD5E1] bg-[#F8FAFC] text-[#475569] hover:bg-[#F1F5F9]"
                                    }
                                `}
                            >

                                <input
                                    type="checkbox"
                                    checked={company}
                                    onChange={(e) =>
                                        setCompany(
                                            e.target.checked
                                        )
                                    }
                                    disabled={loading}
                                    className="
                                        w-4
                                        h-4
                                        accent-[#606C38]
                                    "
                                />

                                <span
                                    className="
                                        font-semibold
                                        text-sm
                                    "
                                >
                                    مؤسسة
                                </span>

                            </label>


                            {/* INDIVIDUAL */}

                            <label
                                className={`
                                    flex
                                    items-center
                                    gap-2
                                    p-3
                                    rounded-lg
                                    border
                                    cursor-pointer
                                    transition

                                    ${
                                        individual
                                            ? "border-[#606C38] bg-[#E7E9D5] text-[#4F5A2E]"
                                            : "border-[#CBD5E1] bg-[#F8FAFC] text-[#475569] hover:bg-[#F1F5F9]"
                                    }
                                `}
                            >

                                <input
                                    type="checkbox"
                                    checked={individual}
                                    onChange={(e) =>
                                        setIndividual(
                                            e.target.checked
                                        )
                                    }
                                    disabled={loading}
                                    className="
                                        w-4
                                        h-4
                                        accent-[#606C38]
                                    "
                                />

                                <span
                                    className="
                                        font-semibold
                                        text-sm
                                    "
                                >
                                    فرد
                                </span>

                            </label>

                        </div>

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
                                bg-[#606C38]
                                hover:bg-[#4F5A2E]
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
                                : "حفظ جهة الاتصال"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};


export default AddContact;