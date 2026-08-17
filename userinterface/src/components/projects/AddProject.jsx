import React, {
    useEffect,
    useState,
} from "react";

import { authFetch } from "../../utils/auth";

const BASE =
    import.meta.env.VITE_DJANGO_BASE_URL;

const AddProject = ({
    onClose,
    onSuccess,
}) => {

    // =========================================================
    // FORM STATE
    // =========================================================

    const [name, setName] =
        useState("");

    const [owner, setOwner] =
        useState("");

    const [location, setLocation] =
        useState("");

    const [area, setArea] =
        useState("");

    const [status, setStatus] =
        useState("preparation");

    const [cost, setCost] =
        useState(0);

    const [startedDate, setStartedDate] =
        useState("");

    const [initialDelivery, setInitialDelivery] =
        useState("");

    const [finalDelivery, setFinalDelivery] =
        useState("");

    // =========================================================
    // OWNERS
    // =========================================================

    const [owners, setOwners] =
        useState([]);

    const [ownersLoading, setOwnersLoading] =
        useState(true);

    // =========================================================
    // UI
    // =========================================================

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    // =========================================================
    // COMMON STYLES
    // =========================================================

    const inputClass = `
        w-full
        h-11
        px-4
        rounded-xl
        border
        border-gray-300
        bg-white
        text-gray-800
        text-sm
        outline-none
        transition-all
        duration-200
        placeholder:text-gray-400
        hover:border-gray-400
        focus:border-green-500
        focus:ring-4
        focus:ring-green-500/10
        disabled:bg-gray-100
        disabled:text-gray-400
        disabled:cursor-not-allowed
        shadow-md
    `;

    const labelClass = `
        block
        mb-2
        text-sm
        font-semibold
        text-gray-700
    `;

    // =========================================================
    // STATUS LABEL
    // =========================================================

    const getStatusLabel = (value) => {

        switch (value) {

            case "preparation":
                return "تحضير";

            case "started":
                return "بدايه";

            case "construction":
                return "قيد الإنشاء";

            case "initial-delivery":
                return "التسليم الأولي";

            case "final-delivery":
                return "التسليم النهائي";

            default:
                return value;
        }
    };

    // =========================================================
    // FETCH OWNERS ONLY
    // =========================================================

    const fetchOwners = async () => {

        setOwnersLoading(true);

        try {

            /*
             * Backend should filter:
             *
             * /api/contacts/?owner=true
             */

            const response =
                await authFetch(
                    `${BASE}/api/contacts/?owner=true`,
                    {
                        method: "GET",
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                console.error(
                    "Fetch owners response:",
                    data
                );

                throw new Error(
                    `Failed to fetch owners: ${response.status}`
                );
            }

            /*
             * Supports:
             *
             * [
             *   {...}
             * ]
             *
             * OR:
             *
             * {
             *   count: 10,
             *   next: "...",
             *   previous: null,
             *   results: [...]
             * }
             */

            const contacts =
                Array.isArray(data)
                    ? data
                    : Array.isArray(data?.results)
                        ? data.results
                        : [];

            /*
             * Extra frontend protection:
             *
             * If backend accidentally returns suppliers,
             * only contacts with owner === true are displayed.
             */

            const ownerContacts =
                contacts.filter(
                    (contact) =>
                        contact.owner === true ||
                        contact.owner === 1 ||
                        contact.owner === "true"
                );

            setOwners(ownerContacts);

        } catch (error) {

            console.error(
                "Error fetching owners:",
                error
            );

            setOwners([]);

            setError(
                "تعذر تحميل الملاك"
            );

        } finally {

            setOwnersLoading(false);
        }
    };

    // =========================================================
    // LOAD OWNERS
    // =========================================================

    useEffect(() => {

        fetchOwners();

    }, []);

    // =========================================================
    // VALIDATE DATES
    // =========================================================

    const validateDates = () => {

        if (
            startedDate &&
            initialDelivery &&
            initialDelivery < startedDate
        ) {

            setError(
                "تاريخ التسليم الأولي يجب أن يكون بعد تاريخ بدء المشروع"
            );

            return false;
        }

        if (
            initialDelivery &&
            finalDelivery &&
            finalDelivery < initialDelivery
        ) {

            setError(
                "تاريخ التسليم النهائي يجب أن يكون بعد تاريخ التسليم الأولي"
            );

            return false;
        }

        return true;
    };

    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        // -----------------------------------------------------
        // REQUIRED VALIDATION
        // -----------------------------------------------------

        if (!name.trim()) {

            setError(
                "يرجى إدخال اسم المشروع"
            );

            return;
        }

        if (!owner) {

            setError(
                "يرجى اختيار المالك"
            );

            return;
        }

        if (!location.trim()) {

            setError(
                "يرجى إدخال موقع المشروع"
            );

            return;
        }

        if (!area.trim()) {

            setError(
                "يرجى إدخال مساحة المشروع"
            );

            return;
        }

        if (cost === "") {

            setError(
                "يرجى إدخال تكلفة المشروع"
            );

            return;
        }

        if (!startedDate) {

            setError(
                "يرجى إدخال تاريخ بدء المشروع"
            );

            return;
        }

        if (!initialDelivery) {

            setError(
                "يرجى إدخال تاريخ التسليم الأولي"
            );

            return;
        }

        if (!finalDelivery) {

            setError(
                "يرجى إدخال تاريخ التسليم النهائي"
            );

            return;
        }

        if (!validateDates()) {
            return;
        }

        // -----------------------------------------------------
        // START LOADING
        // -----------------------------------------------------

        setLoading(true);

        try {

            const response =
                await authFetch(
                    `${BASE}/api/projects/add/`,
                    {
                        method: "POST",

                        body: JSON.stringify({

                            name:
                                name.trim(),

                            owner:
                                Number(owner),

                            location:
                                location.trim(),

                            area:
                                area.trim(),

                            status,

                            cost,

                            started_date:
                                startedDate,

                            initial_delivery:
                                initialDelivery,

                            final_delivery:
                                finalDelivery,
                        }),
                    }
                );

            const data =
                await response.json();

            // -------------------------------------------------
            // ERROR
            // -------------------------------------------------

            if (!response.ok) {

                console.error(
                    "Create project response:",
                    data
                );

                if (
                    data &&
                    typeof data === "object"
                ) {

                    const firstError =
                        Object.values(data)?.[0];

                    setError(
                        Array.isArray(firstError)
                            ? firstError[0]
                            : typeof firstError === "string"
                                ? firstError
                                : "حدث خطأ أثناء إضافة المشروع"
                    );

                } else {

                    setError(
                        "حدث خطأ أثناء إضافة المشروع"
                    );
                }

                return;
            }

            // -------------------------------------------------
            // SUCCESS
            // -------------------------------------------------

            if (onSuccess) {

                onSuccess(
                    data.project || data
                );
            }

        } catch (error) {

            console.error(
                "Add project error:",
                error
            );

            setError(
                "تعذر الاتصال بالخادم"
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
                z-50
                flex
                items-center
                justify-center
                bg-black/50
                backdrop-blur-[2px]
                p-4
            "
        >

            <div
                className="
                    w-full
                    max-w-2xl
                    max-h-[95vh]
                    overflow-hidden
                    bg-white
                    rounded-2xl
                    shadow-2xl
                    border
                    border-gray-100
                "
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        px-6
                        py-5
                        border-b
                        border-gray-100
                        bg-gray-50/70
                        shadow-lg
                    "
                >

                    <div>

                        <h2
                            className="
                                text-xl
                                font-extrabold
                                text-gray-800
                            "
                        >
                            إضافة مشروع جديد
                        </h2>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-gray-500
                            "
                        >
                            أدخل بيانات المشروع الأساسية
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="إغلاق"
                        className="
                            flex
                            items-center
                            justify-center
                            w-9
                            h-9
                            rounded-full
                            text-2xl
                            text-gray-400
                            hover:text-gray-700
                            hover:bg-gray-200
                            transition
                            disabled:opacity-50
                        "
                    >
                        ×
                    </button>

                </div>

                {/* =================================================
                    FORM SCROLL AREA
                ================================================= */}

                <div
                    className="
                        max-h-[calc(95vh-85px)]
                        overflow-y-auto
                    "
                >

                    <form
                        onSubmit={handleSubmit}
                        className="
                            p-6
                            space-y-5
                        "
                    >

                        {/* =================================================
                            PROJECT NAME
                        ================================================= */}

                        <div>

                            <label
                                className={labelClass}
                            >
                                اسم المشروع
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(e) =>
                                    setName(
                                        e.target.value
                                    )
                                }
                                placeholder="أدخل اسم المشروع"
                                className={inputClass}
                                disabled={loading}
                            />

                        </div>

                        {/* =================================================
                            OWNER
                        ================================================= */}

                        <div>

                            <label
                                className={labelClass}
                            >
                                المالك
                            </label>

                            <select
                                value={owner}
                                onChange={(e) =>
                                    setOwner(
                                        e.target.value
                                    )
                                }
                                disabled={
                                    ownersLoading ||
                                    loading
                                }
                                className={`
                                    ${inputClass}
                                    cursor-pointer
                                `}
                            >

                                <option value="">

                                    {ownersLoading
                                        ? "جاري تحميل الملاك..."
                                        : owners.length === 0
                                            ? "لا يوجد ملاك"
                                            : "اختر المالك"}

                                </option>

                                {owners.map(
                                    (contact) => (

                                        <option
                                            key={
                                                contact.id
                                            }
                                            value={
                                                contact.id
                                            }
                                        >
                                            {
                                                contact.name
                                            }
                                        </option>

                                    )
                                )}

                            </select>

                            {!ownersLoading &&
                                owners.length === 0 && (

                                    <p
                                        className="
                                            mt-2
                                            text-xs
                                            text-amber-600
                                        "
                                    >
                                        لا توجد جهات اتصال مسجلة كمالك.
                                    </p>

                                )}

                        </div>

                        {/* =================================================
                            LOCATION + AREA
                        ================================================= */}

                        <div
                            className="
                                grid
                                grid-cols-1
                                md:grid-cols-2
                                gap-4
                            "
                        >

                            <div>

                                <label
                                    className={labelClass}
                                >
                                    الموقع
                                </label>

                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) =>
                                        setLocation(
                                            e.target.value
                                        )
                                    }
                                    placeholder="موقع المشروع"
                                    className={inputClass}
                                    disabled={loading}
                                />

                            </div>

                            <div>

                                <label
                                    className={labelClass}
                                >
                                    المساحة
                                </label>

                                <input
                                    type="text"
                                    value={area}
                                    onChange={(e) =>
                                        setArea(
                                            e.target.value
                                        )
                                    }
                                    placeholder="مثال: 5000 متر"
                                    className={inputClass}
                                    disabled={loading}
                                />

                            </div>

                        </div>

                        {/* =================================================
                            COST
                        ================================================= */}

                        <div>

                            <label
                                className={labelClass}
                            >
                                التكلفة
                            </label>

                            <div
                                className="
                                    relative
                                "
                            >

                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={cost}
                                    onChange={(e) =>
                                        setCost(
                                            e.target.value
                                        )
                                    }
                                    placeholder="0.00"
                                    className={`
                                        ${inputClass}
                                        pl-16
                                    `}
                                    disabled={loading}
                                />

                                <span
                                    className="
                                        absolute
                                        left-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-xs
                                        text-gray-400
                                        pointer-events-none
                                    "
                                >
                                    المبلغ
                                </span>

                            </div>

                        </div>

                        {/* =================================================
                            STATUS
                        ================================================= */}

                        <div>

                            <label
                                className={labelClass}
                            >
                                حالة المشروع
                            </label>

                            <select
                                value={status}
                                onChange={(e) =>
                                    setStatus(
                                        e.target.value
                                    )
                                }
                                disabled={loading}
                                className={`
                                    ${inputClass}
                                    cursor-pointer
                                `}
                            >

                                <option value="preparation">
                                    تحضير
                                </option>

                                <option value="started">
                                    بدأ
                                </option>

                                <option value="construction">
                                    قيد الإنشاء
                                </option>

                                <option value="initial-delivery">
                                    التسليم الأولي
                                </option>

                                <option value="final-delivery">
                                    التسليم النهائي
                                </option>

                            </select>

                        </div>

                        {/* =================================================
                            DATES
                        ================================================= */}

                        <div>

                            <label
                                className={labelClass}
                            >
                                الجدول الزمني للمشروع
                            </label>

                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    md:grid-cols-3
                                    gap-4
                                    p-4
                                    rounded-xl
                                    bg-gray-50
                                    border
                                    border-gray-100
                                "
                            >

                                {/* START DATE */}

                                <div>

                                    <label
                                        className="
                                            block
                                            mb-2
                                            text-xs
                                            font-medium
                                            text-gray-500
                                        "
                                    >
                                        تاريخ البدء
                                    </label>

                                    <input
                                        type="date"
                                        value={
                                            startedDate
                                        }
                                        onChange={(e) =>
                                            setStartedDate(
                                                e.target.value
                                            )
                                        }
                                        className={inputClass}
                                        disabled={loading}
                                    />

                                </div>

                                {/* INITIAL DELIVERY */}

                                <div>

                                    <label
                                        className="
                                            block
                                            mb-2
                                            text-xs
                                            font-medium
                                            text-gray-500
                                        "
                                    >
                                        التسليم الأولي
                                    </label>

                                    <input
                                        type="date"
                                        value={
                                            initialDelivery
                                        }
                                        min={
                                            startedDate ||
                                            undefined
                                        }
                                        onChange={(e) =>
                                            setInitialDelivery(
                                                e.target.value
                                            )
                                        }
                                        className={inputClass}
                                        disabled={loading}
                                    />

                                </div>

                                {/* FINAL DELIVERY */}

                                <div>

                                    <label
                                        className="
                                            block
                                            mb-2
                                            text-xs
                                            font-medium
                                            text-gray-500
                                        "
                                    >
                                        التسليم النهائي
                                    </label>

                                    <input
                                        type="date"
                                        value={
                                            finalDelivery
                                        }
                                        min={
                                            initialDelivery ||
                                            undefined
                                        }
                                        onChange={(e) =>
                                            setFinalDelivery(
                                                e.target.value
                                            )
                                        }
                                        className={inputClass}
                                        disabled={loading}
                                    />

                                </div>

                            </div>

                        </div>

                        {/* =================================================
                            ERROR
                        ================================================= */}

                        {error && (

                            <div
                                className="
                                    flex
                                    items-start
                                    gap-3
                                    p-4
                                    rounded-xl
                                    bg-red-50
                                    border
                                    border-red-100
                                    text-red-600
                                    text-sm
                                "
                            >

                                <span
                                    className="
                                        flex-shrink-0
                                        font-bold
                                    "
                                >
                                    !
                                </span>

                                <span>
                                    {error}
                                </span>

                            </div>

                        )}

                        {/* =================================================
                            ACTIONS
                        ================================================= */}

                        <div
                            className="
                                flex
                                items-center
                                justify-end
                                gap-3
                                pt-3
                                border-t
                                border-gray-100
                            "
                        >

                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="
                                    h-11
                                    px-5
                                    rounded-xl
                                    border
                                    border-gray-200
                                    bg-white
                                    text-gray-700
                                    text-sm
                                    font-extrabold
                                    hover:bg-gray-50
                                    hover:border-gray-300
                                    transition-all
                                    duration-200
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                "
                            >
                                إلغاء
                            </button>

                            <button
                                type="submit"
                                disabled={
                                    loading ||
                                    ownersLoading ||
                                    owners.length === 0
                                }
                                className="
                                    h-11
                                    px-6
                                    rounded-xl
                                    bg-green-600
                                    text-white
                                    text-sm
                                    font-extrabold
                                    shadow-sm
                                    hover:bg-green-700
                                    hover:shadow
                                    active:scale-[0.98]
                                    transition-all
                                    duration-200
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                "
                            >

                                {loading ? (

                                    <span
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                        "
                                    >

                                        <span
                                            className="
                                                w-4
                                                h-4
                                                border-2
                                                border-white/40
                                                border-t-white
                                                rounded-full
                                                animate-spin
                                            "
                                        />

                                        جاري الحفظ...

                                    </span>

                                ) : (
                                    "إضافة المشروع"
                                )}

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
};

export default AddProject;