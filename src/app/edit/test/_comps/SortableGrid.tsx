"use client"
import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Grid, GridItem } from './GridComponents';

interface Item {
  id: string;
  size: 'small' | 'medium' | 'large'; // Size of the widgets (like iPhone widgets)
}

const initialItems: Item[] = [
  { id: '1', size: 'small' },
  { id: '2', size: 'medium' },
  { id: '3', size: 'large' },
  { id: '4', size: 'small' },
  { id: '5', size: 'medium' },
];

export const SortableGrid: React.FC = () => {
  const [items, setItems] = useState<Item[]>(initialItems);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((prev) => {
        const oldIndex = prev.findIndex((item) => item.id === active.id);
        const newIndex = prev.findIndex((item) => item.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <Grid>
          {items.map((item) => (
            <SortableGridItem key={item.id} id={item.id} size={item.size} />
          ))}
        </Grid>
      </SortableContext>
    </DndContext>
  );
};

interface SortableGridItemProps {
  id: string;
  size: 'small' | 'medium' | 'large';
}

const SortableGridItem: React.FC<SortableGridItemProps> = ({ id, size }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <GridItem ref={setNodeRef} style={style} size={size} {...attributes} {...listeners}>
      <div>{`Item ${id}`}</div>
    </GridItem>
  );
};