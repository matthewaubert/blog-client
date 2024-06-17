import './Toggle.css';

interface Props {
  label?: string;
  labelClassName?: string;
  toggleClassName?: string;
  id: string;
  name: string;
  required?: boolean;
  checked: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  height?: string;
  offColor?: string;
  onColor?: string;
  yes?: string | JSX.Element;
  no?: string | JSX.Element;
}

/**
 * A handled checkbox input that displays as a toggle switch
 * @param {string} props.label - Text to display in label
 * @param {string} props.labelClassName - `className` for parent `label` that surrounds the input
 * @param {string} props.toggleClassName
 * @param {string} props.id - The ID of the input field
 * @param {string} props.name - The name of the input field
 * @param {boolean} props.required - Whether or not the field is required
 * @param {boolean} props.checked - If true, the toggle is set to checked. If false, it is not checked.
 * @param {function} props.onChange - A function that handles input change
 * @param {function} props.onBlur - An optional onBlur event handler
 * @param {string} props.height - Height of the Toggle component. Defaults to 30px
 * @param {string} props.offColor - The toggle background color when it *is not* checked
 * @param {string} props.onColor - The toggle background color when it *is* checked
 * @param {string | JSX.Element} props.yes - Text or icon to be displayed in the
 * Toggle background when checked. Best if it's a single character.
 * @param {string | JSX.Element} props.no - Text or icon to be displayed in the
 * Toggle background when not checked. Best if it's a single character.
 */
export default function Toggle({
  label,
  labelClassName,
  toggleClassName,
  id,
  name,
  required,
  checked,
  onChange,
  onBlur,
  height = '30px',
  offColor = '#BBB',
  onColor = '#080',
  yes,
  no,
}: Props) {
  return (
    <label
      className={'toggle' + (labelClassName && ` ${labelClassName}`)}
      style={{ '--toggle-height': height } as React.CSSProperties}
    >
      <span>{label}</span>
      <input
        type="checkbox"
        className={toggleClassName}
        id={id}
        name={name}
        required={required ?? false}
        checked={checked}
        onChange={onChange}
        onBlur={onBlur}
      />
      <div
        className="slider"
        style={{ backgroundColor: checked ? onColor : offColor }}
      >
        {yes && <span className="yes">{yes}</span>}
        {no && <span className="no">{no}</span>}
      </div>
    </label>
  );
}
