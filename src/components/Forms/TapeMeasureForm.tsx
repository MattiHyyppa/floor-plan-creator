import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import type { InferType } from 'yup';
import { useTranslation } from 'react-i18next';

import BlackButton from '../BlackButton';
import NumberFormControl from './NumberFormControl';
import SwitchFormControl from './SwitchFormControl';
import type { TapeMeasureConfig } from '../../types';
import { pixelsToMeters, round, metersToPixels } from '../../utils';
import { useAppDispatch } from '../../hooks';
import { updateShape, deleteShape } from '../../redux/slices/canvasSlice';
import tapeMeasureSchema from '../../schema/tapeMeasure';

const validationSchema = tapeMeasureSchema.pick(['width']).shape({
  disabled: Yup.boolean().required(),
});

interface TapeMeasureFormProps {
  shape: TapeMeasureConfig;
}

const TapeMeasureForm = ({ shape }: TapeMeasureFormProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const decimals = 2;

  const initialValues: InferType<typeof validationSchema> = {
    width: round(pixelsToMeters(shape.width), decimals),
    disabled: !shape.draggable,
  };

  const updateRedux = (newAttrs: Partial<TapeMeasureConfig>) => {
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
          id="tapeMeasureWidth"
          name="width"
          label={t('forms.width')}
          transformedValue={pixelsToMeters(shape.width)}
          updateRedux={(value) => updateRedux({ width: metersToPixels(value) })}
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

export default TapeMeasureForm;
