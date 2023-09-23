import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

import NumberFormControl from './NumberFormControl';
import SwitchFormControl from './SwitchFormControl';
import { type WallConfig } from '../Shapes/Wall';
import { pixelsToMeters, round } from '../../utils';
import { useAppDispatch } from '../../hooks';
import { updateShape } from '../../redux/slices/canvasSlice';

const validationSchema = Yup.object({
  width: Yup.number().required().positive(),
  wallThickness: Yup.number().required().positive(),
  disabled: Yup.boolean().required(),
});

interface WallFormProps {
  wall: WallConfig;
}

const WallForm = ({ wall }: WallFormProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const decimals = 2;

  const initialValues = {
    width: round(pixelsToMeters(wall.width), decimals),
    wallThickness: round(pixelsToMeters(wall.wallThickness), decimals),
    disabled: !wall.draggable,
  };

  const updateRedux = (newAttrs: Partial<WallConfig>) => {
    dispatch(updateShape({ id: wall.id, newAttrs }));
  };

  const commonNumberFormProps = {
    decimals,
    disabled: !wall.draggable,
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={() => void(0) }>
      <Form>
        <NumberFormControl
          id={`width-${wall.id}`}
          name="width"
          label={t('forms.width')}
          transformedValue={pixelsToMeters(wall.width)}
          updateRedux={(value) => updateRedux({ width: value })}
          mb={3}
          {...commonNumberFormProps}
        />
        <NumberFormControl
          id={`wallThickness-${wall.id}`}
          name="wallThickness"
          label={t('forms.wallThickness')}
          transformedValue={pixelsToMeters(wall.wallThickness)}
          updateRedux={(value) => updateRedux({ wallThickness: value })}
          mb={3}
          {...commonNumberFormProps}
        />
        <SwitchFormControl
          id={`disabled-${wall.id}`}
          name="disabled"
          label={t('forms.disableEditing')}
          checked={!wall.draggable}
          updateRedux={(value) => updateRedux({ draggable: !value })}
        />
      </Form>
    </Formik>
  );
};

export default WallForm;
