import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

import NumberFormControl from './NumberFormControl';
import SwitchFormControl from './SwitchFormControl';
import { DoorConfig } from '../Shapes/Door';
import { pixelsToMeters, round } from '../../utils';
import { useAppDispatch } from '../../hooks';
import { updateShape } from '../../redux/slices/shapesSlice';
import type { CustomShapeConfig } from '../../types';

const validationSchema = Yup.object({
  doorWidth: Yup.number().required().positive(),
  isExteriorDoor: Yup.boolean().required(),
  opensRight: Yup.boolean().required(),
  wallThickness: Yup.number().required().positive(),
});

interface DoorFormProps {
  door: DoorConfig;
}

const DoorForm = ({ door }: DoorFormProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const decimals = 2;

  const initialValues = {
    doorWidth: round(pixelsToMeters(door.doorWidth), decimals),
    isExteriorDoor: door.kind === 'exterior',
    opensRight: door.openingDirection === 'right',
    wallThickness: round(pixelsToMeters(door.wallThickness), decimals),
  };

  const updateRedux = (property: keyof DoorConfig, value: number | string) => {
    const newAttrs: CustomShapeConfig = {
      ...door,
      [property]: value,
    };
    dispatch(updateShape({ id: door.id, newAttrs }));
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={() => void(0) }>
      <Form>
        <NumberFormControl
          id={`doorWidth-${door.id}`}
          name="doorWidth"
          label={t('forms.doorWidth')}
          type="number"
          transformedValue={pixelsToMeters(door.doorWidth)}
          updateRedux={(value) => updateRedux('doorWidth', value)}
          decimals={decimals}
          mb={3}
        />
        <SwitchFormControl
          id={`isExteriorDoor-${door.id}`}
          name="isExteriorDoor"
          label={t('forms.doorType')}
          option1={t('forms.interior') || undefined}
          option2={t('forms.exterior') || undefined}
          checked={door.kind === 'exterior'}
          updateRedux={(value) => {
            const doorType: DoorConfig['kind'] = value ? 'exterior': 'interior';
            updateRedux('kind', doorType);
          }}
          mb={3}
        />
        <SwitchFormControl
          id={`opensRight-${door.id}`}
          name="opensRight"
          label={t('forms.doorOpeningDirection')}
          option1={t('forms.left') || undefined}
          option2={t('forms.right') || undefined}
          checked={door.openingDirection === 'right'}
          updateRedux={(value) => {
            const direction: DoorConfig['openingDirection'] = value ? 'right': 'left';
            updateRedux('openingDirection', direction);
          }}
        />
      </Form>
    </Formik>
  );
};

export default DoorForm;
