import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import type { InferType } from 'yup';
import { useTranslation } from 'react-i18next';

import BlackButton from '../BlackButton';
import NumberFormControl from './NumberFormControl';
import SwitchFormControl from './SwitchFormControl';
import type { RectangleHouseConfig } from '../../types';
import { pixelsToMeters, round, metersToPixels } from '../../utils';
import { useAppDispatch } from '../../hooks';
import { updateShape, deleteShape } from '../../redux/slices/canvasSlice';
import rectangleHouseSchema from '../../schema/rectangleHouse';

const validationSchema = rectangleHouseSchema.pick(['exteriorWidth', 'exteriorHeight', 'wallThickness']).shape({
  disabled: Yup.boolean().required(),
});

interface RectangleHouseFormProps {
  shape: RectangleHouseConfig;
}

const RectangleHouseForm = ({ shape }: RectangleHouseFormProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const decimals = 2;

  const initialValues: InferType<typeof validationSchema> = {
    exteriorWidth: round(pixelsToMeters(shape.exteriorWidth), decimals),
    exteriorHeight: round(pixelsToMeters(shape.exteriorHeight), decimals),
    wallThickness: round(pixelsToMeters(shape.wallThickness), decimals),
    disabled: !shape.draggable,
  };

  const updateRedux = (newAttrs: Partial<RectangleHouseConfig>) => {
    dispatch(updateShape({ id: shape.id, newAttrs }));
  };

  const commonNumberFormProps = {
    decimals,
    disabled: !shape.draggable,
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={() => void(0)}>
      <Form>
        <NumberFormControl
          id="rectangleHouseWidth"
          name="exteriorWidth"
          label={t('forms.exteriorWidth')}
          transformedValue={pixelsToMeters(shape.exteriorWidth)}
          updateRedux={(value) => updateRedux({ exteriorWidth: metersToPixels(value) })}
          mb={3}
          {...commonNumberFormProps}
        />
        <NumberFormControl
          id="rectangleHouseHeight"
          name="exteriorHeight"
          label={t('forms.exteriorHeight')}
          transformedValue={pixelsToMeters(shape.exteriorHeight)}
          updateRedux={(value) => updateRedux({ exteriorHeight: metersToPixels(value) })}
          mb={3}
          {...commonNumberFormProps}
        />
        <NumberFormControl
          id="rectangleHouseWallThickness"
          name="wallThickness"
          label={t('forms.exteriorWallThickness')}
          transformedValue={pixelsToMeters(shape.wallThickness)}
          updateRedux={(value) => updateRedux({ wallThickness: metersToPixels(value) })}
          mb={3}
          {...commonNumberFormProps}
        />
        <SwitchFormControl
          id={`disabled-${shape.id}`}
          name="disabled"
          label={t('forms.disableEditing')}
          checked={!shape.draggable}
          updateRedux={(value) => updateRedux({ draggable: !value })}
          mb={5}
        />
        <BlackButton
          width="100%"
          disabled={!shape.draggable}
          onClick={() => dispatch(deleteShape({ id: shape.id }))}
        >
          {t('forms.deleteObject')}
        </BlackButton>
      </Form>
    </Formik>
  );
};

export default RectangleHouseForm;
