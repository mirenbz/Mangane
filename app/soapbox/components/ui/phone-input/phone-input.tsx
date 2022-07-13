import { parsePhoneNumber, AsYouType } from 'libphonenumber-js';
import React, { useState, useEffect } from 'react';

import { CountryCode } from 'soapbox/utils/phone';

import HStack from '../hstack/hstack';
import Input from '../input/input';

import CountryCodeDropdown from './country-code-dropdown';

interface IPhoneInput extends Pick<React.InputHTMLAttributes<HTMLInputElement>, 'required' | 'autoFocus'> {
  /** E164 phone number. */
  value?: string,
  /** Change handler which receives the E164 phone string. */
  onChange?: (phone: string | undefined) => void,
  /** Country code that's selected on mount. */
  defaultCountryCode?: CountryCode,
}

/** Internationalized phone input with country code picker. */
const PhoneInput: React.FC<IPhoneInput> = (props) => {
  const { value, onChange, defaultCountryCode = '1', ...rest } = props;

  const [countryCode, setCountryCode] = useState<CountryCode>(defaultCountryCode);
  const [nationalNumber, setNationalNumber] = useState<string>('');

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    // HACK: AsYouType is not meant to be used this way. But it works!
    const asYouType = new AsYouType({ defaultCallingCode: countryCode });
    const formatted = asYouType.input(target.value);

    if (formatted === nationalNumber && target.value !== nationalNumber) {
      setNationalNumber(target.value);
    } else {
      setNationalNumber(formatted);
    }
  };

  // When the internal state changes, update the external state.
  useEffect(() => {
    if (onChange) {
      try {
        const opts = { defaultCallingCode: countryCode, extract: false } as any;
        const result = parsePhoneNumber(nationalNumber, opts);

        if (!result.isPossible()) {
          throw result;
        }

        onChange(result.format('E.164'));
      } catch (e) {
        // The value returned is always a valid E164 string.
        // If it's not valid, it'll return undefined.
        onChange(undefined);
      }
    }
  }, [countryCode, nationalNumber]);

  return (
    <HStack className='mt-1 shadow-sm'>
      <div className='dark:bg-slate-800 border border-solid border-r-0 border-gray-300 dark:border-gray-600 flex items-center rounded-l-md'>
        <CountryCodeDropdown
          countryCode={countryCode}
          onChange={setCountryCode}
        />
      </div>

      <Input
        type='text'
        outerClassName='mt-0 shadow-none'
        className='rounded-l-none'
        onChange={handleChange}
        value={nationalNumber}
        {...rest}
      />
    </HStack>
  );
};

export default PhoneInput;
