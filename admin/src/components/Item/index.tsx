import { forwardRef, useState, ChangeEvent } from 'react';
import { Box, Flex, IconButton } from '@strapi/design-system';
import { Cross, Drag } from '@strapi/icons';
import { Field } from '@strapi/design-system';
import { ItemProps } from 'src/types';

export const Item = forwardRef<HTMLDivElement | null, ItemProps>(
  (
    {
      id,
      label,
      style,
      attributes,
      listeners,
      disabled = false,
      regex,
      handleDelete,
      handleItemLabelChange,
    },
    ref
  ) => {
    const [errorString, setErrorString] = useState('');
    const [inputValue, setInputValue] = useState(label);

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
      const value = event.target.value;
      setInputValue(value);

      if (value.trim() === '') {
        setErrorString('Item cannot be empty');
        return;
      }

      if (regex && !regex.test(value)) {
        setErrorString('Failed regex test');
        return;
      }

      handleItemLabelChange && handleItemLabelChange(event.target.value, id);

      setErrorString('');
    }

    return (
      <Box
        style={style}
        ref={ref}
        background={disabled ? 'neutral150' : 'neutral0'}
        borderColor={'neutral200'}
        hasRadius={true}
        padding={1}
      >
        <Flex gap={1}>
          <IconButton
            label="Drag"
            variant="ghost"
            disabled={disabled}
            {...attributes}
            {...listeners}
          >
            <Drag />
          </IconButton>
          <Field.Root error={errorString}>
            <Field.Input
              type="text"
              disabled={disabled}
              size="S"
              value={inputValue}
              onChange={handleChange}
            />
            <Field.Error />
          </Field.Root>
          <IconButton
            label="Delete"
            variant="ghost"
            disabled={disabled}
            onClick={() => handleDelete && handleDelete(id)}
          >
            <Cross />
          </IconButton>
        </Flex>
      </Box>
    );
  }
);
