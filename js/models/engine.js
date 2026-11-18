// 4-Stroke Internal Combustion Engine 3D Model & Kinematics
class EngineModel {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();
        this.scene.add(this.group);

        // Kinematic dimensions
        this.crankRadius = 2.4;    // r
        this.conRodLength = 7.2;   // l
        this.pistonPinHeight = 0;  // dynamic
        this.crankAngle = 0;       // 0 to 4*PI (720 deg)

        // Parts references
        this.parts = {};
        this.materials = {};
        this.particles = [];
        this.sparkLight = null;

        // Exploded view positions (offset directions)
        this.explodeOffsets = {};

        this.initMaterials();
        this.buildModel();
    }

    initMaterials() {
        // High quality PBR materials
        this.materials.steelPolished = new THREE.MeshStandardMaterial({
            color: 0xd8dde3,
            metalness: 0.9,
            roughness: 0.2,
            envMapIntensity: 1.2
        });

        this.materials.steelRough = new THREE.MeshStandardMaterial({
            color: 0x8a929a,
            metalness: 0.7,
            roughness: 0.5
        });

        this.materials.castIron = new THREE.MeshStandardMaterial({
            color: 0x474e54,
            metalness: 0.5,
            roughness: 0.65
        });

        this.materials.aluminum = new THREE.MeshStandardMaterial({
            color: 0xc4cdd5,
            metalness: 0.85,
            roughness: 0.3
        });

        this.materials.brass = new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            metalness: 0.8,
            roughness: 0.35
        });

        this.materials.ceramic = new THREE.MeshStandardMaterial({
            color: 0xf5f5f5,
            roughness: 0.1,
            metalness: 0.1
        });

        this.materials.copper = new THREE.MeshStandardMaterial({
            color: 0xb87333,
            metalness: 0.85,
            roughness: 0.4
        });

        // Transparent cylinder sleeve material for X-Ray
        this.materials.glassSleeve = new THREE.MeshPhysicalMaterial({
            color: 0x90b0d0,
            transparent: true,
            opacity: 0.35,
            roughness: 0.1,
            metalness: 0.1,
            transmission: 0.8,
            ior: 1.45,
            side: THREE.DoubleSide
        });

        // Dynamic combustion chamber gas material
        this.materials.combustionGas = new THREE.MeshBasicMaterial({
            color: 0x0099ff,
            transparent: true,
            opacity: 0.45,
            side: THREE.DoubleSide
        });
    }

    buildModel() {
        // Base coordinate center is Crankshaft Axis (0, 0, 0)
        this.buildCrankshaft();
        this.buildConnectingRod();
        this.buildPiston();
        this.buildCylinderBlock();
        this.buildCylinderHead();
        this.buildValves();
        this.buildSparkPlug();
        this.buildCombustionChamber();
    }

    buildCrankshaft() {
        const crankGroup = new THREE.Group();
        crankGroup.name = "crankshaft_group";

        // Main shafts (Cổ trục chính)
        const mainJournalGeo = new THREE.CylinderGeometry(0.75, 0.75, 2.2, 32);
        mainJournalGeo.rotateX(Math.PI / 2);
        const mainFront = new THREE.Mesh(mainJournalGeo, this.materials.steelPolished);
        mainFront.position.z = 2.4;
        mainFront.userData = { partKey: "crankshaft" };
        crankGroup.add(mainFront);

        const mainRear = new THREE.Mesh(mainJournalGeo, this.materials.steelPolished);
        mainRear.position.z = -2.4;
        mainRear.userData = { partKey: "crankshaft" };
        crankGroup.add(mainRear);

        // Counterweights / Crank webs (Má khuỷu & đối trọng)
        const createCrankWeb = (zPos) => {
            const webShape = new THREE.Shape();
            webShape.moveTo(-1.2, -0.6);
            webShape.lineTo(-1.6, -2.6);
            webShape.quadraticCurveTo(0, -3.8, 1.6, -2.6);
            webShape.lineTo(1.2, -0.6);
            webShape.quadraticCurveTo(1.4, 2.8, 0, 3.0);
            webShape.quadraticCurveTo(-1.4, 2.8, -1.2, -0.6);

            const extrudeSettings = { depth: 0.7, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.08, bevelThickness: 0.08 };
            const webGeo = new THREE.ExtrudeGeometry(webShape, extrudeSettings);
            webGeo.center();
            const webMesh = new THREE.Mesh(webGeo, this.materials.steelRough);
            webMesh.position.set(0, 0, zPos);
            webMesh.userData = { partKey: "counterweight" };
            return webMesh;
        };

        const web1 = createCrankWeb(1.1);
        const web2 = createCrankWeb(-1.1);
        crankGroup.add(web1);
        crankGroup.add(web2);

        // Crankpin (Cổ biên / Chốt khuỷu) at radius = crankRadius (y = 2.4)
        const crankPinGeo = new THREE.CylinderGeometry(0.65, 0.65, 1.5, 32);
        crankPinGeo.rotateX(Math.PI / 2);
        const crankPin = new THREE.Mesh(crankPinGeo, this.materials.steelPolished);
        crankPin.position.set(0, this.crankRadius, 0);
        crankPin.userData = { partKey: "crankpin" };
        crankGroup.add(crankPin);

        // Flywheel (Bánh đà) on the rear shaft
        const flywheelGroup = new THREE.Group();
        const flywheelGeo = new THREE.CylinderGeometry(4.2, 4.2, 0.8, 48);
        flywheelGeo.rotateX(Math.PI / 2);
        const flywheelMesh = new THREE.Mesh(flywheelGeo, this.materials.castIron);
        flywheelMesh.userData = { partKey: "flywheel" };
        flywheelGroup.add(flywheelMesh);

        // Ring gear teeth simulation on flywheel
        const ringGeo = new THREE.TorusGeometry(4.15, 0.12, 12, 64);
        const ringMesh = new THREE.Mesh(ringGeo, this.materials.steelRough);
        flywheelGroup.add(ringMesh);

        flywheelGroup.position.set(0, 0, -3.8);
        crankGroup.add(flywheelGroup);

        this.parts.crankshaft = crankGroup;
        this.parts.flywheel = flywheelGroup;
        this.explodeOffsets.crankshaft = new THREE.Vector3(0, -3.5, 0);
        this.explodeOffsets.flywheel = new THREE.Vector3(0, 0, -3.0);
        this.group.add(crankGroup);
    }

    buildConnectingRod() {
        const conRodGroup = new THREE.Group();
        conRodGroup.name = "connecting_rod_group";

        // Big end (Đầu to thanh truyền)
        const bigEndGeo = new THREE.CylinderGeometry(1.0, 1.0, 1.1, 32);
        bigEndGeo.rotateX(Math.PI / 2);
        const bigEnd = new THREE.Mesh(bigEndGeo, this.materials.steelRough);
        conRodGroup.add(bigEnd);

        // Big end bearing inner (Bạc lót đầu to)
        const bearingGeo = new THREE.CylinderGeometry(0.68, 0.68, 1.15, 32);
        bearingGeo.rotateX(Math.PI / 2);
        const bearing = new THREE.Mesh(bearingGeo, this.materials.brass);
        bearing.userData = { partKey: "bearing" };
        conRodGroup.add(bearing);

        // Shank (Thân chữ I) - Length = conRodLength
        const shankHeight = this.conRodLength - 1.6;
        const shankGeo = new THREE.BoxGeometry(0.7, shankHeight, 0.4);
        const shank = new THREE.Mesh(shankGeo, this.materials.steelRough);
        shank.position.set(0, this.conRodLength / 2, 0);
        conRodGroup.add(shank);

        // I-beam flange sides
        const flange1 = new THREE.Mesh(new THREE.BoxGeometry(0.9, shankHeight, 0.12), this.materials.steelRough);
        flange1.position.set(0, this.conRodLength / 2, 0.22);
        const flange2 = new THREE.Mesh(new THREE.BoxGeometry(0.9, shankHeight, 0.12), this.materials.steelRough);
        flange2.position.set(0, this.conRodLength / 2, -0.22);
        conRodGroup.add(flange1);
        conRodGroup.add(flange2);

        // Small end (Đầu nhỏ thanh truyền)
        const smallEndGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.9, 32);
        smallEndGeo.rotateX(Math.PI / 2);
        const smallEnd = new THREE.Mesh(smallEndGeo, this.materials.steelRough);
        smallEnd.position.set(0, this.conRodLength, 0);
        conRodGroup.add(smallEnd);

        // Small end brass bushing (Bạc đồng đầu nhỏ)
        const bushingGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.95, 32);
        bushingGeo.rotateX(Math.PI / 2);
        const bushing = new THREE.Mesh(bushingGeo, this.materials.brass);
        bushing.position.set(0, this.conRodLength, 0);
        conRodGroup.add(bushing);

        // Set metadata on meshes
        conRodGroup.traverse(child => {
            if (child.isMesh && !child.userData.partKey) {
                child.userData.partKey = "connecting_rod";
            }
        });

        this.parts.connectingRod = conRodGroup;
        this.explodeOffsets.connectingRod = new THREE.Vector3(1.5, -1.0, 1.5);
        this.group.add(conRodGroup);
    }

    buildPiston() {
        const pistonGroup = new THREE.Group();
        pistonGroup.name = "piston_group";

        // Piston body (Thân và đỉnh piston) - diameter 4.0, height 3.6
        const pistonGeo = new THREE.CylinderGeometry(2.1, 2.1, 3.6, 48);
        const pistonMesh = new THREE.Mesh(pistonGeo, this.materials.aluminum);
        pistonMesh.userData = { partKey: "piston" };
        pistonGroup.add(pistonMesh);

        // Piston rings (Xéc măng khí và xéc măng dầu)
        const createRing = (yOffset) => {
            const ringGeo = new THREE.TorusGeometry(2.12, 0.05, 12, 48);
            ringGeo.rotateX(Math.PI / 2);
            const ringMesh = new THREE.Mesh(ringGeo, this.materials.castIron);
            ringMesh.position.y = yOffset;
            ringMesh.userData = { partKey: "piston_rings" };
            return ringMesh;
        };
        pistonGroup.add(createRing(1.3));  // Top compression ring
        pistonGroup.add(createRing(1.0));  // 2nd compression ring
        pistonGroup.add(createRing(0.7));  // Oil scraper ring

        // Gudgeon Pin / Wrist pin (Chốt piston)
        const pinGeo = new THREE.CylinderGeometry(0.38, 0.38, 4.3, 32);
        pinGeo.rotateX(Math.PI / 2);
        const pinMesh = new THREE.Mesh(pinGeo, this.materials.steelPolished);
        pinMesh.position.set(0, 0, 0); // At pivot center of piston
        pinMesh.userData = { partKey: "gudgeon_pin" };
        pistonGroup.add(pinMesh);

        this.parts.piston = pistonGroup;
        this.parts.gudgeonPin = pinMesh;
        this.explodeOffsets.piston = new THREE.Vector3(0, 3.5, 0);
        this.explodeOffsets.gudgeonPin = new THREE.Vector3(0, 0, 2.5);
        this.group.add(pistonGroup);
    }

    buildCylinderBlock() {
        const blockGroup = new THREE.Group();
        blockGroup.name = "cylinder_block_group";

        // Cylinder Sleeve / Liner (Lòng xilanh)
        // Bore = 4.22 (radius 2.11), outer radius 2.35, height 9.5
        const sleeveGeo = new THREE.CylinderGeometry(2.25, 2.25, 9.5, 48, 1, true);
        const sleeveMesh = new THREE.Mesh(sleeveGeo, this.materials.glassSleeve);
        sleeveMesh.position.set(0, 7.2, 0);
        sleeveMesh.userData = { partKey: "cylinder_sleeve" };
        blockGroup.add(sleeveMesh);

        // Engine block body with cooling fins (Thân máy với các cánh tản nhiệt)
        const finCount = 8;
        for (let i = 0; i < finCount; i++) {
            const finY = 4.0 + i * 0.9;
            const finGeo = new THREE.BoxGeometry(6.2, 0.18, 6.2);
            const finMesh = new THREE.Mesh(finGeo, this.materials.aluminum);
            finMesh.position.set(0, finY, 0);
            finMesh.userData = { partKey: "cylinder_block" };
            blockGroup.add(finMesh);
        }

        // Crankcase bottom shell (Cacte chứa trục khuỷu)
        const crankcaseGeo = new THREE.BoxGeometry(6.6, 4.0, 6.6);
        const crankcaseMesh = new THREE.Mesh(crankcaseGeo, this.materials.castIron);
        crankcaseMesh.position.set(0, -1.0, 0);
        crankcaseMesh.userData = { partKey: "crankcase" };
        // We make the front of crankcase cut open so internal mechanism is clearly visible
        blockGroup.add(crankcaseMesh);

        this.parts.cylinderBlock = blockGroup;
        this.parts.sleeve = sleeveMesh;
        this.explodeOffsets.cylinderBlock = new THREE.Vector3(-4.0, 0, 0);
        this.group.add(blockGroup);
    }

    buildCylinderHead() {
        const headGroup = new THREE.Group();
        headGroup.name = "cylinder_head_group";

        // Head plate (Nắp máy / Nắp quy-lát)
        const headGeo = new THREE.BoxGeometry(6.6, 1.8, 6.6);
        const headMesh = new THREE.Mesh(headGeo, this.materials.aluminum);
        headMesh.position.set(0, 12.6, 0);
        headMesh.userData = { partKey: "cylinder_head" };
        headGroup.add(headMesh);

        // Intake manifold pipe (Cổ hút)
        const intakePipeGeo = new THREE.CylinderGeometry(0.65, 0.65, 2.8, 24);
        intakePipeGeo.rotateZ(Math.PI / 3);
        const intakePipe = new THREE.Mesh(intakePipeGeo, this.materials.aluminum);
        intakePipe.position.set(-2.4, 13.5, 0);
        intakePipe.userData = { partKey: "intake_manifold" };
        headGroup.add(intakePipe);

        // Exhaust manifold pipe (Cổ xả)
        const exhaustPipeGeo = new THREE.CylinderGeometry(0.65, 0.65, 2.8, 24);
        exhaustPipeGeo.rotateZ(-Math.PI / 3);
        const exhaustPipe = new THREE.Mesh(exhaustPipeGeo, this.materials.castIron);
        exhaustPipe.position.set(2.4, 13.5, 0);
        exhaustPipe.userData = { partKey: "exhaust_manifold" };
        headGroup.add(exhaustPipe);

        // Camshaft & Rocker cover (Nắp dàn cò xupap)
        const rockerCoverGeo = new THREE.CylinderGeometry(1.8, 2.0, 4.5, 24);
        rockerCoverGeo.rotateX(Math.PI / 2);
        const rockerCover = new THREE.Mesh(rockerCoverGeo, this.materials.aluminum);
        rockerCover.position.set(0, 14.2, 0);
        rockerCover.userData = { partKey: "rocker_cover" };
        headGroup.add(rockerCover);

        this.parts.cylinderHead = headGroup;
        this.explodeOffsets.cylinderHead = new THREE.Vector3(0, 5.0, 0);
        this.group.add(headGroup);
    }

    buildValves() {
        const valvesGroup = new THREE.Group();
        valvesGroup.name = "valves_group";

        const createValve = (name, isIntake, xPos) => {
            const vGroup = new THREE.Group();
            vGroup.name = name;

            // Valve stem (Thân xupap)
            const stemGeo = new THREE.CylinderGeometry(0.18, 0.18, 3.2, 24);
            const stemMesh = new THREE.Mesh(stemGeo, this.materials.steelPolished);
            stemMesh.position.y = 1.6;
            vGroup.add(stemMesh);

            // Valve head (Nấm xupap)
            const headRadius = isIntake ? 0.95 : 0.8; // Intake is larger
            const headGeo = new THREE.ConeGeometry(headRadius, 0.45, 32);
            headGeo.rotateX(Math.PI);
            const headMesh = new THREE.Mesh(headGeo, this.materials.steelPolished);
            headMesh.position.y = 0.1;
            vGroup.add(headMesh);

            // Valve spring (Lò xo xupap)
            const springRadius = 0.42;
            const springHeight = 1.8;
            const springGeo = new THREE.CylinderGeometry(springRadius, springRadius, springHeight, 16, 8, true);
            const springMesh = new THREE.Mesh(springGeo, this.materials.copper);
            springMesh.position.y = 2.0;
            vGroup.add(springMesh);

            vGroup.position.set(xPos, 11.7, 0);
            vGroup.userData = { partKey: isIntake ? "intake_valve" : "exhaust_valve", initialY: 11.7 };
            return vGroup;
        };

        this.intakeValve = createValve("intake_valve", true, -1.05);
        this.exhaustValve = createValve("exhaust_valve", false, 1.05);

        valvesGroup.add(this.intakeValve);
        valvesGroup.add(this.exhaustValve);

        this.parts.valves = valvesGroup;
        this.explodeOffsets.valves = new THREE.Vector3(0, 4.5, 0);
        this.group.add(valvesGroup);
    }

    buildSparkPlug() {
        const sparkPlugGroup = new THREE.Group();
        sparkPlugGroup.name = "spark_plug_group";

        // Threaded base (Chân ren bu-gi)
        const threadGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.2, 24);
        const threadMesh = new THREE.Mesh(threadGeo, this.materials.steelRough);
        threadMesh.position.y = 0.6;
        sparkPlugGroup.add(threadMesh);

        // Hex nut (Đai ốc mở bu-gi)
        const hexGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.5, 6);
        const hexMesh = new THREE.Mesh(hexGeo, this.materials.steelPolished);
        hexMesh.position.y = 1.45;
        sparkPlugGroup.add(hexMesh);

        // Ceramic insulator (Sứ cách điện màu trắng có rãnh)
        const ceramicGeo = new THREE.CylinderGeometry(0.5, 0.55, 1.8, 24);
        const ceramicMesh = new THREE.Mesh(ceramicGeo, this.materials.ceramic);
        ceramicMesh.position.y = 2.6;
        sparkPlugGroup.add(ceramicMesh);

        // Terminal stud (Điện cực đuôi bu-gi)
        const studGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.6, 16);
        const studMesh = new THREE.Mesh(studGeo, this.materials.brass);
        studMesh.position.y = 3.8;
        sparkPlugGroup.add(studMesh);

        // Electrodes & Spark point light (Điện cực & tia lửa điện)
        const electrodeGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.35, 12);
        const electrodeMesh = new THREE.Mesh(electrodeGeo, this.materials.copper);
        electrodeMesh.position.y = -0.1;
        sparkPlugGroup.add(electrodeMesh);

        // Point light for spark
        this.sparkLight = new THREE.PointLight(0x00f0ff, 0, 8, 2);
        this.sparkLight.position.set(0, -0.3, 0);
        sparkPlugGroup.add(this.sparkLight);

        // Spark glow mesh
        const sparkGlowGeo = new THREE.SphereGeometry(0.25, 16, 16);
        this.sparkGlowMat = new THREE.MeshBasicMaterial({ color: 0x88ffff, transparent: true, opacity: 0 });
        const sparkGlowMesh = new THREE.Mesh(sparkGlowGeo, this.sparkGlowMat);
        sparkGlowMesh.position.set(0, -0.25, 0);
        sparkPlugGroup.add(sparkGlowMesh);

        sparkPlugGroup.position.set(0, 11.7, 0);
        sparkPlugGroup.userData = { partKey: "spark_plug" };

        this.parts.sparkPlug = sparkPlugGroup;
        this.explodeOffsets.sparkPlug = new THREE.Vector3(0, 6.5, 0);
        this.group.add(sparkPlugGroup);
    }

    buildCombustionChamber() {
        // Cylindrical gas volume between cylinder head (y=11.7) and piston crown
        const gasGeo = new THREE.CylinderGeometry(2.08, 2.08, 1, 32);
        this.combustionGasMesh = new THREE.Mesh(gasGeo, this.materials.combustionGas);
        this.combustionGasMesh.userData = { partKey: "combustion_chamber" };
        this.group.add(this.combustionGasMesh);
    }

    // Kinematics solver & update loop
    update(crankAngle, explodedFactor = 0, audioController = null) {
        this.crankAngle = crankAngle % (4 * Math.PI); // 0 to 720 deg
        const theta = this.crankAngle;
        const deg = (theta * 180 / Math.PI);

        // 1. Crankshaft rotation around Z axis
        this.parts.crankshaft.rotation.z = -theta;

        // 2. Slider-crank kinematics:
        // Crankpin coordinate in world space (relative to crank origin)
        const r = this.crankRadius;
        const l = this.conRodLength;

        // Crankpin position
        const pinX = -r * Math.sin(theta);
        const pinY = r * Math.cos(theta);

        // Connecting rod tilt angle beta
        // sin(beta) = pinX / l = -r * sin(theta) / l
        const sinBeta = pinX / l;
        const beta = Math.asin(Math.max(-1, Math.min(1, sinBeta)));

        // Piston pin height: pinY + l * cos(beta)
        const pistonY = pinY + Math.sqrt(Math.max(0, l * l - pinX * pinX));
        this.pistonPinHeight = pistonY;

        // Connecting rod: position big end at crank pin, rotate by beta
        this.parts.connectingRod.position.set(pinX, pinY, 0);
        this.parts.connectingRod.rotation.z = -beta;

        // Piston: translate vertically to pistonY
        this.parts.piston.position.set(0, pistonY, 0);

        // 3. Valves kinematics:
        // Cycle is 0° to 720°
        // Intake stroke: 0° -> 180° (Intake valve open)
        // Compression: 180° -> 360° (Both closed)
        // Power/Expansion: 360° -> 540° (Both closed, spark fires at 355°-365°)
        // Exhaust stroke: 540° -> 720° (Exhaust valve open)

        let intakeLift = 0;
        let exhaustLift = 0;
        let currentStroke = "Intake";
        let gasColor = 0x00aaff; // Default intake cyan
        let gasOpacity = 0.35;
        let isSparking = false;

        if (deg >= 0 && deg < 180) {
            currentStroke = "Hút (Intake)";
            // Max lift at 90 deg
            intakeLift = Math.sin((deg / 180) * Math.PI) * 0.7;
            gasColor = 0x22c55e; // Green/Blue fresh air-fuel mix
            gasOpacity = 0.3 + (deg / 180) * 0.2;
        } else if (deg >= 180 && deg < 360) {
            currentStroke = "Nén (Compression)";
            // Squeezing mixture -> warms up to amber/orange
            const compProgress = (deg - 180) / 180;
            gasColor = 0xf59e0b; // Amber
            gasOpacity = 0.4 + compProgress * 0.4;

            // Spark ignition near TDC (355° - 365°)
            if (deg >= 352 && deg <= 365) {
                isSparking = true;
                if (audioController && !this.hasPlayedSpark) {
                    audioController.playSparkSound();
                    this.hasPlayedSpark = true;
                }
            } else {
                this.hasPlayedSpark = false;
            }
        } else if (deg >= 360 && deg < 540) {
            currentStroke = "Nổ - Sinh công (Power / Combustion)";
            const expProgress = (deg - 360) / 180;
            gasColor = 0xef4444; // Fire Red / Orange
            gasOpacity = 0.85 - expProgress * 0.4;

            if (deg <= 368) {
                isSparking = true;
            }
        } else {
            currentStroke = "Xả (Exhaust)";
            // Max lift at 630 deg
            exhaustLift = Math.sin(((deg - 540) / 180) * Math.PI) * 0.7;
            gasColor = 0x64748b; // Gray exhaust smoke
            gasOpacity = 0.5 - ((deg - 540) / 180) * 0.25;
        }

        // Apply valve positions
        this.intakeValve.position.y = this.intakeValve.userData.initialY - intakeLift;
        this.exhaustValve.position.y = this.exhaustValve.userData.initialY - exhaustLift;

        // Spark lighting
        if (isSparking) {
            this.sparkLight.intensity = 5.0;
            this.sparkGlowMat.opacity = 0.9;
        } else {
            this.sparkLight.intensity = 0.0;
            this.sparkGlowMat.opacity = 0.0;
        }

        // 4. Combustion chamber dynamic cylinder mesh
        // Crown of piston is at pistonY + 1.8
        // Head bottom is at 11.7
        const crownY = pistonY + 1.8;
        const chamberHeight = Math.max(0.2, 11.7 - crownY);
        this.combustionGasMesh.scale.set(1, chamberHeight, 1);
        this.combustionGasMesh.position.set(0, crownY + chamberHeight / 2, 0);
        this.combustionGasMesh.material.color.setHex(gasColor);
        this.combustionGasMesh.material.opacity = gasOpacity;

        // 5. Exploded View interpolation
        this.applyExplodedView(explodedFactor);

        return {
            strokeName: currentStroke,
            crankAngleDeg: deg.toFixed(1),
            pistonDisplacement: (pistonY - (l - r)).toFixed(2),
            strokePercent: (((pistonY - (l - r)) / (2 * r)) * 100).toFixed(1),
            isSparking: isSparking
        };
    }

    applyExplodedView(factor) {
        // Interpolate parts according to explodeOffsets
        const f = Math.max(0, Math.min(1, factor));

        if (this.parts.cylinderHead) {
            this.parts.cylinderHead.position.copy(this.explodeOffsets.cylinderHead).multiplyScalar(f);
        }
        if (this.parts.cylinderBlock) {
            this.parts.cylinderBlock.position.copy(this.explodeOffsets.cylinderBlock).multiplyScalar(f);
        }
        if (this.parts.valves) {
            this.parts.valves.position.copy(this.explodeOffsets.valves).multiplyScalar(f);
        }
        if (this.parts.sparkPlug) {
            this.parts.sparkPlug.position.copy(this.explodeOffsets.sparkPlug).multiplyScalar(f);
        }
        if (this.parts.flywheel) {
            this.parts.flywheel.position.copy(this.explodeOffsets.flywheel).multiplyScalar(f);
            this.parts.flywheel.position.z += -3.8; // Base offset
        }

        // Hide combustion gas when exploded so view is clean
        this.combustionGasMesh.visible = (factor < 0.2);
    }

    setRenderMode(mode) {
        // 'shaded', 'wireframe', 'xray'
        this.group.traverse(child => {
            if (child.isMesh && child !== this.combustionGasMesh && child !== this.parts.sleeve) {
                if (mode === 'wireframe') {
                    child.material.wireframe = true;
                } else {
                    child.material.wireframe = false;
                }
            }
        });

        if (mode === 'xray') {
            this.parts.cylinderBlock.traverse(c => {
                if (c.isMesh) {
                    c.material.transparent = true;
                    c.material.opacity = 0.25;
                }
            });
            this.parts.cylinderHead.traverse(c => {
                if (c.isMesh) {
                    c.material.transparent = true;
                    c.material.opacity = 0.25;
                }
            });
        } else {
            this.parts.cylinderBlock.traverse(c => {
                if (c.isMesh && c !== this.parts.sleeve) {
                    c.material.transparent = false;
                    c.material.opacity = 1.0;
                }
            });
            this.parts.cylinderHead.traverse(c => {
                if (c.isMesh) {
                    c.material.transparent = false;
                    c.material.opacity = 1.0;
                }
            });
        }
    }

    destroy() {
        this.scene.remove(this.group);
    }
}

window.EngineModel = EngineModel;
