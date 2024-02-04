import { useEffect, useState } from 'react';

import XIcon from "@public/img/toasts/x.svg";
import warningIcon from "@public/img/toasts/warning.svg";
import errorIcon from "@public/img/toasts/error.svg";
import infoIcon from "@public/img/toasts/check.svg";

//ERROR
export const ToastErrorBGColor = '#D84A49';
export const ToastErrorIcon = '/img/toasts/error.svg';
//WARNING
export const ToastWarningBGColor = '#ECBF58';
export const ToastWarningIcon = '/img/toasts/error.svg';
//SUCCESS
export const ToastSuccessBGColor = '#5BC3A2';
export const ToastSuccessIcon = '/img/toasts/check.svg';
//NOTIFICATION
export const ToastNotificationBGColor = '#6FB1C7';
export const ToastNotificationIcon = '/img/toasts/error.svg';

export type ToastObject = {
  id: number;
  title?: string;
  description?: string;
  icon: string;
  backgroundColor: string;
  fixed?: boolean;
  focused?: boolean;
};

type Props = {
  toastList: Array<ToastObject>;
  position: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  autoDelete?: boolean;
  autoDeleteTime?: number;
  marginTop?: number;
};

export const Toast = ({
  toastList,
  position,
  autoDelete,
  autoDeleteTime,
  marginTop = 0,
}: Props) => {
  const [list, setList] = useState(toastList);

  useEffect(() => {
    setList([...toastList]);
  }, [toastList]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        autoDelete &&
        toastList.length &&
        list.length &&
        !toastList[0].fixed
      ) {
        if (!toastList[0].focused) {
          deleteToast(toastList[0].id);
        }

      }
    }, autoDeleteTime);
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line
  }, [toastList, autoDelete, autoDeleteTime, list]);

  const deleteToast = (id: number) => {
    const listItemIndex = list.findIndex((e: any) => e.id === id);
    const toastListItem = toastList.findIndex((e: any) => e.id === id);
    list.splice(listItemIndex, 1);
    toastList.splice(toastListItem, 1);
    setList([...list]);
  };

  return (
    <div
      className={`notification-container flex flex-col gap-2  pointer-events-none`}
      style={{ top: marginTop + 10 }}
    >
      {list.map((toast: ToastObject, i: number) => (
        <div
          key={i}
          className={`rounded-md flex items-center gap-3 py-2 pr-1 px-[.7rem] shadow-md top-0 min-w-[200px] ${position} pointer-events-auto`}
          style={{ backgroundColor: toast.backgroundColor }}
          onMouseEnter={() => { toast.focused = true; }}
          onMouseLeave={() => { toast.focused = false; }}
        >
          <div className="select-none pointer-events-none">
            <img src={toast.icon} alt="" className="notification-img text-white" />
          </div>
          <div className="flex flex-col items-start flex-1 text-white">
            {toast.title && <p className="notification-title leading-snug select-none whitespace-nowrap">{toast.title}</p>}
            {toast.description && <p className="notification-message leading-snug select-none">{toast.description}</p>}
          </div>
          <div className='h-full flex items-start justify-start'>
            <button onClick={() => deleteToast(toast.id)} className='hover:opacity-[0.7]'>
              <div className='h-full p-2 -m-2 -mr-3 -mt-3'>
                <XIcon color='white' className='hover:text-red w-4 h-4' />
              </div>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Toast;
