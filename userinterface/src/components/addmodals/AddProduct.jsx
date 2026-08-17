import React, { useEffect, useState } from "react";
import { authFetch } from "../../utils/auth";

const BASE = import.meta.env.VITE_DJANGO_BASE_URL;

const AddProduct = ({
    onClose,
    onSuccess,
    categories = [],
    selectedCategory = null,
}) => {
    const [name, setName] = useState("");

    const [category, setCategory] = useState(
        selectedCategory?.id
            ? String(selectedCategory.id)
            : ""
    );

    const [unit, setUnit] = useState("");

    const [price, setPrice] = useState("");

    const [quantity, setQuantity] = useState(0);

    const [units, setUnits] = useState([]);

    const [loading, setLoading] = useState(false);

    const [unitsLoading, setUnitsLoading] = useState(true);

    const [error, setError] = useState("");

    // =========================================================
    // FETCH UNITS
    // =========================================================

    const fetchUnits = async () => {
        setUnitsLoading(true);
        setError("");

        try {
            const response = await authFetch(
                `${BASE}/api/units/`,
                {
                    method: "GET",
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch units: ${response.status}`
                );
            }

            const data = await response.json();

            setUnits(data);

        } catch (error) {
            console.error(
                "Error fetching units:",
                error
            );

            setError(
                "تعذر تحميل الوحدات"
            );

        } finally {
            setUnitsLoading(false);
        }
    };

    // =========================================================
    // LOAD UNITS
    // =========================================================

    useEffect(() => {
        fetchUnits();
    }, []);

    // =========================================================
    // UPDATE SELECTED CATEGORY
    // =========================================================

    useEffect(() => {
        if (selectedCategory?.id) {
            setCategory(
                String(selectedCategory.id)
            );
        }
    }, [selectedCategory]);

    // =========================================================
    // SUBMIT PRODUCT
    // =========================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        // -----------------------------------------------------
        // VALIDATION
        // -----------------------------------------------------

        if (!name.trim()) {
            setError(
                "يرجى إدخال اسم المنتج"
            );
            return;
        }

        if (!category) {
            setError(
                "يرجى اختيار التصنيف"
            );
            return;
        }

        if (!unit) {
            setError(
                "يرجى اختيار الوحدة"
            );
            return;
        }

        if (price === "") {
            setError(
                "يرجى إدخال السعر"
            );
            return;
        }

        if (quantity === "") {
            setError(
                "يرجى إدخال الكمية"
            );
            return;
        }

        // -----------------------------------------------------
        // START LOADING
        // -----------------------------------------------------

        setLoading(true);

        try {
            // -------------------------------------------------
            // CREATE PRODUCT
            // -------------------------------------------------

            const response = await authFetch(
                `${BASE}/api/products/add/`,
                {
                    method: "POST",

                    body: JSON.stringify({
                        name: name.trim(),

                        category: Number(category),

                        unit: Number(unit),

                        price: price,

                        quantity: quantity,
                    }),
                }
            );

            const data = await response.json();

            // -------------------------------------------------
            // HANDLE ERROR
            // -------------------------------------------------

            if (!response.ok) {
                console.error(
                    "Create product response:",
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
                            : "حدث خطأ أثناء إضافة المنتج"
                    );
                } else {
                    setError(
                        "حدث خطأ أثناء إضافة المنتج"
                    );
                }

                return;
            }

            // -------------------------------------------------
            // SUCCESS
            // -------------------------------------------------

            if (onSuccess) {
                onSuccess(data);
            }

        } catch (error) {
            console.error(
                "Add product error:",
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
                    max-w-lg
                    bg-white
                    rounded-2xl
                    shadow-xl
                    overflow-hidden
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
                        py-4
                        border-b
                    "
                >
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">
                            إضافة منتج جديد
                        </h2>

                        {selectedCategory && (
                            <p className="text-xs text-gray-500 mt-1">
                                التصنيف:
                                {" "}
                                <span className="font-medium">
                                    {selectedCategory.name}
                                </span>
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
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

                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="p-6 space-y-4"
                >
                    {/* =================================================
                        PRODUCT NAME
                    ================================================= */}

                    <div>
                        <label
                            className="
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                mb-2
                            "
                        >
                            اسم المنتج
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            placeholder="مثال : اسمنت"
                            className="
                                w-full
                                px-4
                                py-3
                                border
                                border-gray-300
                                rounded-lg
                                outline-none
                                focus:ring-2
                                focus:ring-green-500
                            "
                        />
                    </div>

                    {/* =================================================
                        CATEGORY
                    ================================================= */}

                    <div>
                        <label
                            className="
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                mb-2
                            "
                        >
                            التصنيف
                        </label>

                        <select
                            value={category}
                            onChange={(e) =>
                                setCategory(
                                    e.target.value
                                )
                            }
                            className="
                                w-full
                                px-4
                                py-3
                                border
                                border-gray-300
                                rounded-lg
                                outline-none
                                focus:ring-2
                                focus:ring-green-500
                                bg-white
                            "
                        >
                            <option value="">
                                اختر التصنيف
                            </option>

                            {categories.map(
                                (item) => (
                                    <option
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.name}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {/* =================================================
                        UNIT
                    ================================================= */}

                    <div>
                        <label
                            className="
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                mb-2
                            "
                        >
                            الوحدة
                        </label>

                        <select
                            value={unit}
                            onChange={(e) =>
                                setUnit(
                                    e.target.value
                                )
                            }
                            disabled={unitsLoading}
                            className="
                                w-full
                                px-4
                                py-3
                                border
                                border-gray-300
                                rounded-lg
                                outline-none
                                focus:ring-2
                                focus:ring-green-500
                                bg-white
                                disabled:bg-gray-100
                            "
                        >
                            <option value="">
                                {unitsLoading
                                    ? "جاري تحميل الوحدات..."
                                    : "اختر الوحدة"}
                            </option>

                            {units.map(
                                (item) => (
                                    <option
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.name}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {/* =================================================
                        PRICE + QUANTITY
                    ================================================= */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            gap-4
                        "
                    >
                        {/* PRICE */}

                        <div>
                            <label
                                className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    mb-2
                                "
                            >
                                سعر الشراء
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={price}
                                onChange={(e) =>
                                    setPrice(
                                        e.target.value
                                    )
                                }
                                placeholder="0.00"
                                className="
                                    w-full
                                    px-4
                                    py-3
                                    border
                                    border-gray-300
                                    rounded-lg
                                    outline-none
                                    focus:ring-2
                                    focus:ring-green-500
                                "
                            />
                        </div>

                        {/* QUANTITY */}

                        <div>
                            <label
                                className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    mb-2
                                "
                            >
                                الكمية
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={quantity}
                                onChange={(e) =>
                                    setQuantity(
                                        e.target.value
                                    )
                                }
                                placeholder="0"
                                className="
                                    w-full
                                    px-4
                                    py-3
                                    border
                                    border-gray-300
                                    rounded-lg
                                    outline-none
                                    focus:ring-2
                                    focus:ring-green-500
                                "
                            />
                        </div>
                    </div>

                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (
                        <div
                            className="
                                p-3
                                rounded-lg
                                bg-red-50
                                text-red-600
                                text-sm
                                border
                                border-red-100
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
                            justify-end
                            gap-3
                            pt-2
                        "
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="
                                px-4
                                py-2.5
                                rounded-lg
                                bg-gray-100
                                text-gray-700
                                hover:bg-gray-200
                                disabled:opacity-50
                            "
                        >
                            إلغاء
                        </button>

                        <button
                            type="submit"
                            disabled={
                                loading ||
                                unitsLoading
                            }
                            className="
                                px-5
                                py-2.5
                                rounded-lg
                                bg-green-600
                                text-white
                                hover:bg-green-700
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                            "
                        >
                            {loading
                                ? "جاري الحفظ..."
                                : "إضافة المنتج"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;