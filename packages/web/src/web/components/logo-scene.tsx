import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { MoveUpRight, Smartphone } from 'lucide-react';

export default function LogoScene({ accent, dark }: { accent: string; dark: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const lightRef = useRef<THREE.PointLight | null>(null);
  const tilt = useRef({ x: 0, y: 0 });
  const [sensor, setSensor] = useState(false);
  const [sensorMessage, setSensorMessage] = useState('');
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const el = host.current; if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch { setFailed(true); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0, 0); renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.45; el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, .1, 100); camera.position.set(0, 0, 11.8);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment(); const env = pmrem.fromScene(room, .04); scene.environment = env.texture; room.dispose();
    scene.add(new THREE.AmbientLight(0xffffff, 2));
    const key = new THREE.DirectionalLight(0xffffff, 6); key.position.set(-3, 5, 6); scene.add(key);
    const accentLight = new THREE.PointLight('#00E696', 35, 20); accentLight.position.set(2, -2, 3); scene.add(accentLight); lightRef.current = accentLight;
    const group = new THREE.Group(); scene.add(group);
    const mat = new THREE.MeshPhysicalMaterial({ color: '#909e97', metalness: 1, roughness: .23, clearcoat: 1, clearcoatRoughness: .15, envMapIntensity: 2 }); materialRef.current = mat;
    let disposed = false;
    new SVGLoader().load('/images/vtg.svg', data => {
      if (disposed) return;
      data.paths.forEach(path => SVGLoader.createShapes(path).forEach(shape => {
        const geometry = new THREE.ExtrudeGeometry(shape, { depth: 12, bevelEnabled: true, bevelThickness: 2.3, bevelSize: 1.6, bevelSegments: 5, steps: 1, curveSegments: 20 });
        const mesh = new THREE.Mesh(geometry, mat); group.add(mesh);
      }));
      const box = new THREE.Box3().setFromObject(group); const center = box.getCenter(new THREE.Vector3());
      group.children.forEach(mesh => mesh.position.sub(center));
      group.scale.set(.028, -.028, .028);
    }, undefined, () => setFailed(true));
    const resize = () => { const { width, height } = el.getBoundingClientRect(); renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix(); };
    const observer = new ResizeObserver(resize); observer.observe(el); resize();
    let dragging = false, lastX = 0, lastY = 0, dx = 0, dy = 0, frame = 0;
    const down = (e: PointerEvent) => { if (e.button !== 0) return; dragging = true; lastX = e.clientX; lastY = e.clientY; el.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => { if (!dragging) return; dy += (e.clientX - lastX) * .013; dx += (e.clientY - lastY) * .013; lastX = e.clientX; lastY = e.clientY; };
    const up = () => { dragging = false; };
    el.addEventListener('pointerdown', down); el.addEventListener('pointermove', move); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clock = new THREE.Clock();
    const animate = () => { const t = clock.getElapsedTime(); if (!dragging) { dx *= .94; dy *= .94; }
      group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, .05 + dx + tilt.current.x, .09);
      group.rotation.y = (reduced ? -.22 : t * .12 - .22) + dy + tilt.current.y;
      group.rotation.z = -.05; group.position.y = reduced ? 0 : Math.sin(t * .8) * .08;
      renderer.render(scene, camera); frame = requestAnimationFrame(animate);
    }; animate();
    return () => { disposed = true; cancelAnimationFrame(frame); observer.disconnect(); el.removeEventListener('pointerdown', down); el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); group.children.forEach(m => (m as THREE.Mesh).geometry.dispose()); mat.dispose(); env.dispose(); pmrem.dispose(); renderer.dispose(); renderer.domElement.remove(); };
  }, []);
  useEffect(() => { materialRef.current?.color.set(dark ? '#becac5' : '#909e97'); lightRef.current?.color.set(accent); }, [accent, dark]);
  useEffect(() => {
    if (!sensor) return;
    const onTilt = (e: DeviceOrientationEvent) => { tilt.current = { x: THREE.MathUtils.clamp(((e.beta ?? 0) - 40) / 100, -.6, .6), y: THREE.MathUtils.clamp((e.gamma ?? 0) / 75, -.6, .6) }; };
    window.addEventListener('deviceorientation', onTilt); return () => window.removeEventListener('deviceorientation', onTilt);
  }, [sensor]);
  const enableSensor = async () => {
    try {
      if (!window.DeviceOrientationEvent) { setSensorMessage('Sensor indisponível neste dispositivo.'); return; }
      const api = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
      if (api.requestPermission && await api.requestPermission() !== 'granted') { setSensorMessage('Permissão de movimento não concedida.'); return; }
      setSensor(true); setSensorMessage('Movimento ativado');
    } catch { setSensorMessage('Não foi possível acessar o sensor.'); }
  };
  return <div className="scene-shell">
    <div className="scene-top"><span>IDENTIDADE EM MOVIMENTO</span><span>01 — VTG®</span></div>
    <div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="orbit orbit-three"/>
    <div className="platform"><div className="platform-ring"/></div>
    <div ref={host} className="three-canvas" aria-label="Logo VTG tridimensional. Clique e arraste para girar." />
    {failed && <img className="logo-fallback" src="/images/vtg.svg" alt="VTG"/>}
    <div className="scene-coordinate">X 00.00<br/>Y 00.00<br/>Z 00.01</div>
    <span className="scene-cross">+</span>
    <div className="scene-bottom"><span className="drag-note"><MoveUpRight size={13}/> ARRASTE PARA EXPLORAR</span><span>RENDERIZADO EM TEMPO REAL <i/></span></div>
    <button className="sensor-button" onClick={enableSensor}><Smartphone size={14}/>{sensorMessage || 'Ativar movimento'}</button>
  </div>;
}