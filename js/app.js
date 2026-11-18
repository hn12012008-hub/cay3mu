// Main Application Controller: Three.js Scene, Raycasting, UI Controller
class MechanicalApp {
    constructor() {
        this.container = document.getElementById('viewport-container');
        this.currentModelType = 'engine'; // 'engine', 'planetary', 'steering'
        this.currentModel = null;

        // Kinematics & Animation State
        this.isPlaying = true;
        this.rpm = 900; // Default idle RPM
        this.angle = 0; // Current cycle angle in radians
        this.explodedFactor = 0; // 0 to 1
        this.renderMode = 'shaded'; // 'shaded', 'wireframe', 'xray'

        // Audio
        this.audio = new MechanicalAudio();

        // Raycasting
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.hoveredMesh = null;
        this.selectedPartKey = null;

        this.initThree();
        this.initLights();
        this.initControls();
        this.loadModel('engine');
        this.bindUIEvents();
        this.initResize();

        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    initThree() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0b0f17); // Dark high-tech CAD slate

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            45,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            200
        );
        this.camera.position.set(16, 12, 22);

        // WebGL Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.25;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.container.appendChild(this.renderer.domElement);

        // Subtle Studio Floor Grid
        const gridHelper = new THREE.GridHelper(30, 30, 0x334155, 0x1e293b);
        gridHelper.position.y = -6.5;
        this.scene.add(gridHelper);
    }

    initLights() {
        // Ambient soft light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);

        // Key Light (Warm daylight)
        const keyLight = new THREE.DirectionalLight(0xfff8ee, 1.4);
        keyLight.position.set(18, 25, 20);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        keyLight.shadow.bias = -0.0001;
        this.scene.add(keyLight);

        // Fill Light (Cool blue)
        const fillLight = new THREE.DirectionalLight(0x7dd3fc, 0.8);
        fillLight.position.set(-18, 12, -15);
        this.scene.add(fillLight);

        // Rim / Back Light (High-tech cyan accent)
        const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.0);
        rimLight.position.set(0, -10, -20);
        this.scene.add(rimLight);
    }

    initControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxDistance = 60;
        this.controls.minDistance = 3;
        this.controls.target.set(0, 4.5, 0); // Focus on engine mid-block
    }

    loadModel(type) {
        if (this.currentModel) {
            this.currentModel.destroy();
            this.currentModel = null;
        }

        this.currentModelType = type;
        this.selectedPartKey = null;
        this.closePartInspector();

        if (type === 'engine') {
            this.currentModel = new EngineModel(this.scene);
            this.controls.target.set(0, 5.5, 0);
            this.setCameraPreset('isometric');
            document.getElementById('engine-telemetry').style.display = 'block';
            document.getElementById('planetary-telemetry').style.display = 'none';
            document.getElementById('steering-telemetry').style.display = 'none';
            document.getElementById('planetary-mode-selector').style.display = 'none';
            document.getElementById('scrub-container').style.display = 'flex';
        } else if (type === 'planetary') {
            this.currentModel = new PlanetaryModel(this.scene);
            this.controls.target.set(0, 0, 0);
            this.camera.position.set(0, 0, 26);
            document.getElementById('engine-telemetry').style.display = 'none';
            document.getElementById('planetary-telemetry').style.display = 'block';
            document.getElementById('steering-telemetry').style.display = 'none';
            document.getElementById('planetary-mode-selector').style.display = 'flex';
            document.getElementById('scrub-container').style.display = 'none';
        } else if (type === 'steering') {
            this.currentModel = new SteeringModel(this.scene);
            this.controls.target.set(0, 1.5, 0);
            this.camera.position.set(0, 14, 25);
            document.getElementById('engine-telemetry').style.display = 'none';
            document.getElementById('planetary-telemetry').style.display = 'none';
            document.getElementById('steering-telemetry').style.display = 'block';
            document.getElementById('planetary-mode-selector').style.display = 'none';
            document.getElementById('scrub-container').style.display = 'none';
        }

        // Apply current render mode
        this.currentModel.setRenderMode(this.renderMode);
    }

    setCameraPreset(viewName) {
        const t = this.controls.target;
        if (this.currentModelType === 'engine') {
            switch(viewName) {
                case 'isometric':
                    this.camera.position.set(16, 14, 20);
                    this.controls.target.set(0, 5.5, 0);
                    break;
                case 'front':
                    this.camera.position.set(0, 5.5, 24);
                    this.controls.target.set(0, 5.5, 0);
                    break;
                case 'side':
                    this.camera.position.set(24, 5.5, 0);
                    this.controls.target.set(0, 5.5, 0);
                    break;
                case 'top':
                    this.camera.position.set(0, 26, 0.1);
                    this.controls.target.set(0, 5.5, 0);
                    break;
                case 'combustion':
                    this.camera.position.set(0, 10.5, 9);
                    this.controls.target.set(0, 10.0, 0);
                    break;
            }
        } else {
            switch(viewName) {
                case 'isometric':
                    this.camera.position.set(15, 12, 18);
                    break;
                case 'front':
                    this.camera.position.set(0, 0, 24);
                    break;
                case 'side':
                    this.camera.position.set(24, 0, 0);
                    break;
                case 'top':
                    this.camera.position.set(0, 24, 0.1);
                    break;
            }
        }
        this.controls.update();
    }

    bindUIEvents() {
        // Model tabs
        document.querySelectorAll('.model-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.model-tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.loadModel(btn.dataset.model);
            });
        });

        // Play/Pause button
        const playBtn = document.getElementById('btn-play-pause');
        playBtn.addEventListener('click', () => {
            this.isPlaying = !this.isPlaying;
            playBtn.innerHTML = this.isPlaying ?
                '<i class="fa-solid fa-pause"></i> <span>Tạm dừng</span>' :
                '<i class="fa-solid fa-play"></i> <span>Tiếp tục</span>';
        });

        // RPM slider
        const rpmSlider = document.getElementById('rpm-slider');
        const rpmDisplay = document.getElementById('rpm-val');
        rpmSlider.addEventListener('input', (e) => {
            this.rpm = parseInt(e.target.value);
            rpmDisplay.innerText = this.rpm;
        });

        // Exploded view slider
        const explodeSlider = document.getElementById('explode-slider');
        const explodeDisplay = document.getElementById('explode-val');
        explodeSlider.addEventListener('input', (e) => {
            this.explodedFactor = parseFloat(e.target.value) / 100;
            explodeDisplay.innerText = `${Math.round(this.explodedFactor * 100)}%`;
        });

        // Scrub slider for crank angle
        const scrubSlider = document.getElementById('scrub-slider');
        const scrubDisplay = document.getElementById('scrub-val');
        scrubSlider.addEventListener('input', (e) => {
            if (this.isPlaying) {
                this.isPlaying = false;
                playBtn.innerHTML = '<i class="fa-solid fa-play"></i> <span>Tiếp tục</span>';
            }
            const deg = parseFloat(e.target.value);
            this.angle = (deg * Math.PI) / 180;
            scrubDisplay.innerText = `${deg}°`;
        });

        // Render modes (Shaded, Wireframe, X-Ray)
        document.querySelectorAll('.render-mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.render-mode-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderMode = btn.dataset.mode;
                if (this.currentModel) {
                    this.currentModel.setRenderMode(this.renderMode);
                }
            });
        });

        // Camera presets
        document.querySelectorAll('.camera-preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setCameraPreset(btn.dataset.view);
            });
        });

        // Sound toggle
        const soundBtn = document.getElementById('btn-sound-toggle');
        soundBtn.addEventListener('click', () => {
            const isMuted = this.audio.toggleMute();
            soundBtn.innerHTML = isMuted ?
                '<i class="fa-solid fa-volume-xmark"></i>' :
                '<i class="fa-solid fa-volume-high text-cyan-400"></i>';
        });

        // Planetary Mode Selectors
        document.querySelectorAll('.planetary-mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.planetary-mode-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                if (this.currentModel && this.currentModel.setOperatingMode) {
                    this.currentModel.setOperatingMode(btn.dataset.mode);
                }
            });
        });

        // Close Inspector Panel
        document.getElementById('btn-close-inspector').addEventListener('click', () => {
            this.closePartInspector();
        });

        // Raycasting for Mouse move & Click
        this.container.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.container.addEventListener('click', (e) => this.onClick(e));
    }

    onMouseMove(e) {
        const rect = this.container.getBoundingClientRect();
        this.mouse.x = ((e.clientX - rect.left) / this.container.clientWidth) * 2 - 1;
        this.mouse.y = -((e.clientY - rect.top) / this.container.clientHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        if (!this.currentModel) return;

        const intersects = this.raycaster.intersectObjects(this.currentModel.group.children, true);

        let foundPart = null;
        for (let hit of intersects) {
            let cur = hit.object;
            while (cur && cur !== this.currentModel.group) {
                if (cur.userData && cur.userData.partKey) {
                    foundPart = { mesh: hit.object, key: cur.userData.partKey };
                    break;
                }
                cur = cur.parent;
            }
            if (foundPart) break;
        }

        const tooltip = document.getElementById('hover-tooltip');
        if (foundPart && PARTS_DATA[foundPart.key]) {
            this.container.style.cursor = 'pointer';
            tooltip.style.display = 'block';
            tooltip.style.left = `${e.clientX - rect.left + 15}px`;
            tooltip.style.top = `${e.clientY - rect.top + 15}px`;
            tooltip.innerHTML = `<strong>${PARTS_DATA[foundPart.key].titleVi}</strong><br><span style="opacity:0.75; font-size:11px;">${PARTS_DATA[foundPart.key].titleEn}</span>`;
        } else {
            this.container.style.cursor = 'default';
            tooltip.style.display = 'none';
        }
    }

    onClick(e) {
        const rect = this.container.getBoundingClientRect();
        this.mouse.x = ((e.clientX - rect.left) / this.container.clientWidth) * 2 - 1;
        this.mouse.y = -((e.clientY - rect.top) / this.container.clientHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        if (!this.currentModel) return;

        const intersects = this.raycaster.intersectObjects(this.currentModel.group.children, true);
        let foundKey = null;

        for (let hit of intersects) {
            let cur = hit.object;
            while (cur && cur !== this.currentModel.group) {
                if (cur.userData && cur.userData.partKey) {
                    foundKey = cur.userData.partKey;
                    break;
                }
                cur = cur.parent;
            }
            if (foundKey) break;
        }

        if (foundKey && PARTS_DATA[foundKey]) {
            this.showPartInspector(foundKey);
        }
    }

    showPartInspector(partKey) {
        this.selectedPartKey = partKey;
        const data = PARTS_DATA[partKey];
        if (!data) return;

        const panel = document.getElementById('part-inspector-panel');
        document.getElementById('inspector-title-vi').innerText = data.titleVi;
        document.getElementById('inspector-title-en').innerText = data.titleEn;
        document.getElementById('inspector-mechanism').innerText = data.mechanism;
        document.getElementById('inspector-summary').innerText = data.summary;

        const detailsContainer = document.getElementById('inspector-details-list');
        detailsContainer.innerHTML = '';
        data.details.forEach(item => {
            const div = document.createElement('div');
            div.className = 'inspector-spec-item';
            div.innerHTML = `<span class="spec-label">${item.label}:</span> <span class="spec-val">${item.value}</span>`;
            detailsContainer.appendChild(div);
        });

        panel.classList.add('open');
    }

    closePartInspector() {
        document.getElementById('part-inspector-panel').classList.remove('open');
        this.selectedPartKey = null;
    }

    initResize() {
        window.addEventListener('resize', () => {
            const width = this.container.clientWidth;
            const height = this.container.clientHeight;
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        });
    }

    animate(timestamp) {
        requestAnimationFrame(this.animate);

        // Calculate angular velocity (omega = 2*PI * RPM / 60)
        if (this.isPlaying) {
            const dt = 1 / 60;
            const omega = (2 * Math.PI * this.rpm) / 60;
            this.angle += omega * dt;
        }

        // Update current active model
        if (this.currentModel) {
            const telemetry = this.currentModel.update(this.angle, this.explodedFactor, this.audio);

            // Update Audio pitch
            if (this.currentModelType === 'engine') {
                this.audio.updateEngineSound(this.rpm, telemetry.strokeName);
            } else {
                this.audio.updateGearSound(this.rpm);
            }

            // Update UI Telemetry HUD
            this.updateTelemetryHUD(telemetry);
        }

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    updateTelemetryHUD(telemetry) {
        if (!telemetry) return;

        if (this.currentModelType === 'engine') {
            document.getElementById('hud-stroke-name').innerText = telemetry.strokeName;
            document.getElementById('hud-crank-angle').innerText = `${telemetry.crankAngleDeg}°`;
            document.getElementById('hud-piston-pos').innerText = `${telemetry.pistonDisplacement} mm`;
            document.getElementById('stroke-progress-fill').style.width = `${telemetry.strokePercent}%`;

            // Stroke badge color highlights
            const strokeBadge = document.getElementById('hud-stroke-badge');
            if (telemetry.strokeName.includes('Hút')) {
                strokeBadge.className = 'badge badge-intake';
                strokeBadge.innerText = 'KỲ 1: HÚT';
            } else if (telemetry.strokeName.includes('Nén')) {
                strokeBadge.className = 'badge badge-compression';
                strokeBadge.innerText = 'KỲ 2: NÉN';
            } else if (telemetry.strokeName.includes('Nổ')) {
                strokeBadge.className = 'badge badge-power';
                strokeBadge.innerText = 'KỲ 3: NỔ / SINH CÔNG';
            } else {
                strokeBadge.className = 'badge badge-exhaust';
                strokeBadge.innerText = 'KỲ 4: XẢ';
            }

            // Sync scrub slider if playing
            if (this.isPlaying) {
                const deg = parseFloat(telemetry.crankAngleDeg);
                document.getElementById('scrub-slider').value = deg;
                document.getElementById('scrub-val').innerText = `${deg.toFixed(0)}°`;
            }
        } else if (this.currentModelType === 'planetary') {
            document.getElementById('hud-planet-ratio').innerText = telemetry.ratio;
            document.getElementById('hud-planet-desc').innerText = telemetry.description;
            document.getElementById('hud-planet-sun').innerText = `${telemetry.sunSpeed}°`;
            document.getElementById('hud-planet-carrier').innerText = `${telemetry.carrierSpeed}°`;
            document.getElementById('hud-planet-ring').innerText = `${telemetry.ringSpeed}°`;
        } else if (this.currentModelType === 'steering') {
            document.getElementById('hud-steer-dir').innerText = telemetry.steerDirection;
            document.getElementById('hud-rack-travel').innerText = `${telemetry.rackTravelMm} mm`;
            document.getElementById('hud-steer-angle').innerText = `${telemetry.steerAngleDeg}°`;
        }
    }
}

// Instantiate on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
    window.app = new MechanicalApp();
});
