import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

import BlackButton from '../BlackButton';
import NumberFormControl from './NumberFormControl';
import SwitchFormControl from './SwitchFormControl';
import { type DoorConfig } from '../Shapes/Door';
import { pixelsToMeters, round } from '../../utils';
import { useAppDispatch } from '../../hooks';
import { updateShape, deleteShape } from '../../redux/slices/canvasSlice';

const validationSchema = Yup.object({
  doorWidth: Yup.number().required().positive(),
  isExteriorDoor: Yup.boolean().required(),
  opensRight: Yup.boolean().required(),
  wallThickness: Yup.number().required().positive(),
  disabled: Yup.boolean().required(),
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
    disabled: !door.draggable,
  };

  const updateRedux = (newAttrs: Partial<DoorConfig>) => {
    dispatch(updateShape({ id: door.id, newAttrs }));
  };

  const commonNumberFormProps = {
    decimals,
    disabled: !door.draggable,
  };

  const commonSwitchFormProps = {
    disabled: !door.draggable,
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={() => void(0) }>
      <Form>
        <NumberFormControl
          id={`doorWidth-${door.id}`}
          name="doorWidth"
          label={t('forms.doorWidth')}
          transformedValue={pixelsToMeters(door.doorWidth)}
          updateRedux={(value) => updateRedux({ doorWidth: value })}
          mb={3}
          {...commonNumberFormProps}
        />
        <NumberFormControl
          id={`wallThickness-${door.id}`}
          name="wallThickness"
          label={t('forms.wallThickness')}
          transformedValue={pixelsToMeters(door.wallThickness)}
          updateRedux={(value) => updateRedux({ wallThickness: value })}
          mb={3}
          {...commonNumberFormProps}
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
            updateRedux({ kind: doorType });
          }}
          mb={3}
          {...commonSwitchFormProps}
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
            updateRedux({ openingDirection: direction });
          }}
          mb={3}
          {...commonSwitchFormProps}
        />
        <SwitchFormControl
          id={`disabled-${door.id}`}
          name="disabled"
          label={t('forms.disableEditing')}
          checked={!door.draggable}
          updateRedux={(value) => updateRedux({ draggable: !value })}
          mb={5}
        />
        <BlackButton
          width="100%"
          disabled={!door.draggable}
          onClick={() => dispatch(deleteShape({ id: door.id }))}
        >
          {t('forms.deleteObject')}
        </BlackButton>
      </Form>
    </Formik>
  );
};

export default DoorForm;
