import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { SidebarMenuLinks } from "../../../assets/assets";

import logo from "../../../assets/images/logo.png";


function Sidebar() {

    const [expandedItems, setExpandedItems] = useState({});

    const location = useLocation();


    // =========================================================
    // TOGGLE SUB MENU
    // =========================================================

    const toggleSubMenu = (index) => {

        setExpandedItems((prev) => ({

            ...prev,

            [index]: !prev[index],

        }));

    };


    return (

        <aside
            dir="rtl"
            className="
                fixed

                right-0
                top-0
                h-screen
                w-16
                sm:w-64

                bg-gradient-to-b
                from-[#E2E8F0]
                via-[#F4F4F5]
                to-[#FFFFFF]

                border-l
                border-[#D4D4D8]

                shadow-[-2px_0_8px_rgba(0,0,0,0.10)]

                z-50
            "
        >


            {/* ================================================= */}
            {/* LOGO */}
            {/* ================================================= */}

            <div
                className="
                    flex
                    items-center
                    justify-center

                    h-20

                    border-b
                    border-[#D4D4D8]

                    px-2

                    mt-15
                "
            >

                <img
                    src={logo}
                    alt="Logo"
                    className="
                        mx-auto

                        w-15
                        h-15

                        object-contain

                        mb-4

                        rounded-lg
                    "
                />

            </div>


            {/* ================================================= */}
            {/* SIDEBAR MENU */}
            {/* ================================================= */}

            <nav className="p-2 sm:p-4">

                <ul className="space-y-2">


                    {SidebarMenuLinks.map(
                        (item, index) => {

                            const Icon = item.icon;


                            // Active main item

                            const isActive =
                                location.pathname ===
                                item.path;


                            // Expanded

                            const isExpanded =
                                expandedItems[index] ??
                                item.isExpanded ??
                                false;


                            return (

                                <li key={index}>


                                    {/* ================================================= */}
                                    {/* MAIN ITEM WITH SUB ITEMS */}
                                    {/* ================================================= */}

                                    {item.subItems ? (

                                        <button
                                            onClick={() =>
                                                toggleSubMenu(
                                                    index
                                                )
                                            }
                                            className={`
                                                w-full

                                                flex
                                                items-center

                                                justify-center
                                                sm:justify-between

                                                px-3
                                                sm:px-4

                                                py-3

                                                rounded-lg

                                                transition

                                                cursor-pointer

                                                ${
                                                    isExpanded

                                                        ? `
                                                            bg-[#E4E4E7]
                                                            text-[#27272A]

                                                            shadow-sm
                                                          `

                                                        : `
                                                            text-[#52525B]

                                                            hover:bg-[#F1F1F3]

                                                            hover:text-[#27272A]
                                                          `
                                                }
                                            `}
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-center

                                                    gap-3

                                                    justify-center
                                                    sm:justify-start
                                                "
                                            >

                                                <Icon
                                                    size={20}
                                                />


                                                {/* Desktop text */}

                                                <span
                                                    className="
                                                        hidden
                                                        sm:block

                                                        font-semibold
                                                    "
                                                >

                                                    {item.name}

                                                </span>

                                            </div>


                                            {/* Expand / Collapse */}

                                            <span
                                                className="
                                                    hidden
                                                    sm:block

                                                    text-2xl

                                                    text-[#52525B]

                                                    font-light
                                                "
                                            >

                                                {isExpanded
                                                    ? "−"
                                                    : "+"}

                                            </span>

                                        </button>

                                    ) : (


                                        /* ================================================= */
                                        /* NORMAL ITEM */
                                        /* ================================================= */

                                        <Link
                                            to={item.path}
                                            className={`
                                                flex
                                                items-center

                                                justify-center
                                                sm:justify-start

                                                gap-3

                                                px-3
                                                sm:px-4

                                                py-3

                                                rounded-lg

                                                transition

                                                font-extrabold

                                                ${
                                                    isActive

                                                        ? `
                                                            bg-[#E4E4E7]

                                                            text-[#18181B]

                                                            shadow-sm

                                                            border
                                                            border-[#D4D4D8]
                                                          `

                                                        : `
                                                            text-[#52525B]

                                                            hover:bg-[#F1F1F3]

                                                            hover:text-[#27272A]
                                                          `
                                                }
                                            `}
                                        >

                                            <Icon
                                                size={20}
                                            />


                                            {/* Desktop text */}

                                            <span
                                                className="
                                                    hidden
                                                    sm:block

                                                    font-extrabold

                                                    text-lg
                                                "
                                            >

                                                {item.name}

                                            </span>

                                        </Link>

                                    )}


                                    {/* ================================================= */}
                                    {/* SUB ITEMS */}
                                    {/* ================================================= */}

                                    {item.subItems &&
                                        isExpanded && (

                                            <ul
                                                className="
                                                    mt-2

                                                    mr-1
                                                    sm:mr-6

                                                    space-y-1

                                                    border-r-2
                                                    border-[#D4D4D8]

                                                    pr-1
                                                    sm:pr-3
                                                "
                                            >

                                                {item.subItems.map(
                                                    (
                                                        subItem,
                                                        subIndex
                                                    ) => {

                                                        const SubIcon =
                                                            subItem.icon;


                                                        const isSubActive =
                                                            location.pathname ===
                                                            subItem.path;


                                                        return (

                                                            <li
                                                                key={
                                                                    subIndex
                                                                }
                                                            >

                                                                <Link
                                                                    to={
                                                                        subItem.path
                                                                    }
                                                                    className={`
                                                                        flex
                                                                        items-center

                                                                        justify-center
                                                                        sm:justify-start

                                                                        gap-3

                                                                        px-2
                                                                        sm:px-3

                                                                        py-2

                                                                        rounded-lg

                                                                        text-sm

                                                                        transition

                                                                        font-extrabold

                                                                        ${
                                                                            isSubActive

                                                                                ? `
                                                                                    bg-[#E4E4E7]

                                                                                    text-[#18181B]

                                                                                    border
                                                                                    border-[#D4D4D8]
                                                                                  `

                                                                                : `
                                                                                    text-[#71717A]

                                                                                    hover:bg-[#F1F1F3]

                                                                                    hover:text-[#27272A]
                                                                                  `
                                                                        }
                                                                    `}
                                                                >

                                                                    <SubIcon
                                                                        size={
                                                                            16
                                                                        }
                                                                    />


                                                                    {/* Desktop text */}

                                                                    <span
                                                                        className="
                                                                            hidden
                                                                            sm:block

                                                                            font-extrabold
                                                                        "
                                                                    >

                                                                        {
                                                                            subItem.name
                                                                        }

                                                                    </span>

                                                                </Link>

                                                            </li>

                                                        );

                                                    }
                                                )}

                                            </ul>

                                        )}

                                </li>

                            );

                        }
                    )}

                </ul>

            </nav>

        </aside>

    );

}


export default Sidebar;