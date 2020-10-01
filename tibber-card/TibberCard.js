import "./lib/Chart.bundle.js"

class TibberCard extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({
			mode: 'open'
		});
	}

	set hass(hass) {
		const config = this._config;
		if (!this.curAttributes || this.curAttributes != hass.states['sensor.tibber_price'].attributes) {
			this.curAttributes = hass.states['sensor.tibber_price'].attributes;
			this.doWork(hass.states['sensor.tibber_price'].attributes, this.shadowRoot.getElementById('tibberchart').getContext('2d'))
		}

	}

	setConfig(config) {
		this.config = config;
		var cardIcon;
		const cardConfig = Object.assign({}, config);
		const root = this.shadowRoot;


		const card = document.createElement('ha-card');
		const content = document.createElement('div');
		const style = document.createElement('style');


		style.textContent =
			`
	  ha-card {
		position: relative;
		${cardConfig.style}
		
	  }
	  
	  #container {
		padding: 20px 30px 10px 20px;
	  }
	`;
		content.id = 'container';
		card.header = cardConfig.title;
		card.appendChild(content);
		card.appendChild(style);
		root.appendChild(card);
		root.getElementById('container').innerHTML = '<canvas id="tibberchart"></canvas>';
	}

	doWork(data, element) {
		var idag = data.today;
		var imorgon = data.tomorrow;

		this.dataIdag = idag.map(function (e) {
			return Number(e.total);
		});

		this.dataImorgon = imorgon.map(function (e) {
			return Number(e.total);
		});

		var ctx = element;

		this.gradientStroke = ctx.createLinearGradient(0, 50, 0, 130);

		this.gradientStroke.addColorStop(1, "rgba(0,255,0,0.5)");
		this.gradientStroke.addColorStop(0.5, "rgba(255,255,0,0.5)")
		this.gradientStroke.addColorStop(0, "rgba(255,0,0,0.5)");

		this.pointStroke = ctx.createLinearGradient(0, 50, 0, 200);

		this.pointStroke.addColorStop(1, "rgba(0,255,0,0.1)");
		this.pointStroke.addColorStop(0.5, "rgba(255,255,0,0.1)")
		this.pointStroke.addColorStop(0, "rgba(255,0,0,0.1)");

		var maxValue = Math.max.apply(Math, this.dataIdag);
		var maxValueImorgon = Math.max.apply(Math, this.dataImorgon);


		if (maxValue < maxValueImorgon) {
			maxValue = maxValueImorgon;
		}


		this.initconfig = {
			type: 'line',
			options: {
				responsive: false,
				legend: {
					display: false
				},
				animation: {
					duration: 0
				},
				tooltips: {
					callbacks: {
						label: function (tooltipItem) {
							return tooltipItem.yLabel;
						}
					},
					displayColors: false,
					mode: 'nearest'
				},
				maintainAspectRatio: false,
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero: true,
							min: 0.1,
							max: maxValue,
							stepSize: 0.1,
						}
					}]
				}
			},
			data: {
				labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
				datasets: [
					{
						label: 'Imorgon',
						data: this.dataImorgon,
						backgroundColor: this.gradientStroke,
						borderColor: "rgba(200,100,200,0.4)",
						pointRadius: 0.1,
						pointHoverRadius: 0,
						fill: false
					},
					{
						label: 'Idag',
						data: this.dataIdag,
						backgroundColor: this.gradientStroke,
						pointBackgroundColor: this.pointStroke,
						borderColor: this.gradientStroke,
						fill: true,
						pointRadius: 10,
						pointHoverRadius: 15,
					}],
			}
		}



		if (this.initconfig &&
			this.initconfig.data &&
			this.initconfig.data.datasets) {
			// Loop through all the datasets
			for (var j = 1; j < this.dataIdag.length; j++) {
				var thecolor;
				if (this.dataIdag[j - 1] > 0.7)
					thecolor = "rgb(255,0,0)"
				else {
					thecolor = "rgb(0,255,0)"
				}
			}
		}
		var chart = new Chart(ctx, this.initconfig);
	}
	// The height of your card. Home Assistant uses this to automatically
	// distribute all cards over the available columns.
	getCardSize() {
		return 1;
	}
}

customElements.define('tibber-card', TibberCard);
console.info(
	`%cTIBBER-CARD\n%cVersion: 0.0.2	`,
	"color: green; font-weight: bold;",
	""
);