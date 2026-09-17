import { useContext } from 'react';
import { BuilderContext } from '../state/BuilderContext';

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
}