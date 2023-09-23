import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

import NumberFormControl from './NumberFormControl';
import SwitchFormControl from './SwitchFormControl';
import { type LShapedHouseConfig } from '../Shapes/LShapedHouse';
import { pixelsToMeters, round } from '../../utils';
import { useAppDispatch } from '../../hooks';
import { updateShape } from '../../redux/slices/canvasSlice';

const validationSchema = Yup.object({
  exteriorWidth: Yup.number().required().positive(),
  exteriorHeight: Yup.number().required().positive(),
  wallThickness: Yup.number().required().positive(),
  firstWingWidth: Yup.number().required().positive(),
  secondWingWidth: Yup.number().required().positive(),
  disabled: Yup.boolean().required(),
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
    disabled: !house.draggable,
  };

  const updateRedux = (newAttrs: Partial<LShapedHouseConfig>) => {
    dispatch(updateShape({ id: house.id, newAttrs }));
  };

  const commonNumberFormProps = {
    decimals,
    disabled: !house.draggable,
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={() => void(0)}>
      <Form>
        <NumberFormControl
          id="lShapedHouseWidth"
          name="exteriorWidth"
          label={t('forms.exteriorWidth')}
          transformedValue={pixelsToMeters(house.exteriorWidth)}
          updateRedux={(value) => updateRedux({ exteriorWidth: value })}
          mb={3}
          {...commonNumberFormProps}
        />
        <NumberFormControl
          id="lShapedHouseHeight"
          name="exteriorHeight"
          label={t('forms.exteriorHeight')}
          transformedValue={pixelsToMeters(house.exteriorHeight)}
          updateRedux={(value) => updateRedux({ exteriorHeight: value })}
          mb={3}
          {...commonNumberFormProps}
        />
        <NumberFormControl
          id="lShapedHouseWallThickness"
          name="wallThickness"
          label={t('forms.exteriorWallThickness')}
          transformedValue={pixelsToMeters(house.wallThickness)}
          updateRedux={(value) => updateRedux({ wallThickness: value })}
          mb={3}
          {...commonNumberFormProps}
        />
        <NumberFormControl
          id="lShapedHouseFirstWingWidth"
          name="firstWingWidth"
          label={t('forms.firstWingWidth')}
          transformedValue={pixelsToMeters(house.firstWingWidth)}
          updateRedux={(value) => updateRedux({ firstWingWidth: value })}
          mb={3}
          {...commonNumberFormProps}
        />
        <NumberFormControl
          id="lShapedHouseSecondWingWidth"
          name="secondWingWidth"
          label={t('forms.secondWingWidth')}
          transformedValue={pixelsToMeters(house.secondWingWidth)}
          updateRedux={(value) => updateRedux({ secondWingWidth: value })}
          mb={3}
          {...commonNumberFormProps}
        />
        <SwitchFormControl
          id={`disabled-${house.id}`}
          name="disabled"
          label={t('forms.disableEditing')}
          checked={!house.draggable}
          updateRedux={(value) => updateRedux({ draggable: !value })}
        />
      </Form>
    </Formik>
  );
};

export default LShapedHouseForm;
