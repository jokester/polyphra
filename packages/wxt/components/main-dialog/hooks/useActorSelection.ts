import { useState } from 'react';
import { StyleSpec } from '../types';

import { styleOptions } from '../data';
export const useActorSelection = () => {
  const [selectedActor, setSelectedActor] = useState<StyleSpec>(styleOptions[0]!);

  const selectActor = (actor: StyleSpec) => {
    setSelectedActor(actor);
  };

  return {
    selectedActor,
    selectActor,
  };
};
