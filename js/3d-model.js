// Three.js 3D Model Viewer
document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('elevator-canvas')) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(5, 3, 5);
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('elevator-canvas'),
        antialias: true 
    });
    renderer.setSize(document.getElementById('3d-model').clientWidth, document.getElementById('3d-model').clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    
    // Lights setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0x0063cc, 1, 20);
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);
    
    // Controls setup
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 3;
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI / 2;
    
    // Placeholder 3D Model - elevator cabin
    function createElevatorModel() {
        const elevatorGroup = new THREE.Group();
        
        // Cabin
        const cabinGeometry = new THREE.BoxGeometry(2, 3, 2);
        const cabinMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x333333,
            metalness: 0.8,
            roughness: 0.2
        });
        const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
        cabin.position.y = 1.5;
        cabin.castShadow = true;
        cabin.receiveShadow = true;
        elevatorGroup.add(cabin);
        
        // Doors
        const doorGeometry = new THREE.BoxGeometry(0.05, 2.5, 0.9);
        const doorMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x0063cc,
            metalness: 0.9,
            roughness: 0.1
        });
        
        const leftDoor = new THREE.Mesh(doorGeometry, doorMaterial);
        leftDoor.position.set(1, 1.5, 0.2);
        leftDoor.castShadow = true;
        elevatorGroup.add(leftDoor);
        
        const rightDoor = new THREE.Mesh(doorGeometry, doorMaterial);
        rightDoor.position.set(1, 1.5, -0.2);
        rightDoor.castShadow = true;
        elevatorGroup.add(rightDoor);
        
        // Control panel
        const panelGeometry = new THREE.BoxGeometry(0.3, 0.5, 0.05);
        const panelMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
        const panel = new THREE.Mesh(panelGeometry, panelMaterial);
        panel.position.set(0.8, 1.5, 0.975);
        panel.castShadow = true;
        elevatorGroup.add(panel);
        
        // Buttons
        const buttonGeometry = new THREE.CircleGeometry(0.03, 32);
        const buttonMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });
        
        for (let i = 0; i < 6; i++) {
            const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
            button.position.set(
                0.8 - 0.1 * (i % 2),
                1.6 - 0.1 * Math.floor(i / 2),
                1.0
            );
            button.rotation.x = -Math.PI / 2;
            elevatorGroup.add(button);
        }
        
        // Floor
        const floorGeometry = new THREE.BoxGeometry(2, 0.1, 2);
        const floorMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x444444,
            metalness: 0.2,
            roughness: 0.8
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.y = 0.05;
        floor.receiveShadow = true;
        elevatorGroup.add(floor);
        
        // Ceiling with lights
        const ceilingGeometry = new THREE.BoxGeometry(2, 0.1, 2);
        const ceilingMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
        ceiling.position.y = 3;
        ceiling.receiveShadow = true;
        elevatorGroup.add(ceiling);
        
        // Ceiling lights
        const lightGeometry = new THREE.BoxGeometry(1.5, 0.05, 0.5);
        const lightMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            emissive: 0xffffee,
            emissiveIntensity: 0.5
        });
        const ceilingLight = new THREE.Mesh(lightGeometry, lightMaterial);
        ceilingLight.position.y = 2.95;
        elevatorGroup.add(ceilingLight);
        
        // Motor system (simplified)
        const motorGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.8, 16);
        const motorMaterial = new THREE.MeshPhongMaterial({ color: 0x777777 });
        const motor = new THREE.Mesh(motorGeometry, motorMaterial);
        motor.position.y = 3.5;
        motor.castShadow = true;
        elevatorGroup.add(motor);
        
        // Cables
        const cableGeometry = new THREE.CylinderGeometry(0.03, 0.03, 5, 8);
        const cableMaterial = new THREE.MeshPhongMaterial({ color: 0x111111 });
        
        for (let i = 0; i < 4; i++) {
            const cable = new THREE.Mesh(cableGeometry, cableMaterial);
            cable.position.set(
                0.5 - 0.33 * (i % 2),
                6,
                0.5 - 0.33 * Math.floor(i / 2)
            );
            cable.castShadow = true;
            elevatorGroup.add(cable);
        }
        
        // Base
        const baseGeometry = new THREE.BoxGeometry(3, 0.2, 3);
        const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x555555 });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = -0.1;
        base.receiveShadow = true;
        elevatorGroup.add(base);
        
        // Safety features (emergency brake visualization)
        const brakeGeometry = new THREE.BoxGeometry(0.2, 0.4, 2.2);
        const brakeMaterial = new THREE.MeshPhongMaterial({ color: 0xcc0000 });
        const brake = new THREE.Mesh(brakeGeometry, brakeMaterial);
        brake.position.set(-1.1, 0.2, 0);
        brake.visible = false; // Hidden by default
        elevatorGroup.add(brake);
        
        return {
            group: elevatorGroup,
            doors: { left: leftDoor, right: rightDoor },
            safety: { brake: brake },
            motor: motor,
            cabin: cabin
        };
    }
    
    // Create elevator model
    const elevatorModel = createElevatorModel();
    scene.add(elevatorModel.group);
    
    // Feature Highlighting System
    const featureItems = document.querySelectorAll('.feature-item');
    
    featureItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            featureItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            const feature = this.getAttribute('data-feature');
            
            // Reset all features
            elevatorModel.safety.brake.visible = false;
            elevatorModel.doors.left.position.z = 0.2;
            elevatorModel.doors.right.position.z = -0.2;
            elevatorModel.motor.material.emissive = new THREE.Color(0x000000);
            elevatorModel.cabin.material.emissive = new THREE.Color(0x000000);
            
            // Highlight selected feature
            switch(feature) {
                case 'cabin':
                    // Open doors animation
                    gsap.to(elevatorModel.doors.left.position, { z: 0.6, duration: 1 });
                    gsap.to(elevatorModel.doors.right.position, { z: -0.6, duration: 1 });
                    elevatorModel.cabin.material.emissive = new THREE.Color(0x003366);
                    elevatorModel.cabin.material.emissiveIntensity = 0.3;
                    break;
                case 'motor':
                    // Highlight motor system
                    camera.position.set(0, 5, 5);
                    controls.update();
                    elevatorModel.motor.material.emissive = new THREE.Color(0x003366);
                    elevatorModel.motor.material.emissiveIntensity = 0.5;
                    break;
                case 'control':
                    // Focus on control panel
                    camera.position.set(3, 2, 3);
                    controls.target.set(0.8, 1.5, 0.975);
                    controls.update();
                    break;
                case 'safety':
                    // Show safety features
                    elevatorModel.safety.brake.visible = true;
                    break;
            }
        });
    });
    
    // Control Buttons
    document.getElementById('rotate-left').addEventListener('click', function() {
        gsap.to(elevatorModel.group.rotation, { y: elevatorModel.group.rotation.y + Math.PI/2, duration: 1 });
    });
    
    document.getElementById('rotate-right').addEventListener('click', function() {
        gsap.to(elevatorModel.group.rotation, { y: elevatorModel.group.rotation.y - Math.PI/2, duration: 1 });
    });
    
    document.getElementById('zoom-in').addEventListener('click', function() {
        gsap.to(camera.position, { 
            x: camera.position.x * 0.7,
            y: camera.position.y * 0.7,
            z: camera.position.z * 0.7,
            duration: 0.5 
        });
    });
    
    document.getElementById('zoom-out').addEventListener('click', function() {
        gsap.to(camera.position, { 
            x: camera.position.x * 1.3,
            y: camera.position.y * 1.3,
            z: camera.position.z * 1.3,
            duration: 0.5 
        });
    });
    
    document.getElementById('reset-view').addEventListener('click', function() {
        gsap.to(camera.position, { x: 5, y: 3, z: 5, duration: 1 });
        gsap.to(controls.target, { x: 0, y: 0, z: 0, duration: 1 });
        gsap.to(elevatorModel.group.rotation, { x: 0, y: 0, z: 0, duration: 1 });
        
        // Reset all features
        featureItems.forEach(i => i.classList.remove('active'));
        featureItems[0].classList.add('active');
        
        elevatorModel.safety.brake.visible = false;
        gsap.to(elevatorModel.doors.left.position, { z: 0.2, duration: 1 });
        gsap.to(elevatorModel.doors.right.position, { z: -0.2, duration: 1 });
        elevatorModel.motor.material.emissive = new THREE.Color(0x000000);
        elevatorModel.cabin.material.emissive = new THREE.Color(0x000000);
    });
    
    // Window resize handler
    window.addEventListener('resize', function() {
        camera.aspect = document.getElementById('3d-model').clientWidth / document.getElementById('3d-model').clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(document.getElementById('3d-model').clientWidth, document.getElementById('3d-model').clientHeight);
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    
    animate();
});