import React, { Suspense } from 'react'
// import { Card } from '../../ui/dashboard/cards'
import RevenueChart from '../../ui/dashboard/revenue-chart'
import LatestInvoices from '../../ui/dashboard/latest-invoices'
import { lusitana } from '../../ui/fonts'
import { fetchCardData} from '../../lib/data'
import { CardSkeleton, LatestInvoicesSkeleton, RevenueChartSkeleton } from '@/app/ui/skeletons'
import CardWrapper from '@/app/ui/dashboard/cards'

const Page = async () => {
  // const revenue = await fetchRevenue()
  // const {
  //   totalPaidInvoices,
  //   totalPendingInvoices,
  //   numberOfCustomers,
  //   numberOfInvoices
  // } = await fetchCardData()

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-x1 md:text-2xl`}>
        Dashboard
      </h1>
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        {/* <Card title='Collected' value={totalPaidInvoices} type='collected' />
        <Card title='Pending' value={totalPendingInvoices} type='pending' />
        <Card title='Total Invoices' value={numberOfInvoices} type='invoices' />
        <Card title='Total Customers' value={numberOfCustomers} type='customers' /> */}
<Suspense fallback={<CardSkeleton/>}><CardWrapper/></Suspense>
      </div>
      <div className='mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8'>
       <Suspense fallback={<RevenueChartSkeleton/>}><RevenueChart/></Suspense> 
        <Suspense fallback={<LatestInvoicesSkeleton/>}><LatestInvoices /></Suspense>
      </div>
    </main>
  )
}

export default Page