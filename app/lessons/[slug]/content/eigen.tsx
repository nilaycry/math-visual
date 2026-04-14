"use client";

import dynamic from "next/dynamic";

const EigenSketch = dynamic(
  () => import("@/components/sketches/EigenSketch"),
  { ssr: false }
);

export default function EigenLesson() {
  return (
    <div>
      <h2>the directions a matrix can&apos;t change</h2>
      <p>
        The definition looks simple: Av = λv. A matrix times a vector equals a
        scalar times that same vector. I stared at that for a while before it
        meant anything. What finally made it real was drawing it.
      </p>

      <hr />

      <h3>the geometric picture</h3>
      <p>
        Take a 2×2 matrix and feed it every point on the unit circle. What comes
        out is an ellipse — the circle gets stretched and possibly rotated. Most
        vectors get knocked off their original direction entirely. But the
        eigenvectors don&apos;t. They sit exactly along the axes of that ellipse.
        The matrix can only stretch them, not rotate them. λ is just how much.
      </p>

      <p>
        The gray circle is the input. The purple ellipse is the output. The
        colored lines are eigenvectors — they pass through the transformation
        unchanged in direction. Drag the sliders or try a preset.
      </p>

      <div className="not-prose my-8">
        <EigenSketch />
      </div>

      <hr />

      <h3>the algebra, motivated by the geometry</h3>
      <p>
        If Av = λv, then (A − λI)v = 0. For that to have a nonzero solution,
        (A − λI) has to be singular — it has to squash space down a dimension.
        That only happens when its determinant is zero:
      </p>

      <div className="math-highlight">det(A − λI) = 0</div>

      <p>For a 2×2 matrix [[a,b],[c,d]] this expands to:</p>

      <div className="math-highlight">λ² − (a+d)λ + (ad−bc) = 0</div>

      <p>
        The trace (a+d) and determinant (ad−bc) fully determine the eigenvalues.
      </p>

      <hr />

      <h3>when it gets weird</h3>
      <p>
        Try the rotation preset — [[0,−1],[1,0]]. The unit circle maps back to a
        unit circle. No direction is preserved. The eigenvalues are ±i. There are
        no real eigenvectors. Everything spins.
      </p>
      <p>
        This isn&apos;t a failure of the method. It&apos;s the method telling you
        something true about the transformation.
      </p>

      <hr />

      <h3>why I actually care about this</h3>
      <p>
        I work on a market regime classification project with the UIUC Data
        Science Club. PCA comes up constantly — it&apos;s how you find the
        directions of maximum variance in high-dimensional data. Those directions
        are eigenvectors of the covariance matrix. The eigenvalues tell you how
        much variance each one captures.
      </p>
      <p>
        Understanding what eigenvalues geometrically mean makes PCA not feel like
        magic. It&apos;s just finding the axes of the ellipse your data lives on.
      </p>

      <hr />

      <h3>what this doesn&apos;t cover yet</h3>
      <p>
        Repeated eigenvalues, defective matrices (not enough eigenvectors to span
        the space), and the spectral theorem (when you&apos;re guaranteed a full
        orthogonal set). That&apos;s MATH 416 stuff. I&apos;ll add it when I get
        there this fall.
      </p>
    </div>
  );
}
