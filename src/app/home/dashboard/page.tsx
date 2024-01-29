'use client'

import React, { useEffect } from "react";
import dynamic from 'next/dynamic'
// import ReactEcharts from "echarts-for-react";
const ReactEcharts = dynamic(
  () => import('echarts-for-react'),
  { ssr: false },
)

// export const metadata: Metadata = {
//   title: 'Dashboard',
//   description: 'Welcome',
// }

const option_bars = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar'
    }
  ]
};

const option_line = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'line'
    }
  ]
};

export default function AdminPage() {

  const [show_chart, setShowChart] = React.useState(false)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Your client-side code that uses window goes here
      setShowChart(true)
    }


  }, [])

  return (
    <main className="flex flex-col items-center justify-between py-6 px-24 max-w-2xl w-fit">
      <span>dashboard page</span>
      <div className='w-[400px] h-[400px]'>
        {show_chart && (typeof window !== 'undefined') && <ReactEcharts option={option_line} />}
      </div>
      <div className='w-[400px] h-[400px]'>
      {show_chart && (typeof window !== 'undefined') && <ReactEcharts option={option_bars} />}
      </div>
    </main>
  )
}
