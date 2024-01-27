import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import type { InferType } from 'yup';
import { useTranslation } from 'react-i18next';

import BlackButton from '../BlackButton';
import SwitchFormControl from './SwitchFormControl';
import type { StoveConfig } from '../../types';
import { useAppDispatch } from '../../hooks';
import { updateShape, deleteShape } from '../../redux/slices/canvasSlice';

const validationSchema = Yup.object({
  disabled: Yup.boolean().required(),
});

interface StoveFormProps {
  shape: StoveConfig;
}

const StoveForm = ({ shape }: StoveFormProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const initialValues: InferType<typeof validationSchema> = {
    disabled: !shape.draggable,
  };

  const updateRedux = (newAttrs: Partial<StoveConfig>) => {
    dispatch(updateShape({ id: shape.id, newAttrs }));
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={() => void(0)}>
      <Form>
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

export default StoveForm;
