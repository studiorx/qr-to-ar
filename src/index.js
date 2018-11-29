// TODO: add found / lost listeners
// TODO: handle resize and fill screen

import { THREEx } from 'ar.js';
import { Vector3, Quaternion, Matrix4, Camera, PerspectiveCamera, WebGLRenderer, Scene, PointLight, AmbientLight, Mesh, BoxGeometry, MeshPhongMaterial } from 'three';
import { Easing, Tween, autoPlay } from 'es6-tween';

autoPlay(true);


const App = {
  width: window.innerWidth,
  height: window.innerHeight,
};
window.App = App;


let arToolkitSource;
let arToolkitContext;

let matrix = new Matrix4();

const arSuccess = () => {
  arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: 'assets/camera_para.dat',
    detectionMode: 'mono',
  });
  arToolkitContext.init(() => {
    // App.camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
  });

  const markerControls = new THREEx.ArMarkerControls(arToolkitContext, App.fakeCam, {
    type: 'pattern',
    patternUrl: 'assets/qr-marker.patt',
    changeMatrixMode: 'cameraTransformMatrix',
  });
  setTimeout(() => {
    window.arToolkitContext = arToolkitContext;
    markerControls.context.arController.setPattRatio(0.9);
  }, 500);
};

const arError = () => {
  console.log('arError');
  // App.camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 10000);
  // scene.add(camera);
  // camera.position.set(3, 2.5, -5);
  // camera.lookAt(origin);
  // window.camera = camera;
  // window.addEventListener('resize', this.watchResize);
  // this.watchResize();
  // this.animate();
};


let position = new Vector3(); // eslint-disable-line
let rotation = new Quaternion(); // eslint-disable-line
let scale = new Vector3(); // eslint-disable-line

const update = () => {
  if (arToolkitSource.ready) {
    arToolkitContext.update(arToolkitSource.domElement);
    if (arToolkitContext.arController && arToolkitContext.arController.barcodeMarkers && arToolkitContext.arController.barcodeMarkers['0']) {
      const { inCurrent, inPrevious } = arToolkitContext.arController.barcodeMarkers['0'];
      // if (inCurrent) {
      matrix = arToolkitContext.getProjectionMatrix();
      App.fakeCam.projectionMatrix.copy(matrix);

      // console.log(App.fakeCam.scale);
      App.camera.position.x = App.fakeCam.position.x;
      App.camera.position.y = App.fakeCam.position.y;
      App.camera.position.z = App.fakeCam.position.z;
      App.camera.rotation.x = App.fakeCam.rotation.x;
      App.camera.rotation.y = App.fakeCam.rotation.y;
      App.camera.rotation.z = App.fakeCam.rotation.z;
      // App.camera.rotation.set(App.fakeCam.rotation);
      // App.camera.scale.set(App.fakeCam.scale);
      // console.log(App.camera.position);
      // App.camera.matrix.set(newMatrix);

      // console.log(matrix, rotation);
      // if (!inPrevious) {
      // }
      // const newMatrix = arToolkitContext.getProjectionMatrix().toArray();
      // new Tween(matrix).to(newMatrix[0], 500).start();

      // console.log(matrix, arToolkitContext.getProjectionMatrix());

      // for (let i = 0; i < newMatrix.length; i += 1) {
      // console.log(newMatrix[i]);
      // }
      // matrix = arToolkitContext.getProjectionMatrix();
      // matrix = new Matrix4();
      // matrix.set(newMatrix);
      // } else {
      //   matrix = arToolkitContext.getProjectionMatrix();
      //   // App.camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
      // }
      // }
      // console.log(matrix.toArray());
      // App.camera.projectionMatrix.copy(matrix);
      // }
    }
  }
  App.renderer.render(App.scene, App.camera);
  requestAnimationFrame(update);
};

const init = () => {
  App.scene = new Scene();
  App.renderer = new WebGLRenderer({ antialias: true, alpha: true });
  App.el = App.renderer.domElement;
  document.body.appendChild(App.el);
  App.el.className = 'scene';
  App.light1 = new PointLight(0xffffff, 2, 2000);
  App.light2 = new AmbientLight(0xffffff, 0.25);
  App.renderer.setSize(640, 480);
  App.renderer.setPixelRatio(2);
  App.light1.position.set(App.width / 2, App.height / 2, App.height);
  App.scene.add(App.light1);
  App.scene.add(App.light2);

  App.cube = new Mesh(
    new BoxGeometry(1, 0.05, 1),
    new MeshPhongMaterial(),
  );
  App.cube.position.y = 0.025;
  App.scene.add(App.cube);

  App.camera = new PerspectiveCamera(44, 640 / 480, 0.001, 100);
  App.fakeCam = new Camera();
  App.scene.add(App.camera);
  arToolkitSource = new THREEx.ArToolkitSource({
    sourceType: 'webcam',
  });
  // try to init AR,
  // if it works, render the AR camera, if not, render a standard camera
  arToolkitSource.init(arSuccess, arError);

  update();
};


init();
