import { ChangeEventHandler } from 'react';
import SearchIcon from '../icons/search';

export function SearchTextInput({
  label,
  id,
  onChange,
  value,
  placeholder,
  required,
}: {
  label?: string;
  // To associate input with label
  id?: string;
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
  value?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <>
      <label htmlFor={(id || '') + label} className='inputLabel mt-3'>
        {label}
      </label>
      <div className='relative'>
        <div className='absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none'>
          <SearchIcon className='text-quaternaryFg' />
        </div>
        <input
          type='text'
          id={(id || '') + label}
          className='bg-primaryBg border border-gray-300 text-gray-900 text-base placeholder-textPlaceholder rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 ps-10'
          placeholder={placeholder}
          required={required}
          onChange={onChange}
          value={value}
        />
      </div>
    </>
  );
}
