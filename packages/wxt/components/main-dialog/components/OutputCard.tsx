import React, { useEffect, useMemo, useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Loader2, RefreshCw, Volume2 } from 'lucide-react';
import { useApiClient } from '@/api';
import { useAsyncEffect } from '@jokester/ts-commonutil/lib/react/hook/use-async-effect';
import { ActorSpec } from '@/api/client';
import { createDebugLogger } from '@/components/logger';
import { ProgressBar } from 'primereact/progressbar';

const logger = createDebugLogger('polyphra:components:OutputCard');

interface OutputCardProps {
  origText: string;
  actor: ActorSpec | null;
}

interface OutputState {
  paramError?: string

  rephrasedText?: string;
  rephraseError?: string

  speechUri?: string
  speechDuration?: number;
  speechError?: string;
}

export const OutputCard: React.FC<OutputCardProps> = ({
  origText,
  actor,
}) => {
  const api = useApiClient()
  const [s, setS] = useState<OutputState | null>(null)

  useAsyncEffect(async (running) => {
    if (!running.current) return;
    setS({});
    if (!origText) {
      setS({ paramError: 'No text provided' });
      return;
    }

    if (!actor) {
      setS({ paramError: 'No style selected' });
      return;
    }

    const paraphraseRes = await api.createParaphrase(actor, origText).catch(e => {
      logger('Failed to create paraphrase', e);
    })
    if (!running.current) return;
    if (!paraphraseRes?.text) {
      setS({ rephraseError: 'Failed generating text' })
      return
    } else {
      setS({ rephrasedText: paraphraseRes.text });
    }

    const ttsRes = await api.createTts(actor, paraphraseRes.text).catch(e => {
      logger('Failed to create TTS', e);
    })
    if (!running.current) return;
    if (!ttsRes?.audio_uri) {
      setS(prev => ({...prev, speechError: 'Failed generating speech' }));
      return;
    }
    setS(prev => ({...prev, speechUri: ttsRes.audio_uri, speechDuration: ttsRes.audio_duration }));

  }, [origText, actor]);

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between gap-2'>
        <label className='text-sm font-medium'>Wlll be:</label>
        <span className='flex-1' />
        <Button outlined size='small' aria-label=''>
          Read out <Volume2 className='w-4 h-4 ml-2' />
        </Button>

        {/* <Button outlined size='small' aria-label=''> Regenerate <RefreshCw className='w-4 h-4 ml-2' /> </Button> */}
      </div>
      <Card>
        <p className='text-sm leading-relaxed italic'>{s?.rephrasedText ?? <ProgressBar mode="indeterminate" style={{ height: '0.8em' }} />}</p>
      </Card>
    </div>
  );
};
