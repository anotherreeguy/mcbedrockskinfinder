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
        // Step 1: Fetch the user's UUID from Mojang's API
        const userResponse = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
        const userData = await userResponse.json();

        if (!userData || !userData.id) {
            errorMessage.textContent = "Invalid username or user not found!";
            return;
        }

        const uuid = userData.id;

        // Step 2: Fetch the skin texture URL from Mojang's API using UUID
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

    // Create scene and camera for 3D view
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(300, 400);
    preview3d.appendChild(renderer.domElement);

    // Create the player model using the skin texture
    const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(textureUrl);
    const playerMaterial = new THREE.MeshBasicMaterial({ map: texture });

    playerModel = new THREE.Mesh(playerGeometry, playerMaterial);
    scene.add(playerModel);
    camera.position.z = 2;

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    if (playerModel) {
        playerModel.rotation.y += 0.01; // Rotate the model
    }
    renderer.render(scene, camera);
}

function downloadSkin() {
    const link = document.createElement('a');
    link.href = skinImageUrl;
    link.download = 'minecraft_skin.png';
    link.click();
}
