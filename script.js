let textureUrl = "";
let skinImageUrl = "";
let playerModel;
let renderer, scene, camera;

async function fetchSkin() {
    const username = document.getElementById("username").value;
    const errorMessage = document.getElementById("errorMessage");
    const skinImage = document.getElementById("skinImage");
    const preview3d = document.getElementById("preview3d");
    const downloadBtn = document.getElementById("downloadBtn");

    // Reset errors, images, and previews
    errorMessage.textContent = "";
    skinImage.src = "";
    preview3d.innerHTML = "";
    downloadBtn.style.display = "none"; // Hide download button initially

    if (!username) {
        errorMessage.textContent = "Please enter a Minecraft username!";
        return;
    }

    try {
        // Step 1: Fetch the user's UUID from Mojang's API using their username
        const userResponse = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
        const userData = await userResponse.json();

        if (!userData || !userData.id) {
            errorMessage.textContent = "Invalid username or user not found!";
            return;
        }

        const uuid = userData.id;

        // Step 2: Fetch the player's skin texture using their UUID
        const skinResponse = await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`);
        const skinData = await skinResponse.json();

        if (!skinData || !skinData.properties || !skinData.properties[0].value) {
            errorMessage.textContent = "Skin not found for this user!";
            return;
        }

        // Extract and decode the base64 skin texture
        const base64Texture = skinData.properties[0].value;
        const textureUrl = `https://textures.minecraft.net/texture/${base64Texture}`;

        // Set the skin image and allow download
        skinImageUrl = textureUrl;
        skinImage.src = skinImageUrl;
        downloadBtn.style.display = "block"; // Show download button

        // Step 3: Create 3D player model preview using Three.js
        create3DPreview(textureUrl);

    } catch (error) {
        errorMessage.textContent = "An error occurred. Please try again!";
        console.error("Error fetching skin:", error);
    }
}

function create3DPreview(textureUrl) {
    const preview3d = document.getElementById("preview3d");

    // Initialize Three.js scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

    // Create a WebGL renderer and add it to the DOM
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(300, 400);
    preview3d.appendChild(renderer.domElement);

    // Create a cube to display the skin (simplified, for now)
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    // Animation loop for rendering
    function animate() {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    }

    animate();
}
