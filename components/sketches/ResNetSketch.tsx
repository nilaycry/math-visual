"use client";

import { useState, useEffect, useRef } from "react";
import p5 from "p5";

export default function ResNetSketch() {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);

  // Animation state
  const [isPlaying, setIsPlaying] = useState(false);
  const playStateRef = useRef({ time: 0, active: false });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let cancelled = false;

    while (el.firstChild) el.removeChild(el.firstChild);

    const timer = setTimeout(() => {
      if (cancelled || !el) return;
      if (p5Ref.current) { p5Ref.current.remove(); p5Ref.current = null; }

      p5Ref.current = new p5((p: p5) => {
        const W = 660;
        const H = 440;
        
        const numLayers = 16;
        const startX = 60;
        const endX = W - 60;
        const spacingX = (endX - startX) / (numLayers - 1);
        
        const topY = 120; // Standard net Y
        const botY = 320; // ResNet Y

        p.setup = () => {
          p.createCanvas(W, H);
          p.textFont("Inter");
          p.noLoop();
        };

        p.draw = () => {
          p.background(13, 17, 23);

          const state = playStateRef.current;
          
          if (state.active) {
            state.time += 0.15; // Speed of backprop
            if (state.time > numLayers + 2) {
              state.active = false;
              setIsPlaying(false);
              p.noLoop();
            }
          }

          const drawNetwork = (yPos: number, isResNet: boolean) => {
            // Title
            p.fill(180); p.noStroke(); p.textAlign(p.LEFT, p.BOTTOM);
            p.textSize(14);
            p.text(isResNet ? "Residual Network" : "Standard Network", startX, yPos - 50);

            // Draw edges
            p.noFill();
            for (let i = 0; i < numLayers - 1; i++) {
              const cx1 = startX + i * spacingX;
              const cx2 = startX + (i + 1) * spacingX;
              
              // Standard edge
              p.stroke(40);
              p.strokeWeight(2);
              p.line(cx1, yPos, cx2, yPos);

              // Skip connection
              if (isResNet && i < numLayers - 2 && i % 2 === 0) {
                const cx3 = startX + (i + 2) * spacingX;
                p.stroke(60);
                p.strokeWeight(2);
                p.noFill();
                p.arc((cx1 + cx3) / 2, yPos, cx3 - cx1, 60, Math.PI, 0); // Above the line
              }
            }

            // Draw gradient flow (backward)
            if (state.active) {
              // Current pulse position (flowing right to left)
              // time 0 = layer 15, time 15 = layer 0
              for (let i = numLayers - 1; i >= 0; i--) {
                const pulseDist = state.time - (numLayers - 1 - i);
                
                // If pulse is currently bridging from i+1 to i
                if (pulseDist > 0 && pulseDist < 1) {
                   const nx1 = startX + (i + 1) * spacingX;
                   const nx2 = startX + i * spacingX;
                   const currX = p.lerp(nx1, nx2, pulseDist);
                   
                   // Decay calculation
                   const layersTravelled = numLayers - 1 - i;
                   let intensity = 1.0;
                   if (!isResNet) {
                     intensity = Math.pow(0.7, layersTravelled); // Exponential decay
                   } else {
                     // ResNet intensity decays much slower
                     intensity = Math.pow(0.95, layersTravelled); 
                   }

                   const alpha = Math.max(0.1, intensity) * 255;
                   
                   // Draw main pulse
                   p.fill(255, 80, 160, alpha);
                   p.noStroke();
                   p.circle(currX, yPos, 10);

                   // Draw skip connection pulse if applicable
                   if (isResNet && (i % 2 === 0)) {
                      // Skip spans from i+2 to i. 
                      // When time puts the pulse between i+2 and i, draw it on the arc.
                      // Wait, a skip goes from i+2 to i, so it covers 2 steps of time.
                   }
                }

                // Actually, an easier way to show ResNet is to color the edges that are passing gradient.
                // Let's illuminate the edges directly instead of drawing a moving dot.
              }
              
              // Edge Illumination Method:
              for (let i = numLayers - 1; i >= 0; i--) {
                const t = numLayers - 1 - i; // Time when node i is reached
                if (state.time >= t) {
                  const layersTravelled = t;
                  
                  let intensity = 1.0;
                  if (!isResNet) intensity = Math.pow(0.65, layersTravelled);
                  else intensity = Math.pow(0.95, Math.floor(layersTravelled / 2)); // only drops every skip block
                  
                  const c = p.color(255, 80, 160, Math.max(20, intensity * 255));
                  
                  // Node glow
                  p.noStroke();
                  p.fill(c);
                  p.circle(startX + i * spacingX, yPos, 12);
                  
                  // Trailing edge glow
                  if (i < numLayers - 1 && state.time >= t + 1) {
                    p.stroke(c);
                    p.strokeWeight(4);
                    p.line(startX + i * spacingX, yPos, startX + (i + 1) * spacingX, yPos);
                  }
                  
                  // Skip connection glow
                  if (isResNet && i % 2 === 0 && i < numLayers - 2 && state.time >= t + 2) {
                    p.stroke(c);
                    p.strokeWeight(4);
                    p.noFill();
                    p.arc(startX + (i + 1) * spacingX, yPos, spacingX * 2, 60, Math.PI, 0);
                  }
                }
              }
            }

            // Draw nodes
            p.stroke(80);
            p.strokeWeight(2);
            p.fill(20);
            for (let i = 0; i < numLayers; i++) {
              p.circle(startX + i * spacingX, yPos, 8);
            }

            // Labels
            p.fill(120); p.noStroke(); p.textAlign(p.CENTER, p.TOP);
            p.textSize(10);
            p.text("input", startX, yPos + 15);
            p.text("loss", endX, yPos + 15);
          };

          drawNetwork(topY, false);
          drawNetwork(botY, true);
        };
      }, el);
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (p5Ref.current) { p5Ref.current.remove(); p5Ref.current = null; }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fireGradient = () => {
    playStateRef.current = { time: 0, active: true };
    setIsPlaying(true);
    if (p5Ref.current) p5Ref.current.loop();
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl overflow-hidden border border-border/50 bg-card flex justify-center">
        <div ref={containerRef} />
      </div>

      <div className="flex justify-center">
        <button
          onClick={fireGradient}
          disabled={isPlaying}
          className={`px-8 py-3 rounded-lg text-sm font-medium transition-all ${
            isPlaying 
              ? "bg-secondary text-muted-foreground cursor-not-allowed" 
              : "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
          }`}
        >
          {isPlaying ? "Backpropagating..." : "Fire Gradient (Backward)"}
        </button>
      </div>
    </div>
  );
}
