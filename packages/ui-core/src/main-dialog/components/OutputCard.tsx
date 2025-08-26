import React, { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Volume2 } from 'lucide-react';
import { useApiClient } from '../../app';
import { useAsyncEffect } from '@jokester/ts-commonutil/lib/react/hook/use-async-effect';
import { ResourcePool } from '@jokester/ts-commonutil/lib/concurrency/resource-pool-basic';
import { wait } from '@jokester/ts-commonutil/lib/concurrency/timing'
import { ActorSpec, PolyphraApiClient } from '../../api';
import { createDebugLogger } from '../../logger';
import { ProgressBar } from 'primereact/progressbar';

const logger = createDebugLogger('polyphra:components:OutputCard');

interface OutputCardProps {
  origText: string;
  actor: ActorSpec | null;
}

interface TtsSegment {
  text: string;
  audio_uri?: string;
  audio_duration?: number;
  error?: string;
}

interface OutputState {
  paramError?: string;

  rephrasedText?: string;
  rephraseError?: string;

  speechSegments?: TtsSegment[];
  speechError?: string;
  speechGenerationProgress?: number;
}

async function createSegments(
  api: PolyphraApiClient,
  actor: ActorSpec,
  texts: string[],
  onProgress?: (completedCount: number, totalCount: number) => void
): Promise<TtsSegment[]> {
  const segments: TtsSegment[] = texts.map(text => ({ text }));

  // Use ResourcePool to limit concurrent TTS calls (max 4 concurrent)
  const ttsPool = ResourcePool.multiple([0, 1, 2, 3]);

  // Process all segments in parallel
  const ttsPromises = segments.map(async (segment, index) => {

    try {
      const ttsRes = await ttsPool.use(() => api.createTts(actor, segment.text));

      // Update the segment with TTS result
      segments[index] = {
        ...segments[index],
        audio_uri: ttsRes.audio_uri,
        audio_duration: ttsRes.audio_duration
      };

      // Report progress if callback provided
      if (onProgress) {
        const completedSegments = segments.filter(seg => seg.audio_uri || seg.error).length;
        onProgress(completedSegments, segments.length);
      }

      return { index, success: true };

    } catch (e) {
      logger('Failed to create TTS for segment', index, e);

      // Update the segment with error
      segments[index] = {
        ...segments[index],
        error: 'Failed to generate speech'
      };

      // Report progress if callback provided
      if (onProgress) {
        const completedSegments = segments.filter(seg => seg.audio_uri || seg.error).length;
        onProgress(completedSegments, segments.length);
      }

      return { index, success: false };
    }
  });

  await Promise.all(ttsPromises);
  return segments;
}

export const OutputCard: React.FC<OutputCardProps> = ({
  origText,
  actor,
}) => {
  const api = useApiClient();
  const [s, setS] = useState<OutputState | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null)

  // Helper function to split text into segments for parallel TTS processing
  const splitTextIntoSegments = (text: string): string[] => {
    // Split by sentences, keeping punctuation
    const sentences = text.match(/[^\.!?]+[\.!?]+/g) || [text];

    // Group sentences into segments of reasonable length (max ~200 chars per segment)
    const segments: string[] = [];
    let currentSegment = '';

    for (const sentence of sentences) {
      if (currentSegment.length + sentence.length > 200 && currentSegment.length > 0) {
        segments.push(currentSegment.trim());
        currentSegment = sentence;
      } else {
        currentSegment += sentence;
      }
    }

    if (currentSegment.trim()) {
      segments.push(currentSegment.trim());
    }

    return segments.length > 0 ? segments : [text];
  };

  useAsyncEffect(async (running) => {
    await wait(0.3e3) // this also throttles the call
    if (!running.current) return;
    setS({});
    if (!origText) {
      setS({ paramError: 'Please provide some text' });
      return;
    }

    if (!actor) {
      setS({ paramError: 'Please pick a style' });
      return;
    }

    const paraphraseRes = await api.createParaphrase(actor, origText).catch(e => {
      logger('Failed to create paraphrase', e);
    });
    if (!running.current) return;
    if (!paraphraseRes?.text) {
      setS({ rephraseError: 'Failed generating text' });
      return;
    } else {
      setS({ rephrasedText: paraphraseRes.text });
    }

    // Split text into segments for parallel TTS processing
    const textSegments = splitTextIntoSegments(paraphraseRes.text);

    // Create segments with TTS using the extracted function
    try {
      const completedSegments = await createSegments(
        api,
        actor,
        textSegments,
        (completedCount, totalCount) => {
          if (!running.current) return;
          const progress = (completedCount / totalCount) * 100;
          setS(prev => ({
            ...prev,
            speechGenerationProgress: progress
          }));
        }
      );

      if (!running.current) return;

      // Update state with completed segments
      setS(prev => ({
        ...prev,
        speechSegments: completedSegments,
        speechGenerationProgress: 100
      }));

      // Check if any segments failed
      const hasErrors = completedSegments.some(segment => segment.error);
      if (hasErrors) {
        setS(prev => ({ ...prev, speechError: 'Failed to generate full voice sample' }));
      }
    } catch (e) {
      logger('Failed to create TTS segments', e);
      if (!running.current) return;
      setS(prev => ({ ...prev, speechError: 'Failed to generate voice' }));
    }
  }, [origText, actor]);

  // Sequential playback effect
  useAsyncEffect(async (running, released) => {
    if (!isPlaying || !s?.speechSegments?.length) return;

    // Only start playback if all segments are ready
    const allReady = s.speechSegments.every(segment => segment.audio_uri || segment.error);
    if (!allReady) return;

    logger('Starting sequential playback of', s.speechSegments.length, 'segments');

    // Play segments sequentially
    for (let i = 0; i < s.speechSegments.length; i++) {
      const segment = s.speechSegments[i];

      // Check if we should stop playing (check isPlaying state directly)
      if (!running.current) break;

      if (segment.audio_uri && !segment.error) {
        const audio = audioRef.current!;
        audio.src = segment.audio_uri;

        const played = new Promise<void>((resolve, reject) => {
          audio.onended = () => resolve();
          audio.onerror = (e) => reject(e);
          audio.play().catch(reject);
        })

        logger('Playing segment', i + 1, 'of', s.speechSegments.length);
        const breaked = await Promise.race([played, released.then(() => true)])
        if (breaked) {
          audio.pause();
          return;
        }

        // Check again if we should continue (user might have clicked stop)
        if (!running.current) break;
      }
    }

    // Playback finished
    logger('Sequential playback completed');
    if (running.current) {
      setIsPlaying(false);
    }
  }, [isPlaying]);

  const textOutput = s?.paramError ? (
    <p>{s.paramError}</p>
  ) : s?.rephraseError ? (
    <p>{s.rephraseError}</p>
  ) : s?.rephrasedText ?? (
    <>
      <p>Generating rephrase...</p>
      <ProgressBar mode='indeterminate' style={{ height: '0.8em' }}></ProgressBar>
    </>
  );

  const allSegmentsReady = s?.speechSegments?.every(segment =>
    segment.audio_uri || segment.error
  );

  const hasErrors = s?.paramError || s?.rephraseError;

  const playButtonText = isPlaying
    ? 'Playing...'
    : allSegmentsReady
      ? (
        <>
          Play voice<Volume2 className='w-4 h-4 ml-2' />
        </>
      )
      : 'Generating voice...';

  const handlePlayClick = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  logger('Render OutputCard', { origText, actor, state: s, isPlaying, });

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between gap-2'>
        <audio ref={audioRef} />
        <label className='text-sm font-medium'>Will be:</label>
        <span className='flex-1' />
        {!hasErrors && (
          <Button
            outlined
            disabled={!allSegmentsReady}
            onClick={handlePlayClick}
            className='w-40 justify-center'
            size='small'
            aria-label={isPlaying ? 'stop playing voice' : 'play generated voice'}
          >
            {playButtonText}
          </Button>
        )}

        {/* <Button outlined size='small' aria-label=''> Regenerate <RefreshCw className='w-4 h-4 ml-2' /> </Button> */}
      </div>

      {/* Show TTS generation progress */}
      {s?.speechSegments && !allSegmentsReady && (
        <div className='mb-2'>
          <p className='text-xs text-gray-600 mb-1'>
            Generating voice ({s.speechSegments.filter(seg => seg.audio_uri || seg.error).length}/{s.speechSegments.length} segments)
          </p>
          <ProgressBar
            value={s.speechGenerationProgress || 0}
            style={{ height: '0.5em' }}
          />
        </div>
      )}

      <Card>
        <div className='whitespace-pre-line text-sm leading-relaxed italic'>
          {textOutput}
        </div>
      </Card>
    </div>
  );
};
