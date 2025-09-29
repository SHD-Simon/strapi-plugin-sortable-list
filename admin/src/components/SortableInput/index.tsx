import { ChangeEvent, forwardRef, KeyboardEvent, useMemo, useState } from 'react';
import { useField, type InputProps } from '@strapi/strapi/admin';
import { Field, Flex } from '@strapi/design-system';
import { Item } from '../Item';
import { Plus } from '@strapi/icons';
import {
  closestCorners,
  DndContext,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { SortableItem } from '../SortableItem';
import { ItemProps } from 'src/types';

type SortableInputProps = InputProps & {
  attribute: {
    options: {
      inputRegex?: string;
    };
  };
};

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

function createItem(label: string): ItemProps {
  return {
    id: uid(),
    label,
  };
}

const SortableInput = forwardRef<HTMLDivElement, SortableInputProps>(
  ({ attribute, hint, disabled, labelAction, label, name, required, ...props }, ref) => {
    const field = useField(name);

    const regexPattern = attribute.options?.inputRegex;

    const [errorString, setErrorString] = useState(field.error);
    const [inputValue, setInputValue] = useState('');
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [items, setItems] = useState<ItemProps[]>(() => {
      if (Array.isArray(field.value)) {
        return field.value.map((item: string) => createItem(item));
      }
      return [];
    });
    const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );

    const regex = useMemo(() => {
      if (!regexPattern) return null;
      try {
        return new RegExp(regexPattern);
      } catch {
        setErrorString('Invalid regex input pattern');
        return null;
      }
    }, [regexPattern]);

    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
      if (event.key === 'Enter') {
        handleAdd();
      }
    }

    function handleValueChange(event: ChangeEvent<HTMLInputElement>) {
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

      setErrorString('');
    }

    function handleDelete(id: UniqueIdentifier) {
      const filteredItems = items.filter((item) => item.id !== id);
      const filteredLabels = filteredItems.map((item) => item.label);

      field.onChange(name, filteredLabels);

      setItems(filteredItems);
    }

    function handleAdd() {
      if (inputValue.trim() === '') {
        setErrorString('Item cannot be empty');
        return;
      }

      if (regex && !regex.test(inputValue)) {
        setErrorString('Failed regex test');
        return;
      }

      setErrorString('');

      const currentItems = items.map((item) => item.label);

      field.onChange(name, [...currentItems, inputValue]);

      setItems((items) => {
        return [...items, createItem(inputValue)];
      });

      setInputValue('');
    }

    function handleItemLabelChange(text: string, id: UniqueIdentifier) {
      const updatedItems = items.map((item) => (item.id === id ? { ...item, label: text } : item));
      const updatedLabels = updatedItems.map((item) => item.label);
      setItems(updatedItems);
      field.onChange(name, updatedLabels);
    }

    function handleDragOver(event: DragOverEvent) {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = items.findIndex((x) => x.id === active.id);
        const newIndex = items.findIndex((x) => x.id === over.id);

        const newArray = arrayMove(items, oldIndex, newIndex);

        setItems(newArray);
      }
    }

    function handleDragStart(event: DragStartEvent) {
      setActiveId(event.active.id);
    }

    function handleDragEnd() {
      setActiveId(null);
      const updatedLabels = items.map((item) => item.label);
      field.onChange(name, updatedLabels);
    }

    const activeLabel = items && items.find((item) => item.id === activeId)?.label;

    return (
      <div ref={ref}>
        <Field.Root
          name={name}
          id={name}
          error={field.error || errorString}
          hint={hint}
          required={required}
        >
          <Field.Label action={labelAction}>{label}</Field.Label>
          <Field.Input
            name={name}
            onChange={handleValueChange}
            value={inputValue}
            required={required}
            disabled={disabled}
            onKeyDown={handleKeyDown}
            endAction={<Plus width={16} height={16} color="neutral400" onClick={handleAdd} />}
            placeholder="Press enter to add"
          />
          <Field.Hint />
          <Field.Error />
        </Field.Root>
        {items && items.length > 0 && (
          <Flex gap={2} marginTop={3} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            {disabled ? (
              <>
                {items.map((item) => (
                  <Item
                    key={item.id}
                    id={item.id}
                    label={item.label}
                    disabled={true}
                    handleDelete={handleDelete}
                    handleItemLabelChange={handleItemLabelChange}
                  />
                ))}
              </>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragEnd}
              >
                <SortableContext items={items.map((item) => item.id)}>
                  {items.map((item) => (
                    <SortableItem
                      key={item.id}
                      id={item.id}
                      label={item.label}
                      regex={regex}
                      handleDelete={handleDelete}
                      handleItemLabelChange={handleItemLabelChange}
                    />
                  ))}
                </SortableContext>
                <DragOverlay>
                  {activeId ? (
                    <Item
                      label={activeLabel || ''}
                      id={activeId}
                      handleDelete={handleDelete}
                      handleItemLabelChange={handleItemLabelChange}
                    />
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </Flex>
        )}
      </div>
    );
  }
);

export default SortableInput;
