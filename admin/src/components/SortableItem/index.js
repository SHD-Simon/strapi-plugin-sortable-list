import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Item } from '../Item';

export function SortableItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  return (
    <Item
      ref={setNodeRef}
      id={props.id}
      style={style}
      label={props.label}
      attributes={attributes}
      listeners={listeners}
      handleDelete={props.handleDelete}
    />
  );
}
