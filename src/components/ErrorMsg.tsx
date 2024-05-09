interface ErrorMsgProps {
  msg: string;
}

export default function ErrorMsg({ msg }: ErrorMsgProps) {
  return (
    <p className="text-red-600 text-sm sm:text-base leading-snug">{msg}</p>
  );
}
