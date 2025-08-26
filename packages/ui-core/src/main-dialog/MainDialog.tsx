import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { MainDialogProps } from './types';
import { ActorSelector, DialogHeader, OutputCard, TextInput } from './components';
import { useActorSelection } from './useActorSelection';

export const MainDialog: React.FC<MainDialogProps> = ({ visible, onHide, origText }) => {
  const { actors, setCurrentActor, currentActor } = useActorSelection();
  const [text, setText] = useState(origText || "I'm glad");

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
          label=""
          value={text}
          onChange={(e) => setText(e)}
          readOnly={!!origText}
        />

        <ActorSelector
          options={actors}
          value={currentActor}
          onChange={setCurrentActor}
        />

        <OutputCard
          origText={text}
          actor={currentActor}
        />
      </div>
    </Dialog>
  );
};
