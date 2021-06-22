'use strict';

var totalShadow = document.querySelector('.total-shadow');

//Fetching time through API

const getTodos = async () => {
	const response = await fetch(
		'https://ipgeolocation.abstractapi.com/v1/?api_key=d3d2ec62bad749f1a6123a7731e96ba8',
	);

	if (response.status !== 200) {
		throw new Error('Cannot fetch the data');
	}

	const data = await response.json();

	return data;
};

//executing fetch

getTodos()
	.then(data => setTime(data))

	.catch(err => console.log('rejected', err.message));

// setting now as the Date

function setTime(data) {
	let time = data.timezone.current_time;

	var splittime = time.split(':'); // split it at the colons

	// minutes are worth 60 seconds. Hours are worth 60 minutes.
	let seconds = +splittime[0] * 60 * 60 + +splittime[1] * 60 + +splittime[2];

	updateTime(seconds);
	updateCountdown(seconds);

	var startClock = setInterval(() => {
		updateTime();
	}, 1000);

	var startCountdown = setInterval(() => {
		updateCountdown();
	}, 1000);
}

//Intervaled time, and countdown timer

var updateTime = seconds => {
	var clockH = document.querySelector('.clock_hours');

	var clockM = document.querySelector('.clock_minutes');

	var clockS = document.querySelector('.clock_seconds');

	return () => {
		//taking fetched frozen time and setting the seconds and adding 1 every interval
		console.log(seconds);

		seconds.setSeconds(seconds + 1);

		var hours = now.getHours() % 12;

		var minutes = now.getMinutes();

		var seconds = now.getSeconds();

		clockH.style.transform = 'rotate('.concat((360 / 12) * hours, 'deg)');

		clockM.style.transform = 'rotate('.concat((360 / 60) * minutes, 'deg)');

		clockS.style.transform = 'rotate('.concat((360 / 60) * seconds, 'deg)');
	};
};

//checking difference between set time and actual time.

var updateCountdown = (now => {
	var finalDate;

	var countDays = document.querySelector('.countdown_days');

	var countHours = document.querySelector('.countdown_hours');

	var countMinutes = document.querySelector('.countdown_minutes');

	var countSeconds = document.querySelector('.countdown_seconds');

	var dating = document.getElementById('dating');

	var date_ok = document.getElementById('date_ok');

	return () => {
		date_ok.addEventListener('click', function () {
			totalShadow.style.display = 'none';

			totalShadow.querySelector('.date').style.display = 'none';

			finalDate = dating.value;

			finalDate = new Date(finalDate);
		});

		var diff = finalDate - now;

		if (finalDate === undefined || isNaN(finalDate)) {
			countDays.textContent = '00';

			countHours.textContent = '00';

			countMinutes.textContent = '00';

			countSeconds.textContent = '00';
		} else if (diff <= 0) {
			playSound();

			finalDate = undefined;

			totalShadow.querySelector('.match').style.display = 'block';

			totalShadow.style.display = 'block';

			resetter();
		} else {
			var diffObj = convertMillisToDHMS(diff);

			countDays.textContent =
				diffObj.days >= 10 ? diffObj.days : '0' + diffObj.days;

			countHours.textContent =
				diffObj.hours >= 10 ? diffObj.hours : '0' + diffObj.hours;

			countMinutes.textContent =
				diffObj.minutes >= 10 ? diffObj.minutes : '0' + diffObj.minutes;

			countSeconds.textContent =
				diffObj.seconds >= 10 ? diffObj.seconds : '0' + diffObj.seconds;
		}
	};
})();

//Setting alarm for set time.

const setting = (() => {
	var setter = document.querySelector('.setter_button');

	return setter.addEventListener('click', function () {
		totalShadow.style.display = 'flex';

		totalShadow.querySelector('.date').style.display = 'block';
	});
})();

//playalarm and resetting alarm

//USING DESTRUCTURING

const { resetter, playSound } = (() => {
	var audio = document.createElement('audio');

	var resetting = document.getElementById('reset');

	return {
		playSound() {
			audio.src = 'sounds/alarm.mp3';

			audio.loop = true;

			audio.play();
		},

		resetter() {
			resetting.addEventListener('click', function () {
				audio.pause();

				audio.loop = false;

				totalShadow.style.display = 'none';

				totalShadow.querySelector('.match').style.display = 'none';
			});
		},
	};
})();

//conversion for time

var convertMillisToDHMS = millis => {
	var second = 1000;

	var minute = second * 60;

	var hour = minute * 60;

	var day = hour * 24;

	var days = Math.floor(millis / day);

	var hours = Math.floor((millis % day) / hour);

	var minutes = Math.floor((millis % hour) / minute);

	var seconds = Math.floor((millis % minute) / second);

	return {
		days: days,

		hours: hours,

		minutes: minutes,

		seconds: seconds,
	};
};
