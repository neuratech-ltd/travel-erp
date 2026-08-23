import React from 'react'


interface TitleCardProps {
    icon?: React.ReactNode;
    title?: string;
    description?: string;
}

const TitleCard = ({ icon, title, description }: TitleCardProps) => {
  return (
   <div id="header-text-block">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
           {icon}
            {title} 
          </h2>
          <p className="text-2xs text-slate-400 font-medium mt-0.5">{description}</p>
        </div>
  )
}

export default TitleCard
