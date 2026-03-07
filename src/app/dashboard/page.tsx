'use client';

import { useDashboardData } from '@/hooks/useDashboardData';
import { DashboardTemplate } from '@/components/templates/DashboardTemplate';

export default function Dashboard() {
	const dashboardData = useDashboardData();

	return <DashboardTemplate {...dashboardData} />;
}
