import { THREEx } from 'ar.js';
import { Clock, Mesh, ShadowMaterial, PCFSoftShadowMap, AnimationMixer, Vector3, PerspectiveCamera, WebGLRenderer, Scene, SpotLight, PointLight, AmbientLight } from 'three';
import GLTFLoader from 'three-gltf-loader';

import './style.scss';

const App = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const clock = new Clock();

let arToolkitSource;
let arToolkitContext;
let mixer = AnimationMixer;
let animation;

const marker = {
  lost: true,
  lostCount: 0,
  lostThreshold: 20,
};

const startAnimation = () => {
  App.rendererEl.classList.remove('hidden');

  clock.stop();
  clock.start();
  mixer.time = 0;

  mixer.clipAction(animation).play();
};

const markerFound = () => {
  marker.lostCount = 0;
  if (marker.lost) {
    marker.lost = false;
    startAnimation();
  }
};

const update = () => {
  marker.lostCount += 1;
  if (!marker.lost && marker.lostCount > marker.lostThreshold) {
    marker.lost = true;
    // App.scene.visible = false;
    App.rendererEl.classList.add('hidden');
    mixer.stopAllAction();
  }
  if (mixer.time < 2) {
    mixer.update(clock.getDelta());
  }
  arToolkitContext.update(arToolkitSource.domElement);

  App.renderer.render(App.scene, App.camera);
  requestAnimationFrame(update);
};

const arReady = () => {
  arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: 'assets/camera_para.dat',
    detectionMode: 'color',
    maxDetectionRate: 60,
  });

  const markerControls = new THREEx.ArMarkerControls(arToolkitContext, App.camera, {
    type: 'pattern',
    patternUrl: 'assets/pattern-marker.patt',
    changeMatrixMode: 'cameraTransformMatrix',
  });

  arToolkitContext.init(() => {
    markerControls.context.arController.setPattRatio(0.8);
    markerControls.addEventListener('markerFound', markerFound);
    update();
  });
};

const arError = () => {
  console.log('arError');
};

const init = () => {
  App.scene = new Scene();
  App.renderer = new WebGLRenderer({ antialias: true, alpha: true });
  App.renderer.shadowMap.enabled = true;
  App.shadowMapType = PCFSoftShadowMap;
  App.rendererEl = App.renderer.domElement;
  document.body.appendChild(App.rendererEl);
  App.rendererEl.className = 'scene hidden';
  App.light1 = new SpotLight(0xffffff);
  App.light2 = new AmbientLight(0xffffff, 1);
  App.renderer.setSize(640, 480);
  App.renderer.setPixelRatio(1);

  const loader = new GLTFLoader();
  loader.load('assets/models/marker.gltf', (gltf) => {
    gltf.scene.scale.set(0.1, 0.1, 0.1);
    gltf.scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    const hide = gltf.scene.getObjectByName('hide');
    const shadow = gltf.scene.getObjectByName('shadow');
    hide.renderOrder = 0;
    hide.material.colorWrite = false;
    shadow.material = new ShadowMaterial();
    mixer = new AnimationMixer(gltf.scene);
    animation = gltf.animations[0]; // eslint-disable-line
    App.scene.add(gltf.scene);
  });
  App.light1.position.set(5, 8, 2);
  App.light1.lookAt(0, 0, 0);
  App.light1.intensity = 1;
  App.light1.castShadow = true;
  App.light1.shadow.mapSize.width = 1024;
  App.light1.shadow.mapSize.height = 1024;
  App.light1.shadow.camera.near = 0.5;
  App.light1.shadow.camera.far = 30;
  App.light1.shadow.camera.fov = 150;
  App.scene.add(App.light1);
  App.scene.add(App.light2);

  App.camera = new PerspectiveCamera(42.5, 640 / 480, 0.001, 2000);
  App.camera.position.set(50, 25, 50);
  App.camera.setFocalLength(33);
  App.camera.lookAt(new Vector3());

  App.scene.add(App.camera);
  arToolkitSource = new THREEx.ArToolkitSource({ sourceType: 'webcam' });

  // try to init AR,
  // if it works, render the AR camera, if not, render a standard camera
  arToolkitSource.init(arReady, arError);
};


init();
