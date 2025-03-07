let textureUrl = "";
let skinImageUrl = "";
let skinTexture = null;
let scene, camera, renderer, mesh;

async function fetchSkin() {
    const username = document.getElementById("username").value;
    const errorMessage = document.getElementById("errorMessage");
    const skinImage = document.getElementById("skinImage");
    const preview3d = document.getElementById("preview3d");
    const downloadBtn = document.getElementById("downloadBtn");

    if (!username) {
        errorMessage.textContent = "Please enter a Minecraft username!";
        return;
    }

    // Reset previous error message and skin preview
    errorMessage.textContent = "";
    skinImage.src = "";
    preview3d.innerHTML = "";
    downloadBtn.style.display = "none"; // Hide download button initially

    try {
        // Step 1: Get the User ID from the GeyserMC API using the username
        const userResponse = await fetch(`https://api.geysermc.org/v2/xbox/xuid/${username}`);
        const userData = await userResponse.json();

        if (!userData || !userData.xuid) {
            errorMessage.textContent = "Invalid username or user not found!";
            return;
        }

        const userId = userData.xuid;

        // Step 2: Get the texture ID from the GeyserMC API
        const skinResponse = await fetch(`https://api.geysermc.org/v2/skin/${userId}`);
        const skinData = await skinResponse.json();

        if (!skinData || !skinData.textures || !skinData.textures[0]) {
            errorMessage.textContent = "Skin not found for this user!";
            return;
        }

        const textureId = skinData.textures[0];

        // Step 3: Generate the skin preview URL
        textureUrl = `https://textures.minecraft.net/texture/${textureId}`;

        // Set the skin preview image
        skinImageUrl = textureUrl;
        skinImage.src = skinImageUrl;

        // Enable download button
        downloadBtn.style.display = "block";

        // Render the 3D preview of the skin
        create3DPreview(textureUrl);

    } catch (error) {
        errorMessage.textContent = "An error occurred. Please try again!";
        console.error("Error fetching skin:", error);
    }
}

function create3DPreview(textureUrl) {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(200, 300); // Set size of preview
    document.getElementById("preview3d").appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
    loader.load(textureUrl, function (texture) {
        skinTexture = texture;

        const geometry = new THREE.BoxGeometry(1, 2, 1); // Body size
        const material = new THREE.MeshBasicMaterial({ map: skinTexture });
        mesh = new THREE.Mesh(geometry, material);

        scene.add(mesh);
        camera.position.z = 3;

        animate();
    });
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate the model for a better view
    if (mesh) {
        mesh.rotation.y += 0.01;
    }

    renderer.render(scene, camera);
}

function downloadSkin() {
    const link = document.createElement('a');
    link.href = skinImageUrl;
    link.download = 'minecraft_skin.png';
    link.click();
}
