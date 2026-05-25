import React, {useEffect} from 'react';
import {cancelRender, continueRender, staticFile, useDelayRender} from 'remotion';
import {CINEMATIC_VOICEOVER_PATH} from './timing';

const LOGO_PATH = 'logo.png';

const preloadAudio = (src: string): Promise<void> =>
  new Promise((resolve, reject) => {
    const audio = document.createElement('audio');
    audio.preload = 'auto';

    const onReady = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error(`Failed to preload cinematic audio: ${src}`));
    };
    const cleanup = () => {
      audio.removeEventListener('loadedmetadata', onReady);
      audio.removeEventListener('error', onError);
    };

    audio.addEventListener('loadedmetadata', onReady, {once: true});
    audio.addEventListener('error', onError, {once: true});
    audio.src = src;
    audio.load();

    if (audio.readyState >= 1) {
      onReady();
    }
  });

const preloadImage = (src: string): Promise<void> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload cinematic image: ${src}`));
    img.src = src;
  });

/**
 * Preloads cinematic static assets with a single stable delayRender handle per mount.
 * Handle is created in useEffect (not useState) to avoid duplicate handles under concurrency.
 */
export const CinematicAssetGate: React.FC<{children: React.ReactNode}> = ({children}) => {
  const {delayRender: delay, continueRender: continue_, cancelRender: cancel} = useDelayRender();

  useEffect(() => {
    const handle = delay('Loading GovAI cinematic assets');
    let cancelled = false;

    const audioSrc = staticFile(CINEMATIC_VOICEOVER_PATH);
    const logoSrc = staticFile(LOGO_PATH);

    Promise.all([preloadAudio(audioSrc), preloadImage(logoSrc)])
      .then(() => {
        if (!cancelled) {
          continue_(handle);
        }
      })
      .catch((error: unknown) => {
        cancel(error instanceof Error ? error : new Error(String(error)));
      });

    return () => {
      cancelled = true;
      continue_(handle);
    };
  }, [delay, continue_, cancel]);

  return <>{children}</>;
};
