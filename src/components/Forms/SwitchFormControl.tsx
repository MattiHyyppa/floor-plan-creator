import {
  FormControl,
  FormLabel,
  Switch,
  SwitchProps,
} from '@chakra-ui/react';
import { useField } from 'formik';

interface SwitchFormControlProps {
  id: string;
  label: string;
  name: string;
  checked: boolean;

  updateRedux: (value: boolean) => void;
}

const SwitchFormControl = (props: SwitchFormControlProps & SwitchProps) => {
  const { id, label, name, updateRedux, checked, ...otherProps } = props;
  const { m, ml, mr, mt, mb, mx, my, ...switchProps } = otherProps;
  const marginProps = { m, ml, mr, mt, mb, mx, my };

  const [field, , helpers] = useField({ name, type: 'checkbox' });

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
