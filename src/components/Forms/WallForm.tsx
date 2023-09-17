import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

import NumberFormControl from './NumberFormControl';
import { type WallConfig } from '../Shapes/Wall';
import { pixelsToMeters, round } from '../../utils';
import { useAppDispatch } from '../../hooks';
import { updateShape } from '../../redux/slices/shapesSlice';

const validationSchema = Yup.object({
  width: Yup.number().required().positive(),
  wallThickness: Yup.number().required().positive(),
});

interface WallFormProps {
  wall: WallConfig;
}

const WallForm = ({ wall }: WallFormProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const decimals = 2;

  const initialValues = {
    width: round(pixelsToMeters(wall.width), decimals),
    wallThickness: round(pixelsToMeters(wall.wallThickness), decimals),
  };

  const updateRedux = (newAttrs: Partial<WallConfig>) => {
    dispatch(updateShape({ id: wall.id, newAttrs }));
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={() => void(0) }>
      <Form>
        <NumberFormControl
          id={`width-${wall.id}`}
          name="width"
          label={t('forms.width')}
          type="number"
          transformedValue={pixelsToMeters(wall.width)}
          updateRedux={(value) => updateRedux({ width: value })}
          decimals={decimals}
          mb={3}
        />
        <NumberFormControl
          id={`wallThickness-${wall.id}`}
          name="wallThickness"
          label={t('forms.wallThickness')}
          type="number"
          transformedValue={pixelsToMeters(wall.wallThickness)}
          updateRedux={(value) => updateRedux({ wallThickness: value })}
          decimals={decimals}
          mb={3}
        />
      </Form>
    </Formik>
  );
};

export default WallForm;
