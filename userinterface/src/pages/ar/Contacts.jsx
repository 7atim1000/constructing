import { useEffect, useState } from "react";
import { authFetch } from "../../utils/auth";
import AddContact from "../../components/addmodals/AddContact";


const Contacts = () => {

    const BASE = import.meta.env.VITE_DJANGO_BASE_URL;

    const [contacts, setContacts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [showAddContact, setShowAddContact] =
        useState(false);


    // =========================================================
    // FETCH CONTACTS
    // =========================================================

    const fetchContacts = async () => {

        try {

            setLoading(true);

            setError("");


            const response = await authFetch(
                `${BASE}/api/contacts/`
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to fetch contacts"
                );

            }


            const data = await response.json();


            console.log(
                "Contacts API response:",
                data
            );


            // =====================================================
            // HANDLE PAGINATED RESPONSE
            // =====================================================

            let contactList = [];


            if (Array.isArray(data)) {

                contactList = data;

            } else if (
                data &&
                Array.isArray(data.results)
            ) {

                contactList = data.results;

            }


            setContacts(contactList);


        } catch (error) {

            console.error(
                "Error fetching contacts:",
                error
            );

            setError(
                "فشل في تحميل جهات الاتصال"
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        fetchContacts();

    }, []);


    // =========================================================
    // CONTACT ADDED
    // =========================================================

    const handleContactAdded = async (newContact) => {

    console.log("CONTACT ADDED:", newContact);

    setShowAddContact(false);

    // If the API returned the created contact,
    // display it immediately.
    if (newContact && newContact.id) {

        setContacts((previousContacts) => {

            const exists = previousContacts.some(
                (contact) =>
                    String(contact.id) ===
                    String(newContact.id)
            );

            if (exists) {
                return previousContacts;
            }

            return [
                newContact,
                ...previousContacts
            ];
        });

    }

    // Synchronize with database
    await fetchContacts();
};

    // =========================================================
    // CONTACT TYPE
    // =========================================================

    const getContactType = (contact) => {

        if (contact.contact_type) {

            switch (contact.contact_type) {

                case "owner":
                    return "المالك";

                case "supplier":
                    return "المورد";

                case "company":
                    return "شركة";

                case "individual":
                    return "فرد";

                default:
                    return contact.contact_type;

            }

        }


        // ---------------------------------------------------------
        // FALLBACK
        // ---------------------------------------------------------

        if (contact.owner) {

            return "المالك";

        }


        if (contact.supplier) {

            return "المورد";

        }


        if (contact.company) {

            return "شركة";

        }


        if (contact.individual) {

            return "فرد";

        }


        return "غير محدد";

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
                        جهات الاتصال
                    </h1>


                    <p
                        className="
                            mt-1
                            text-sm
                            text-[#71717A]
                        "
                    >
                        إدارة العملاء والموردين والجهات
                    </p>

                </div>


                {/* ================================================= */}
                {/* ADD CONTACT */}
                {/* ================================================= */}

                <button
                    type="button"
                    onClick={() =>
                        setShowAddContact(true)
                    }
                    className="
                        bg-[#606C38]
                        hover:bg-[#4F5A2E]
                        text-white
                        px-4
                        py-2.5
                        rounded-lg
                        font-extrabold
                        shadow-sm
                        transition
                        cursor-pointer
                    "
                >
                    + إضافة جهة اتصال
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
                        font-extrabold
                        text-[#71717A]
                    "
                >
                    جاري تحميل جهات الاتصال...
                </div>

            ) : contacts.length === 0 ? (

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
                        لا توجد جهات اتصال حالياً
                    </p>


                    <button
                        type="button"
                        onClick={() =>
                            setShowAddContact(true)
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
                        + إضافة أول جهة اتصال
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

                            {/* ================================================= */}
                            {/* HEADER */}
                            {/* ================================================= */}

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
                                            font-extrabold
                                        "
                                    >
                                        الاسم
                                    </th>


                                    <th
                                        className="
                                            px-4
                                            py-3
                                            font-extrabold
                                        "
                                    >
                                        العنوان
                                    </th>


                                    <th
                                        className="
                                            px-4
                                            py-3
                                            font-extrabold
                                        "
                                    >
                                        الهاتف
                                    </th>


                                    <th
                                        className="
                                            px-4
                                            py-3
                                            font-extrabold
                                        "
                                    >
                                        الرصيد
                                    </th>


                                    <th
                                        className="
                                            px-4
                                            py-3
                                            font-extrabold
                                        "
                                    >
                                        النوع
                                    </th>

                                </tr>

                            </thead>


                            {/* ================================================= */}
                            {/* BODY */}
                            {/* ================================================= */}

                            <tbody>

                                {contacts.map(
                                    (contact, index) => (

                                        <tr
                                            key={
                                                contact.id ??
                                                `contact-${index}`
                                            }
                                            className="
                                                border-t
                                                border-[#E4E4E7]
                                                hover:bg-[#F8F9F3]
                                                transition
                                            "
                                        >

                                            {/* # */}

                                            <td
                                                className="
                                                    px-4
                                                    py-3
                                                    text-[#71717A]
                                                "
                                            >
                                                {index + 1}
                                            </td>


                                            {/* NAME */}

                                            <td
                                                className="
                                                    px-4
                                                    py-3
                                                    font-semibold
                                                    text-[#27272A]
                                                "
                                            >
                                                {contact.name}
                                            </td>


                                            {/* ADDRESS */}

                                            <td
                                                className="
                                                    px-4
                                                    py-3
                                                    text-[#52525B]
                                                "
                                            >
                                                {contact.address || "-"}
                                            </td>


                                            {/* PHONE */}

                                            <td
                                                className="
                                                    px-4
                                                    py-3
                                                    text-[#52525B]
                                                "
                                            >
                                                {contact.phone || "-"}
                                            </td>


                                            {/* BALANCE */}

                                            <td
                                                className="
                                                    px-4
                                                    py-3
                                                    font-semibold
                                                    text-[#27272A]
                                                "
                                            >
                                                {contact.balance ?? "0.00"}
                                            </td>


                                            {/* TYPE */}

                                            <td
                                                className="
                                                    px-4
                                                    py-3
                                                "
                                            >

                                                <span
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        rounded-full
                                                        bg-[#E7E9D5]
                                                        px-3
                                                        py-1
                                                        text-sm
                                                        font-semibold
                                                        text-[#4F5A2E]
                                                    "
                                                >
                                                    {getContactType(
                                                        contact
                                                    )}
                                                </span>

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
            {/* ADD CONTACT MODAL */}
            {/* ================================================= */}

            {showAddContact && (

                <AddContact
                    onClose={() =>
                        setShowAddContact(false)
                    }
                    onContactAdded={
                        handleContactAdded
                    }
                />

            )}

        </div>

    );

};


export default Contacts;