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
        // Step 1: Fetch the user's XUID (Minecraft user ID) from the API
        const xuidResponse = await fetch(`https://api.geysermc.org/v2/xbox/xuid/${username}`);
        const xuidData = await xuidResponse.json();

        if (!xuidData.xuid) {
            errorMessage.textContent = "Invalid Minecraft username or user not found!";
            return;
        }

        const xuid = xuidData.xuid;

        // Step 2: Fetch the player's profile skin data using the XUID
        const skinResponse = await fetch(`https://api.geysermc.org/v2/skin/${xuid}`);
        const skinData = await skinResponse.json();

        if (!skinData.texture_id) {
            errorMessage.textContent = "Skin not found for this user!";
            return;
        }

        // Step 3: Build the texture URL using the texture ID
        const textureId = skinData.texture_id;
        textureUrl = `https://textures.minecraft.net/texture/${textureId}`;

        // Set the skin image and allow download
        skinImageUrl = textureUrl;
        skinImage.src = skinImageUrl;
        downloadBtn.style.display = "block"; // Show download button

        // Step 4: Create 3D preview of the skin (this part can be customized further)
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
