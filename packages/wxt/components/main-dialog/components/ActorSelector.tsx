import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Avatar } from 'primereact/avatar';
import { StyleSpec } from '../types';
import { styleOptions } from '../data';

interface ActorSelectorProps {
  value: StyleSpec;
  onChange: (actor: StyleSpec) => void;
}

// Custom option template for the dropdown
const renderActorOption = (option: StyleSpec) => {
  return (
    <div className='flex items-center gap-2 py-2'>
      <Avatar
        image={option.avatar || undefined}
        label={option.name.split(' ').map((n) => n[0]).join('')}
        size='normal'
        shape='circle'
      />
      <div className='flex flex-col'>
        <span className='font-medium'>{option.name}</span>
        <span className='text-xs text-gray-500'>{option.description}</span>
      </div>
    </div>
  );
};

// Selected value template for the dropdown
const renderActorValue = (option: StyleSpec, props: any) => {
  return renderActorOption(option);
};

export const ActorSelector: React.FC<ActorSelectorProps> = ({value, onChange: onActorChange}) => {
  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium'>In the style of:</label>
      <Dropdown
        value={value}
        options={styleOptions}
        onChange={(e) => onActorChange(e.value)}
        itemTemplate={renderActorOption}
        valueTemplate={renderActorValue}
        useOptionAsValue
        placeholder=''
        className='w-full'
      />
    </div>
  );
};
