const recordButtonOne = document.getElementById('record-button-one');
const playButtonOne = document.getElementById('play-button-one');
const stopButtonOne = document.getElementById('stop-button-one');

const recordButtonTwo = document.getElementById('record-button-two');
const playButtonTwo = document.getElementById('play-button-two');
const stopButtonTwo = document.getElementById('stop-button-two');
const backdropTwo = document.getElementById('backdrop-two');

const recordButtonThree = document.getElementById('record-button-three');
const playButtonThree = document.getElementById('play-button-three');
const stopButtonThree = document.getElementById('stop-button-three');
const backdropThree = document.getElementById('backdrop-three');

const recordButtonFour = document.getElementById('record-button-four');
const playButtonFour = document.getElementById('play-button-four');
const stopButtonFour = document.getElementById('stop-button-four');
const backdropFour = document.getElementById('backdrop-four');

const signalImages = document.querySelectorAll('.signal-image');

const playMixButton = document.getElementById('play-mix-button');
const renderButton = document.getElementById('render-button');

// Grabadora
const recorder = new Tone.Recorder();
// Microfono
const mic = new Tone.UserMedia().connect(recorder);
// Players
let players = [];
//Latencia
const latencyInput = document.getElementById('latency-input');
const latencyButton = document.getElementById('latency-button');
let latencyValue = 250;

let audioNotStarted = true;
document.querySelectorAll('button').forEach(btn => {
		btn.addEventListener('click', async () => {
			if (audioNotStarted){
				await Tone.start()
				console.log('audio is ready')
				audioNotStarted = false;
			}
		});
});

latencyButton.addEventListener('click', () => {
	latencyValue = latencyInput.value;
	console.log(latencyValue);
});

const recordTrack = () => {
	// Grabar si el micrófono está abierto
	mic.open().then(() => {
		// El micrófono está abierto, comenzar la grabación
		recorder.start();
	}).catch(e => {
	console.log("Error al abrir el micrófono: " + e);
	});
}

const stopRecording = async (index) => {
	// the recorded audio is returned as a blob
	const recording = await recorder.stop();
	console.log("new recording created");
	// download the recording by creating an anchor element and blob url
	const url = URL.createObjectURL(recording);

	//Se le asigna el url de la grabacion a Player. Asi se puede reproducir la grabacion desde player.
	players[index] = new Tone.Player(url).toDestination();
	console.log(url);

	//change silence image to sound image
	signalImages[index].src='signal.jpg';
}
const playTrack = (index) => {
	if(players[index]){
		players[index].start();
	}else{
		console.log("no player");
	}
}

const playMix = () => {
	if(players[0]){
		setTimeout(() => {
			players[0].start();
		}, (latencyValue * 3));
	}
	if(players[1]){
		setTimeout(() => {
			players[1].start();
		}, (latencyValue * 2));
	}
	if(players[2]){
		setTimeout(() => {
			players[2].start();
		}, latencyValue);
	}
	if(players[3]){
		players[3].start();
	}
}

//#region one
recordButtonOne.addEventListener('click', () => {
	recordButtonOne.classList.add('hidden');
	stopButtonOne.classList.remove('hidden');
	
	recordTrack();
});

stopButtonOne.addEventListener('click', () => {
	stopButtonOne.classList.add('hidden');
	recordButtonOne.classList.remove('hidden');

	stopRecording(0);
	backdropTwo.classList.add('hidden');
});

playButtonOne.addEventListener('click', () => {
	playTrack(0);
});
//#endregion

//#region two
recordButtonTwo.addEventListener('click', () => {
	recordButtonTwo.classList.add('hidden');
	stopButtonTwo.classList.remove('hidden');

	recordTrack();
	if(players[0]){
		players[0].start();
	}
});

stopButtonTwo.addEventListener('click', async () => {
	stopButtonTwo.classList.add('hidden');
	recordButtonTwo.classList.remove('hidden');

	stopRecording(1);
	backdropThree.classList.add('hidden');
});

playButtonTwo.addEventListener('click', () => {
	playTrack(1);
});
//#endregion

//#region three
recordButtonThree.addEventListener('click', () => {
	recordButtonThree.classList.add('hidden');
	stopButtonThree.classList.remove('hidden');

	recordTrack();
	if(players[0]){
		setTimeout(() => {
			players[0].start();
		}, latencyValue);
	}
	if(players[1]){
		players[1].start();
	}
});

stopButtonThree.addEventListener('click', async () => {
	stopButtonThree.classList.add('hidden');
	recordButtonThree.classList.remove('hidden');

	stopRecording(2);
	backdropFour.classList.add('hidden');
});

playButtonThree.addEventListener('click', () => {
	playTrack(2);
});
//#endregion

//#region four
recordButtonFour.addEventListener('click', () => {
	recordButtonFour.classList.add('hidden');
	stopButtonFour.classList.remove('hidden');

	recordTrack();
	if(players[0]){
		setTimeout(() => {
			players[0].start();
		}, (latencyValue * 2));
	}
	if(players[1]){
		setTimeout(() => {
			players[1].start();
		}, latencyValue);
	}
	if(players[2]){
		players[2].start();
	}
});

stopButtonFour.addEventListener('click', async () => {
	stopButtonFour.classList.add('hidden');
	recordButtonFour.classList.remove('hidden');

	stopRecording(3);
});

playButtonFour.addEventListener('click', () => {
	playTrack(3);
});
//#endregion


playMixButton.addEventListener('click', () => {
	playMix();
});

const audio = document.querySelector('audio');
const actx  = Tone.context;
const dest  = actx.createMediaStreamDestination();
const MixRecorder = new MediaRecorder(dest.stream);

const chunks = [];

renderButton.addEventListener('click', () => {
	players.forEach(player => {
		player.connect(dest);
	});

	MixRecorder.start();

	playMix();

	players[0].onstop = () => {
		MixRecorder.stop();
	}
	/* setTimeout(() => {
	  }, "20000"); */
});

MixRecorder.ondataavailable = evt => chunks.push(evt.data);
MixRecorder.onstop = evt => {
    let blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
    audio.src = URL.createObjectURL(blob);
};
