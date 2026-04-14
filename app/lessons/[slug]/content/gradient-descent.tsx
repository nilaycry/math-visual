"use client";

import dynamic from "next/dynamic";

const GradientSketch = dynamic(
  () => import("@/components/sketches/GradientSketch"),
  { ssr: false }
);

export default function GradientDescentLesson() {
  return (
    <div>
      <h2>The Big Idea</h2>
      <p>
        Imagine you&apos;re standing on a foggy mountain and need to reach the
        valley floor. You can&apos;t see far, but you can feel the ground
        beneath your feet. What do you do?{" "}
        <strong>
          You take a step in the direction the ground slopes most steeply
          downward.
        </strong>{" "}
        Repeat, and you&apos;ll eventually reach a low point.
      </p>

      <p>
        That&apos;s <em>gradient descent</em> — an algorithm that sits at the
        heart of nearly all modern machine learning, from training neural
        networks to fitting simple regression lines.
      </p>

      <h2>The Math</h2>
      <p>
        Given an objective function <code>f(x, y)</code>, the{" "}
        <strong>gradient</strong> is the vector of partial derivatives:
      </p>

      <div className="math-highlight">
        ∇f(x, y) = [ ∂f/∂x, ∂f/∂y ]
      </div>

      <p>
        The gradient points in the direction of <em>steepest ascent</em>. To
        minimize, we walk in the <em>opposite</em> direction:
      </p>

      <div className="math-highlight">
        x_{"{n+1}"} = x_n − α · ∇f(x_n)
      </div>

      <p>
        Here <strong>α</strong> (alpha) is the <em>learning rate</em> — a small
        positive number that controls step size. Too large, and you overshoot
        the minimum; too small, and convergence takes forever.
      </p>

      <h3>Try It: Interactive Gradient Descent</h3>
      <p>
        The contour plot below shows the function{" "}
        <code>f(x,y) = x² + 3y² + 0.5xy + x − 2y + 5</code>. Darker regions
        are lower values. <strong>Click anywhere</strong> to place a starting
        point, then watch the ball roll toward the minimum.
      </p>

      <div className="not-prose my-8">
        <GradientSketch />
      </div>

      <h2>The Learning Rate Matters — A Lot</h2>
      <p>
        Try experimenting with the learning rate slider above:
      </p>
      <ul>
        <li>
          <strong>Very small (0.005)</strong> — the ball creeps slowly toward the
          minimum, taking many tiny steps. Robust but painfully slow.
        </li>
        <li>
          <strong>Medium (0.05)</strong> — smooth, efficient convergence. This
          is the sweet spot for our function.
        </li>
        <li>
          <strong>Large (0.15)</strong> — the ball oscillates wildly or even
          overshoots. In extreme cases it can diverge entirely.
        </li>
      </ul>

      <h2>Convex vs Non-Convex</h2>
      <p>
        The function shown is <strong>convex</strong> — it has exactly one
        minimum, and gradient descent is guaranteed to find it. But most
        interesting problems (including training neural networks) involve{" "}
        <strong>non-convex landscapes</strong> with many local minima, saddle
        points, and plateaus.
      </p>

      <p>
        In those settings, researchers use clever modifications like{" "}
        <strong>momentum</strong> (giving the ball inertia),{" "}
        <strong>Adam optimizer</strong> (adaptive per-parameter learning rates),
        and <strong>stochastic gradient descent</strong> (using random subsets of
        data to add helpful noise).
      </p>

      <h2>Where Gradient Descent Appears</h2>
      <ul>
        <li>
          <strong>Deep learning</strong> — training every neural network from
          GPT to image classifiers
        </li>
        <li>
          <strong>Linear regression</strong> — finding the line of best fit
        </li>
        <li>
          <strong>Logistic regression</strong> — fitting classification
          boundaries
        </li>
        <li>
          <strong>Recommender systems</strong> — matrix factorization for
          Netflix-style recommendations
        </li>
        <li>
          <strong>Physics simulations</strong> — energy minimization in
          molecular dynamics
        </li>
      </ul>

      <blockquote>
        &ldquo;Gradient descent can get you to the bottom of the valley, but it
        can&apos;t tell you if you&apos;re in the deepest valley.&rdquo; — Every ML
        engineer, eventually
      </blockquote>
    </div>
  );
}
