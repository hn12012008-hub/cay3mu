// Planetary Gearbox (Hệ Bánh Răng Hành Tinh) 3D Model & Kinematics
class PlanetaryModel {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();
        this.scene.add(this.group);

        // Gear teeth specification
        this.teethSun = 18;
        this.teethPlanet = 12;
        this.teethRing = 42; // Ring = Sun + 2 * Planet = 18 + 24 = 42

        // Module m = 0.2
        this.module = 0.22;
        this.sunRadius = (this.teethSun * this.module);      // ~3.96
        this.planetRadius = (this.teethPlanet * this.module);// ~2.64
        this.carrierRadius = this.sunRadius + this.planetRadius; // ~6.6
        this.ringRadius = (this.teethRing * this.module);    // ~9.24

        this.planetCount = 3;
        this.operatingMode = "reduction"; // 'reduction', 'reverse', 'overdrive'
        this.parts = {};
        this.materials = {};
        this.explodeOffsets = {};

        this.initMaterials();
        this.buildModel();
    }

    initMaterials() {
        this.materials.sunGear = new THREE.MeshStandardMaterial({
            color: 0xe0a030, // Gold / Brass-like
            metalness: 0.8,
            roughness: 0.25
        });

        this.materials.planetGear = new THREE.MeshStandardMaterial({
            color: 0x38bdf8, // Sky Blue steel
            metalness: 0.75,
            roughness: 0.3
        });

        this.materials.ringGear = new THREE.MeshStandardMaterial({
            color: 0x94a3b8, // Titanium silver
            metalness: 0.85,
            roughness: 0.25
        });

        this.materials.carrier = new THREE.MeshStandardMaterial({
            color: 0x475569, // Dark gunmetal
            metalness: 0.6,
            roughness: 0.5
        });

        this.materials.shaft = new THREE.MeshStandardMaterial({
            color: 0xd1d5db, // Chrome steel
            metalness: 0.9,
            roughness: 0.15
        });
    }

    // Helper to generate a gear mesh with realistic involute-like teeth
    createGearMesh(numTeeth, pitchRadius, thickness, material, isInternal = false) {
        const shape = new THREE.Shape();
        const toothDepth = this.module * 1.5;
        const addendumRadius = pitchRadius + (isInternal ? -toothDepth : toothDepth);
        const dedendumRadius = pitchRadius + (isInternal ? toothDepth * 1.2 : -toothDepth * 1.2);

        const totalPoints = numTeeth * 4;
        for (let i = 0; i < totalPoints; i++) {
            const angle = (i / totalPoints) * Math.PI * 2;
            const subIndex = i % 4;
            let r = pitchRadius;

            if (subIndex === 0) r = dedendumRadius;
            else if (subIndex === 1) r = addendumRadius;
            else if (subIndex === 2) r = addendumRadius;
            else if (subIndex === 3) r = dedendumRadius;

            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;

            if (i === 0) shape.moveTo(x, y);
            else shape.lineTo(x, y);
        }
        shape.closePath();

        // If not internal gear, make a center hole for the shaft
        if (!isInternal) {
            const holePath = new THREE.Path();
            holePath.absarc(0, 0, pitchRadius * 0.35, 0, Math.PI * 2, true);
            shape.holes.push(holePath);
        } else {
            // For ring gear, the outside boundary is a larger cylinder shell
            // In Three.js, for an internal ring, shape can be outer circle with inner teeth as hole
            const outerShape = new THREE.Shape();
            const outerR = pitchRadius + 2.0;
            outerShape.absarc(0, 0, outerR, 0, Math.PI * 2, false);
            outerShape.holes.push(shape);
            const extrudeSettings = { depth: thickness, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.08, bevelThickness: 0.08 };
            const geo = new THREE.ExtrudeGeometry(outerShape, extrudeSettings);
            geo.center();
            return new THREE.Mesh(geo, material);
        }

        const extrudeSettings = { depth: thickness, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.06, bevelThickness: 0.06 };
        const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geo.center();
        return new THREE.Mesh(geo, material);
    }

    buildModel() {
        // 1. Sun Gear + Shaft
        const sunGroup = new THREE.Group();
        const sunGearMesh = this.createGearMesh(this.teethSun, this.sunRadius, 1.4, this.materials.sunGear);
        sunGearMesh.userData = { partKey: "sun_gear" };
        sunGroup.add(sunGearMesh);

        // Input Shaft for Sun
        const sunShaftGeo = new THREE.CylinderGeometry(0.7, 0.7, 7.0, 32);
        sunShaftGeo.rotateX(Math.PI / 2);
        const sunShaft = new THREE.Mesh(sunShaftGeo, this.materials.shaft);
        sunShaft.position.z = 2.5;
        sunShaft.userData = { partKey: "input_shaft" };
        sunGroup.add(sunShaft);

        this.parts.sunGroup = sunGroup;
        this.group.add(sunGroup);

        // 2. Planet Carrier (Cần dẫn) + Planet gears
        const carrierGroup = new THREE.Group();
        this.planetMeshes = [];

        // Carrier plate (Triangular plate with rounded corners)
        const plateShape = new THREE.Shape();
        const rC = this.carrierRadius;
        for (let i = 0; i < this.planetCount; i++) {
            const angle = (i / this.planetCount) * Math.PI * 2;
            const px = Math.cos(angle) * (rC + 1.2);
            const py = Math.sin(angle) * (rC + 1.2);
            if (i === 0) plateShape.moveTo(px, py);
            else plateShape.lineTo(px, py);
        }
        plateShape.closePath();
        const plateGeo = new THREE.ExtrudeGeometry(plateShape, { depth: 0.6, bevelEnabled: true, bevelSize: 0.08, bevelThickness: 0.08 });
        plateGeo.center();

        const frontPlate = new THREE.Mesh(plateGeo, this.materials.carrier);
        frontPlate.position.z = 1.6;
        frontPlate.userData = { partKey: "planet_carrier" };
        carrierGroup.add(frontPlate);

        const rearPlate = new THREE.Mesh(plateGeo, this.materials.carrier);
        rearPlate.position.z = -1.6;
        rearPlate.userData = { partKey: "planet_carrier" };
        carrierGroup.add(rearPlate);

        // Output shaft mounted on carrier
        const carrierShaftGeo = new THREE.CylinderGeometry(0.9, 0.9, 5.0, 32);
        carrierShaftGeo.rotateX(Math.PI / 2);
        const carrierShaft = new THREE.Mesh(carrierShaftGeo, this.materials.shaft);
        carrierShaft.position.z = -3.5;
        carrierShaft.userData = { partKey: "output_shaft" };
        carrierGroup.add(carrierShaft);

        // Build 3 Planet Gears with their pins
        this.planetHolders = [];
        for (let i = 0; i < this.planetCount; i++) {
            const angle = (i / this.planetCount) * Math.PI * 2;
            const px = Math.cos(angle) * rC;
            const py = Math.sin(angle) * rC;

            // Pin / spindle for the planet
            const pinGeo = new THREE.CylinderGeometry(0.4, 0.4, 3.6, 24);
            pinGeo.rotateX(Math.PI / 2);
            const pinMesh = new THREE.Mesh(pinGeo, this.materials.shaft);
            pinMesh.position.set(px, py, 0);
            carrierGroup.add(pinMesh);

            // Planet gear mesh
            const planetMesh = this.createGearMesh(this.teethPlanet, this.planetRadius, 1.4, this.materials.planetGear);
            planetMesh.position.set(px, py, 0);
            planetMesh.userData = { partKey: "planet_gear", initialAngle: angle };
            carrierGroup.add(planetMesh);

            this.planetHolders.push({
                mesh: planetMesh,
                angleOffset: angle,
                x: px,
                y: py
            });
        }

        this.parts.carrierGroup = carrierGroup;
        this.group.add(carrierGroup);

        // 3. Ring Gear (Vành răng bao ngoài)
        const ringMesh = this.createGearMesh(this.teethRing, this.ringRadius, 1.6, this.materials.ringGear, true);
        ringMesh.userData = { partKey: "ring_gear" };
        this.parts.ringMesh = ringMesh;
        this.group.add(ringMesh);

        // Explode offsets
        this.explodeOffsets.sun = new THREE.Vector3(0, 0, 4.0);
        this.explodeOffsets.carrier = new THREE.Vector3(0, 0, -4.5);
        this.explodeOffsets.ring = new THREE.Vector3(0, 0, 0);
    }

    setOperatingMode(mode) {
        this.operatingMode = mode; // 'reduction', 'reverse', 'overdrive'
    }

    update(sunAngle, explodedFactor = 0, audioController = null) {
        const thetaS = sunAngle;
        const Ns = this.teethSun;
        const Np = this.teethPlanet;
        const Nr = this.teethRing;

        let thetaC = 0; // Carrier angle
        let thetaR = 0; // Ring angle
        let ratioText = "";
        let modeDescription = "";

        // Willis formula: (w_s - w_c) / (w_r - w_c) = -Nr / Ns
        if (this.operatingMode === "reduction") {
            // Mode 1: Ring Fixed (w_r = 0), Sun Input, Carrier Output
            // w_c = w_s * Ns / (Ns + Nr)
            const ratio = Ns / (Ns + Nr); // 18 / (18 + 42) = 18/60 = 0.3 (Reduction 3.33:1)
            thetaR = 0;
            thetaC = thetaS * ratio;
            ratioText = "3.33 : 1 (Giảm tốc)";
            modeDescription = "Khóa Vành răng: Bánh trời quay dẫn động cần dẫn quay chậm hơn 3.33 lần, mô-men xoắn tăng cực đại (Số 1 / Số tiến xe ô tô).";
        } else if (this.operatingMode === "reverse") {
            // Mode 2: Carrier Fixed (w_c = 0), Sun Input, Ring Output
            // w_r = -w_s * (Ns / Nr)
            const ratio = - (Ns / Nr); // -18 / 42 = -0.428 (Reverse 2.33:1)
            thetaC = 0;
            thetaR = thetaS * ratio;
            ratioText = "-2.33 : 1 (Đảo chiều / Số lùi)";
            modeDescription = "Khóa Cần dẫn: Bánh trời quay làm các bánh hành tinh tự quay quanh trục, đảo chiều quay của Vành răng ngoài (Số lùi Reverse).";
        } else if (this.operatingMode === "overdrive") {
            // Mode 3: Sun Fixed (w_s = 0), Carrier Input, Ring Output
            // w_r = w_c * (Ns + Nr) / Nr
            const carrierInputAngle = thetaS * 0.3;
            thetaC = carrierInputAngle;
            thetaR = thetaC * ((Ns + Nr) / Nr); // 60 / 42 = 1.43 (Overdrive)
            ratioText = "0.70 : 1 (Tăng tốc / Overdrive)";
            modeDescription = "Khóa Bánh răng mặt trời: Cần dẫn quay kéo vành răng ngoài quay nhanh hơn 1.43 lần (Chế độ tiết kiệm nhiên liệu đường trường).";
        }

        // Apply rotations
        this.parts.sunGroup.rotation.z = (this.operatingMode === "overdrive") ? 0 : thetaS;
        this.parts.carrierGroup.rotation.z = thetaC;
        this.parts.ringMesh.rotation.z = thetaR;

        // Individual planet gear self-rotations on their pins:
        // Planet relative speed to carrier: (w_p - w_c) = - (w_s - w_c) * (Ns / Np)
        const relSunToCarrier = (this.operatingMode === "overdrive" ? -thetaC : (thetaS - thetaC));
        const thetaP_relative = - relSunToCarrier * (Ns / Np);

        this.planetHolders.forEach(p => {
            p.mesh.rotation.z = thetaP_relative;
        });

        // Apply exploded view
        const f = Math.max(0, Math.min(1, explodedFactor));
        this.parts.sunGroup.position.copy(this.explodeOffsets.sun).multiplyScalar(f);
        this.parts.carrierGroup.position.copy(this.explodeOffsets.carrier).multiplyScalar(f);

        return {
            mode: this.operatingMode,
            ratio: ratioText,
            description: modeDescription,
            sunSpeed: ((thetaS * 180 / Math.PI) % 360).toFixed(0),
            carrierSpeed: ((thetaC * 180 / Math.PI) % 360).toFixed(0),
            ringSpeed: ((thetaR * 180 / Math.PI) % 360).toFixed(0)
        };
    }

    setRenderMode(mode) {
        this.group.traverse(child => {
            if (child.isMesh) {
                child.material.wireframe = (mode === 'wireframe');
                if (mode === 'xray') {
                    child.material.transparent = true;
                    child.material.opacity = (child === this.parts.ringMesh) ? 0.3 : 0.7;
                } else {
                    child.material.transparent = false;
                    child.material.opacity = 1.0;
                }
            }
        });
    }

    destroy() {
        this.scene.remove(this.group);
    }
}

window.PlanetaryModel = PlanetaryModel;
