import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

import BlackButton from '../BlackButton';
import NumberFormControl from './NumberFormControl';
import SwitchFormControl from './SwitchFormControl';
import type { WindowConfig } from '../../types';
import { pixelsToMeters, round, metersToPixels } from '../../utils';
import { useAppDispatch } from '../../hooks';
import { updateShape, deleteShape } from '../../redux/slices/canvasSlice';
import windowSchema from '../../schema/window';

const validationSchema = windowSchema.pick(['windowWidth', 'wallThickness']).shape({
  disabled: Yup.boolean().required(),
});

interface WindowFormProps {
  shape: WindowConfig;
}

const WindowForm = ({ shape }: WindowFormProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const decimals = 2;

  const initialValues = {
    windowWidth: round(pixelsToMeters(shape.windowWidth), decimals),
    wallThickness: round(pixelsToMeters(shape.wallThickness), decimals),
    disabled: !shape.draggable,
  };

  const updateRedux = (newAttrs: Partial<WindowConfig>) => {
    dispatch(updateShape({ id: shape.id, newAttrs }));
  };

  const commonNumberFormProps = {
    decimals,
    disabled: !shape.draggable,
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={() => void(0) }>
      <Form>
        <NumberFormControl
          id={`windowWidth-${shape.id}`}
          name="windowWidth"
          label={t('forms.width')}
          transformedValue={pixelsToMeters(shape.windowWidth)}
          updateRedux={(value) => updateRedux({ windowWidth: metersToPixels(value) })}
          mb={3}
          {...commonNumberFormProps}
        />
        <NumberFormControl
          id={`wallThickness-${shape.id}`}
          name="wallThickness"
          label={t('forms.wallThickness')}
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

export default WindowForm;
