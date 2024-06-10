import { useState } from 'react';

interface Props {
  className?: string;
  id: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  value: string[];
  onChange: (name: string, items: string[]) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

/**
 * A handled input that produces an array of strings for the parent form,
 * and displays its array of values below the input.
 * @param {string} props.className
 * @param {string} props.id - The ID of the input field for purposes of relating to the label
 * @param {string} props.name - The name of the input field
 * @param {string} props.placeholder
 * @param {string[]} props.value
 * @param {function} props.onChange - A function that handles input change. It is called
 * on `Enter` keydown and on clicking an item `x` button. It accepts the field `name` and
 * the updated `value` array as parameters.
 * @param {function} props.onBlur - An optional onBlur event handler
 */
export default function ArrayInput({
  className,
  id,
  name,
  placeholder,
  required,
  value,
  onChange,
  onBlur,
}: Props) {
  const [input, setInput] = useState('');

  // on `Enter` keydown, add `input` to `value` array and pass to `onChange`
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && input.trim() !== '') {
      e.preventDefault();
      if (!value.includes(input.trim())) {
        onChange(name, [...value, input.trim()]);
        setInput('');
      }
    }
  }

  // filter item out of array
  function handleRemoveItem(item: string) {
    onChange(
      name,
      value.filter((t) => t !== item),
    );
  }

  return (
    <div>
      <input
        type="text"
        className={className}
        id={id}
        name={name}
        placeholder={placeholder ?? ''}
        required={required ?? false}
        value={input}
        onChange={(e) => setInput(e.target.value.toLowerCase())}
        onKeyDown={handleKeyDown}
        onBlur={onBlur}
      />
      {value.length > 0 && (
        <div className="flex gap-1 mt-2">
          {value.map((item, index) => (
            <span key={index} className="text-sm p-1 pl-2 rounded bg-gray-200">
              {item}
              <button
                type="button"
                className="text-base leading-none ml-[2px] w-5 h-5 rounded-2xl bg-gray-200 hover:brightness-90"
                onClick={() => handleRemoveItem(item)}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
