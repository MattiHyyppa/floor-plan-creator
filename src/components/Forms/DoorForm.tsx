import {
  RadioGroup,
  Stack,
  Radio,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

import BlackButton from '../BlackButton';
import NumberFormControl from './NumberFormControl';
import SwitchFormControl from './SwitchFormControl';
import type { DoorConfig } from '../../types';
import { pixelsToMeters, round } from '../../utils';
import { useAppDispatch } from '../../hooks';
import { updateShape, deleteShape } from '../../redux/slices/canvasSlice';
import doorSchema, { isDoorKind, isOpeningDirection } from '../../schema/door';

const validationSchema = doorSchema.pick(['doorWidth', 'kind', 'openingDirection', 'wallThickness']).shape({
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
    kind: door.kind,
    openingDirection: door.openingDirection,
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
        <FormControl>
          <FormLabel htmlFor="doorKind" fontSize="sm" mb={1}>{t('forms.doorType')}</FormLabel>
          <RadioGroup
            id="doorKind"
            name="kind"
            value={door.kind}
            onChange={value => isDoorKind(value) && updateRedux({ kind: value })}
            isDisabled={!door.draggable}
            mb={3}
          >
            <Stack direction="column">
              <Radio value="interior" size="sm">
                {t('forms.interior')}
              </Radio>
              <Radio value="exterior" size="sm">
                {t('forms.exterior')}
              </Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="openingDirection" fontSize="sm" mb={1}>{t('forms.doorOpeningDirection')}</FormLabel>
          <RadioGroup
            id="openingDirection"
            name="openingDirection"
            value={door.openingDirection}
            onChange={value => isOpeningDirection(value) && updateRedux({ openingDirection: value })}
            isDisabled={!door.draggable}
            mb={3}
          >
            <Stack direction="column">
              <Radio value="left" size="sm">
                {t('forms.left')}
              </Radio>
              <Radio value="right" size="sm">
                {t('forms.right')}
              </Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
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
