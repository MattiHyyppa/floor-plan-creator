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
  shape: DoorConfig;
}

const DoorForm = ({ shape }: DoorFormProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const decimals = 2;

  const initialValues = {
    doorWidth: round(pixelsToMeters(shape.doorWidth), decimals),
    kind: shape.kind,
    openingDirection: shape.openingDirection,
    wallThickness: round(pixelsToMeters(shape.wallThickness), decimals),
    disabled: !shape.draggable,
  };

  const updateRedux = (newAttrs: Partial<DoorConfig>) => {
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
          id={`doorWidth-${shape.id}`}
          name="doorWidth"
          label={t('forms.doorWidth')}
          transformedValue={pixelsToMeters(shape.doorWidth)}
          updateRedux={(value) => updateRedux({ doorWidth: value })}
          mb={3}
          {...commonNumberFormProps}
        />
        <NumberFormControl
          id={`wallThickness-${shape.id}`}
          name="wallThickness"
          label={t('forms.wallThickness')}
          transformedValue={pixelsToMeters(shape.wallThickness)}
          updateRedux={(value) => updateRedux({ wallThickness: value })}
          mb={3}
          {...commonNumberFormProps}
        />
        <FormControl>
          <FormLabel htmlFor="doorKind" fontSize="sm" mb={1}>{t('forms.doorType')}</FormLabel>
          <RadioGroup
            id="doorKind"
            name="kind"
            value={shape.kind}
            onChange={value => isDoorKind(value) && updateRedux({ kind: value })}
            isDisabled={!shape.draggable}
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
            value={shape.openingDirection}
            onChange={value => isOpeningDirection(value) && updateRedux({ openingDirection: value })}
            isDisabled={!shape.draggable}
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

export default DoorForm;
