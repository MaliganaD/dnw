import React from 'react';
import { LucideIcon } from 'lucide-react';

interface HeaderItemProps {
  name: string;
  Icon: LucideIcon;
  onClick?: () => void;
}

const HeaderItem: React.FC<HeaderItemProps> = ({ name, Icon, onClick }) => {
  return (
    <div onClick={onClick} className='flex items-center gap-3 text-[15px] font-semibold cursor-pointer hover:underline underline-offset-8 mb-2 md:mb-0 group relative'>
        <Icon className='w-4 h-4 text-white' />
        <h2 className='tracking-[2px] text-white uppercase opacity-80 group-hover:opacity-100 transition-opacity'>{name}</h2>
        <div className='absolute -bottom-2 left-0 right-0 h-[2px] bg-white opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 transition-all duration-300 origin-center hidden md:block' />
    </div>
  );
};
export default HeaderItem;