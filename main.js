import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.y = 1.8;
camera.position.x = -4;
camera.position.z = 0;

camera.rotateY(1.1);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

document.body.appendChild(renderer.domElement);

// Add geometry

const loader = new GLTFLoader();

loader.load('./room.glb', function (gltf) {
  scene.add(gltf.scene);
}, undefined, (error) => {
  console.error(error);
});

// Add light
const light = new THREE.RectAreaLight( 0xffffff, 1.7 ); // soft white light
const secondaryLight = new THREE.RectAreaLight( 0xffffff, 0.5 ); // soft white light
secondaryLight.position.set(-4, 2, -4);
secondaryLight.lookAt(-6, 2, 0);

scene.add( light, secondaryLight );

// Render loop

const composer = new EffectComposer( renderer );

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const outlinePass = new OutlinePass(new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera);
outlinePass.edgeGlow = 0;
outlinePass.pulsePeriod = 2.5;
composer.addPass(outlinePass);

// Check Intersection

let selectedObjects = [];

renderer.domElement.addEventListener( 'pointermove', onPointerMove );

function onPointerMove( event ) {

  if ( event.isPrimary === false ) return;

  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  checkIntersection();

}


function animate() {
  requestAnimationFrame( animate );
  composer.render();
}

animate();

/** Helpers */

function checkIntersection() {

  raycaster.setFromCamera( mouse, camera );

  const intersects = raycaster.intersectObject( scene, true );

  if ( intersects.length > 0 ) {

    const selectedObject = intersects[ 0 ].object;
    addSelectedObject( selectedObject );
    outlinePass.selectedObjects = selectedObjects;

  } else {

    // outlinePass.selectedObjects = [];

  }

}

/**
 * 
 * @param {THREE.Mesh} object 
 */
function addSelectedObject( object ) {


  console.log(object);
  if(!object.name.includes('Surfboard')) return;

  selectedObjects = [];
  selectedObjects.push( object );
}