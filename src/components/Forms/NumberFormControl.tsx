import { useEffect, useRef } from 'react';
import { Field, useField, useFormikContext } from 'formik';
import { Input, FormControl, FormLabel, InputProps } from '@chakra-ui/react';

import { round, numDecimals, metersToPixels, almostEqual } from '../../utils';

/**
 * Return a formatted version of `value`. If `value` can be converted to a valid number,
 * the conversion will be done. The converted number is returned and if it has more
 * decimal digits than `decimals`, it is rounded to having `decimals` decimal digits before
 * being returned. If the converted value is NaN, the original `value` is returned, instead.
 * However, in JavaScript, the empty string will result in 0 after being converted to a
 * number and, therefore, if `value` is an empty string, the empty string is returned.
 * This utility function can be used for formatting the value in a number input, for example,
 * when the idea is to keep the input number from having too high a precision.
 */
const getFormattedValue = (value: unknown, decimals: number) => {
  if (value === '') {
    return value;
  }

  const numberValue = Number(value);
  if (isNaN(numberValue)) {
    return value;
  }

  return (numDecimals(numberValue) > decimals) ? round(numberValue, decimals) : numberValue;
};

interface NumberFormControlProps {
  id: string;
  label: string;
  name: string;
  decimals: number;

  // The value in Redux store for the value corresponding to this input field.
  // The value in Redux store could be changed by resizing the shape using its
  // transformer using Konva. Therefore, the value in the input field needs to be
  // updated to match the state in case the state is changed in another way than
  // through the form field.
  transformedValue: number;

  updateRedux: (value: number) => void;
}

/**
 * A form control for a number input. The component takes care of rounding the input
 * field's value to certain precision given by the `decimals` prop. This form control
 * is not something that would be used in usual forms because, usually, there is no
 * need to keep the form state in Redux. However, in this app, it is required to have
 * a form which can be used for changing the Redux state. For example, the form could
 * have a number input for the width of the house drawn on the canvas and when the width
 * is changed through the form, the Redux state should change automatically to update
 * the canvas. To minimize, the connection between this component and Redux, updating
 * Redux state will be done with the `updateRedux` function given in the props so that
 * the parent component can decide how to interact with Redux.
 */
const NumberFormControl = (props: NumberFormControlProps & InputProps) => {
  const { id, label, name, transformedValue, decimals, updateRedux, ...otherProps } = props;
  const { m, ml, mr, mt, mb, mx, my, ...inputFieldProps } = otherProps;
  const marginProps = { m, ml, mr, mt, mb, mx, my };

  const [field, meta, helpers] = useField(name);
  const notRoundedFieldValue = useRef<number>(field.value);

  const { setFieldValue } = useFormikContext();

  // If the value (in Redux) has been changed in another way than through the input field,
  // we need to manually change the input field's value.
  useEffect(() => {
    if (!almostEqual(notRoundedFieldValue.current, transformedValue)) {
      const displayValue = (numDecimals(transformedValue) > decimals) ? round(transformedValue, decimals) : transformedValue;
      // Set the possibly rounded value to the input field's value...
      helpers.setValue(displayValue);
      // ... but keep the non-rounded value, too, for future comparisons with
      // the Redux state
      notRoundedFieldValue.current = transformedValue;
    }
  }, [transformedValue, decimals, helpers]);

  return (
    <FormControl isInvalid={meta.error ? true : false} {...marginProps}>
      <FormLabel htmlFor={id} fontSize="sm" mb={1}>{label}</FormLabel>
      <Field
        as={Input}
        id={id}
        type="number"
        step={Math.pow(10, -decimals)}
        size="sm"
        borderColor="gray.300"
        _hover={{ borderColor: 'gray.400' }}
        focusBorderColor={meta.error ? 'red.500' : 'blue.500'}
        rounded="md"
        bg="gray.50"
        {...inputFieldProps}
        {...field}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange={(e: any) => {
          const value = getFormattedValue(e.target.value, decimals);
          setFieldValue(name, value);
          if (typeof value === 'number') {
            updateRedux(metersToPixels(value));
          }
        }}
      />
    </FormControl>
  );
};

export default NumberFormControl;
