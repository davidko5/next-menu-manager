import { ChangeEventHandler, HTMLAttributes } from 'react';

export function TextInput({
  label,
  onChange,
  value,
  placeholder,
  required,
}: {
  label?: string;
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
  value?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <>
      <label htmlFor={label} className='inputLabel'>
        {label}
      </label>
      <input
        type='text'
        id={label}
        className='bg-primaryBg border border-gray-300 text-gray-900 text-base placeholder-textPlaceholder rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2'
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        value={value}
      />
    </>
  );
}
