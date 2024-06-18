import { Tooltip, Button } from '@material-tailwind/react';
import { Children, FC, ReactNode } from 'react'

interface Props {
  children: ReactNode;
  tooltip?: string;
}
const TooltipDefault: FC<Props> = ({children, tooltip}): JSX.Element => {
  return (
    <div className='group relative inline-block'>
      {children}
      <span className='invisible group-hover:visible opacity-0
      group-hover:opacity-100 transition bg-[#2C3375] text-white p-1 round
      absolute top-full mt-2 whitespace-nowrap'>
        {tooltip}
      </span>
    </div>
  );
};
export default TooltipDefault;