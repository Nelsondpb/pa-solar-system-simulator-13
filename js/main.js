class SolarSystemSimulator {
    constructor() {
        this.initScene();
        this.initSolarSystem();
        this.initControls();
        this.animate();
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);

        this.camera = new THREE.PerspectiveCamera(75, 800 / 800, 0.1, 1000);
        this.camera.position.set(0, 50, 100);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('glCanvas'),
            antialias: true
        });
        this.renderer.setSize(800, 800);
        this.renderer.shadowMap.enabled = true;
    }

    initSolarSystem() {
        this.solarSystem = new SolarSystem(this.scene);
        this.solarSystem.createDefaultSystem();
    }

    initControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.solarSystem.update();
        this.renderer.render(this.scene, this.camera);
    }
}

window.addEventListener('load', () => {
    new SolarSystemSimulator();
});