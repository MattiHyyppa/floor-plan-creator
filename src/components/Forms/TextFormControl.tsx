import { Field, useField } from 'formik';
import { Input, FormControl, FormLabel, InputProps } from '@chakra-ui/react';

interface TextFormControlProps {
  id: string;
  label: string;
  name: string;

  updateRedux: (value: string) => void;
}

const TextFormControl = (props: TextFormControlProps & InputProps) => {
  const { id, label, name, updateRedux, ...otherProps } = props;
  const { m, ml, mr, mt, mb, mx, my, ...inputFieldProps } = otherProps;
  const marginProps = { m, ml, mr, mt, mb, mx, my };

  const [field, meta, helpers] = useField(name);

  return (
    <FormControl isInvalid={meta.error ? true : false} {...marginProps}>
      <FormLabel htmlFor={id} fontSize="sm" mb={1}>{label}</FormLabel>
      <Field
        as={Input}
        id={id}
        type="text"
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
          helpers.setValue(e.target.value);
          updateRedux(e.target.value);
        }}
      />
    </FormControl>
  );
};

export default TextFormControl;
