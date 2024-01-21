import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

import BlackButton from '../BlackButton';
import NumberFormControl from './NumberFormControl';
import SwitchFormControl from './SwitchFormControl';
import type { BoxConfig } from '../../types';
import { pixelsToMeters, round } from '../../utils';
import { useAppDispatch } from '../../hooks';
import { updateShape, deleteShape } from '../../redux/slices/canvasSlice';
import boxSchema from '../../schema/box';

const validationSchema = boxSchema.pick(['width', 'height']).shape({
  disabled: Yup.boolean().required(),
});

interface BoxFormProps {
  box: BoxConfig;
}

const BoxForm = ({ box }: BoxFormProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const decimals = 2;

  const initialValues = {
    width: round(pixelsToMeters(box.width), decimals),
    height: round(pixelsToMeters(box.height), decimals),
    disabled: !box.draggable,
  };

  const updateRedux = (newAttrs: Partial<BoxConfig>) => {
    dispatch(updateShape({ id: box.id, newAttrs }));
  };

  const commonNumberFormProps = {
    decimals,
    disabled: !box.draggable,
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={() => void(0)}>
      <Form>
        <NumberFormControl
          id="boxWidth"
          name="width"
          label={t('forms.width')}
          transformedValue={pixelsToMeters(box.width)}
          updateRedux={(value) => updateRedux({ width: value })}
          mb={3}
          {...commonNumberFormProps}
        />
        <NumberFormControl
          id="boxHeight"
          name="height"
          label={t('forms.height')}
          transformedValue={pixelsToMeters(box.height)}
          updateRedux={(value) => updateRedux({ height: value })}
          mb={3}
          {...commonNumberFormProps}
        />
        <SwitchFormControl
          id={`disabled-${box.id}`}
          name="disabled"
          label={t('forms.disableEditing')}
          checked={!box.draggable}
          updateRedux={(value) => updateRedux({ draggable: !value })}
          mb={5}
        />
        <BlackButton
          width="100%"
          disabled={!box.draggable}
          onClick={() => dispatch(deleteShape({ id: box.id }))}
        >
          {t('forms.deleteObject')}
        </BlackButton>
      </Form>
    </Formik>
  );
};

export default BoxForm;
