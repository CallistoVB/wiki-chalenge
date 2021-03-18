import { AxesHelper, BoxBufferGeometry, BufferGeometry, Float32BufferAttribute, MathUtils, Mesh, MeshNormalMaterial, PerspectiveCamera, Points, PointsMaterial, Scene, TextureLoader, WebGLRenderer, VertexColors, Clock, Group } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { render } from 'vue';

const count = 100000;
const distance = 20;

/* ------- Textures --------- */
const textureLoader = new TextureLoader();
const circleTexture = textureLoader.load('/img/circle.png')

/* ------- Scene & Camera ---------- */
const scene = new Scene();

scene.add(new AxesHelper())

const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;
camera.position.y = 0.5;
camera.position.x = 0.5;
scene.add(camera)

/* ------- Contruction des points -------- */
const points = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)
for(let i = 0; i < points.length; i++) {
    points[i] = MathUtils.randFloatSpread(distance * 2);
    colors[i] = Math.random();
}

const geometry = new BufferGeometry();
geometry.setAttribute('position', new Float32BufferAttribute(points, 3))
geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))
const pointsObject = new Points(
    geometry,
    new PointsMaterial({
        size: 0.3,
        vertexColors: VertexColors,
        alphaTest: 0.1,
        map: circleTexture
    })
);
const group = new Group();
group.add(pointsObject)

scene.add(group)

/* --------- Rendu ----------- */

const renderer = new WebGLRenderer({
    antialias: true,
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement)
renderer.render(scene, camera)

const controls = new OrbitControls(camera, renderer.domElement)
const clock = new Clock()

let mouseX = 0;
let mouseY = 0;
window.addEventListener('mousemove', event => {
    mouseX = event.clientX / window.innerWidth
    mouseY = event.clientY / window.innerHeight
	console.log(mouseX, mouseY)
})

const tick = (time) => {
    camera.position.x += (mouseX - camera.position.x) * 10;
    camera.position.y += (mouseY - camera.position.y) * 10;

    camera.lookAt(scene.position)

    renderer.render(scene, camera)
    requestAnimationFrame(tick)
}

requestAnimationFrame(tick)

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})