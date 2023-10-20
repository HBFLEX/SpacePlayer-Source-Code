const { ipcRenderer } = require('electron')
const remote = require('@electron/remote')

const prevBtn = document.querySelector('.prevBtn')
const playBtn = document.querySelector('.playBtn')
const nextBtn = document.querySelector('.nextBtn')
const prevSideBtn = document.querySelector('.prevSideBtn')
const nextSideBtn = document.querySelector('.nextSideBtn')
const trackProgress = document.querySelector('.track-progress')
const trackVolume = document.querySelector('.track-volume')
const trackCurrentTime = document.querySelector('.track-current-time')
const trackTotalDuration = document.querySelector('.track-duration-time')
const playerContainer = document.querySelector('.player')
const coverImage = document.querySelector('.coverImage')
const cover = document.getElementById('cover')
const upNextDisplay = document.querySelector('.upNextDisplay')
const toggleFSBtn = document.querySelector('.toggleFS')
const keyEventDisplay = document.querySelector('.keyEventDisplay')
const videoPlayer = document.getElementById('video-player')

let audioPlayer = new Audio()
let isTrackPaused = false
let trackIndex = 0 // to determine the index of the current playing track in the tracklist

// current window ref
const currentWindow = remote.getCurrentWindow()

// all files imported to the player are stored in this array
let tracklist = []

// sound effects -> will be applied on the next update
// const ctx = new AudioContext()
// ctx.createMediaElementSource(audioPlayer)

// const oscillator = ctx.createOscillator()
// oscillator.type = 'sine'
// oscillator.frequency.setValueAtTime(420, ctx.currentTime);

// const biquadFilter = ctx.createBiquadFilter();
// biquadFilter.type = 'lowpass';
// biquadFilter.frequency.setValueAtTime(200, ctx.currentTime + 4);
// oscillator.connect(biquadFilter);

// biquadFilter.connect(ctx.destination);
// oscillator.start();
// oscillator.stop(30);

const updateAudioProgress = () => {
	if(audioPlayer.currentTime < 10){
		trackCurrentTime.innerHTML = `00:0${Math.floor(audioPlayer.currentTime)}`
	}

	if(audioPlayer.currentTime >= 10){
		trackCurrentTime.innerHTML = `00:${Math.floor(audioPlayer.currentTime)}`
	}

	if(audioPlayer.currentTime === 60){
		trackCurrentTime.innerHTML = `0${Math.floor(audioPlayer.currentTime / 60)}:00`
	}

	if(audioPlayer.currentTime > 60 && audioPlayer.currentTime % 60 < 10){
		trackCurrentTime.innerHTML = `0${Math.floor(audioPlayer.currentTime / 60)}:0${Math.floor(audioPlayer.currentTime % 60)}`
	}

	if(audioPlayer.currentTime > 60 && audioPlayer.currentTime % 60 >= 10){
		trackCurrentTime.innerHTML = `0${Math.floor(audioPlayer.currentTime / 60)}:${Math.floor(audioPlayer.currentTime % 60)}`
	}

	if(audioPlayer.currentTime === 600){
		trackCurrentTime.innerHTML = `${600 / 60}:00`
	}

	if(audioPlayer.currentTime > 600 && audioPlayer.currentTime % 60 < 10){
		trackCurrentTime.innerHTML = `${Math.floor(audioPlayer.currentTime / 60)}:0${Math.floor(audioPlayer.currentTime % 60)}`
	}

	if(audioPlayer.currentTime > 600 && audioPlayer.currentTime % 60 >= 10){
		trackCurrentTime.innerHTML = `${Math.floor(audioPlayer.currentTime / 60)}:${Math.floor(audioPlayer.currentTime % 60)}`
	}

	const totalMinutes = audioPlayer.currentTime / 60
	const seconds = Math.floor(audioPlayer.currentTime % 60)
	const hours = Math.floor(totalMinutes / 60)
	const minutes = Math.floor(totalMinutes % 60)

	if(audioPlayer.currentTime > 3600 && minutes < 10 && seconds < 10){
		trackCurrentTime.innerHTML = `${hours}:0${minutes}:0${seconds}`
	}

	if(audioPlayer.currentTime > 3600 && minutes < 10 && seconds >= 10){
		trackCurrentTime.innerHTML = `${hours}:0${minutes}:${seconds}`
	}

	if(audioPlayer.currentTime > 3600 && minutes >= 10 && seconds < 10){
		trackCurrentTime.innerHTML = `${hours}:${minutes}:0${seconds}`
	}

	if(audioPlayer.currentTime > 3600 && minutes >= 10 && seconds >= 10){
		trackCurrentTime.innerHTML = `${hours}:${minutes}:${seconds}`
	}
}

const updateVideoProgress = () => {
	if(videoPlayer.currentTime < 10){
		trackCurrentTime.innerHTML = `00:0${Math.floor(videoPlayer.currentTime)}`
	}

	if(videoPlayer.currentTime >= 10){
		trackCurrentTime.innerHTML = `00:${Math.floor(videoPlayer.currentTime)}`
	}

	if(videoPlayer.currentTime === 60){
		trackCurrentTime.innerHTML = `0${Math.floor(videoPlayer.currentTime / 60)}:00`
	}

	if(videoPlayer.currentTime > 60 && videoPlayer.currentTime % 60 < 10){
		trackCurrentTime.innerHTML = `0${Math.floor(videoPlayer.currentTime / 60)}:0${Math.floor(videoPlayer.currentTime % 60)}`
	}

	if(videoPlayer.currentTime > 60 && videoPlayer.currentTime % 60 >= 10){
		trackCurrentTime.innerHTML = `0${Math.floor(videoPlayer.currentTime / 60)}:${Math.floor(videoPlayer.currentTime % 60)}`
	}

	if(videoPlayer.currentTime === 600){
		trackCurrentTime.innerHTML = `${600 / 60}:00`
	}

	if(videoPlayer.currentTime > 600 && videoPlayer.currentTime % 60 < 10){
		trackCurrentTime.innerHTML = `${Math.floor(videoPlayer.currentTime / 60)}:0${Math.floor(videoPlayer.currentTime % 60)}`
	}

	if(videoPlayer.currentTime > 600 && videoPlayer.currentTime % 60 >= 10){
		trackCurrentTime.innerHTML = `${Math.floor(videoPlayer.currentTime / 60)}:${Math.floor(videoPlayer.currentTime % 60)}`
	}

	if(videoPlayer.currentTime > 3599 && videoPlayer.currentTime < 3600){
		trackCurrentTime.innerHTML = '1:00:00'
	}

	const totalMinutes = videoPlayer.currentTime / 60
	const seconds = Math.floor(videoPlayer.currentTime % 60)
	const hours = Math.floor(totalMinutes / 60)
	const minutes = Math.floor(totalMinutes % 60)

	if(videoPlayer.currentTime > 3600 && minutes < 10 && seconds < 10){
		trackCurrentTime.innerHTML = `${hours}:0${minutes}:0${seconds}`
	}

	if(videoPlayer.currentTime > 3600 && minutes < 10 && seconds >= 10){
		trackCurrentTime.innerHTML = `${hours}:0${minutes}:${seconds}`
	}

	if(videoPlayer.currentTime > 3600 && minutes >= 10 && seconds < 10){
		trackCurrentTime.innerHTML = `${hours}:${minutes}:0${seconds}`
	}

	if(videoPlayer.currentTime > 3600 && minutes >= 10 && seconds >= 10){
		trackCurrentTime.innerHTML = `${hours}:${minutes}:${seconds}`
	}

	// if(videoPlayer.currentTime > 3600 && videoPlayer.currentTime % 60 > 10){
	// 	trackCurrentTime.innerHTML = `${Math.floor(videoPlayer.currentTime / 60 / 60)}:${Math.floor(videoPlayer.currentTime % 60)}:${Math.floor(videoPlayer.currentTime % 60 % 60)}`
	// }
}

const updateTrackRunningTime = () => {
	if(tracklist[trackIndex].metadata.isVideo) updateVideoProgress()
	else updateAudioProgress()
}

const handleUpNextDisplay = (currentTime) => {
	if(parseInt(currentTime) === 80){
		// check if the media is a video, if it is looped show the up next track = itself
		// same for audio
		// otherwise if they both not looped, the up next track is one in front of its
		// queue position
		let upNextTrack
		if(tracklist[trackIndex].metadata.isVideo){
			if(videoPlayer.loop){
				upNextTrack = trackIndex
			}else{
				upNextTrack = trackIndex < tracklist.length - 1 ? trackIndex + 1 : 0
			}
		}else{
			if(audioPlayer.loop){
				upNextTrack = trackIndex
			}else{
				upNextTrack = trackIndex < tracklist.length - 1 ? trackIndex + 1 : 0
			}
		}
		upNextDisplay.innerHTML = `<p style="font-size: 16px;">Up Next: <b>${tracklist[upNextTrack].metadata.fileName}</b></p>`
		upNextDisplay.style.opacity = 1
	}

	if(parseInt(currentTime) === 90){
		upNextDisplay.style.opacity = 0
	}
}

const updateTrackProgress = () => {

	setInterval(() => {
		if(tracklist[trackIndex].metadata.isVideo){
			if(videoPlayer.duration){
				let currentTime = videoPlayer.currentTime * (100 / videoPlayer.duration)
				trackProgress.value = currentTime
				updateTrackRunningTime()
				handleUpNextDisplay(currentTime)
			}
		}else{
			if(audioPlayer.duration){
				let currentTime = audioPlayer.currentTime * (100 / audioPlayer.duration)
				trackProgress.value = currentTime
				updateTrackRunningTime()
				handleUpNextDisplay(currentTime)
			}
		}
	},1000)
}

// change the volume if user adjusts it
trackVolume.addEventListener('change', () => {
	// the audio/video player volume is set from 0 - 1, dividing it by 100 changes
	// the track volume value since it is from 0 - 100, changes to a range of 0 - 1
	if(tracklist[trackIndex].metadata.isVideo) videoPlayer.volume = trackVolume.value / 100
	else audioPlayer.volume = trackVolume.value / 100
})

const prettifyTrackDuration = (duration) => {
	let trackDurationHour, trackDurationMin, trackDurationSec, durationHour, durationMin, durationSec
	// in this case a track less than 60 seconds doesnt include a , (1 minutes, 40 seconds) for example
	// if it is i first check if it contains a (.) since some shorter track comes with for example 40.56 sec
	// if true, i split the string and grab the first value which in this case 40, i do not intend to display
	// float like values. otherwise i just grab the duration second itself then return it.
	// this format comes with fp-props module -> to understand you should look at how metadata is displayed
	if(!duration.includes(',')){
		trackDurationSec = duration.includes('.') ? duration.split('.')[0] : duration
		trackDurationMin = "00"
		audioPlayer.volume = 0.5
		trackVolume.value = 50
	}else{
		// get the minute digit which shows at index 0 excluding the string 'minutes' after it
		if(tracklist[trackIndex].metadata.extension === '.mp3' || tracklist[trackIndex].metadata.extension === '.wav' || tracklist[trackIndex].metadata.extension === '.ogg' || tracklist[trackIndex].metadata.extension === '.mp4' || tracklist[trackIndex].metadata.extension === '.webm' || tracklist[trackIndex].metadata.extension === '.ogg'){
			
			if(duration.split(', ').length > 2){
				durationHour = duration.split(', ')[0]
				durationMin = duration.split(', ')[1]
				durationSec = duration.split(', ')[2].split('.')[0]
				trackDurationHour = durationHour
				trackDurationHour = trackDurationHour.replace('hours', '').trim()
				trackDurationSec = durationSec.substring(0, 2)
			}else{
				durationMin = duration.split(', ')[0]
				durationSec = duration.split(', ')[1]
				trackDurationSec = durationSec.substring(0, 2)
			}

			trackDurationMin = durationMin.substring(0, 2).trim()

			if(trackDurationSec.includes('.')){ 
				trackDurationSec = trackDurationSec.replace('.', '')
				trackDurationSec = '0' + trackDurationSec
			}
		}
		// trackDurationMin = tracklist[trackIndex].metadata.extension === '.mp3' ? duration.split(', ')[0].substring(0, 1) : duration.split('.')[0].substring(0, 1)
		// // get the first two digits excluding the string 'seconds' after it
		// trackDurationSec = tracklist[trackIndex].metadata.extension === '.mp3' ? duration.split(', ')[1].substring(0, 2) : duration.split('.')[1].substring(0, 2)
	}
	// if the duration length < 3 that means the loaded media is less than an hour
	// will return its total min and total sec
	// if the duration length > 2 thats means the loaded media is about an hour or longer
	// will return its total hours, total min & total sec
	return duration.split(', ').length < 3 ? `${trackDurationMin}:${trackDurationSec}` : `${trackDurationHour}:${trackDurationMin}:${trackDurationSec}`
}

const generateRandomBackgroundOptions = () => {
	const red = Math.floor(Math.random() * 255)
	const green = Math.floor(Math.random() * 255)
	const blue = Math.floor(Math.random() * 255)

	const colorOptions = {
		primaryColor: { red: red, green: green, blue: blue }, 
		secondaryColor: { 
			red: red <= 200 ? red + 10 : red,
			green: green <= 200 ? green + 10 : green,
			blue: blue <= 200 ? blue + 10 : blue,
		} 
	}

	return colorOptions
}

const changePlayerBackground = () => {
	const colorPicker = generateRandomBackgroundOptions()
	playerContainer.style.background = `
		linear-gradient(
			180deg,
			rgba(${colorPicker.primaryColor.red}, ${colorPicker.primaryColor.green}, ${colorPicker.primaryColor.blue}, 0.4),
			rgba(${colorPicker.secondaryColor.red}, ${colorPicker.secondaryColor.green}, ${colorPicker.secondaryColor.blue}, 0.4) 
		)
	`
}

const loadVideoTrack = (track) => {
	console.log(track)
	videoPlayer.width = window.outerWidth
	videoPlayer.height = window.outerHeight

	videoPlayer.src = track.song
	videoPlayer.load()
	videoPlayer.style.display = 'block'
	audioPlayer.src = ""
	audioPlayer.pause()
	videoPlayer.volume = 0.5
	currentWindow.setFullScreen(true)
	coverImage.style.display = 'none'
}

const loadAudioTrack = (track) => {
	audioPlayer.src = track.song
	audioPlayer.load()
	audioPlayer.volume = 0.5 // when the track loads set it to 50%, range of (0 - 1)
	videoPlayer.src = ''
	videoPlayer.style.display = 'none'
	cover.src = './static/images/bg_plain.jpg'
	coverImage.style.display = 'block'
}

const handleFSMode = () => {
	if(!(tracklist[trackIndex].metadata.isVideo)){
		currentWindow.setFullScreen(false)
		toggleFSBtn.style.display = 'none'
	}else{
		toggleFSBtn.style.display = 'block'
	}
}

const loadTrack = (track) => {
	// check if the incoming track is not a video, then initialize the audio player
	// otherwise initialize the video player
	if(track.metadata.isVideo){
		loadVideoTrack(track)
	}else{
		loadAudioTrack(track)
	}

	updateTrackProgress()
	// update the track duration
	trackTotalDuration.textContent = prettifyTrackDuration(track.metadata.durationPretty)
	currentTrackinfo = track

	// send the loaded track metadata to the main process
	ipcRenderer.send('current-track-metadata', track.metadata)
	// hide or show the toggle full-screen btn on incoming track type
	handleFSMode()
}

const playTrack = () => {
	isTrackPaused = false
	
	if(tracklist[trackIndex].metadata.isVideo) {
		videoPlayer.play()
	}else{
		audioPlayer.play()
	}

	playBtn.innerHTML = '<i class="prevBtn fa fa-pause-circle fa-3x"></i>'
	showNotificationOnPlay(currentTrackinfo.metadata)
	ipcRenderer.send('currentPlayingTrack', tracklist[trackIndex])

}

const pauseTrack = () => {
	isTrackPaused = true
	if(tracklist[trackIndex].metadata.isVideo) {
		videoPlayer.pause()
	}else{
		audioPlayer.pause()
	}
	playBtn.innerHTML = '<i class="prevBtn fa fa-play-circle fa-3x"></i>'
}

const playPaused = () => {
	if(isTrackPaused) playTrack()
	else pauseTrack()
}

const playNext = () =>{
	if(trackIndex < tracklist.length - 1) trackIndex++
	else trackIndex = 0
	if(tracklist[trackIndex].metadata.isVideo){
		videoPlayer.currentTime = 0
	}else{
		audioPlayer.currentTime = 0
	}
	loadTrack(tracklist[trackIndex])
	playTrack()
	changePlayerBackground()
	upNextDisplay.style.opacity = 0
}

const playPrev = () => {
	if(trackIndex > 0) trackIndex--
	else trackIndex = tracklist.length - 1
	console.log(trackIndex)
	loadTrack(tracklist[trackIndex])
	playTrack()
	changePlayerBackground()
	upNextDisplay.style.opacity = 0
}

const showNotificationOnPlay = (metadata) => {
	const notification = new Notification('SpacePlayer', { body: `${metadata.fileName} is now playing...`, icon: '../build/icon.ico' })
}

playBtn.addEventListener('click', (event) => {
	playPaused()
})

prevBtn.addEventListener('click', (event) => {
	playPrev()
})

nextBtn.addEventListener('click', (event) => {
	playNext()
})

const replaceAndPlay = (track) => {
	tracklist = []
	trackIndex = 0
	tracklist.push(track)

	loadTrack(tracklist[trackIndex])
	playTrack()
	console.log('loaded track', track)
	console.log('track in the tracklist', tracklist[trackIndex])
	trackVolume.value = 50
	
	if(tracklist[trackIndex].metadata.isVideo) videoPlayer.volume = 0.5
	else audioPlayer.volume = 0.5

	handleUpNextDisplay.style.opacity = 0
}

ipcRenderer.on('imported-song', (event, track) => {
	tracklist.push(track)
	//console.log('track',track)
	if(audioPlayer.src === '' || audioPlayer.src === null){
		loadTrack(tracklist[trackIndex])
		playTrack()
		audioPlayer.volume = 0.5
		trackVolume.value = 50
	}
	// send the current track list to the main process
	ipcRenderer.send('current-track-list', tracklist)
	// add to queue
	ipcRenderer.send('queued-to-playlist')

})


ipcRenderer.on('loop-track', (event) => {
	if(tracklist[trackIndex].metadata.isVideo) videoPlayer.loop = true
	else audioPlayer.loop = true
})

ipcRenderer.on('unloop-track', (event) => {
	if(tracklist[trackIndex].metadata.isVideo) videoPlayer.loop = false
	else audioPlayer.loop = false
})

ipcRenderer.on('playNormalRate', (event) => {
	if(tracklist[trackIndex].metadata.isVideo) videoPlayer.playbackRate = 1.0
	else audioPlayer.playbackRate = 1.0
})

ipcRenderer.on('playHalfRate', (event) => {
	if(tracklist[trackIndex].metadata.isVideo) videoPlayer.playbackRate = 0.5
	else audioPlayer.playbackRate = 0.5
})

ipcRenderer.on('playFasterRate', (event) => {
	if(tracklist[trackIndex].metadata.isVideo) videoPlayer.playbackRate = 2.0
	else audioPlayer.playbackRate = 2.0
})

// if the track ends reset it and pause it
audioPlayer.addEventListener('ended', (event) => {
	//audioPlayer.currentTime = 0
	playBtn.innerHTML = '<i class="prevBtn fa fa-play-circle fa-2x"></i>'
	tracklist[trackIndex].song.volume = 0.5
	trackVolume.value = 50
	playNext()
})

videoPlayer.addEventListener('ended', (event) => {
	//videoPlayer.currentTime = 0
	playBtn.innerHTML = '<i class="prevBtn fa fa-play-circle fa-2x"></i>'
	tracklist[trackIndex].song.volume = 0.5
	trackVolume.value = 50
	playNext()
})

// drag and drop files 

window.addEventListener('dragenter', (event) => {
	event.preventDefault()
	playerContainer.style.background = 'linear-gradient(180deg, #303876, #238191)'
})

window.addEventListener('dragover', (event) => {
	event.preventDefault()
	playerContainer.style.background = 'linear-gradient(180deg, #428856, #268903)'
})

window.addEventListener('dragleave', (event) => {
	event.preventDefault()
	playerContainer.style.background = 'linear-gradient(180deg, #302856, #208091)'
})

window.addEventListener('drop', (event) => {
	// get all the files which were dragged over, check if they are mp3's
	// send them to the main process to attach metadata to the files
	const files = [...event.dataTransfer.files]
	let filePaths = []

	files.filter((file) => {
		if(file.type === 'audio/mpeg' || file.type === 'audio/ogg' || file.type === 'audio/wav' || file.type === 'video/mp4' || file.type === 'video/webm' || file.type === 'video/ogg') filePaths.push(file.path)
	})
	if(filePaths) ipcRenderer.send('dragDroppedFiles', filePaths)
	playerContainer.style.background = 'linear-gradient(180deg, #302856, #208091)'
	
	if(audioPlayer.src) ipcRenderer.send('queued-to-playlist')
})

// get the clicked or selected media and load it to the player automatically
let selectedTrack = ipcRenderer.sendSync('play-selected-track')
if(selectedTrack.error || selectedTrack === null || selectedTrack === undefined){
	console.log('nothing got returned')
}else{
	replaceAndPlay(selectedTrack)
}


// get the new changed selected track, remove and replace it with the old track on the same
// window instance
ipcRenderer.on('new-selected-track', (event, track) => {
	replaceAndPlay(track)
})

ipcRenderer.on('clear-playlist', (event) => {
	tracklist = []
	audioPlayer.pause()
	audioPlayer.src = ""
	trackProgress.value = 0
	trackVolume.value = 0
	playBtn.innerHTML = '<i class="prevBtn fa fa-play-circle fa-3x"></i>'
	trackTotalDuration.textContent = "00:00"
	trackCurrentTime.textContent = "00:00"
	videoPlayer.pause()
	
})

// seek the track to the seeked position
trackProgress.addEventListener('change', () => {
	if(tracklist[trackIndex].metadata.isVideo){
		videoPlayer.currentTime = videoPlayer.duration * (trackProgress.value / 100)
	}else{
		audioPlayer.currentTime = audioPlayer.duration * (trackProgress.value / 100)
	}
	upNextDisplay.style.opacity = 0
})

// hide the next track display when clicked
upNextDisplay.addEventListener('click', () => {
	upNextDisplay.style.opacity = 0
})

const toggleFullScreen = () => {
	currentWindow.setFullScreen(!(currentWindow.isFullScreen()))
	// if(currentWindow.isFullScreen() && playerContainer.style.opacity === 1){ playerContainer.style.opacity = 0 }
	// else { playerContainer.style.opacity = 1 }
}

toggleFSBtn.addEventListener('click', () => {
	toggleFullScreen()
})

prevSideBtn.addEventListener('click', () => {
	playPrev()
})

nextSideBtn.addEventListener('click', () => {
	playNext()
})

if(tracklist.length === 0){
	videoPlayer.style.display = 'none'
	coverImage.style.display = 'block'
}

const handleKeyEventDisplay = (eventType) => {
	keyEventDisplay.style.opacity = 1
	if(eventType === 'volume') keyEventDisplay.innerHTML = `<p>${trackVolume.value}%</p>`
	if(eventType === 'fastForward' && tracklist[trackIndex].metadata.isVideo){
		let currentTime = Math.floor(videoPlayer.currentTime * (100 / videoPlayer.duration))
		keyEventDisplay.innerHTML = `<p>${currentTime}% of ${prettifyTrackDuration(tracklist[trackIndex].metadata.durationPretty)}</p>`
	}

	if(eventType === 'fastForward' && !(tracklist[trackIndex].metadata.isVideo)){
		let currentTime = Math.floor(audioPlayer.currentTime * (100 / audioPlayer.duration))
		keyEventDisplay.innerHTML = `<p>${currentTime}% of ${prettifyTrackDuration(tracklist[trackIndex].metadata.durationPretty)}</p>`
	}

	if(eventType === 'fastBackward' && tracklist[trackIndex].metadata.isVideo){
		let currentTime = Math.floor(videoPlayer.currentTime * (100 / videoPlayer.duration))
		keyEventDisplay.innerHTML = `<p>${currentTime}% of ${prettifyTrackDuration(tracklist[trackIndex].metadata.durationPretty)}</p>`
	}

	if(eventType === 'fastBackward' && !(tracklist[trackIndex].metadata.isVideo)){
		let currentTime = Math.floor(audioPlayer.currentTime * (100 / audioPlayer.duration))
		keyEventDisplay.innerHTML = `<p>${currentTime}% of ${prettifyTrackDuration(tracklist[trackIndex].metadata.durationPretty)}</p>`
	}

	if(eventType === 'togglePlayPause'){
		if(isTrackPaused){
			keyEventDisplay.innerHTML = `
			<button class="player-control-btn">
				<i class="fa fa-pause-circle fa-2x"></i>
			</button>`
		}else{
			keyEventDisplay.innerHTML = `
			<button class="player-control-btn">
				<i class="fa fa-play-circle fa-2x"></i>
			</button>`
		}
	}

	if(eventType === 'playPrev'){
		keyEventDisplay.innerHTML = `
		<button class="player-control-btn">
			<i class="fa fa-step-backward fa-2x"></i>
		</button>`
	}

	if(eventType === 'playNext'){
		keyEventDisplay.innerHTML = `
		<button class="player-control-btn">
			<i class="fa fa-step-forward fa-2x"></i>
		</button>`
	}

	if(eventType === 'toggleFS'){
		keyEventDisplay.innerHTML = `
		<button class="player-control-btn">
			<i class="fa fa-expand fa-2x"></i>
		</button>`
	}

	if(eventType === 'loopTrack'){
		keyEventDisplay.innerHTML = `
		<button class="player-control-btn">
			<i class="fa fa-repeat fa-2x"></i>
		</button>`
	}

	if(eventType === 'fastForward'){
		keyEventDisplay.innerHTML += `
		<button class="player-control-btn">
			<i class="fa fa-fast-forward fa-2x"></i>
		</button>`
	}

	if(eventType === 'fastBackward'){
		keyEventDisplay.innerHTML += `
		<button class="player-control-btn">
			<i class="fa fa-fast-backward fa-2x"></i>
		</button>`
	}

	setTimeout(() => {
		keyEventDisplay.style.opacity = 0
	}, 800)
}

// listen for some keyboard events to control the media playback
document.addEventListener('keyup', (event) => {
	if(tracklist.length > 0){
		// if Space Key is pressed, toggle play/pause event
		if(event.key === ' '){
			playPaused()
			handleKeyEventDisplay('togglePlayPause')
		}

		// if Q key is pressed, play prev track
		if(event.key === 'q' || event.key === 'Q' || event.key === 'p' || event.key === 'P'){
			playPrev()
			handleKeyEventDisplay('playPrev')
		}

		// if E key is pressed, play prev track
		if(event.key === 'e' || event.key === 'E' || event.key === 'n' || event.key === 'N'){
			playNext()
			handleKeyEventDisplay('playNext')
		}

		// if f key is pressed, toggle fullscreen
		if(event.key === 'f' || event.key === 'F'){
			if(tracklist[trackIndex].metadata.isVideo){
				handleKeyEventDisplay('toggleFS')
				currentWindow.setFullScreen(!currentWindow.isFullScreen())
			}
		}

		// if escape key is pressed, disable fullscreen mode
		if(event.key === 'Escape'){
			if(tracklist[trackIndex].metadata.isVideo){
				handleKeyEventDisplay('toggleFS')
				if(currentWindow.isFullScreen()){
					currentWindow.setFullScreen(false)
				}
			}
		}

		// if m key is pressed, mute track
		if(event.key === 'm' || event.key === 'M'){
			if(tracklist[trackIndex].metadata.isVideo) videoPlayer.muted = !videoPlayer.muted
			else audioPlayer.muted = !audioPlayer.muted
		}

		// if l or r key is pressed, loop track
		if(event.key === 'l' || event.key === 'L' || event.key === 'r' || event.key === 'R'){
			if(tracklist[trackIndex].metadata.isVideo) videoPlayer.loop = !videoPlayer.loop
			else audioPlayer.loop = !audioPlayer.muted
			handleKeyEventDisplay('loopTrack')
		}
	}
})

document.addEventListener('keydown', (event) => {
	if(tracklist.length > 0){
		// if Arrow Up key is pressed, increase the volume and update the volume meter
		// for media type currently playing
		if(event.key === 'ArrowUp'){
			if(tracklist[trackIndex].metadata.isVideo){
				let currentVolume = videoPlayer.volume += 0.1
				trackVolume.value = currentVolume * 100
				handleKeyEventDisplay('volume')
			}else{
				let currentVolume = audioPlayer.volume += 0.1
				trackVolume.value = currentVolume * 100
				handleKeyEventDisplay('volume')
			}
		}

		// if Arrow Up key is pressed, increase the volume and update the volume meter
		// for media type currently playing
		if(event.key === 'ArrowDown'){
			if(tracklist[trackIndex].metadata.isVideo){
				let currentVolume = videoPlayer.volume -= 0.1
				trackVolume.value = currentVolume * 100
				handleKeyEventDisplay('volume')
			}else{
				let currentVolume = audioPlayer.volume -= 0.1
				trackVolume.value = currentVolume * 100
				handleKeyEventDisplay('volume')
			}
		}

		// if Arrow Right is pressed, seek the current media forward
		if(event.key === 'ArrowRight'){
			if(tracklist[trackIndex].metadata.isVideo){
				videoPlayer.currentTime += 2
				upNextDisplay.style.opacity = 0
				handleKeyEventDisplay('fastForward')
			}else{
				audioPlayer.currentTime += 2
				upNextDisplay.style.opacity = 0
				handleKeyEventDisplay('fastForward')
			}
		}

		// if Arrow Left is pressed, seek the current media forward
		if(event.key === 'ArrowLeft'){
			if(tracklist[trackIndex].metadata.isVideo){
				if(videoPlayer.currentTime > 2) videoPlayer.currentTime -= 2
				handleKeyEventDisplay('fastBackward')
			}else{
				if(audioPlayer.currentTime > 2) audioPlayer.currentTime -= 2
				handleKeyEventDisplay('fastBackward')
			}
		}
	}
})

videoPlayer.addEventListener('dblclick', (event) => {
	handleKeyEventDisplay('toggleFS')
	currentWindow.setFullScreen(!currentWindow.isFullScreen())
})

// Most of the code is self descriptive, i tried to implement the most readable
// variable and function names but if you feel lost always ask me on my email what
// most of the code is all about. GO AHEAD AND CONTRIBUTE TO THIS PROJECT ASTRONAUT 🚀