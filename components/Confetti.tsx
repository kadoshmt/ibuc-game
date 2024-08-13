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

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const len = this.length();
    if (len > 0) {
      this.x /= len;
      this.y /= len;
    }
  }

  static sub(_vec0: Vector2, _vec1: Vector2) {
    return new Vector2(_vec0.x - _vec1.x, _vec0.y - _vec1.y);
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

class ConfettiRibbon {
  position: Vector2;
  prevPosition: Vector2;
  particles: EulerMass[];
  particleDist: number;
  particleCount: number;
  xOff: number;
  yOff: number;
  frontColor: string;
  backColor: string;
  time: number;
  oscillationSpeed: number;
  oscillationDistance: number;
  ySpeed: number;
  velocityInherit: number;
  static bounds: Vector2;

  constructor(_x: number, _y: number, _count: number, _dist: number, _thickness: number, _angle: number, _mass: number, _drag: number) {
    this.particleDist = _dist;
    this.particleCount = _count;
    this.particles = [];
    const ci = Math.round(Math.random() * 3);
    const colors = [
      ["#df0049", "#660671"],
      ["#00e857", "#005291"],
      ["#2bebbc", "#05798a"],
      ["#ffd200", "#b06c00"]
    ];
    this.frontColor = colors[ci][0];
    this.backColor = colors[ci][1];
    this.xOff = Math.cos((Math.PI / 180) * _angle) * _thickness;
    this.yOff = Math.sin((Math.PI / 180) * _angle) * _thickness;
    this.position = new Vector2(_x, _y);
    this.prevPosition = new Vector2(_x, _y);
    this.velocityInherit = Math.random() * 2 + 4;
    this.time = Math.random() * 100;
    this.oscillationSpeed = Math.random() * 2 + 2;
    this.oscillationDistance = Math.random() * 40 + 40;
    this.ySpeed = Math.random() * 40 + 80;
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(new EulerMass(_x, _y - i * this.particleDist, _mass, _drag));
    }
  }

  update(_dt: number) {
    this.time += _dt * this.oscillationSpeed;
    this.position.y += this.ySpeed * _dt;
    this.position.x += Math.cos(this.time) * this.oscillationDistance * _dt;
    this.particles[0].position = this.position;
    const dX = this.prevPosition.x - this.position.x;
    const dY = this.prevPosition.y - this.position.y;
    const delta = Math.sqrt(dX * dX + dY * dY);
    this.prevPosition = new Vector2(this.position.x, this.position.y);
    for (let i = 1; i < this.particleCount; i++) {
      const dirP = Vector2.sub(this.particles[i - 1].position, this.particles[i].position);
      dirP.normalize();
      dirP.mul((delta / _dt) * this.velocityInherit);
      this.particles[i].addForce(dirP);
    }
    for (let i = 1; i < this.particleCount; i++) {
      this.particles[i].integrate(_dt);
    }
    for (let i = 1; i < this.particleCount; i++) {
      const rp2 = new Vector2(this.particles[i].position.x, this.particles[i].position.y);
      rp2.sub(this.particles[i - 1].position);
      rp2.normalize();
      rp2.mul(this.particleDist);
      rp2.add(this.particles[i - 1].position);
      this.particles[i].position = rp2;
    }
    if (this.position.y > ConfettiRibbon.bounds.y + this.particleDist * this.particleCount) {
      this.reset();
    }
  }

  reset() {
    this.position.y = -Math.random() * ConfettiRibbon.bounds.y;
    this.position.x = Math.random() * ConfettiRibbon.bounds.x;
    this.prevPosition = new Vector2(this.position.x, this.position.y);
    this.velocityInherit = Math.random() * 2 + 4;
    this.time = Math.random() * 100;
    this.oscillationSpeed = Math.random() * 2.0 + 1.5;
    this.oscillationDistance = Math.random() * 40 + 40;
    this.ySpeed = Math.random() * 40 + 80;
    const ci = Math.round(Math.random() * 3);
    const colors = [
      ["#df0049", "#660671"],
      ["#00e857", "#005291"],
      ["#2bebbc", "#05798a"],
      ["#ffd200", "#b06c00"]
    ];
    this.frontColor = colors[ci][0];
    this.backColor = colors[ci][1];
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(new EulerMass(this.position.x, this.position.y - i * this.particleDist, 1, 0.05));
    }
  }

  draw(_g: CanvasRenderingContext2D) {
    for (let i = 0; i < this.particleCount - 1; i++) {
      const p0 = new Vector2(this.particles[i].position.x + this.xOff, this.particles[i].position.y + this.yOff);
      const p1 = new Vector2(this.particles[i + 1].position.x + this.xOff, this.particles[i + 1].position.y + this.yOff);
      if (this.side(this.particles[i].position.x, this.particles[i].position.y, this.particles[i + 1].position.x, this.particles[i + 1].position.y, p1.x, p1.y) < 0) {
        _g.fillStyle = this.frontColor;
        _g.strokeStyle = this.frontColor;
      } else {
        _g.fillStyle = this.backColor;
        _g.strokeStyle = this.backColor;
      }
      if (i === 0) {
        _g.beginPath();
        _g.moveTo(this.particles[i].position.x, this.particles[i].position.y);
        _g.lineTo(this.particles[i + 1].position.x, this.particles[i + 1].position.y);
        _g.lineTo((this.particles[i + 1].position.x + p1.x) * 0.5, (this.particles[i + 1].position.y + p1.y) * 0.5);
        _g.closePath();
        _g.stroke();
        _g.fill();
        _g.beginPath();
        _g.moveTo(p1.x, p1.y);
        _g.lineTo(p0.x, p0.y);
        _g.lineTo((this.particles[i + 1].position.x + p1.x) * 0.5, (this.particles[i + 1].position.y + p1.y) * 0.5);
        _g.closePath();
        _g.stroke();
        _g.fill();
      } else if (i === this.particleCount - 2) {
        _g.beginPath();
        _g.moveTo(this.particles[i].position.x, this.particles[i].position.y);
        _g.lineTo(this.particles[i + 1].position.x, this.particles[i + 1].position.y);
        _g.lineTo((this.particles[i].position.x + p0.x) * 0.5, (this.particles[i].position.y + p0.y) * 0.5);
        _g.closePath();
        _g.stroke();
        _g.fill();
        _g.beginPath();
        _g.moveTo(p1.x, p1.y);
        _g.lineTo(p0.x, p0.y);
        _g.lineTo((this.particles[i].position.x + p0.x) * 0.5, (this.particles[i].position.y + p0.y) * 0.5);
        _g.closePath();
        _g.stroke();
        _g.fill();
      } else {
        _g.beginPath();
        _g.moveTo(this.particles[i].position.x, this.particles[i].position.y);
        _g.lineTo(this.particles[i + 1].position.x, this.particles[i + 1].position.y);
        _g.lineTo(p1.x, p1.y);
        _g.lineTo(p0.x, p0.y);
        _g.closePath();
        _g.stroke();
        _g.fill();
      }
    }
  }

  side(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
    return (x1 - x2) * (y3 - y2) - (y1 - y2) * (x3 - x2);
  }
}

class EulerMass {
  position: Vector2;
  velocity: Vector2;
  force: Vector2;
  mass: number;
  drag: number;

  constructor(_x: number, _y: number, _mass: number, _drag: number) {
    this.position = new Vector2(_x, _y);
    this.velocity = new Vector2(0, 0);
    this.force = new Vector2(0, 0);
    this.mass = _mass;
    this.drag = _drag;
  }

  addForce(_f: Vector2) {
    this.force.add(_f);
  }

  integrate(_dt: number) {
    const acc = this.currentForce(this.position);
    acc.mul(1 / this.mass);
    const posDelta = new Vector2(this.velocity.x, this.velocity.y);
    posDelta.mul(_dt);
    this.position.add(posDelta);
    acc.mul(_dt);
    this.velocity.add(acc);
    this.force = new Vector2(0, 0);
  }

  currentForce(_pos: Vector2) {
    const totalForce = new Vector2(this.force.x, this.force.y);
    const speed = this.velocity.length();
    const dragVel = new Vector2(this.velocity.x, this.velocity.y);
    dragVel.mul(this.drag * this.mass * speed);
    totalForce.sub(dragVel);
    return totalForce;
  }
}

ConfettiRibbon.bounds = new Vector2(0, 0);

class ConfettiCanvas {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  confettiPapers: ConfettiPaper[];
  confettiRibbons: ConfettiRibbon[];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.confettiPapers = [];
    this.confettiRibbons = [];
    const confettiPaperCount = 25;
    const confettiRibbonCount = 7;

    ConfettiPaper.bounds = new Vector2(canvas.width, canvas.height);
    ConfettiRibbon.bounds = new Vector2(canvas.width, canvas.height);

    for (let i = 0; i < confettiPaperCount; i++) {
      this.confettiPapers.push(new ConfettiPaper(Math.random() * canvas.width, Math.random() * canvas.height));
    }

    for (let i = 0; i < confettiRibbonCount; i++) {
      this.confettiRibbons.push(
        new ConfettiRibbon(
          Math.random() * canvas.width,
          -Math.random() * canvas.height * 2,
          30,
          8.0,
          8.0,
          45,
          1,
          0.05
        )
      );
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
    this.confettiRibbons.forEach(ribbon => {
      ribbon.update(dt);
      ribbon.draw(this.context);
    });
    requestAnimationFrame(this.update);
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    ConfettiPaper.bounds = new Vector2(this.canvas.width, this.canvas.height);
    ConfettiRibbon.bounds = new Vector2(this.canvas.width, this.canvas.height);
  }
}

interface ConfettiProps {
  backgroundImage?: string;
}

const Confetti: React.FC<ConfettiProps> = ({ backgroundImage = '/bg-complete.png' }) => {
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

export default Confetti;