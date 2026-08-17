import { useEffect, useState } from "react";
import { authFetch } from "../../utils/auth";
import AddUnit from "../../components/addmodals/AddUnit";


const Units = () => {

    const BASE = import.meta.env.VITE_DJANGO_BASE_URL;

    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showAddUnit, setShowAddUnit] = useState(false);


    // =========================================================
    // FETCH UNITS
    // =========================================================

    const fetchUnits = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await authFetch(
                `${BASE}/api/units/`
            );

            if (!response.ok) {

                throw new Error(
                    "Failed to fetch units"
                );

            }

            const data = await response.json();

            console.log("Units API response:", data);


            // =====================================================
            // HANDLE API RESPONSE
            // =====================================================

            if (Array.isArray(data)) {

                setUnits(data);

            } else if (Array.isArray(data.results)) {

                setUnits(data.results);

            } else {

                setUnits([]);

            }


        } catch (error) {

            console.error(
                "Error fetching units:",
                error
            );

            setError(
                "فشل في تحميل الوحدات"
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        fetchUnits();

    }, []);


    // =========================================================
    // UNIT ADDED
    // =========================================================

    const handleUnitAdded = (newUnit) => {

        console.log(
            "New unit received in Units.jsx:",
            newUnit
        );


        if (newUnit) {

            // Add new unit immediately to the existing list
            setUnits((prevUnits) => {

                // Prevent duplicate unit
                const alreadyExists = prevUnits.some(
                    (unit) =>
                        String(unit.id) ===
                        String(newUnit.id)
                );

                if (alreadyExists) {

                    return prevUnits;

                }

                return [
                    ...prevUnits,
                    newUnit
                ];

            });

        }


        // Close modal immediately
        setShowAddUnit(false);

    };


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div
            dir="rtl"
            className="
                min-h-screen
                bg-[#F8F8F7]
                p-4
                sm:p-6
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
                    gap-4
                    mb-6
                "
            >

                <div>

                    <h1
                        className="
                            text-2xl
                            sm:text-3xl
                            font-extrabold
                            text-[#27272A]
                        "
                    >
                        الوحدات
                    </h1>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-[#71717A]
                        "
                    >
                        إدارة وحدات المنتجات
                    </p>

                </div>


                {/* ADD UNIT */}

                <button
                    type="button"
                    onClick={() => setShowAddUnit(true)}
                    className="
                        bg-[#606C38]
                        hover:bg-[#4F5A2E]
                        text-white
                        px-4
                        py-2.5
                        rounded-lg
                        font-semibold
                        shadow-sm
                        transition
                        cursor-pointer
                    "
                >
                    + إضافة وحدة
                </button>

            </div>


            {/* ================================================= */}
            {/* ERROR */}
            {/* ================================================= */}

            {error && (

                <div
                    className="
                        mb-4
                        rounded-lg
                        border
                        border-red-200
                        bg-red-50
                        text-red-700
                        p-3
                        text-sm
                    "
                >
                    {error}
                </div>

            )}


            {/* ================================================= */}
            {/* LOADING */}
            {/* ================================================= */}

            {loading ? (

                <div
                    className="
                        bg-white
                        rounded-xl
                        border
                        border-[#E4E4E7]
                        p-8
                        text-center
                        text-[#71717A]
                    "
                >
                    جاري تحميل الوحدات...
                </div>

            ) : units.length === 0 ? (

                /* ================================================= */
                /* EMPTY */
                /* ================================================= */

                <div
                    className="
                        bg-white
                        rounded-xl
                        border
                        border-[#E4E4E7]
                        p-10
                        text-center
                    "
                >

                    <p
                        className="
                            text-[#71717A]
                            mb-4
                        "
                    >
                        لا توجد وحدات حالياً
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            setShowAddUnit(true)
                        }
                        className="
                            bg-[#606C38]
                            hover:bg-[#4F5A2E]
                            text-white
                            px-4
                            py-2
                            rounded-lg
                            font-semibold
                            transition
                            cursor-pointer
                        "
                    >
                        + إضافة أول وحدة
                    </button>

                </div>

            ) : (

                /* ================================================= */
                /* TABLE */
                /* ================================================= */

                <div
                    className="
                        bg-white
                        rounded-xl
                        border
                        border-[#E4E4E7]
                        shadow-sm
                        overflow-hidden
                    "
                >

                    <div className="overflow-x-auto">

                        <table
                            className="
                                w-full
                                text-right
                            "
                        >

                            <thead
                                className="
                                    bg-[#E7E9D5]
                                    text-[#3F4726]
                                "
                            >

                                <tr>

                                    <th
                                        className="
                                            px-4
                                            py-3
                                            font-bold
                                        "
                                    >
                                        #
                                    </th>

                                    <th
                                        className="
                                            px-4
                                            py-3
                                            font-bold
                                        "
                                    >
                                        اسم الوحدة
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {units.map(
                                    (unit, index) => (

                                        <tr
                                            key={
                                                unit.id ??
                                                `unit-${index}`
                                            }
                                            className="
                                                border-t
                                                border-[#E4E4E7]
                                                hover:bg-[#F8F9F3]
                                                transition
                                            "
                                        >

                                            <td
                                                className="
                                                    px-4
                                                    py-3
                                                    text-[#71717A]
                                                "
                                            >
                                                {index + 1}
                                            </td>

                                            <td
                                                className="
                                                    px-4
                                                    py-3
                                                    font-semibold
                                                    text-[#27272A]
                                                "
                                            >
                                                {unit.name}
                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            )}


            {/* ================================================= */}
            {/* ADD UNIT MODAL */}
            {/* ================================================= */}

            {showAddUnit && (

                <AddUnit
                    onClose={() =>
                        setShowAddUnit(false)
                    }
                    onUnitAdded={
                        handleUnitAdded
                    }
                />

            )}

        </div>

    );

};


export default Units;