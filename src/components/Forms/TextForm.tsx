import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import type { InferType } from 'yup';
import { useTranslation } from 'react-i18next';

import BlackButton from '../BlackButton';
import NumberFormControl from './NumberFormControl';
import SwitchFormControl from './SwitchFormControl';
import TextFormControl from './TextFormControl';
import type { TextConfig } from '../../types';
import { useAppDispatch } from '../../hooks';
import { updateShape, deleteShape } from '../../redux/slices/canvasSlice';
import textSchema from '../../schema/text';

const validationSchema = textSchema.pick(['text', 'fontSize']).shape({
  disabled: Yup.boolean().required(),
});

interface TextFormProps {
  shape: TextConfig;
}

const TextForm = ({ shape }: TextFormProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const initialValues: InferType<typeof validationSchema> = {
    text: shape.text,
    fontSize: shape.fontSize,
    disabled: !shape.draggable,
  };

  const updateRedux = (newAttrs: Partial<TextConfig>) => {
    dispatch(updateShape({ id: shape.id, newAttrs }));
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={() => void(0)}>
      <Form>
        <TextFormControl
          id="text"
          name="text"
          label={t('forms.text')}
          updateRedux={(value) => updateRedux({ text: value })}
          mb={3}
          isDisabled={!shape.draggable}
        />
        <NumberFormControl
          id="fontSize"
          name="fontSize"
          label={t('forms.fontSize')}
          transformedValue={shape.fontSize}
          updateRedux={(value) => updateRedux({ fontSize: value })}
          decimals={0}
          mb={3}
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

export default TextForm;
