import { useEffect, useState } from 'react';

import { useApiClient } from '../app';
import { useSingleton } from 'foxact/use-singleton';
import { ActorSpec } from '../api';
import { usePromised } from '@jokester/ts-commonutil/lib/react/hook/use-promised';
export const useActorSelection = () => {
  const api = useApiClient();
  const actorsP = useSingleton(() => api.getActors());
  const [currentActor, setCurrentActor] = useState<ActorSpec | null>(null);
  const actors = usePromised(actorsP.current);

  useEffect(() => {
    if (actors.value && actors.value.length > 0) {
      // Set the first actor as the default
      setCurrentActor(actors.value[0]);
    } else {
      setCurrentActor(null);
    }
  }, [actors]);

  return {
    actors: actors.value ?? [],
    currentActor,
    setCurrentActor,
  };
};
