import {
  FormControl,
  FormLabel,
  Switch,
  SwitchProps,
  Box,
} from '@chakra-ui/react';
import { useField } from 'formik';

interface SwitchFormControlProps {
  id: string;
  label: string;
  name: string;
  checked: boolean;
  option1?: string;
  option2?: string;

  updateRedux: (value: boolean) => void;
}

const SwitchFormControl = (props: SwitchFormControlProps & SwitchProps) => {
  const { id, label, name, updateRedux, checked, option1, option2, ...otherProps } = props;
  const { m, ml, mr, mt, mb, mx, my, ...switchProps } = otherProps;
  const marginProps = { m, ml, mr, mt, mb, mx, my };

  const [field, , helpers] = useField({ name, type: 'checkbox' });

  if ((typeof option1 === 'string') && (typeof option2 === 'string')) {
    return (
      <Box {...marginProps}>
        <FormLabel htmlFor={id} fontSize="sm" mb={1}>{label}</FormLabel>
        <FormControl display="flex" alignItems="center" justifyContent="center">
          <FormLabel htmlFor={id} fontSize="sm" mb={0} mr={3}>{option1}</FormLabel>
          <Switch
            id={id}
            size="md"
            isChecked={checked}
            {...switchProps}
            {...field}
            onChange={(e) => {
              helpers.setValue(e.target.checked);
              updateRedux(e.target.checked);
            }}
          />
          <FormLabel htmlFor={id} fontSize="sm" mb={0} ml={3}>{option2}</FormLabel>
        </FormControl>
      </Box>
    );
  }

  return (
    <FormControl display="flex" alignItems="center" justifyContent="space-between" {...marginProps}>
      <FormLabel htmlFor={id} fontSize="sm" mb={0}>{label}</FormLabel>
      <Switch
        id={id}
        size="md"
        isChecked={checked}
        {...switchProps}
        {...field}
        onChange={(e) => {
          helpers.setValue(e.target.checked);
          updateRedux(e.target.checked);
        }}
      />
    </FormControl>
  );
};

export default SwitchFormControl;
