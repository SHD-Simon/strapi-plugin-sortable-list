import React, { forwardRef, useState } from "react";
import { useIntl } from "react-intl";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import { FieldAction, Flex, Icon, TextInput } from "@strapi/design-system";
import { Plus } from "@strapi/icons";

import { SortableItem } from "../SortableItem";
import { Item } from "../Item";
import getTrad from "../../utils/getTrad";

function createItem(label) {
  return {
    id: (Date.now() + Math.random()).toString(36),
    label,
  };
}

const SortableList = forwardRef((props, forwardedRef) => {
  const {
    attribute,
    description,
    disabled = false,
    error,
    intlLabel,
    name,
    onChange,
    required = false,
    value = "[]",
    placeholder,
  } = props;

  const { formatMessage } = useIntl();
  const [inputValue, setInputValue] = useState("");
  const [activeId, setActiveId] = useState(null);
  const [errorString, setErrorString] = useState(error);

  const [items, setItems] = useState(() => {
    const defaultItems = JSON.parse(value)
      ? JSON.parse(value).map((item) => createItem(item))
      : [];
    return defaultItems;
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      handleAdd();
    }
  }

  function handleAdd() {
    if (attribute.options?.inputRegex) {
      const regex = new RegExp(attribute.options.inputRegex);
      if (!regex.test(inputValue)) {
        setErrorString(
          formatMessage({
            id: getTrad("options.advanced.regex.error"),
            defaultMessage: "Failed regex test",
          })
        );
        return;
      }
    }

    const newValue = items.map((item) => item.label);

    onChange({
      target: {
        name,
        value: JSON.stringify([...newValue, inputValue]),
        type: attribute.type,
      },
    });

    setItems((items) => {
      return [...items, createItem(inputValue)];
    });

    setInputValue("");
    setErrorString("");
  }

  function handleDelete(itemToDelete) {
    const newArray = items.filter((item) => item.id !== itemToDelete);
    const newValue = newArray.map((item) => item.label);

    onChange({
      target: {
        name,
        value: JSON.stringify([...newValue]),
        type: attribute.type,
      },
    });

    setItems(newArray);
  }

  function handleDragOver(event) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((x) => x.id === active.id);
      const newIndex = items.findIndex((x) => x.id === over.id);

      const newArray = arrayMove(items, oldIndex, newIndex);

      setItems(newArray);
    }
  }

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  function handleDragEnd() {
    setActiveId(null);
    const newValue = items.map((item) => item.label);

    onChange({
      target: {
        name,
        value: JSON.stringify([...newValue]),
        type: attribute.type,
      },
    });
  }

  const activeLabel = items.find((item) => item.id === activeId)?.label;

  return (
    <>
      <TextInput
        label={formatMessage(intlLabel)}
        hint={description ? formatMessage(description) : false}
        name={name}
        placeholder={
          placeholder
            ? placeholder
            : formatMessage({
                id: getTrad("input.placeholder"),
                defaultMessage: "Failed regex test",
              })
        }
        onKeyDown={handleKeyDown}
        onChange={(event) => setInputValue(event.target.value)}
        value={inputValue}
        required={required}
        disabled={disabled}
        error={errorString}
        endAction={
          <FieldAction onClick={handleAdd}>
            <Icon width={3} height={3} color="neutral400" as={Plus} />
          </FieldAction>
        }
      />
      <Flex gap={2} wrap="wrap" marginTop={3}>
        {disabled ? (
          <>
            {items.map((item) => (
              <Item
                key={item.id}
                id={item.id}
                label={item.label}
                handle={true}
                handleDelete={handleDelete}
                disabled={true}
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
                  handle={true}
                  handleDelete={handleDelete}
                />
              ))}
            </SortableContext>
            <DragOverlay>
              {activeId ? (
                <Item
                  label={activeLabel}
                  id={activeId}
                  handleDelete={handleDelete}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </Flex>
    </>
  );
});

export default SortableList;
