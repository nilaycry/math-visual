"use client";

import dynamic from "next/dynamic";

const FourierSketch = dynamic(
  () => import("@/components/sketches/FourierSketch"),
  { ssr: false }
);

export default function FourierSeriesLesson() {
  return (
    <div>
      <h2>What is a Fourier Series?</h2>
      <p>
        One of the most beautiful ideas in mathematics is that{" "}
        <strong>any periodic function</strong> — no matter how jagged or wild —
        can be built by simply <em>adding up sine and cosine waves</em>. This is
        the core insight of the <strong>Fourier series</strong>, named after
        the French mathematician Joseph Fourier.
      </p>

      <p>
        Think of it like mixing audio frequencies: a pure tone is a single sine
        wave, but a complex sound (like a violin or a human voice) is a sum of
        many frequencies at different volumes. Fourier showed that the same
        principle works for <em>any</em> repeating pattern.
      </p>

      <h2>Building a Square Wave</h2>
      <p>
        A square wave alternates instantly between +1 and −1 — it has sharp,
        discontinuous corners that seem impossible to capture with smooth sine
        functions. Yet Fourier&apos;s formula says:
      </p>

      <div className="math-highlight">
        f(t) = (4/π) · [ sin(t) + sin(3t)/3 + sin(5t)/5 + sin(7t)/7 + … ]
      </div>

      <p>
        Each term adds an <strong>odd harmonic</strong> — a sine wave whose
        frequency is an odd multiple of the fundamental. As you add more terms,
        the sum gets closer and closer to a perfect square wave.
      </p>

      <h3>Try It: Interactive Fourier Visualizer</h3>
      <p>
        The visualization below shows epicycles (rotating circles) that trace
        the Fourier approximation. Drag the <strong>Number of Terms</strong>{" "}
        slider to see how adding more harmonics sharpens the wave.
      </p>

      <div className="not-prose my-8">
        <FourierSketch />
      </div>

      <h2>Why Epicycles?</h2>
      <p>
        Each rotating circle represents one term in the Fourier series. The
        radius of each circle is <code>4/(nπ)</code> where <em>n</em> is the
        harmonic number (1, 3, 5, …), and it rotates at frequency <em>n</em>.
        The tip of the last circle traces out the sum, and the trail on the
        right shows the waveform being produced.
      </p>

      <p>
        With just <strong>1 term</strong>, you get a pure sine wave. With{" "}
        <strong>5 terms</strong>, the square-ish shape is already recognizable.
        Crank it up to <strong>30 terms</strong> and you can see the Gibbs
        phenomenon — those tiny overshoots near the corners that never fully
        disappear, no matter how many terms you add.
      </p>

      <h2>The Gibbs Phenomenon</h2>
      <p>
        Even with infinitely many terms, the Fourier series overshoots by about{" "}
        <strong>9%</strong> at each discontinuity. This ripple is called the{" "}
        <em>Gibbs phenomenon</em>, discovered by J. Willard Gibbs in 1899. It&apos;s
        not a bug in the math — it&apos;s an unavoidable consequence of approximating
        a jump discontinuity with continuous sine waves.
      </p>

      <h2>Where Fourier Series Appear</h2>
      <ul>
        <li>
          <strong>Audio compression</strong> — MP3 and AAC use frequency
          decomposition (via the related FFT) to throw away inaudible
          frequencies
        </li>
        <li>
          <strong>Image processing</strong> — JPEG compression works by
          decomposing image blocks into cosine frequencies
        </li>
        <li>
          <strong>Signal processing</strong> — filtering noise, analyzing
          vibrations, radio transmission
        </li>
        <li>
          <strong>Quantum mechanics</strong> — wave functions are expanded in
          Fourier bases
        </li>
        <li>
          <strong>Heat equation</strong> — Fourier originally developed the
          series to solve heat conduction problems
        </li>
      </ul>

      <blockquote>
        &ldquo;Mathematics, rightly viewed, possesses not only truth, but supreme
        beauty — a beauty cold and austere, like that of sculpture.&rdquo; — Bertrand Russell
      </blockquote>
    </div>
  );
}
