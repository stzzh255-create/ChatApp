const socket = io();

let username = "";

const SECRET_KEY = "chat-secret-key";

function joinChat(){

    const country =
    document.getElementById("country").value;

    const phone =
    document.getElementById("phone").value;

    if(phone.trim() === ""){
        alert("Masukkan nomor");
        return;
    }

    username = country + " " + phone;

    socket.emit("join", username);

    document.getElementById("loginPage").style.display = "none";

    document.getElementById("appPage").style.display = "flex";

}

function encryptMessage(message){

    return CryptoJS.AES.encrypt(message, SECRET_KEY).toString();

}

function decryptMessage(cipher){

    const bytes =
    CryptoJS.AES.decrypt(cipher, SECRET_KEY);

    return bytes.toString(CryptoJS.enc.Utf8);

}

function sendMessage(){

    const input =
    document.getElementById("messageInput");

    if(input.value.trim() === "") return;

    const encrypted =
    encryptMessage(input.value);

    socket.emit("send-message",{
        encrypted
    });

    input.value = "";

}

socket.on("receive-message",(data)=>{

    const div =
    document.createElement("div");

    div.className = "message";

    div.innerHTML = `
    <b>${data.username}</b><br>
    ${decryptMessage(data.encrypted)}
    `;

    document.getElementById("messages").appendChild(div);

});

socket.on("online-users",(users)=>{

    document.getElementById("onlineUsers").innerHTML =
    users.join("<br>");

});