import React, { useEffect, useRef } from 'react';

class Vector2 {
  x: number;
  y: number;

  constructor(_x: number, _y: number) {
    this.x = _x;
    this.y = _y;
  }

  add(_vec: Vector2) {
    this.x += _vec.x;
    this.y += _vec.y;
  }

  sub(_vec: Vector2) {
    this.x -= _vec.x;
    this.y -= _vec.y;
  }

  mul(_f: number) {
    this.x *= _f;
    this.y *= _f;
  }

  normalize() {
    const length = Math.sqrt(this.x * this.x + this.y * this.y);
    if (length > 0) {
      this.x /= length;
      this.y /= length;
    }
  }
}

class ConfettiPaper {
  pos: Vector2;
  rotationSpeed: number;
  angle: number;
  rotation: number;
  cosA: number;
  size: number;
  oscillationSpeed: number;
  xSpeed: number;
  ySpeed: number;
  corners: Vector2[];
  time: number;
  frontColor: string;
  backColor: string;

  static bounds: Vector2;

  constructor(_x: number, _y: number) {
    this.pos = new Vector2(_x, _y);
    this.rotationSpeed = Math.random() * 600 + 800;
    this.angle = (Math.PI / 180) * Math.random() * 360;
    this.rotation = (Math.PI / 180) * Math.random() * 360;
    this.cosA = 1.0;
    this.size = 5.0;
    this.oscillationSpeed = Math.random() * 1.5 + 0.5;
    this.xSpeed = 40.0;
    this.ySpeed = Math.random() * 60 + 50.0;
    this.corners = [];
    this.time = Math.random();

    const colors = [
      ["#df0049", "#660671"],
      ["#00e857", "#005291"],
      ["#2bebbc", "#05798a"],
      ["#ffd200", "#b06c00"],
    ];
    const ci = Math.round(Math.random() * (colors.length - 1));
    this.frontColor = colors[ci][0];
    this.backColor = colors[ci][1];

    for (let i = 0; i < 4; i++) {
      const dx = Math.cos(this.angle + (Math.PI / 180) * (i * 90 + 45));
      const dy = Math.sin(this.angle + (Math.PI / 180) * (i * 90 + 45));
      this.corners[i] = new Vector2(dx, dy);
    }
  }

  update(_dt: number) {
    this.time += _dt;
    this.rotation += this.rotationSpeed * _dt;
    this.cosA = Math.cos((Math.PI / 180) * this.rotation);
    this.pos.x += Math.cos(this.time * this.oscillationSpeed) * this.xSpeed * _dt;
    this.pos.y += this.ySpeed * _dt;
    if (this.pos.y > ConfettiPaper.bounds.y) {
      this.pos.x = Math.random() * ConfettiPaper.bounds.x;
      this.pos.y = 0;
    }
  }

  draw(_g: CanvasRenderingContext2D) {
    _g.fillStyle = this.cosA > 0 ? this.frontColor : this.backColor;
    _g.beginPath();
    _g.moveTo(
      this.pos.x + this.corners[0].x * this.size,
      this.pos.y + this.corners[0].y * this.size * this.cosA
    );
    for (let i = 1; i < 4; i++) {
      _g.lineTo(
        this.pos.x + this.corners[i].x * this.size,
        this.pos.y + this.corners[i].y * this.size * this.cosA
      );
    }
    _g.closePath();
    _g.fill();
  }
}

ConfettiPaper.bounds = new Vector2(0, 0);

class ConfettiCanvas {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  confettiPapers: ConfettiPaper[];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.confettiPapers = [];
    const confettiPaperCount = 25;

    ConfettiPaper.bounds = new Vector2(canvas.width, canvas.height);

    for (let i = 0; i < confettiPaperCount; i++) {
      this.confettiPapers.push(new ConfettiPaper(Math.random() * canvas.width, Math.random() * canvas.height));
    }

    this.update = this.update.bind(this);
    this.update();
  }

  update() {
    const dt = 1.0 / 30;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.confettiPapers.forEach(paper => {
      paper.update(dt);
      paper.draw(this.context);
    });
    requestAnimationFrame(this.update);
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    ConfettiPaper.bounds = new Vector2(this.canvas.width, this.canvas.height);
  }
}

interface ConfettiProps {
  backgroundImage?: string;
}

const SimpleConfetti: React.FC<ConfettiProps> = ({ backgroundImage = '/bg-complete.png' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const confetti = new ConfettiCanvas(canvas);
      confetti.resize(); // Garantir que o canvas seja dimensionado corretamente na inicialização
      const handleResize = () => {
        confetti.resize();
      };
  
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    } else {
      console.error("Canvas not found.");
    }
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
      <img
        src={backgroundImage}
        alt="Background"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -2 }}
      />
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default SimpleConfetti;
