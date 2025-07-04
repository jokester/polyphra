import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { MainDialogProps } from './types';
import { ActorSelector, DialogHeader, OutputCard, TextInput } from './components';
import { useActorSelection } from './useActorSelection';

export const MainDialog: React.FC<MainDialogProps> = ({ visible, onHide, origText }) => {
  const { actors, setCurrentActor, currentActor } = useActorSelection();

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={<DialogHeader />}
      modal
      draggable={false}
      resizable={false}
      closeOnEscape
      className='w-3/4 max-w-4xl'
    >
      <div className='space-y-4'>
        <TextInput
          value={origText}
          onChange={() => { }}
          readOnly
        />

        <ActorSelector
          options={actors}
          value={currentActor}
          onChange={setCurrentActor}
        />

        <OutputCard
          origText={origText}
          actor={currentActor}
          key={`output-${currentActor?.id}`}
        />
      </div>
    </Dialog>
  );
};
