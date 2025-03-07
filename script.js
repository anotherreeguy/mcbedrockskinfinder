let textureUrl = "";
let skinImageUrl = "";
let playerModel;

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
        // Step 1: Get the User ID (xuid) from the GeyserMC API using the username
        const userResponse = await fetch(`https://api.geysermc.org/v2/xbox/xuid/${username}`);
        const userData = await userResponse.json();

        if (!userData || !userData.xuid) {
            errorMessage.textContent = "Invalid username or user not found!";
            return;
        }

        const xuid = userData.xuid;

        // Step 2: Get the skin texture from the GeyserMC API using the xuid
        const skinResponse = await fetch(`https://api.geysermc.org/v2/skin/${xuid}`);
        const skinData = await skinResponse.json();

        if (!skinData || !skinData.textures || !skinData.textures[0]) {
            errorMessage.textContent = "Skin not found for this user!";
            return;
        }

        // Step 3: Generate the skin preview URL
        textureUrl = `https://textures.minecraft.net/texture/${skinData.textures[0]}`;
        skinImageUrl = textureUrl;

        // Set the skin preview image
        skinImage.src = skinImageUrl;

        // Enable download button
        downloadBtn.style.display = "block";

        // Create and render the 3D preview model
        create3DPreview(textureUrl);

    } catch (error) {
        errorMessage.textContent = "An error occurred. Please try again!";
        console.error("Error fetching skin:", error);
    }
}

function create3DPreview(textureUrl) {
    const preview3d = document.getElementById("preview3d");

    // Create a new Minecraft player model with the texture URL
    playerModel = new THREE.MinecraftPlayerModel({
        textureUrl: textureUrl,
        scale: 0.4
    });

    // Create scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(200, 300);
    preview3d.appendChild(renderer.domElement);

    // Add player model to the scene
    scene.add(playerModel);

    camera.position.z = 3;

    function animate() {
        requestAnimationFrame(animate);
        playerModel.rotation.y += 0.01;
        renderer.render(scene, camera);
    }

    animate();
}

function downloadSkin() {
    const link = document.createElement('a');
    link.href = skinImageUrl;
    link.download = 'minecraft_skin.png';
    link.click();
}
