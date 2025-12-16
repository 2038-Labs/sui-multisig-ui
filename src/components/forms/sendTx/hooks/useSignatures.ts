import { useCallback, useEffect, useMemo, useState } from 'react';

export const useSignatures = (threshold: number) => {
  const [signatures, setSignatures] = useState<string[]>(
    Array(threshold).fill('')
  );

  const addSignature = useCallback(() => {
    setSignatures((prev) => [...prev, '']);
  }, []);

  const popSignature = useCallback(() => {
    if(signatures.length <= threshold) return;
    setSignatures((prev) => prev.slice(0, -1));
  }, [signatures, threshold]);

  const updateSignature = useCallback((index: number, newSignature: string) => {
    setSignatures((prev) => {
      const newSigs = [...prev];
      newSigs[index] = newSignature;
      return newSigs;
    });
  }, []);

  const resetSignatures = useCallback((newSignatures: string[]) => {
    setSignatures(newSignatures);
  }, []);

  useEffect(() => {
    if (signatures.length < threshold) {
      setSignatures((prev) => [
        ...prev,
        ...Array(threshold - prev.length).fill(''),
      ]);
    }
  }, [threshold]);

  return useMemo(
    () => ({
      signatures,
      addSignature,
      popSignature,
      updateSignature,
      resetSignatures,
    }),
    [signatures, addSignature, popSignature, updateSignature, resetSignatures]
  );
};
