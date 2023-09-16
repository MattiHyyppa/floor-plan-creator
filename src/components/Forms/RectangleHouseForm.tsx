import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

import NumberFormControl from './NumberFormControl';
import { RectangleHouseConfig } from '../Shapes/RectangleHouse';
import { pixelsToMeters, round } from '../../utils';
import { useAppDispatch } from '../../hooks';
import { updateShape } from '../../redux/slices/shapesSlice';
import type { CustomShapeConfig } from '../../types';

const validationSchema = Yup.object({
  exteriorWidth: Yup.number().required().positive(),
  exteriorHeight: Yup.number().required().positive(),
  wallThickness: Yup.number().required().positive(),
});

interface RectangleHouseFormProps {
  house: RectangleHouseConfig;
}

const RectangleHouseForm = ({ house }: RectangleHouseFormProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const decimals = 2;

  const initialValues = {
    exteriorWidth: round(pixelsToMeters(house.exteriorWidth), decimals),
    exteriorHeight: round(pixelsToMeters(house.exteriorHeight), decimals),
    wallThickness: round(pixelsToMeters(house.wallThickness), decimals),
  };

  const updateRedux = (property: keyof RectangleHouseConfig, value: number) => {
    const newAttrs: CustomShapeConfig = {
      ...house,
      [property]: value,
    };
    dispatch(updateShape({ id: house.id, newAttrs }));
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={() => void(0)}>
      <Form>
        <NumberFormControl
          id="rectangleHouseWidth"
          name="exteriorWidth"
          label={t('forms.exteriorWidth')}
          type="number"
          transformedValue={pixelsToMeters(house.exteriorWidth)}
          updateRedux={(value) => updateRedux('exteriorWidth', value)}
          decimals={decimals}
          mb={3}
        />
        <NumberFormControl
          id="rectangleHouseHeight"
          name="exteriorHeight"
          label={t('forms.exteriorHeight')}
          type="number"
          transformedValue={pixelsToMeters(house.exteriorHeight)}
          updateRedux={(value) => updateRedux('exteriorHeight', value)}
          decimals={decimals}
          mb={3}
        />
        <NumberFormControl
          id="rectangleHouseWallThickness"
          name="wallThickness"
          label={t('forms.exteriorWallThickness')}
          type="number"
          transformedValue={pixelsToMeters(house.wallThickness)}
          updateRedux={(value) => updateRedux('wallThickness', value)}
          decimals={decimals}
        />
      </Form>
    </Formik>
  );
};

export default RectangleHouseForm;
