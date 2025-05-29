class SolarSystemSimulator {
    constructor() {
        this.initScene();
        this.initSolarSystem();
        this.initControls();
        this.animate();
        this.addEventListeners();
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000033);

        this.camera = new THREE.PerspectiveCamera(75, 800 / 800, 0.1, 1000);
        this.camera.position.set(0, 30, 100);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('glCanvas'),
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(800, 800);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    initSolarSystem() {
        this.solarSystem = new SolarSystem(this.scene);
    }

    initControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 20;
        this.controls.maxDistance = 500;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.controls.update();
        this.solarSystem.update();

        this.renderer.render(this.scene, this.camera);
    }

    addEventListeners() {
        window.addEventListener('keydown', (e) => {
            if (e.key === ' ') this.solarSystem.paused = !this.solarSystem.paused;
        });

        window.addEventListener('beforeunload', () => {
            this.solarSystem.cleanup();
        });
    }
}

window.addEventListener('load', () => {
    try {
        new SolarSystemSimulator();
    } catch (error) {
        console.error("Erro ao iniciar simulador:", error);
        alert("Erro ao carregar o simulador. Verifique o console para detalhes.");
    }
});