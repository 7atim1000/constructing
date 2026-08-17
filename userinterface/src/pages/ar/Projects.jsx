import React, { useEffect, useState } from "react";
import { authFetch } from "../../utils/auth";

import AddProject from "../../components/projects/AddProject";
import ProjectDetails from "../../components/projects/ProjectDetails";

const BASE = import.meta.env.VITE_DJANGO_BASE_URL;

const Projects = () => {
    const [projects, setProjects] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [showAddProject, setShowAddProject] =
        useState(false);

    const [selectedProject, setSelectedProject] =
        useState(null);

    const [showProjectDetails, setShowProjectDetails] =
        useState(false);

    const [page, setPage] = useState(1);

    const [pagination, setPagination] = useState({
        count: 0,
        next: null,
        previous: null,
    });

    // =========================================================
    // STATUS
    // =========================================================

    const getStatusLabel = (status) => {
        switch (status) {
            case "preparation":
                return "تحضير";

            case "started":
                return "بدأ";

            case "construction":
                return "قيد الإنشاء";

            case "initial-delivery":
                return "التسليم الأولي";

            case "final-delivery":
                return "التسليم النهائي";

            default:
                return status;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "preparation":
                return "bg-gray-100 text-gray-700";

            case "started":
                return "bg-blue-100 text-blue-700";

            case "construction":
                return "bg-yellow-100 text-yellow-700";

            case "initial-delivery":
                return "bg-purple-100 text-purple-700";

            case "final-delivery":
                return "bg-green-100 text-green-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    // =========================================================
    // FETCH PROJECTS
    // =========================================================

    const fetchProjects = async (
        requestedPage = 1
    ) => {
        setLoading(true);
        setError("");

        try {
            const response = await authFetch(
                `${BASE}/api/projects/?page=${requestedPage}`,
                {
                    method: "GET",
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch projects: ${response.status}`
                );
            }

            const data = await response.json();

            setProjects(
                data.results || []
            );

            setPagination({
                count: data.count || 0,
                next: data.next || null,
                previous: data.previous || null,
            });

            setPage(requestedPage);

        } catch (error) {
            console.error(
                "Error fetching projects:",
                error
            );

            setError(
                "تعذر تحميل المشاريع"
            );

        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {
        fetchProjects(1);
    }, []);

    // =========================================================
    // CREATE SUCCESS
    // =========================================================

    const handleProjectCreated = () => {
        setShowAddProject(false);

        fetchProjects(1);
    };

    // =========================================================
    // UPDATE SUCCESS
    // =========================================================

    const handleProjectUpdated = (
        updatedProject
    ) => {
        setSelectedProject(
            updatedProject
        );

        setProjects((previous) =>
            previous.map((project) =>
                project.id === updatedProject.id
                    ? updatedProject
                    : project
            )
        );
    };

    // =========================================================
    // OPEN DETAILS
    // =========================================================

    const openProjectDetails = (
        project
    ) => {
        setSelectedProject(project);

        setShowProjectDetails(true);
    };

    // =========================================================
    // CLOSE DETAILS
    // =========================================================

    const closeProjectDetails = () => {
        setShowProjectDetails(false);

        setSelectedProject(null);

        fetchProjects(page);
    };

    // =========================================================
    // PAGINATION
    // =========================================================

    const goNext = () => {
        if (pagination.next) {
            fetchProjects(page + 1);
        }
    };

    const goPrevious = () => {
        if (
            pagination.previous &&
            page > 1
        ) {
            fetchProjects(page - 1);
        }
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div className="min-h-full bg-gray-50 p-4 md:p-6">

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                className="
                    flex
                    flex-col
                    md:flex-row
                    md:items-center
                    md:justify-between
                    gap-4
                    mb-6
                "
            >
                <div>
                    <h1
                        className="
                            text-2xl
                            font-extrabold
                            text-gray-800
                        "
                    >
                        المشاريع
                    </h1>

                    <p
                        className="
                            text-sm
                            text-gray-500
                            mt-1
                        "
                    >
                        إدارة ومتابعة المشاريع
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        setShowAddProject(true)
                    }
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        px-5
                        py-3
                        rounded-xl
                        bg-green-600
                        text-white
                        font-extrabold
                        hover:bg-green-700
                        transition
                    "
                >
                    <span className="text-xl">
                        +
                    </span>

                    مشروع جديد
                </button>
            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <div
                    className="
                        mb-5
                        p-4
                        rounded-xl
                        bg-red-50
                        border
                        border-red-100
                        text-red-600
                    "
                >
                    {error}
                </div>
            )}

            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (
                <div
                    className="
                        flex
                        items-center
                        justify-center
                        py-20
                        text-gray-500
                    "
                >
                    جاري تحميل المشاريع...
                </div>
            ) : projects.length === 0 ? (
                /* =================================================
                    EMPTY
                ================================================= */

                <div
                    className="
                        bg-white
                        rounded-2xl
                        border
                        border-gray-200
                        p-12
                        text-center
                    "
                >
                    <div
                        className="
                            text-5xl
                            mb-4
                        "
                    >
                        🏗️
                    </div>

                    <h2
                        className="
                            text-lg
                            font-bold
                            text-gray-800
                        "
                    >
                        لا توجد مشاريع
                    </h2>

                    <p
                        className="
                            text-sm
                            text-gray-500
                            mt-2
                        "
                    >
                        ابدأ بإضافة مشروع جديد
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            setShowAddProject(true)
                        }
                        className="
                            mt-5
                            px-5
                            py-2.5
                            rounded-lg
                            bg-green-600
                            text-white
                            hover:bg-green-700
                        "
                    >
                        إضافة مشروع
                    </button>
                </div>
            ) : (
                <>
                    {/* =================================================
                        PROJECTS
                    ================================================= */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            xl:grid-cols-3
                            gap-5
                        "
                    >
                        {projects.map(
                            (project) => (
                                <div
                                    key={project.id}
                                    className="
                                        bg-white
                                        rounded-2xl
                                        border
                                        border-gray-200
                                        shadow-sm
                                        hover:shadow-md
                                        transition
                                        overflow-hidden
                                    "
                                >
                                    {/* CARD HEADER */}

                                    <div
                                        className="
                                            p-5
                                            border-b
                                            border-gray-100
                                            shadow-lg
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                items-start
                                                justify-between
                                                gap-3
                                            "
                                        >
                                            <div>
                                                <h2
                                                    className="
                                                        font-extrabold
                                                        text-gray-800
                                                        text-lg
                                                    "
                                                >
                                                    {project.name}
                                                </h2>

                                                <p
                                                    className="
                                                        text-xs
                                                        text-gray-400
                                                        mt-1
                                                    "
                                                >
                                                    #{project.id}
                                                </p>
                                            </div>

                                            <span
                                                className={`
                                                    px-3
                                                    py-1.5
                                                    rounded-full
                                                    text-xs
                                                    font-medium
                                                    whitespace-nowrap
                                                    ${getStatusClass(
                                                        project.status
                                                    )}
                                                `}
                                            >
                                                {getStatusLabel(
                                                    project.status
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {/* CARD BODY */}

                                    <div className="p-5 space-y-3">

                                        <div
                                            className="
                                                flex
                                                justify-between
                                                gap-3
                                                text-sm
                                                shadow-xl
                                            "
                                        >
                                            <span className="text-gray-500">
                                                المالك
                                            </span>

                                            <span
                                                className="
                                                    font-medium
                                                    text-gray-800
                                                "
                                            >
                                                {project.owner_name ||
                                                    "-"}
                                            </span>
                                        </div>

                                        <div
                                            className="
                                                flex
                                                justify-between
                                                gap-3
                                                text-sm
                                            "
                                        >
                                            <span className="text-gray-500">
                                                الموقع
                                            </span>

                                            <span
                                                className="
                                                    font-medium
                                                    text-gray-800
                                                "
                                            >
                                                {project.location ||
                                                    "-"}
                                            </span>
                                        </div>

                                        <div
                                            className="
                                                flex
                                                justify-between
                                                gap-3
                                                text-sm
                                            "
                                        >
                                            <span className="text-gray-500">
                                                المساحة
                                            </span>

                                            <span
                                                className="
                                                    font-medium
                                                    text-gray-800
                                                "
                                            >
                                                {project.area ||
                                                    "-"}
                                            </span>
                                        </div>

                                        <div
                                            className="
                                                flex
                                                justify-between
                                                gap-3
                                                text-sm
                                            "
                                        >
                                            <span className="text-gray-500">
                                                التكلفة
                                            </span>

                                            <span
                                                className="
                                                    font-bold
                                                    text-green-700
                                                "
                                            >
                                                {project.cost}
                                            </span>
                                        </div>

                                    </div>

                                    {/* CARD FOOTER */}

                                    <div
                                        className="
                                            px-5
                                            py-4
                                            bg-gray-50
                                            border-t
                                            border-gray-100
                                        "
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openProjectDetails(
                                                    project
                                                )
                                            }
                                            className="
                                                w-full
                                                py-2.5
                                                rounded-lg
                                                border
                                                border-gray-300
                                                bg-gray-200
                                                shadow-xl
                                                text-gray-700
                                                font-extrabold
                                                hover:bg-gray-100
                                            "
                                        >
                                            تفاصيل المشروع
                                        </button>
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    {/* =================================================
                        PAGINATION
                    ================================================= */}

                    <div
                        className="
                            mt-6
                            flex
                            items-center
                            justify-between
                            bg-white
                            border
                            border-gray-200
                            rounded-xl
                            px-4
                            py-3
                        "
                    >
                        <button
                            type="button"
                            onClick={goPrevious}
                            disabled={
                                !pagination.previous
                            }
                            className="
                                px-4
                                py-2
                                rounded-lg
                                bg-gray-100
                                text-gray-700
                                disabled:opacity-40
                                disabled:cursor-not-allowed
                            "
                        >
                            السابق
                        </button>

                        <div
                            className="
                                text-sm
                                text-gray-500
                            "
                        >
                            الصفحة{" "}
                            <span
                                className="
                                    font-bold
                                    text-gray-800
                                "
                            >
                                {page}
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={goNext}
                            disabled={
                                !pagination.next
                            }
                            className="
                                px-4
                                py-2
                                rounded-lg
                                bg-gray-100
                                text-gray-700
                                disabled:opacity-40
                                disabled:cursor-not-allowed
                            "
                        >
                            التالي
                        </button>
                    </div>
                </>
            )}

            {/* =================================================
                ADD PROJECT
            ================================================= */}

            {showAddProject && (
                <AddProject
                    onClose={() =>
                        setShowAddProject(false)
                    }
                    onSuccess={
                        handleProjectCreated
                    }
                />
            )}

            {/* =================================================
                PROJECT DETAILS
            ================================================= */}

            {showProjectDetails &&
                selectedProject && (
                    <ProjectDetails
                        project={
                            selectedProject
                        }
                        onClose={
                            closeProjectDetails
                        }
                        onUpdated={
                            handleProjectUpdated
                        }
                    />
                )}
        </div>
    );
};

export default Projects;