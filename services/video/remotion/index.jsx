import { Composition, registerRoot } from 'remotion';
import { DailyReel } from './DailyReel.jsx';

function Root() {
  return (
    <Composition
      id="DailyReel"
      component={DailyReel}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={1}
      // Length always comes from the narration audio, passed in as props (see src/steps/render.mjs).
      calculateMetadata={({ props }) => ({ durationInFrames: props.durationInFrames })}
    />
  );
}

registerRoot(Root);
