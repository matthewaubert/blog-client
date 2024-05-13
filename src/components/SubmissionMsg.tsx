interface Props {
  success: boolean;
  msg: string;
}

/**
 * JSX component for displaying a message after form submission.
 * On success, displays green color scheme. On failure, displays red color scheme.
 * @param {Props} props
 * @param {} props.success - Whether form submission was a success or not
 * @param {} props.msg - Message to display
 * @returns 
 */
export default function SubmissionMsg({ success, msg }: Props) {
  return (
    <div
      className={
        'sub-msg-margin p-4 text-center rounded-b border-t-8 font-bold shadow-md ' +
        (success
          ? 'border-t-green-800 bg-green-200 text-green-800'
          : 'border-t-red-600 bg-red-200 text-red-600')
      }
    >
      {msg}
    </div>
  );
}
