import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

import NumberFormControl from './NumberFormControl';
import { LShapedHouseConfig } from '../Shapes/LShapedHouse';
import { pixelsToMeters, round } from '../../utils';
import { useAppDispatch } from '../../hooks';
import { updateShape } from '../../redux/slices/shapesSlice';
import type { CustomShapeConfig } from '../../types';

const validationSchema = Yup.object({
  exteriorWidth: Yup.number().required().positive(),
  exteriorHeight: Yup.number().required().positive(),
  wallThickness: Yup.number().required().positive(),
  firstWingWidth: Yup.number().required().positive(),
  secondWingWidth: Yup.number().required().positive(),
});


interface LShapedHouseFormProps {
  house: LShapedHouseConfig;
}

const LShapedHouseForm = ({ house }: LShapedHouseFormProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const decimals = 2;

  const initialValues = {
    exteriorWidth: round(pixelsToMeters(house.exteriorWidth), decimals),
    exteriorHeight: round(pixelsToMeters(house.exteriorHeight), decimals),
    wallThickness: round(pixelsToMeters(house.wallThickness), decimals),
    firstWingWidth: round(pixelsToMeters(house.firstWingWidth), decimals),
    secondWingWidth: round(pixelsToMeters(house.secondWingWidth), decimals),
  };

  const updateRedux = (property: keyof LShapedHouseConfig, value: number) => {
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
          id="lShapedHouseWidth"
          name="exteriorWidth"
          label={t('forms.exteriorWidth')}
          type="number"
          transformedValue={pixelsToMeters(house.exteriorWidth)}
          updateRedux={(value) => updateRedux('exteriorWidth', value)}
          decimals={decimals}
          mb={2}
        />
        <NumberFormControl
          id="lShapedHouseHeight"
          name="exteriorHeight"
          label={t('forms.exteriorHeight')}
          type="number"
          transformedValue={pixelsToMeters(house.exteriorHeight)}
          updateRedux={(value) => updateRedux('exteriorHeight', value)}
          decimals={decimals}
          mb={2}
        />
        <NumberFormControl
          id="lShapedHouseWallThickness"
          name="wallThickness"
          label={t('forms.exteriorWallThickness')}
          type="number"
          transformedValue={pixelsToMeters(house.wallThickness)}
          updateRedux={(value) => updateRedux('wallThickness', value)}
          decimals={decimals}
          mb={2}
        />
        <NumberFormControl
          id="lShapedHouseFirstWingWidth"
          name="firstWingWidth"
          label={t('forms.firstWingWidth')}
          type="number"
          transformedValue={pixelsToMeters(house.firstWingWidth)}
          updateRedux={(value) => updateRedux('firstWingWidth', value)}
          decimals={decimals}
          mb={2}
        />
        <NumberFormControl
          id="lShapedHouseSecondWingWidth"
          name="secondWingWidth"
          label={t('forms.secondWingWidth')}
          type="number"
          transformedValue={pixelsToMeters(house.secondWingWidth)}
          updateRedux={(value) => updateRedux('secondWingWidth', value)}
          decimals={decimals}
        />
      </Form>
    </Formik>
  );
};

export default LShapedHouseForm;
