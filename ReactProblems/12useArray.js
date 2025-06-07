import React, { useState } from 'react'

type UseArrayActions<T> = {
  push: (item: T) => void,
  removeByIndex: (index: number) => void
}

export function useArray<T>(initialValue: T[]): { value: T[] } & UseArrayActions<T> {
  const [value, setValue] = React.useState(initialValue);
  const push = React.useCallback((item: T) => {
    setValue(prevValue => {
      return [...prevValue, item];
    })
  }, []);
  const removeByIndex = React.useCallback((index: number) => {
    setValue(prevValue => {
      const newValue = [...prevValue];
      newValue.splice(index, 1);
      return newValue;
    });
  }, [])
  return {value, push, removeByIndex};
}