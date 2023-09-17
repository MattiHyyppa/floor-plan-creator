import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

import NumberFormControl from './NumberFormControl';
import SwitchFormControl from './SwitchFormControl';
import { type WindowConfig } from '../Shapes/Window';
import { pixelsToMeters, round } from '../../utils';
import { useAppDispatch } from '../../hooks';
import { updateShape } from '../../redux/slices/shapesSlice';

const validationSchema = Yup.object({
  windowWidth: Yup.number().required().positive(),
  wallThickness: Yup.number().required().positive(),
  disabled: Yup.boolean().required(),
});

interface WindowFormProps {
  window: WindowConfig;
}

const WindowForm = ({ window: w }: WindowFormProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const decimals = 2;

  const initialValues = {
    windowWidth: round(pixelsToMeters(w.windowWidth), decimals),
    wallThickness: round(pixelsToMeters(w.wallThickness), decimals),
    disabled: !w.draggable,
  };

  const updateRedux = (newAttrs: Partial<WindowConfig>) => {
    dispatch(updateShape({ id: w.id, newAttrs }));
  };

  const commonNumberFormProps = {
    decimals,
    disabled: !w.draggable,
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={() => void(0) }>
      <Form>
        <NumberFormControl
          id={`windowWidth-${w.id}`}
          name="windowWidth"
          label={t('forms.width')}
          transformedValue={pixelsToMeters(w.windowWidth)}
          updateRedux={(value) => updateRedux({ windowWidth: value })}
          mb={3}
          {...commonNumberFormProps}
        />
        <NumberFormControl
          id={`wallThickness-${w.id}`}
          name="wallThickness"
          label={t('forms.wallThickness')}
          transformedValue={pixelsToMeters(w.wallThickness)}
          updateRedux={(value) => updateRedux({ wallThickness: value })}
          mb={3}
          {...commonNumberFormProps}
        />
        <SwitchFormControl
          id={`disabled-${w.id}`}
          name="disabled"
          label={t('forms.disableEditing')}
          checked={!w.draggable}
          updateRedux={(value) => updateRedux({ draggable: !value })}
        />
      </Form>
    </Formik>
  );
};

export default WindowForm;
