import { UniqueIdentifier } from '@dnd-kit/core';
import { CSSProperties } from 'react';

export type ItemProps = {
  id: UniqueIdentifier;
  label: string;
  style?: CSSProperties;
  attributes?: Record<string, any>;
  listeners?: Record<string, any>;
  disabled?: boolean;
  regex?: RegExp | null;
  handleDelete?: (id: UniqueIdentifier) => void;
  handleItemLabelChange?: (text: string, id: UniqueIdentifier) => void;
};
