"use client"

import React from 'react'
import { useSession } from '@/lib/auth-client'
import DashboardHomePageData from '../components/dashboardLayout/DashboardHomePageData'


const DashboardHomePage = () => {
    const { data: session, isPending } = useSession()

    if (isPending) return <div className="flex h-[50vh] items-center justify-center">
        <div className="size-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
    </div>

    if (!session) return <div>Redirecting to login...</div>

    return (
        <DashboardHomePageData />
    )
}


export default DashboardHomePage