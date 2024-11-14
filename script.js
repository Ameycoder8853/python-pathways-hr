// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBqPaKhqBBR1fXcyKqFnSTYBE6HYWUrd0c",
    authDomain: "python-pathways-hr.firebaseapp.com",
    projectId: "python-pathways-hr",
    storageBucket: "python-pathways-hr.firebasestorage.app",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "1:205224999454:web:948b6a1ba0c5be75634c0f"
};

// Initialize Firebase and Firestore
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Counter to simulate unique ID increment
let legacyCounter = 1;

async function generateLegacyID() {
    const staffName = document.getElementById("staffName").value.trim();
    const position = document.getElementById("position").value.trim();
    const dateOfJoining = document.getElementById("dateOfJoining").value;

    // Check if inputs are valid
    if (staffName && position && dateOfJoining) {
        const randomLetters = getRandomString(4);
        const randomNumber = Math.floor(Math.random() * 1000);
        const symbol = getRandomSymbol();
        const legacyID = `${staffName.substring(0, 3).toUpperCase()}-${randomLetters}-${randomNumber}${symbol}`;

        document.getElementById("legacyID").innerText = `Legacy ID for ${staffName}: ${legacyID}`;
        createCertificate(staffName, position, dateOfJoining, legacyID);

        // Save to Firestore
        try {
            await db.collection("staff").add({
                name: staffName,
                position: position,
                legacyID: legacyID,
                dateOfJoining: dateOfJoining,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Redirect to thanks page after successful save
            window.location.href = "thanks.html";
        } catch (error) {
            console.error("Error adding document to Firestore: ", error);
            alert("There was an error saving your data. Please try again.");
        }

        legacyCounter++;
    } else {
        document.getElementById("legacyID").innerText = "Please fill in all fields.";
    }
}

function createCertificate(name, position, date, id) {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#2c2c2c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.font = "36px Arial, sans-serif";
    ctx.fillText("Python Pathways Club", 230, 50);
    ctx.font = "24px Arial, sans-serif";
    ctx.fillText("Certificate of Welcome", 250, 120);
    ctx.font = "20px Arial, sans-serif";
    ctx.fillText("This is to certify that", 300, 180);
    ctx.font = "28px Arial, sans-serif";
    ctx.fillText(name, 330, 220);
    ctx.font = "20px Arial, sans-serif";
    ctx.fillText(`Position: ${position}`, 300, 260);
    ctx.fillText(`Date of Joining: ${date}`, 300, 300);
    ctx.fillText(`Legacy ID: ${id}`, 300, 340);
    ctx.font = "18px Arial, sans-serif";
    ctx.fillText(`Date of Issue: ${new Date().toLocaleDateString()}`, 300, 420);
    ctx.font = "20px Arial, sans-serif";
    ctx.fillText("Signed,", 500, 500);
    ctx.fillText("Om Rajguru", 500, 530);
    ctx.fillText("President, Python Pathways", 500, 560);

    const link = document.createElement("a");
    link.download = `${name}_Certificate.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
}

function getRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function getRandomSymbol() {
    const symbols = ['@', '#', '$', '^', '&', '*', '!'];
    return symbols[Math.floor(Math.random() * symbols.length)];
}