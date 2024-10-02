"use client"
import React from 'react';
import styled from 'styled-components';

interface GridProps {
  children: React.ReactNode;
}

export const Grid: React.FC<GridProps> = ({ children }) => {
  return (
    <StyledGrid>
      {children}
    </StyledGrid>
  );
};

interface GridItemProps {
  size: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  style: React.CSSProperties;
}

export const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(({ size, children, style }, ref) => {
  return (
    <StyledGridItem ref={ref} size={size} style={style}>
      {children}
    </StyledGridItem>
  );
});

const getGridItemSize = (size: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return '100px';
    case 'medium':
      return '150px';
    case 'large':
      return '200px';
    default:
      return '100px';
  }
};

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
`;

interface StyledGridItemProps {
  size: 'small' | 'medium' | 'large';
}

const StyledGridItem = styled.div<StyledGridItemProps>`
  width: ${({ size }) => getGridItemSize(size)};
  height: ${({ size }) => getGridItemSize(size)};
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  user-select: none;
  cursor: grab;
`;