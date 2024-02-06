'use client'

import React, { useEffect } from "react";
import dynamic from 'next/dynamic'
// import ReactEcharts from "echarts-for-react";
const ReactEcharts = dynamic(
  () => import('echarts-for-react'),
  { ssr: false },
)
import { ComposeOption } from 'echarts/core';
import { BarSeriesOption, LineSeriesOption } from 'echarts/charts';
import { useAppContext } from "@/hooks/useAppContext";
// echar chart options

type ECOption = ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
>;


// export const metadata: Metadata = {
//   title: 'Dashboard',
//   description: 'Welcome',
// }

const option_bars: ECOption = {
  radius: "100%", // this
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

const option_line: ECOption = {
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

  const {setLoading}= useAppContext();

  // useEffect(() => {
  //   setLoading(true)
  //   setTimeout(() => {
  //     setLoading(false)
  //   }, 1200);
  // }, [])

  // show_chart
  const [show_chart, set_show_chart] = React.useState(false)
  useEffect(() => {
    set_show_chart(true)
  }, [])

  return (
    <main className=" w-full py-12 px-4 md:px-12 h-full">
      <div className='md:container'> 
        <div className='w-full h-fit px-4 md:px-8 py-6 md:pb-12 bg-white rounded-3xl flex flex-col overflow-y-auto'>

          <div className="h-full w-full flex flex-col overflow-auto gap-6">
            <div className='border-b-[3px] border-b-[#2C3375] w-fit px-12 self-center'>
              <h1 className='uppercase font-bold text-3xl'>DASHBOARD</h1>
            </div>

            <div className="">
              <span className="font-bold text-lg">Gráfica de ventas</span>
              <div className='h-[400px] '>
                {show_chart && (typeof window !== 'undefined') && <ReactEcharts option={option_line} style={{ height: '100%', width: '100%' }} />}
              </div>
            </div>

            <div className="">
              <span className="font-bold text-lg">Frecuencia de visitas de máquinas expendedoras</span>
              <div className='h-[400px] '>
                {show_chart && (typeof window !== 'undefined') && <ReactEcharts option={option_bars} style={{ height: '100%', width: '100%' }} />}
              </div>
            </div>
          </div>


        </div>
      </div>
    </main>


    // <main className="flex flex-col items-center justify-between py-6 px-24 max-w-2xl w-fit">
    //   <span>dashboard page</span>
    //   <div className='w-[400px] h-[400px]'>
    //     {show_chart && (typeof window !== 'undefined') && <ReactEcharts option={option_line} />}
    //   </div>
    //   <div className='w-[400px] h-[400px]'>
    //   {show_chart && (typeof window !== 'undefined') && <ReactEcharts option={option_bars} />}
    //   </div>
    // </main>
  )
}
