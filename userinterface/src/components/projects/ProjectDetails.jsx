import React, {
    useEffect,
    useState,
} from "react";

import { authFetch } from "../../utils/auth";

const BASE =
    import.meta.env.VITE_DJANGO_BASE_URL;

const ProjectDetails = ({
    project,
    onClose,
    onUpdated,
}) => {

    // =========================================================
    // STATE
    // =========================================================

    const [name, setName] =
        useState(project.name || "");

    const [owner, setOwner] =
        useState(
            project.owner
                ? String(project.owner)
                : ""
        );

    const [location, setLocation] =
        useState(project.location || "");

    const [area, setArea] =
        useState(project.area || "");

    const [cost, setCost] =
        useState(project.cost || "");

    const [status, setStatus] =
        useState(
            project.status || "preparation"
        );

    const [startedDate, setStartedDate] =
        useState(
            project.started_date || ""
        );

    const [
        initialDelivery,
        setInitialDelivery,
    ] = useState(
        project.initial_delivery || ""
    );

    const [
        finalDelivery,
        setFinalDelivery,
    ] = useState(
        project.final_delivery || ""
    );

    const [owners, setOwners] =
        useState([]);

    const [ownersLoading, setOwnersLoading] =
        useState(true);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    // =========================================================
    // STATUS LIST
    // =========================================================

    const statuses = [
        {
            value: "preparation",
            label: "تحضير",
            shortLabel: "تحضير",
        },
        {
            value: "started",
            label: "البداية",
            shortLabel: "البداية",
        },
        {
            value: "construction",
            label: "قيد الإنشاء",
            shortLabel: "إنشاء",
        },
        {
            value: "initial-delivery",
            label: "التسليم الأولي",
            shortLabel: "التسليم الأولي",
        },
        {
            value: "final-delivery",
            label: "التسليم النهائي",
            shortLabel: "التسليم النهائي",
        },
    ];

    // =========================================================
    // GET CURRENT STATUS INDEX
    // =========================================================

    const currentStatusIndex =
        statuses.findIndex(
            (item) =>
                item.value === status
        );

    // =========================================================
    // FETCH OWNERS ONLY
    // =========================================================

    const fetchOwners = async () => {

        setOwnersLoading(true);

        try {

            const response =
                await authFetch(
                    `${BASE}/api/contacts/?owner=true`,
                    {
                        method: "GET",
                    }
                );

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch owners: ${response.status}`
                );
            }

            const data =
                await response.json();

            const contacts =
                Array.isArray(data)
                    ? data
                    : data.results || [];

            /*
             * Extra frontend protection:
             *
             * Even if the backend returns contacts
             * without respecting ?owner=true,
             * only contacts where owner === true
             * will be displayed.
             */

            const ownerContacts =
                contacts.filter(
                    (contact) =>
                        contact.owner === true ||
                        contact.owner === 1
                );

            setOwners(ownerContacts);

        } catch (error) {

            console.error(
                "Error fetching owners:",
                error
            );

            setError(
                "تعذر تحميل الملاك"
            );

        } finally {

            setOwnersLoading(false);
        }
    };

    useEffect(() => {
        fetchOwners();
    }, []);

    // =========================================================
    // STATUS CLICK
    // =========================================================

    const handleStatusClick = (
        selectedStatus
    ) => {

        setStatus(selectedStatus);

        /*
         * When project moves to STARTED,
         * automatically set today's date
         * if no started date exists.
         */

        if (
            selectedStatus ===
            "started"
        ) {

            if (!startedDate) {

                const today =
                    new Date()
                        .toISOString()
                        .split("T")[0];

                setStartedDate(today);
            }
        }
    };

    // =========================================================
    // UPDATE PROJECT
    // =========================================================

    const handleUpdate = async (e) => {

        e.preventDefault();

        setError("");

        // -----------------------------------------------------
        // VALIDATION
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
                "يرجى إدخال الموقع"
            );

            return;
        }

        if (!area.trim()) {

            setError(
                "يرجى إدخال المساحة"
            );

            return;
        }

        if (cost === "") {

            setError(
                "يرجى إدخال التكلفة"
            );

            return;
        }

        // -----------------------------------------------------
        // STARTED DATE
        // -----------------------------------------------------

        if (
            status === "started" &&
            !startedDate
        ) {

            setError(
                "يجب إدخال تاريخ بدء المشروع"
            );

            return;
        }

        // -----------------------------------------------------
        // INITIAL DELIVERY
        // -----------------------------------------------------

        if (
            status === "initial-delivery" &&
            !initialDelivery
        ) {

            setError(
                "يجب إدخال تاريخ التسليم الأولي"
            );

            return;
        }

        // -----------------------------------------------------
        // FINAL DELIVERY
        // -----------------------------------------------------

        if (
            status === "final-delivery" &&
            !finalDelivery
        ) {

            setError(
                "يجب إدخال تاريخ التسليم النهائي"
            );

            return;
        }

        // -----------------------------------------------------
        // DATE VALIDATION
        // -----------------------------------------------------

        if (
            startedDate &&
            initialDelivery &&
            initialDelivery < startedDate
        ) {

            setError(
                "تاريخ التسليم الأولي يجب أن يكون بعد تاريخ البدء"
            );

            return;
        }

        if (
            initialDelivery &&
            finalDelivery &&
            finalDelivery < initialDelivery
        ) {

            setError(
                "تاريخ التسليم النهائي يجب أن يكون بعد تاريخ التسليم الأولي"
            );

            return;
        }

        // -----------------------------------------------------
        // UPDATE
        // -----------------------------------------------------

        setLoading(true);

        try {

            const response =
                await authFetch(
                    `${BASE}/api/projects/${project.id}/update/`,
                    {
                        method: "PATCH",

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

            if (!response.ok) {

                console.error(
                    "Update project response:",
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
                            : "حدث خطأ أثناء تحديث المشروع"
                    );

                } else {

                    setError(
                        "حدث خطأ أثناء تحديث المشروع"
                    );
                }

                return;
            }

            const updatedProject =
                data.project || data;

            if (onUpdated) {

                onUpdated(
                    updatedProject
                );
            }

        } catch (error) {

            console.error(
                "Update project error:",
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
            className="
                fixed
                inset-0
                z-50
                bg-black/60
                backdrop-blur-[2px]
                flex
                items-center
                justify-center
                p-2
                sm:p-4
            "
        >

            {/* =================================================
                MODAL
            ================================================= */}

            <div
                className="
                    w-full
                    max-w-5xl

                    max-h-[98vh]
                    sm:max-h-[95vh]

                    overflow-hidden

                    bg-white

                    rounded-xl
                    sm:rounded-2xl

                    shadow-2xl

                    flex
                    flex-col
                "
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div
                    className="
                        shrink-0
                        
                        flex
                        items-center
                        justify-between

                        gap-3

                        px-4
                        py-4

                        sm:px-6
                        sm:py-5

                        shadow-xl
                        bg-gray-200
                        shadow-[-2px_0_8px_rgba(0,0,0,0.10)]
                    "
                >

                    <div className="min-w-0">

                        <h2
                            className="
                                text-lg
                                sm:text-xl
                                font-extrabold
                                text-gray-800
                                truncate
                            "
                        >
                            تفاصيل المشروع
                        </h2>

                        <p
                            className="
                                text-xs
                                sm:text-sm
                                text-gray-500
                                mt-1
                                truncate
                            "
                        >
                            #{project.id}
                            {" — "}
                            {project.name}
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            shrink-0

                            w-9
                            h-9

                            sm:w-10
                            sm:h-10

                            rounded-full

                            bg-gray-100
                            text-gray-500

                            text-xl

                            flex
                            items-center
                            justify-center

                            hover:bg-gray-200
                            hover:text-gray-700

                            active:scale-95

                            transition
                        "
                    >
                        ×
                    </button>

                </div>

                {/* =================================================
                    SCROLLABLE CONTENT
                ================================================= */}

                <div
                    className="
                        overflow-y-auto
                        overscroll-contain
                    "
                >

                    {/* =================================================
                        STATUS
                    ================================================= */}

                    <div
                        className="
                            px-3
                            py-4

                            sm:px-6
                            sm:py-6

                            bg-gray-50
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-2
                                mb-4
                                sm:mb-5
                            "
                        >

                            <h3
                                className="
                                    text-sm
                                    sm:text-base
                                    font-extrabold
                                    text-gray-700
                                    
                                "
                            >
                                المشروع حاليا :
                            </h3>

                            <span
                                className="
                                    text-xs
                                    sm:text-sm
                                    text-green-700
                                    bg-green-100
                                    px-2.5
                                    py-1
                                    rounded-full
                                    font-medium
                                "
                            >
                                {
                                    statuses[
                                        currentStatusIndex
                                    ]?.label ||
                                    status
                                }
                            </span>

                        </div>

                        {/* STATUS GRID */}

                        <div
                            className="
                                grid
                                grid-cols-2
                                sm:grid-cols-3
                                lg:grid-cols-5

                                gap-2
                                sm:gap-3
                            "
                        >

                            {statuses.map(
                                (
                                    item,
                                    index
                                ) => {

                                    const active =
                                        status ===
                                        item.value;

                                    const completed =
                                        currentStatusIndex >=
                                        index;

                                    return (

                                        <button
                                            key={
                                                item.value
                                            }
                                            type="button"
                                            onClick={() =>
                                                handleStatusClick(
                                                    item.value
                                                )
                                            }
                                            className={`
                                                relative

                                                min-h-[92px]
                                                sm:min-h-[110px]

                                                rounded-md

                                                p-2.5
                                                sm:p-3

                                                transition-all
                                                duration-200

                                                border-2

                                                active:scale-[0.97]
                                                 shadow-xl
                                                ${
                                                    active
                                                        ? "border-green-600 bg-green-50 shadow-sm"
                                                        : completed
                                                        ? "border-green-300 bg-green-50/70"
                                                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                                                }
                                            `}
                                        >

                                            {/* NUMBER */}

                                            <div
                                                className={`
                                                    mx-auto

                                                    w-9
                                                    h-9

                                                    sm:w-10
                                                    sm:h-10

                                                    rounded-lg

                                                    flex
                                                    items-center
                                                    justify-center

                                                    font-bold

                                                    text-sm
                                                    sm:text-base

                                                    ${
                                                        active
                                                            ? "bg-green-600 text-white shadow-sm"
                                                            : completed
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-gray-100 text-gray-500"
                                                    }
                                                `}
                                            >
                                                {index + 1}
                                            </div>

                                            {/* LABEL */}

                                            <div
                                                className={`
                                                    mt-2

                                                    text-[15px]
                                                    sm:text-xs

                                                    leading-4

                                                    font-extrabold

                                                    ${
                                                        active
                                                            ? "text-green-700"
                                                            : completed
                                                            ? "text-green-700"
                                                            : "text-gray-600"
                                                    }
                                                `}
                                            >
                                                <span className="sm:hidden">
                                                    {
                                                        item.shortLabel
                                                    }
                                                </span>

                                                <span className="hidden sm:inline">
                                                    {
                                                        item.label
                                                    }
                                                </span>
                                            </div>

                                            {/* ACTIVE INDICATOR */}

                                            {active && (
                                                <div
                                                    className="
                                                        absolute
                                                        top-2
                                                        right-2

                                                        w-3
                                                        h-3

                                                        rounded-full
                                                        bg-red-600
                                                    "
                                                />
                                            )}

                                        </button>
                                    );
                                }
                            )}

                        </div>

                    </div>

                    {/* =================================================
                        FORM
                    ================================================= */}

                    <form
                        onSubmit={
                            handleUpdate
                        }
                        className="
                            p-4
                            sm:p-6

                            space-y-6
                        "
                    >

                        {/* =================================================
                            PROJECT INFORMATION
                        ================================================= */}

                        <section>

                            <h3
                                className="
                                    text-sm
                                    sm:text-base
                                    font-extrabold
                                    text-gray-800
                                    mb-4
                                    flex
                                    items-center
                                    gap-2
                                    
                                "
                            >

                                <span
                                    className="
                                        w-1
                                        h-10
                                        rounded-full
                                        bg-red-600
                                    "
                                />

                                بيانات المشروع

                            </h3>

                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    md:grid-cols-2

                                    gap-4
                                "
                            >

                                {/* NAME */}

                                <div>

                                    <label
                                        className="
                                            block
                                            text-lg
                                            font-extrabold
                                            text-gray-700
                                            mb-1.5
                                        "
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
                                        className="
                                            w-full
                                            h-11
                                            px-3
                                            sm:px-4
                                            rounded-xl
                                            border
                                            border-gray-300
                                            bg-white
                                            text-sm
                                            text-gray-800
                                            outline-none
                                            transition
                                            focus:border-green-500
                                            focus:ring-2
                                            focus:ring-green-100
                                            placeholder:text-gray-400
                                        "
                                    />

                                </div>

                                {/* OWNER */}

                                <div>

                                    <label
                                        className="
                                            block
                                            text-lg
                                            font-extrabold
                                            text-gray-700
                                            mb-1.5
                                        "
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
                                            ownersLoading
                                        }
                                        className="
                                            w-full

                                            h-11

                                            px-3
                                            sm:px-4

                                            rounded-xl

                                            border
                                            border-gray-300

                                            bg-white

                                            text-sm
                                            text-gray-800

                                            outline-none

                                            transition

                                            focus:border-green-500
                                            focus:ring-2
                                            focus:ring-green-100

                                            disabled:bg-gray-100
                                            disabled:text-gray-400
                                        "
                                    >

                                        <option value="">
                                            {ownersLoading
                                                ? "جاري تحميل الملاك..."
                                                : "اختر المالك"}
                                        </option>

                                        {owners.map(
                                            (
                                                contact
                                            ) => (

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

                                </div>

                                {/* LOCATION */}

                                <div>

                                    <label
                                        className="
                                            block
                                            text-lg
                                            font-extrabold
                                            text-gray-700
                                            mb-1.5
                                        "
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
                                        className="
                                            w-full
                                            h-11

                                            px-3
                                            sm:px-4

                                            rounded-xl

                                            border
                                            border-gray-300

                                            text-sm

                                            outline-none

                                            focus:border-green-500
                                            focus:ring-2
                                            focus:ring-green-100
                                        "
                                    />

                                </div>

                                {/* AREA */}

                                <div>

                                    <label
                                        className="
                                            block
                                            text-lg
                                            font-extrabold
                                            text-gray-700
                                            mb-1.5
                                        "
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
                                        className="
                                            w-full
                                            h-11

                                            px-3
                                            sm:px-4

                                            rounded-xl

                                            border
                                            border-gray-300

                                            text-sm

                                            outline-none

                                            focus:border-green-500
                                            focus:ring-2
                                            focus:ring-green-100
                                        "
                                    />

                                </div>

                                {/* COST */}

                                <div
                                    className="
                                        md:col-span-2
                                    "
                                >

                                    <label
                                        className="
                                            block
                                            text-lg
                                            font-extrabold
                                            text-gray-700
                                            mb-1.5
                                        "
                                    >
                                        التكلفة
                                    </label>

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
                                        className="
                                            w-full
                                            h-11

                                            px-3
                                            sm:px-4

                                            rounded-xl

                                            border
                                            border-gray-300

                                            text-sm

                                            outline-none

                                            focus:border-green-500
                                            focus:ring-2
                                            focus:ring-green-100
                                        "
                                    />

                                </div>

                            </div>

                        </section>

                        {/* =================================================
                            DATES
                        ================================================= */}

                        <section>

                            <h3
                                className="
                                    text-sm
                                    sm:text-base

                                    font-extrabold
                                    text-gray-800

                                    mb-4
   
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                <span
                                    className="
                                        w-1
                                        h-10
                                        shadow-lg
                                        font-extrabold
                                        bg-green-600
                                    "
                                />

                                تواريخ المشروع

                            </h3>

                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    md:grid-cols-3
                                    
                                    gap-4
                                "
                            >

                                {/* STARTED DATE */}

                                <div>

                                    <label
                                        className={`
                                            block
                                            text-sm
                                            font-extrabold
                                            mb-1.5

                                            ${
                                                status ===
                                                "started"
                                                    ? "text-blue-700"
                                                    : "text-gray-700"
                                            }
                                        `}
                                    >
                                        تاريخ بدء المشروع
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
                                        className={`
                                            w-full
                                            h-11

                                            px-3
                                            sm:px-4

                                            rounded-xl

                                            border

                                            text-sm
                                           
                                            outline-none

                                            transition

                                            ${
                                                status ===
                                                "started"
                                                    ? "border-blue-500 ring-2 ring-blue-100"
                                                    : "border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                            }
                                        `}
                                    />

                                    {status ===
                                        "started" && (

                                        <p
                                            className="
                                                text-md
                                                text-green-600
                                                mt-1.5
                                                font-extrabold
                                            "
                                        >
                                            تاريخ المرحلة الحالية
                                        </p>

                                    )}

                                </div>

                                {/* INITIAL DELIVERY */}

                                <div>

                                    <label
                                        className={`
                                            block
                                            text-sm
                                            font-extrabold
                                            mb-1.5

                                            ${
                                                status ===
                                                "initial-delivery"
                                                    ? "text-purple-700"
                                                    : "text-gray-700"
                                            }
                                        `}
                                    >
                                        تاريخ التسليم الأولي
                                    </label>

                                    <input
                                        type="date"
                                        value={
                                            initialDelivery
                                        }
                                        onChange={(e) =>
                                            setInitialDelivery(
                                                e.target.value
                                            )
                                        }
                                        className={`
                                            w-full
                                            h-11

                                            px-3
                                            sm:px-4

                                            rounded-xl

                                            border

                                            text-sm

                                            outline-none

                                            ${
                                                status ===
                                                "initial-delivery"
                                                    ? "border-purple-500 ring-2 ring-purple-100"
                                                    : "border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                            }
                                        `}
                                    />

                                    {status ===
                                        "initial-delivery" && (

                                        <p
                                            className="
                                                text-xs
                                                text-purple-600
                                                mt-1.5
                                            "
                                        >
                                            تاريخ التسليم الأولي
                                        </p>

                                    )}

                                </div>

                                {/* FINAL DELIVERY */}

                                <div>

                                    <label
                                        className={`
                                            block
                                            text-sm
                                            font-extrabold
                                            mb-1.5

                                            ${
                                                status ===
                                                "final-delivery"
                                                    ? "text-green-700"
                                                    : "text-gray-700"
                                            }
                                        `}
                                    >
                                        تاريخ التسليم النهائي
                                    </label>

                                    <input
                                        type="date"
                                        value={
                                            finalDelivery
                                        }
                                        onChange={(e) =>
                                            setFinalDelivery(
                                                e.target.value
                                            )
                                        }
                                        className={`
                                            w-full
                                            h-11

                                            px-3
                                            sm:px-4

                                            rounded-xl

                                            border

                                            text-sm

                                            outline-none

                                            ${
                                                status ===
                                                "final-delivery"
                                                    ? "border-green-500 ring-2 ring-green-100"
                                                    : "border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                            }
                                        `}
                                    />

                                    {status ===
                                        "final-delivery" && (

                                        <p
                                            className="
                                                text-xs
                                                text-green-600
                                                mt-1.5
                                            "
                                        >
                                            تاريخ التسليم النهائي
                                        </p>

                                    )}

                                </div>

                            </div>

                        </section>

                        {/* =================================================
                            ERROR
                        ================================================= */}

                        {error && (

                            <div
                                className="
                                    p-3
                                    sm:p-4

                                    rounded-xl

                                    bg-red-50
                                    border
                                    border-red-100

                                    text-red-600

                                    text-xs
                                    sm:text-sm

                                    leading-5
                                "
                            >
                                {error}
                            </div>

                        )}

                        {/* =================================================
                            ACTIONS
                        ================================================= */}

                        <div
                            className="
                                flex

                                flex-col-reverse
                                sm:flex-row

                                justify-end

                                gap-2
                                sm:gap-3

                                pt-4

                                border-t
                            "
                        >

                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="
                                    w-full
                                    sm:w-auto

                                    min-h-[44px]

                                    px-5

                                    rounded-xl

                                    bg-gray-100
                                    text-gray-700

                                    text-sm
                                    font-medium

                                    hover:bg-gray-200

                                    active:scale-[0.98]

                                    transition

                                    disabled:opacity-50
                                "
                            >
                                إغلاق
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="
                                    w-full
                                    sm:w-auto

                                    min-h-[44px]

                                    px-6

                                    rounded-xl

                                    bg-green-600
                                    text-white

                                    text-sm
                                    font-medium

                                    shadow-sm

                                    hover:bg-green-700

                                    active:scale-[0.98]

                                    transition

                                    disabled:opacity-50
                                "
                            >
                                {loading
                                    ? "جاري التحديث..."
                                    : "حفظ التعديلات"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
};

export default ProjectDetails;