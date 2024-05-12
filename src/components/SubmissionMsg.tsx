interface Props {
  success: boolean;
  msg: string;
}

export default function SubmissionMsg({ success, msg }: Props) {
  return (
    <div
      className={
        'm-auto p-4 text-center rounded-b border-t-8 font-bold shadow-md ' +
        (success
          ? 'border-t-green-800 bg-green-200 text-green-800'
          : 'border-t-red-600 bg-red-200 text-red-600')
      }
    >
      {msg}
    </div>
  );
}
