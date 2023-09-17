import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

import NumberFormControl from './NumberFormControl';
import { type WindowConfig } from '../Shapes/Window';
import { pixelsToMeters, round } from '../../utils';
import { useAppDispatch } from '../../hooks';
import { updateShape } from '../../redux/slices/shapesSlice';

const validationSchema = Yup.object({
  windowWidth: Yup.number().required().positive(),
  wallThickness: Yup.number().required().positive(),
});

interface WindowFormProps {
  window: WindowConfig;
}

const WindowForm = ({ window }: WindowFormProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const decimals = 2;

  const initialValues = {
    windowWidth: round(pixelsToMeters(window.windowWidth), decimals),
    wallThickness: round(pixelsToMeters(window.wallThickness), decimals),
  };

  const updateRedux = (newAttrs: Partial<WindowConfig>) => {
    dispatch(updateShape({ id: window.id, newAttrs }));
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={() => void(0) }>
      <Form>
        <NumberFormControl
          id={`windowWidth-${window.id}`}
          name="windowWidth"
          label={t('forms.width')}
          type="number"
          transformedValue={pixelsToMeters(window.windowWidth)}
          updateRedux={(value) => updateRedux({ windowWidth: value })}
          decimals={decimals}
          mb={3}
        />
        <NumberFormControl
          id={`wallThickness-${window.id}`}
          name="wallThickness"
          label={t('forms.wallThickness')}
          type="number"
          transformedValue={pixelsToMeters(window.wallThickness)}
          updateRedux={(value) => updateRedux({ wallThickness: value })}
          decimals={decimals}
          mb={3}
        />
      </Form>
    </Formik>
  );
};

export default WindowForm;
