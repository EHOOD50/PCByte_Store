import { useEffect, useState } from "react";

import adminApi from "../api/adminApi";

import type { AdminDashboardData } from "../types/adminDashboard";

export const useAdminDashboard = () => {

    const [dashboard, setDashboard] =
        useState<AdminDashboardData | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(false);

    const loadDashboard =
        async () => {

            try {

                setLoading(true);

                const response =
                    await adminApi.get<AdminDashboardData>(
                        "/admin/dashboard"
                    );

                setDashboard(response.data);

                setError(false);

            } catch (err) {

                console.error(err);

                setError(true);

            } finally {

                setLoading(false);

            }

        };

    useEffect(() => {

        void loadDashboard();

    }, []);

    return {

        dashboard,

        loading,

        error,

        reload: loadDashboard,

    };

};