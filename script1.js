'use strict';

var totalShadow = document.querySelector('.total-shadow');
var now = new Date();
var switched = false;

const getTodos = resource => {
	return new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();
		request.addEventListener('readystatechange', () => {
			if (request.readyState === 4 && request.status === 200) {
				const data = JSON.parse(request.responseText);
				resolve(data);
			} else if (request.readyState === 4) {
				reject('could not fetch the data');
			}
		});
		request.open('GET', resource);
		request.send();
	});
};

const boopie = data => {
	var temptime = data;
	now = new Date(temptime.datetime);
	var startClock = setInterval(() => {
		if (switched) {
			clearInterval(startClock);
			switched = false;
			updateTime();
		} else {
			updateTime();
		}
	}, 1000);
	var startCountdown = setInterval(() => {
		if (switched) {
			clearInterval(startCountdown);
			switched = false;
			updateCountdown();
		} else {
			updateCountdown();
		}
	}, 1000);
};

getTodos(
	'https://timezone.abstractapi.com/v1/current_time/?api_key=02cb7d9db65e4c3c95f94e654a21f854&location=Oxford, United Kingdom',
)
	.then(data => {
		boopie(data);
	})
	.catch(err => {
		console.log('promise rejected:', err);
	});
var selected = document.getElementById('time-select');
selected.addEventListener('change', () => {
	if (selected.value === '1') {
		switched = true;
		var address =
			'https://timezone.abstractapi.com/v1/current_time/?api_key=02cb7d9db65e4c3c95f94e654a21f854&location=Toronto, Canada';
		getTodos(address)
			.then(data => {
				boopie(data);
			})
			.catch(err => {
				console.log('promise rejected:', err);
			});
	} else if (selected.value === '2') {
		switched = true;
		var address =
			'https://timezone.abstractapi.com/v1/current_time/?api_key=02cb7d9db65e4c3c95f94e654a21f854&location=Oxford, United Kingdom';
		getTodos(address)
			.then(data => {
				boopie(data);
			})
			.catch(err => {
				console.log('promise rejected:', err);
			});
	} else {
		switched = true;
		var address =
			'https://timezone.abstractapi.com/v1/current_time/?api_key=02cb7d9db65e4c3c95f94e654a21f854&location=Seoul, South Korea';
		getTodos(address)
			.then(data => {
				boopie(data);
			})
			.catch(err => {
				console.log('promise rejected:', err);
			});
	}
}); //Intervaled time, and countdown timer

var updateTime = (() => {
	console.log(now);
	var clockH = document.querySelector('.clock_hours');
	var clockM = document.querySelector('.clock_minutes');
	var clockS = document.querySelector('.clock_seconds');
	return () => {
		//taking fetched frozen time and setting the seconds and adding 1 every interval
		now.setSeconds(now.getSeconds() + 1);
		var hours = now.getHours() % 12;
		var minutes = now.getMinutes();
		var seconds = now.getSeconds();
		clockH.style.transform = 'rotate('.concat((360 / 12) * hours, 'deg)');
		clockM.style.transform = 'rotate('.concat((360 / 60) * minutes, 'deg)');
		clockS.style.transform = 'rotate('.concat((360 / 60) * seconds, 'deg)');
	};
})(); //checking difference between set time and actual time.

var updateCountdown = (() => {
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
})(); //Setting alarm for set time.

const setting = (() => {
	var setter = document.querySelector('.setter_button');
	return setter.addEventListener('click', function () {
		totalShadow.style.display = 'flex';
		totalShadow.querySelector('.date').style.display = 'block';
	});
})(); //playalarm and resetting alarm

var _ref = (() => {
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

const resetter = _ref.resetter,
	playSound = _ref.playSound; //conversion for time

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

updateTime();
updateCountdown();
