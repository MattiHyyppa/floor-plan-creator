import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

import BlackButton from '../BlackButton';
import NumberFormControl from './NumberFormControl';
import SwitchFormControl from './SwitchFormControl';
import type { LShapedHouseConfig } from '../../types';
import { pixelsToMeters, round, metersToPixels } from '../../utils';
import { useAppDispatch } from '../../hooks';
import { updateShape, deleteShape } from '../../redux/slices/canvasSlice';
import lShapedHouseSchema from '../../schema/lShapedHouse';

const validationSchema = lShapedHouseSchema.pick([
  'exteriorWidth',
  'exteriorHeight',
  'wallThickness',
  'firstWingWidth',
  'secondWingWidth'
]).shape({
  disabled: Yup.boolean().required(),
});

interface LShapedHouseFormProps {
  shape: LShapedHouseConfig;
}

const LShapedHouseForm = ({ shape }: LShapedHouseFormProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const decimals = 2;

  const initialValues = {
    exteriorWidth: round(pixelsToMeters(shape.exteriorWidth), decimals),
    exteriorHeight: round(pixelsToMeters(shape.exteriorHeight), decimals),
    wallThickness: round(pixelsToMeters(shape.wallThickness), decimals),
    firstWingWidth: round(pixelsToMeters(shape.firstWingWidth), decimals),
    secondWingWidth: round(pixelsToMeters(shape.secondWingWidth), decimals),
    disabled: !shape.draggable,
  };

  const updateRedux = (newAttrs: Partial<LShapedHouseConfig>) => {
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
          id="lShapedHouseWidth"
          name="exteriorWidth"
          label={t('forms.exteriorWidth')}
          transformedValue={pixelsToMeters(shape.exteriorWidth)}
          updateRedux={(value) => updateRedux({ exteriorWidth: metersToPixels(value) })}
          mb={3}
          {...commonNumberFormProps}
        />
        <NumberFormControl
          id="lShapedHouseHeight"
          name="exteriorHeight"
          label={t('forms.exteriorHeight')}
          transformedValue={pixelsToMeters(shape.exteriorHeight)}
          updateRedux={(value) => updateRedux({ exteriorHeight: metersToPixels(value) })}
          mb={3}
          {...commonNumberFormProps}
        />
        <NumberFormControl
          id="lShapedHouseWallThickness"
          name="wallThickness"
          label={t('forms.exteriorWallThickness')}
          transformedValue={pixelsToMeters(shape.wallThickness)}
          updateRedux={(value) => updateRedux({ wallThickness: metersToPixels(value) })}
          mb={3}
          {...commonNumberFormProps}
        />
        <NumberFormControl
          id="lShapedHouseFirstWingWidth"
          name="firstWingWidth"
          label={t('forms.firstWingWidth')}
          transformedValue={pixelsToMeters(shape.firstWingWidth)}
          updateRedux={(value) => updateRedux({ firstWingWidth: metersToPixels(value) })}
          mb={3}
          {...commonNumberFormProps}
        />
        <NumberFormControl
          id="lShapedHouseSecondWingWidth"
          name="secondWingWidth"
          label={t('forms.secondWingWidth')}
          transformedValue={pixelsToMeters(shape.secondWingWidth)}
          updateRedux={(value) => updateRedux({ secondWingWidth: metersToPixels(value) })}
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

export default LShapedHouseForm;
