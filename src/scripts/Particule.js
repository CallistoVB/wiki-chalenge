import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js'

export default (domElement, color) => {
    const count = 10000;

    let camera, scene, renderer, stats, material;
    let mouseX = 0, mouseY = 0;

    const width = window.innerWidth;
    const height = window.innerHeight + 200;

    let windowHalfX = width / 2;
    let windowHalfY = height / 2;

    var isMobile = false;

    init();
    if(isMobile) animateMobile();
    else animate();

    function init() {
        camera = new THREE.PerspectiveCamera( 55, width / height, 2, 2000 );
        camera.position.z = 1000;

        scene = new THREE.Scene();
        //scene.background = new THREE.Color(color)
        scene.fog = new THREE.FogExp2( 0x000000, 0.001 );

        const geometry = new THREE.BufferGeometry();
        const vertices = [];

        const sprite = new THREE.TextureLoader().load( '/img/circle.png' );

        for ( let i = 0; i < count; i ++ ) {

            const x = 2000 * Math.random() - 1000;
            const y = 2000 * Math.random() - 1000;
            const z = 2000 * Math.random() - 1000;

            vertices.push( x, y, z );

        }

        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

        material = new THREE.PointsMaterial( { size: 35, sizeAttenuation: true, map: sprite, alphaTest: 0.5, transparent: true } );
        material.color.setHSL( 1.0, 0.3, 0.7 );

        const particles = new THREE.Points( geometry, material );
        scene.add( particles );

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( width, height );
        domElement.appendChild( renderer.domElement );

        domElement.parentElement.addEventListener( 'pointermove', onPointerMove );

        window.addEventListener( 'resize', onWindowResize );


        isMobile = mobilecheck()
    }

    function onWindowResize() {

        windowHalfX = width / 2;
        windowHalfY = height / 2;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize( width, height );

    }

    function onPointerMove( event ) {

        if ( event.isPrimary === false ) return;

        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;

    }

    function animate() {
        requestAnimationFrame(animate);

        render();
    }

    function render() {
        const time = Date.now() * 0.00005;

        camera.position.x += ( mouseX - camera.position.x ) * 0.05;
        camera.position.y += ( - mouseY - camera.position.y ) * 0.05;

        camera.lookAt( scene.position );

        const h = ( 360 * ( 1.0 + time ) % 360 ) / 360;
        material.color.setHSL( h, 0.5, 0.5 );

        renderer.render( scene, camera );

    }

    function animateMobile() {
        const coords = {n: -1}
        new TWEEN.Tween(coords)
            .to({n: 1})
            .onUpdate(() => {
                camera.position.x += coords.n;
                camera.position.y += coords.n;
                camera.position.z += coords.n * 0.8;
            })
            .repeat(Infinity).yoyo(true)
            .duration(10000)
            .start()

        requestAnimationFrame(renderMobile)
    }

    function renderMobile(timeNative) {
        const time = Date.now() * 0.00005;
        
        const h = ( 360 * ( 1.0 + time ) % 360 ) / 360;
        material.color.setHSL( h, 0.5, 0.5 );

        TWEEN.update(timeNative)

        renderer.render( scene, camera );

        requestAnimationFrame(renderMobile)
    }
}