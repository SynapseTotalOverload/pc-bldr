'use client'

import { CardBox } from "./card-box"

interface BlockListsProps {
  title: string;
  info: any;
}

export const BlockLists = ({ title, info }: BlockListsProps) => { 
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
        <CardBox />
        <CardBox />
        <CardBox />
      </div>
    </div>
  )
}