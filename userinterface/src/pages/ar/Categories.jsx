import React, { useEffect, useState } from "react";
import AddCategory from "../../components/addmodals/AddCategory";
import AddProduct from "../../components/addmodals/AddProduct";
import { authFetch } from "../../utils/auth";

const BASE = import.meta.env.VITE_DJANGO_BASE_URL;

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);

    const [expandedCategories, setExpandedCategories] = useState({});

    const [loading, setLoading] = useState(true);

    const [showAddCategory, setShowAddCategory] = useState(false);
    const [showAddProduct, setShowAddProduct] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState(null);

    const getToken = () => {
        return localStorage.getItem("access");
    };

    // =========================================================
    // FETCH CATEGORIES
    // =========================================================

    // const fetchCategories = async () => {
    //     try {
    //         const token = getToken();

    //         const response = await fetch(
    //             `${BASE}/api/categories/`,
    //             {
    //                 method: "GET",
    //                 headers: {
    //                     "Authorization": `Bearer ${token}`,
    //                     "Content-Type": "application/json",
    //                 },
    //             }
    //         );

    //         if (!response.ok) {
    //             throw new Error(
    //                 `Failed to fetch categories: ${response.status}`
    //             );
    //         }

    //         const data = await response.json();

    //         setCategories(data);
    //     } catch (error) {
    //         console.error("Error fetching categories:", error);
    //     }
    // };

    // // =========================================================
    // // FETCH PRODUCTS
    // // =========================================================

    // const fetchProducts = async () => {
    //     try {
    //         const token = getToken();

    //         const response = await fetch(
    //             `${BASE}/api/products/`,
    //             {
    //                 method: "GET",
    //                 headers: {
    //                     "Authorization": `Bearer ${token}`,
    //                     "Content-Type": "application/json",
    //                 },
    //             }
    //         );

    //         if (!response.ok) {
    //             throw new Error(
    //                 `Failed to fetch products: ${response.status}`
    //             );
    //         }

    //         const data = await response.json();

    //         setProducts(data);
    //     } catch (error) {
    //         console.error("Error fetching products:", error);
    //     }
    // };

    // =========================================================
    // FETCH ALL
    // =========================================================
     
    
    // =========================================================
// FETCH CATEGORIES
// =========================================================

const fetchCategories = async () => {
    try {
        const response = await authFetch(
            `${BASE}/api/categories/`,
            {
                method: "GET",
            }
        );

        if (!response.ok) {
            throw new Error(
                `Failed to fetch categories: ${response.status}`
            );
        }

        const data = await response.json();

        setCategories(data);

    } catch (error) {

        console.error(
            "Error fetching categories:",
            error
        );

    }
};


// =========================================================
// FETCH PRODUCTS
// =========================================================

    const fetchProducts = async () => {
        try {
            const response = await authFetch(
                `${BASE}/api/products/`,
                {
                    method: "GET",
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch products: ${response.status}`
                );
            }

            const data = await response.json();

            setProducts(data);

        } catch (error) {

            console.error(
                "Error fetching products:",
                error
            );

        }
    };


    const fetchData = async () => {
        setLoading(true);

        await Promise.all([
            fetchCategories(),
            fetchProducts(),
        ]);

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // =========================================================
    // TOGGLE CATEGORY
    // =========================================================

    const toggleCategory = (categoryId) => {
        setExpandedCategories((previous) => ({
            ...previous,
            [categoryId]: !previous[categoryId],
        }));
    };

    // =========================================================
    // GET PRODUCTS OF CATEGORY
    // =========================================================

    const getCategoryProducts = (categoryId) => {
        return products.filter(
            (product) =>
                Number(product.category) === Number(categoryId)
        );
    };

    // =========================================================
    // ADD PRODUCT
    // =========================================================

    const handleAddProduct = (category = null) => {
        setSelectedCategory(category);
        setShowAddProduct(true);
    };

    // =========================================================
    // AFTER CATEGORY CREATED
    // =========================================================

    const handleCategoryAdded = async () => {
        setShowAddCategory(false);

        await fetchCategories();
    };

    // =========================================================
    // AFTER PRODUCT CREATED
    // =========================================================

    const handleProductAdded = async () => {
        setShowAddProduct(false);
        setSelectedCategory(null);

        await fetchProducts();
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[300px]">
                <div className="text-gray-500 text-lg">
                    جاري تحميل التصنيفات...
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        التصنيفات والمنتجات
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        إدارة التصنيفات والمنتجات التابعة لكل تصنيف
                    </p>
                </div>

                <div className="flex items-center gap-3">

                    {/* ADD CATEGORY */}

                    <button
                        onClick={() => setShowAddCategory(true)}
                        className="
                            flex items-center gap-2
                            px-4 py-2.5
                            rounded-lg
                            bg-blue-600
                            text-white
                            hover:bg-blue-700
                            transition
                            shadow-sm
                        "
                    >
                        <span className="text-lg">
                            +
                        </span>

                        إضافة تصنيف
                    </button>

                    {/* ADD PRODUCT */}

                    <button
                        onClick={() => handleAddProduct(null)}
                        className="
                            flex items-center gap-2
                            px-4 py-2.5
                            rounded-lg
                            bg-green-600
                            text-white
                            hover:bg-green-700
                            transition
                            shadow-sm
                        "
                    >
                        <span className="text-lg">
                            +
                        </span>

                        إضافة منتج
                    </button>

                </div>
            </div>

            {/* =================================================
                EMPTY CATEGORIES
            ================================================= */}

            {categories.length === 0 ? (

                <div
                    className="
                        bg-white
                        border
                        border-gray-200
                        rounded-xl
                        p-10
                        text-center
                    "
                >
                    <div className="text-5xl mb-4">
                        📂
                    </div>

                    <h2 className="text-lg font-semibold text-gray-700">
                        لا توجد تصنيفات
                    </h2>

                    <p className="text-gray-500 text-sm mt-2 mb-5">
                        قم بإضافة أول تصنيف للبدء.
                    </p>

                    <button
                        onClick={() => setShowAddCategory(true)}
                        className="
                            px-5 py-2.5
                            rounded-lg
                            bg-blue-600
                            text-white
                            hover:bg-blue-700
                        "
                    >
                        + إضافة تصنيف
                    </button>
                </div>

            ) : (

                /* =================================================
                   CATEGORIES
                ================================================= */

                <div className="space-y-3">

                    {categories.map((category) => {

                        const categoryProducts =
                            getCategoryProducts(category.id);

                        const isExpanded =
                            !!expandedCategories[category.id];

                        return (
                            <div
                                key={category.id}
                                className="
                                    bg-white
                                    border
                                    border-gray-200
                                    rounded-xl
                                    overflow-hidden
                                    shadow-sm
                                "
                            >

                                {/* =================================================
                                    CATEGORY HEADER
                                ================================================= */}

                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        px-4
                                        py-4
                                        hover:bg-gray-50
                                        transition
                                    "
                                >

                                    <div className="flex items-center gap-3">

                                        {/* ARROW */}

                                        <button
                                            onClick={() =>
                                                toggleCategory(category.id)
                                            }
                                            className="
                                                w-9
                                                h-9
                                                flex
                                                items-center
                                                justify-center
                                                rounded-lg
                                                bg-gray-100
                                                hover:bg-gray-200
                                                transition
                                            "
                                        >
                                            <span
                                                className={`
                                                    text-gray-600
                                                    transition-transform
                                                    duration-200
                                                    ${
                                                        isExpanded
                                                            ? "rotate-180"
                                                            : ""
                                                    }
                                                `}
                                            >
                                                ▼
                                            </span>
                                        </button>

                                        {/* CATEGORY ICON */}

                                        <div
                                            className="
                                                w-10
                                                h-10
                                                rounded-lg
                                                bg-blue-100
                                                flex
                                                items-center
                                                justify-center
                                                text-xl
                                            "
                                        >
                                            📁
                                        </div>

                                        {/* CATEGORY NAME */}

                                        <div>

                                            <h2 className="font-semibold text-gray-800">
                                                {category.name}
                                            </h2>

                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {categoryProducts.length} منتج
                                            </p>

                                        </div>

                                    </div>

                                    {/* CATEGORY ACTIONS */}

                                    <div className="flex items-center gap-2">

                                        {/* ADD PRODUCT TO THIS CATEGORY */}

                                        <button
                                            onClick={() =>
                                                handleAddProduct(category)
                                            }
                                            className="
                                                hidden
                                                sm:flex
                                                items-center
                                                gap-1
                                                px-3
                                                py-2
                                                rounded-lg
                                                text-sm
                                                bg-green-50
                                                text-green-700
                                                hover:bg-green-100
                                                transition
                                            "
                                        >
                                            <span>
                                                +
                                            </span>

                                            منتج
                                        </button>

                                        {/* ARROW */}

                                        <button
                                            onClick={() =>
                                                toggleCategory(category.id)
                                            }
                                            className="
                                                px-2
                                                text-gray-400
                                                hover:text-gray-700
                                            "
                                        >
                                            {isExpanded ? "▲" : "▼"}
                                        </button>

                                    </div>

                                </div>

                                {/* =================================================
                                    PRODUCTS
                                ================================================= */}

                                {isExpanded && (

                                    <div
                                        className="
                                            border-t
                                            border-gray-100
                                            bg-gray-50
                                            p-4
                                        "
                                    >

                                        {categoryProducts.length === 0 ? (

                                            <div
                                                className="
                                                    py-8
                                                    text-center
                                                    text-gray-500
                                                "
                                            >

                                                <div className="text-3xl mb-2">
                                                    📦
                                                </div>

                                                <p className="text-sm">
                                                    لا توجد منتجات في هذا التصنيف
                                                </p>

                                                <button
                                                    onClick={() =>
                                                        handleAddProduct(category)
                                                    }
                                                    className="
                                                        mt-3
                                                        px-4
                                                        py-2
                                                        rounded-lg
                                                        bg-green-600
                                                        text-white
                                                        text-sm
                                                        hover:bg-green-700
                                                    "
                                                >
                                                    + إضافة منتج
                                                </button>

                                            </div>

                                        ) : (

                                            <div className="space-y-2">

                                                {categoryProducts.map(
                                                    (product) => (

                                                        <div
                                                            key={product.id}
                                                            className="
                                                                flex
                                                                items-center
                                                                justify-between
                                                                bg-white
                                                                border
                                                                border-gray-200
                                                                rounded-lg
                                                                px-4
                                                                py-3
                                                                hover:shadow-sm
                                                                transition
                                                            "
                                                        >

                                                            <div className="flex items-center gap-3">

                                                                <div
                                                                    className="
                                                                        w-9
                                                                        h-9
                                                                        rounded-lg
                                                                        bg-green-100
                                                                        flex
                                                                        items-center
                                                                        justify-center
                                                                    "
                                                                >
                                                                    📦
                                                                </div>

                                                                <div>

                                                                    <h3
                                                                        className="
                                                                            text-sm
                                                                            font-medium
                                                                            text-gray-800
                                                                        "
                                                                    >
                                                                        {product.name}
                                                                    </h3>

                                                                    <p
                                                                        className="
                                                                            text-xs
                                                                            text-gray-500
                                                                            mt-0.5
                                                                        "
                                                                    >
                                                                        الوحدة:
                                                                        {" "}
                                                                        {product.unit_name}
                                                                    </p>

                                                                </div>

                                                            </div>

                                                            <div className="text-right">

                                                                <p
                                                                    className="
                                                                        text-sm
                                                                        font-semibold
                                                                        text-gray-800
                                                                    "
                                                                >
                                                                    {product.price}
                                                                </p>

                                                                <p
                                                                    className="
                                                                        text-xs
                                                                        text-gray-500
                                                                    "
                                                                >
                                                                    الكمية:
                                                                    {" "}
                                                                    {product.quantity}
                                                                </p>

                                                            </div>

                                                        </div>

                                                    )
                                                )}

                                            </div>

                                        )}

                                    </div>

                                )}

                            </div>
                        );
                    })}

                </div>

            )}

            {/* =================================================
                ADD CATEGORY MODAL
            ================================================= */}

            {showAddCategory && (

                <AddCategory
                    onClose={() => setShowAddCategory(false)}
                    onSuccess={handleCategoryAdded}
                />

            )}

            {/* =================================================
                ADD PRODUCT MODAL
            ================================================= */}

            {showAddProduct && (

                <AddProduct
                    selectedCategory={selectedCategory}
                    categories={categories}
                    onClose={() => {
                        setShowAddProduct(false);
                        setSelectedCategory(null);
                    }}
                    onSuccess={handleProductAdded}
                />

            )}

        </div>
    );
};

export default Categories;