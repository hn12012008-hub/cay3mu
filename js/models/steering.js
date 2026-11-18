// Rack & Pinion Steering Mechanism (Cơ cấu Bánh răng - Thanh răng thước lái ô tô)
class SteeringModel {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();
        this.scene.add(this.group);

        this.pinionRadius = 1.4;
        this.rackStroke = 0; // -3.0 to +3.0 lateral movement
        this.pinionAngle = 0;

        this.parts = {};
        this.materials = {};
        this.explodeOffsets = {};

        this.initMaterials();
        this.buildModel();
    }

    initMaterials() {
        this.materials.steelPolished = new THREE.MeshStandardMaterial({
            color: 0xe2e8f0,
            metalness: 0.9,
            roughness: 0.2
        });

        this.materials.gearSteel = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            metalness: 0.8,
            roughness: 0.3
        });

        this.materials.castHousing = new THREE.MeshStandardMaterial({
            color: 0x334155,
            metalness: 0.5,
            roughness: 0.7
        });

        this.materials.rubber = new THREE.MeshStandardMaterial({
            color: 0x1e293b,
            roughness: 0.9,
            metalness: 0.1
        });

        this.materials.wheelTire = new THREE.MeshStandardMaterial({
            color: 0x18181b,
            roughness: 0.85,
            metalness: 0.1
        });

        this.materials.wheelRim = new THREE.MeshStandardMaterial({
            color: 0xf1f5f9,
            metalness: 0.85,
            roughness: 0.2
        });

        this.materials.brass = new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            metalness: 0.8,
            roughness: 0.35
        });
    }

    buildModel() {
        // 1. Steering Column & Pinion (Trục lái & Bánh răng chủ động)
        const pinionGroup = new THREE.Group();
        pinionGroup.name = "pinion_group";

        // Shaft
        const shaftGeo = new THREE.CylinderGeometry(0.5, 0.5, 6.0, 24);
        const shaftMesh = new THREE.Mesh(shaftGeo, this.materials.steelPolished);
        shaftMesh.position.y = 3.0;
        shaftMesh.userData = { partKey: "steering_column" };
        pinionGroup.add(shaftMesh);

        // Steering Wheel on top
        const wheelRimGeo = new THREE.TorusGeometry(2.4, 0.25, 16, 48);
        const wheelRim = new THREE.Mesh(wheelRimGeo, this.materials.rubber);
        wheelRim.position.y = 5.8;
        wheelRim.rotateX(Math.PI / 2);
        wheelRim.userData = { partKey: "steering_wheel" };
        pinionGroup.add(wheelRim);

        // Wheel spokes
        const spokeGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.3, 16);
        for (let i = 0; i < 3; i++) {
            const spoke = new THREE.Mesh(spokeGeo, this.materials.steelPolished);
            spoke.position.y = 5.8;
            spoke.rotateY((i * 120 * Math.PI) / 180);
            spoke.rotateZ(Math.PI / 2);
            spoke.translateY(1.15);
            pinionGroup.add(spoke);
        }

        // Pinion gear at bottom
        const pinionGeo = new THREE.CylinderGeometry(this.pinionRadius, this.pinionRadius, 1.8, 20);
        const pinionMesh = new THREE.Mesh(pinionGeo, this.materials.gearSteel);
        pinionMesh.userData = { partKey: "pinion_gear" };
        pinionGroup.add(pinionMesh);

        // Position pinion
        pinionGroup.position.set(0, 1.4, 0);
        this.parts.pinion = pinionGroup;
        this.group.add(pinionGroup);

        // 2. Rack Gear (Thanh răng chuyển động ngang)
        const rackGroup = new THREE.Group();
        rackGroup.name = "rack_group";

        // Main cylindrical rack bar length = 16
        const rackBarGeo = new THREE.CylinderGeometry(0.65, 0.65, 16.0, 24);
        rackBarGeo.rotateZ(Math.PI / 2);
        const rackBar = new THREE.Mesh(rackBarGeo, this.materials.steelPolished);
        rackBar.userData = { partKey: "rack_shaft" };
        rackGroup.add(rackBar);

        // Rack teeth region in center
        const teethRegionGeo = new THREE.BoxGeometry(7.0, 0.5, 1.0);
        const teethMesh = new THREE.Mesh(teethRegionGeo, this.materials.gearSteel);
        teethMesh.position.set(0, 0.5, 0);
        teethMesh.userData = { partKey: "rack_teeth" };
        rackGroup.add(teethMesh);

        this.parts.rack = rackGroup;
        this.group.add(rackGroup);

        // 3. Housing / Casing (Vỏ thước lái)
        const housingGroup = new THREE.Group();
        housingGroup.name = "housing_group";

        // Center pinion sleeve housing
        const centerCasingGeo = new THREE.CylinderGeometry(2.0, 2.0, 3.2, 24);
        const centerCasing = new THREE.Mesh(centerCasingGeo, this.materials.castHousing);
        centerCasing.position.set(0, 1.4, 0);
        centerCasing.userData = { partKey: "steering_housing" };
        housingGroup.add(centerCasing);

        // Lateral tube sleeves
        const tubeLeftGeo = new THREE.CylinderGeometry(1.0, 1.0, 4.5, 24);
        tubeLeftGeo.rotateZ(Math.PI / 2);
        const tubeLeft = new THREE.Mesh(tubeLeftGeo, this.materials.castHousing);
        tubeLeft.position.set(-3.5, 0, 0);
        tubeLeft.userData = { partKey: "steering_housing" };
        housingGroup.add(tubeLeft);

        const tubeRight = tubeLeft.clone();
        tubeRight.position.set(3.5, 0, 0);
        housingGroup.add(tubeRight);

        // Rubber boots / Bellows on both sides (Chụp bụi cao su)
        const createBellow = (xPos) => {
            const bellowGeo = new THREE.CylinderGeometry(0.95, 0.7, 2.8, 16, 6);
            bellowGeo.rotateZ(Math.PI / 2);
            const bellowMesh = new THREE.Mesh(bellowGeo, this.materials.rubber);
            bellowMesh.position.set(xPos, 0, 0);
            bellowMesh.userData = { partKey: "rubber_boot" };
            return bellowMesh;
        };
        this.leftBoot = createBellow(-6.5);
        this.rightBoot = createBellow(6.5);
        housingGroup.add(this.leftBoot);
        housingGroup.add(this.rightBoot);

        this.parts.housing = housingGroup;
        this.group.add(housingGroup);

        // 4. Tie rods & Knuckles & Road Wheels (Rô-tuyn lái & Bánh xe)
        const createWheelAssembly = (isLeft) => {
            const asm = new THREE.Group();
            const sign = isLeft ? -1 : 1;

            // Ball Joint / Tie rod inner (Rô-tuyn lái trong)
            const ballGeo = new THREE.SphereGeometry(0.6, 16, 16);
            const ballMesh = new THREE.Mesh(ballGeo, this.materials.brass);
            ballMesh.position.set(0, 0, 0);
            asm.add(ballMesh);

            // Tie rod bar (Thanh giằng lái)
            const rodGeo = new THREE.CylinderGeometry(0.3, 0.3, 4.0, 16);
            rodGeo.rotateZ(Math.PI / 2);
            const rodMesh = new THREE.Mesh(rodGeo, this.materials.steelPolished);
            rodMesh.position.set(sign * 2.0, 0, 0);
            rodMesh.userData = { partKey: "tie_rod" };
            asm.add(rodMesh);

            // Wheel Hub & Tire
            const wheelPivot = new THREE.Group();
            wheelPivot.position.set(sign * 4.2, 0, 0);

            // Brake Disc (Đĩa phanh)
            const discGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.2, 32);
            discGeo.rotateZ(Math.PI / 2);
            const discMesh = new THREE.Mesh(discGeo, this.materials.steelPolished);
            discMesh.userData = { partKey: "brake_disc" };
            wheelPivot.add(discMesh);

            // Rim (Vành lazăng)
            const rimGeo = new THREE.CylinderGeometry(2.2, 2.2, 1.4, 32);
            rimGeo.rotateZ(Math.PI / 2);
            const rimMesh = new THREE.Mesh(rimGeo, this.materials.wheelRim);
            wheelPivot.add(rimMesh);

            // Tire (Lốp cao su)
            const tireGeo = new THREE.TorusGeometry(2.6, 0.9, 16, 32);
            tireGeo.rotateY(Math.PI / 2);
            const tireMesh = new THREE.Mesh(tireGeo, this.materials.wheelTire);
            tireMesh.userData = { partKey: "road_wheel" };
            wheelPivot.add(tireMesh);

            asm.add(wheelPivot);
            asm.wheelPivot = wheelPivot;
            return asm;
        };

        this.leftWheelAsm = createWheelAssembly(true);
        this.leftWheelAsm.position.set(-8.0, 0, 0);
        this.group.add(this.leftWheelAsm);

        this.rightWheelAsm = createWheelAssembly(false);
        this.rightWheelAsm.position.set(8.0, 0, 0);
        this.group.add(this.rightWheelAsm);

        // Exploded view offsets
        this.explodeOffsets.pinion = new THREE.Vector3(0, 4.0, 0);
        this.explodeOffsets.housing = new THREE.Vector3(0, 0, -3.5);
        this.explodeOffsets.leftWheel = new THREE.Vector3(-4.0, 0, 0);
        this.explodeOffsets.rightWheel = new THREE.Vector3(4.0, 0, 0);
    }

    update(steeringAngle, explodedFactor = 0, audioController = null) {
        // steeringAngle is input rotation of steering wheel/pinion (radians)
        // Convert to periodic left-right oscillation or direct drive
        this.pinionAngle = steeringAngle;
        this.parts.pinion.rotation.y = -steeringAngle;

        // Linear rack travel: deltaX = R * theta
        // Limit travel to realistic lock-to-lock (+/- 2.8 units)
        const travel = Math.sin(steeringAngle * 0.5) * 2.5;
        this.rackStroke = travel;

        this.parts.rack.position.x = travel;

        // Steering knuckle angle of wheels
        // Delta steer angle proportional to rack movement
        const steerAngle = (travel / 2.5) * (32 * Math.PI / 180); // Max 32 degrees
        this.leftWheelAsm.wheelPivot.rotation.y = steerAngle;
        this.rightWheelAsm.wheelPivot.rotation.y = steerAngle;

        // Tie rods shift with the rack
        this.leftWheelAsm.position.x = -8.0 + travel;
        this.rightWheelAsm.position.x = 8.0 + travel;

        // Exploded view
        const f = Math.max(0, Math.min(1, explodedFactor));
        this.parts.pinion.position.y = 1.4 + this.explodeOffsets.pinion.y * f;
        this.parts.housing.position.z = this.explodeOffsets.housing.z * f;
        this.leftWheelAsm.position.x = (-8.0 + travel) + this.explodeOffsets.leftWheel.x * f;
        this.rightWheelAsm.position.x = (8.0 + travel) + this.explodeOffsets.rightWheel.x * f;

        const steerDeg = (steerAngle * 180 / Math.PI).toFixed(1);
        return {
            wheelTurnDeg: ((-steeringAngle * 180 / Math.PI) % 360).toFixed(0),
            rackTravelMm: (travel * 25).toFixed(1), // Scaled to mm
            steerAngleDeg: steerDeg,
            steerDirection: travel > 0.05 ? "Rẽ Phải (Right)" : (travel < -0.05 ? "Rẽ Trái (Left)" : "Thẳng (Center)")
        };
    }

    setRenderMode(mode) {
        this.group.traverse(child => {
            if (child.isMesh) {
                child.material.wireframe = (mode === 'wireframe');
                if (mode === 'xray') {
                    child.material.transparent = true;
                    child.material.opacity = (child.userData.partKey === "steering_housing") ? 0.25 : 0.7;
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

window.SteeringModel = SteeringModel;
