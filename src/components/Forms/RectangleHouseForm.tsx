import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

import BlackButton from '../BlackButton';
import NumberFormControl from './NumberFormControl';
import SwitchFormControl from './SwitchFormControl';
import { type RectangleHouseConfig } from '../Shapes/RectangleHouse';
import { pixelsToMeters, round } from '../../utils';
import { useAppDispatch } from '../../hooks';
import { updateShape, deleteShape } from '../../redux/slices/canvasSlice';

const validationSchema = Yup.object({
  exteriorWidth: Yup.number().required().positive(),
  exteriorHeight: Yup.number().required().positive(),
  wallThickness: Yup.number().required().positive(),
  disabled: Yup.boolean().required(),
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
    disabled: !house.draggable,
  };

  const updateRedux = (newAttrs: Partial<RectangleHouseConfig>) => {
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
          id="rectangleHouseWidth"
          name="exteriorWidth"
          label={t('forms.exteriorWidth')}
          transformedValue={pixelsToMeters(house.exteriorWidth)}
          updateRedux={(value) => updateRedux({ exteriorWidth: value })}
          mb={3}
          {...commonNumberFormProps}
        />
        <NumberFormControl
          id="rectangleHouseHeight"
          name="exteriorHeight"
          label={t('forms.exteriorHeight')}
          transformedValue={pixelsToMeters(house.exteriorHeight)}
          updateRedux={(value) => updateRedux({ exteriorHeight: value })}
          mb={3}
          {...commonNumberFormProps}
        />
        <NumberFormControl
          id="rectangleHouseWallThickness"
          name="wallThickness"
          label={t('forms.exteriorWallThickness')}
          transformedValue={pixelsToMeters(house.wallThickness)}
          updateRedux={(value) => updateRedux({ wallThickness: value })}
          mb={3}
          {...commonNumberFormProps}
        />
        <SwitchFormControl
          id={`disabled-${house.id}`}
          name="disabled"
          label={t('forms.disableEditing')}
          checked={!house.draggable}
          updateRedux={(value) => updateRedux({ draggable: !value })}
          mb={5}
        />
        <BlackButton
          width="100%"
          disabled={!house.draggable}
          onClick={() => dispatch(deleteShape({ id: house.id }))}
        >
          {t('forms.deleteObject')}
        </BlackButton>
      </Form>
    </Formik>
  );
};

export default RectangleHouseForm;
