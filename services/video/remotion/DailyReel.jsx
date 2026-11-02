import { useMemo } from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { colors, fonts } from './theme.js';
import { Captions } from './Captions.jsx';
import { CopticCross } from './CopticCross.jsx';

const FADE = 12; // frames

/** Fades a scene in and out over its own Sequence. */
function Scene({ duration, children, style }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, FADE, duration - FADE, duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <AbsoluteFill style={{ opacity, ...style }}>{children}</AbsoluteFill>;
}

/** A page screenshot shown as a slowly drifting card. */
function ShotCard({ src, duration, top = 430, height = 1300, position = 'top' }) {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, duration], [1, 1.06]);
  return (
    <div
      style={{
        position: 'absolute', left: 70, right: 70, top, height,
        borderRadius: 40, overflow: 'hidden',
        border: `2px solid ${colors.line}`,
        boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
      }}
    >
      <Img
        src={staticFile(src)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: position, transform: `scale(${scale})`, transformOrigin: 'top center' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 55%, ${colors.bg} 100%)` }} />
    </div>
  );
}

const eyebrow = {
  fontFamily: fonts.body, fontSize: 34, fontWeight: 600, letterSpacing: 6,
  textTransform: 'uppercase', color: colors.gold,
};

function TitleScene({ coptic, title, duration }) {
  const frame = useCurrentFrame();
  const rise = interpolate(frame, [0, 30], [30, 0], { extrapolateRight: 'clamp' });
  return (
    <Scene duration={duration} style={{ alignItems: 'center', justifyContent: 'center', padding: 90 }}>
      <div style={{ transform: `translateY(${rise}px)`, textAlign: 'center' }}>
        <CopticCross size={200} />
        <div style={{ ...eyebrow, marginTop: 60 }}>{coptic.day} {coptic.monthName} · {coptic.year} A.M.</div>
        <div style={{ fontFamily: fonts.heading, fontWeight: 600, fontSize: 104, lineHeight: 1.05, color: colors.text, marginTop: 36 }}>
          {title}
        </div>
        {(coptic.feast || coptic.fast) && (
          <div style={{ fontFamily: fonts.body, fontSize: 38, color: colors.muted, marginTop: 36 }}>
            {[coptic.feast, coptic.fast].filter(Boolean).join(' · ')}
          </div>
        )}
      </div>
    </Scene>
  );
}

function SaintScene({ title, subtitle, images, duration }) {
  return (
    <Scene duration={duration}>
      <div style={{ position: 'absolute', top: 200, left: 90, right: 90 }}>
        <div style={eyebrow}>Remembered today</div>
        <div style={{ fontFamily: fonts.heading, fontWeight: 600, fontSize: 76, lineHeight: 1.05, color: colors.text, marginTop: 14 }}>{title}</div>
        {subtitle && <div style={{ fontFamily: fonts.body, fontSize: 34, color: colors.muted, marginTop: 12 }}>{subtitle}</div>}
      </div>
      <ShotCard src={images.icon ?? images.saint} duration={duration} top={500} height={1240} position={images.icon ? 'center' : 'top'} />
    </Scene>
  );
}

function VerseScene({ verse, words, images, duration, startFrame }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const now = (frame + startFrame) / fps;
  const body = words.slice(verse.wordRange[0], verse.wordRange[1] + 1);
  return (
    <Scene duration={duration}>
      <AbsoluteFill style={{ opacity: 0.22 }}>
        <Img src={staticFile(images.readings)} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(6px)' }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(to bottom, ${colors.bg}cc, ${colors.bg}ee)` }} />
      <div style={{ position: 'absolute', top: 260, left: 90, right: 90 }}>
        <div style={eyebrow}>Today’s Gospel</div>
        <div style={{ fontFamily: fonts.headingItalic, fontStyle: 'italic', fontWeight: 500, fontSize: 68, lineHeight: 1.28, color: colors.text, marginTop: 40 }}>
          {body.map((w, i) => (
            <span key={i} style={{ opacity: now >= w.start ? 1 : 0.35 }}>{w.text} </span>
          ))}
        </div>
        <div style={{ fontFamily: fonts.body, fontSize: 36, color: colors.gold, marginTop: 40 }}>
          {verse.ref} <span style={{ color: colors.muted }}>· World English Bible</span>
        </div>
      </div>
    </Scene>
  );
}

function ReflectionScene({ images, duration }) {
  return (
    <Scene duration={duration}>
      <ShotCard src={images.readings} duration={duration} top={260} height={1300} />
      <div style={{ position: 'absolute', top: 160, left: 90, ...eyebrow }}>Reflection</div>
    </Scene>
  );
}

function EndCard({ images, siteLabel, duration }) {
  return (
    <Scene duration={duration + FADE} style={{ alignItems: 'center', justifyContent: 'center' }}>
      <AbsoluteFill style={{ opacity: 0.18 }}>
        <Img src={staticFile(images.home)} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(10px)' }} />
      </AbsoluteFill>
      <div style={{ textAlign: 'center' }}>
        <Img src={staticFile(images.logo)} style={{ width: 220, height: 220 }} />
        <div style={{ ...eyebrow, marginTop: 50 }}>Read more on</div>
        <div style={{ fontFamily: fonts.heading, fontWeight: 600, fontSize: 112, color: colors.text, marginTop: 10 }}>copticfaith</div>
        <div style={{ fontFamily: fonts.body, fontSize: 42, color: colors.gold, marginTop: 16 }}>{siteLabel}</div>
      </div>
    </Scene>
  );
}

export function DailyReel(props) {
  const { coptic, title, subtitle, verse, words, segments, images, siteLabel, durationInFrames } = props;
  const { fps } = useVideoConfig();
  const seg = useMemo(() => Object.fromEntries(segments.map((s) => [s.id, s])), [segments]);
  const f = (t) => Math.round(t * fps);

  // Each scene starts when its segment of narration starts.
  const cuts = [
    0,
    f(seg.saint.start) - 6,
    f(seg.verse.start) - 6,
    f(seg.reflection.start) - 6,
    f(seg.closing.start) - 6,
    durationInFrames,
  ];
  const span = (i) => ({ from: cuts[i], durationInFrames: cuts[i + 1] - cuts[i] + FADE });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 30%, ${colors.gold}14, transparent 60%)` }} />
      <Audio src={staticFile('narration.mp3')} />

      <Sequence {...span(0)}><TitleScene coptic={coptic} title={title} duration={span(0).durationInFrames} /></Sequence>
      <Sequence {...span(1)}><SaintScene title={props.saintName ?? title} subtitle={subtitle} images={images} duration={span(1).durationInFrames} /></Sequence>
      <Sequence {...span(2)}><VerseScene verse={verse} words={words} images={images} duration={span(2).durationInFrames} startFrame={cuts[2]} /></Sequence>
      <Sequence {...span(3)}><ReflectionScene images={images} duration={span(3).durationInFrames} /></Sequence>
      <Sequence from={cuts[4]} durationInFrames={cuts[5] - cuts[4]}><EndCard images={images} siteLabel={siteLabel} duration={cuts[5] - cuts[4]} /></Sequence>

      {/* The verse and the closing line are on screen already, so captions skip them. */}
      <Captions words={words} skip={verse.wordRange} until={seg.closing.start} />
    </AbsoluteFill>
  );
}
