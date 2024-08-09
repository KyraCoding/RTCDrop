const socket = io();
const peerConnection = new RTCPeerConnection();

const fileInput = document.getElementById('fileInput');
const sendFileButton = document.getElementById('sendFile');

// Handle incoming offers and ICE candidates
socket.on('offer', async (offer) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit('answer', answer);
});

socket.on('ice-candidate', async (candidate) => {
    try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
        console.error('Error adding received ICE candidate', error);
    }
});

// Create an offer when the file is ready to send
sendFileButton.addEventListener('click', async () => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit('offer', offer);

    // Add the file to the data channel
    const file = fileInput.files[0];
    if (file) {
        const channel = peerConnection.createDataChannel('fileTransfer');
        channel.binaryType = 'arraybuffer';
        channel.onopen = () => {
            channel.send(file);
        };
    }
});

peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
        socket.emit('ice-candidate', event.candidate);
    }
};

peerConnection.ondatachannel = (event) => {
    const channel = event.channel;
    channel.onmessage = (event) => {
        console.log('File received:', event.data);
        // Save the file or process it
    };
};
