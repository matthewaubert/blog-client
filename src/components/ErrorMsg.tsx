import Icon from '@mdi/react';
import { mdiAlert } from '@mdi/js'; // https://pictogrammers.com/library/mdi/icon/alert/

interface ErrorMsgProps {
  msg: string;
}

export default function ErrorMsg({ msg }: ErrorMsgProps) {
  return (
    <div className="flex gap-2 sm:gap-1 items-center">
      <Icon
        path={mdiAlert}
        color=""
        className="h-6 fill-red-700 shrink-0 -mt-[1px]"
      />
      <span className="text-red-700 text-sm sm:text-base leading-tight">
        {msg}
      </span>
    </div>
  );
}
