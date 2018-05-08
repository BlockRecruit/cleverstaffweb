angular.module('services.vacancyReport', [
    'ngResource',
    'ngCookies'
]).factory('vacancyReport', [function () {
    let report = {};

    function setBreadcrumbs({breadcrumbsType, vacancyLocalId, vacancyPosition}) {
        report.breadcrumbs.breadcrumbs = {
            vacancy : [
                {
                    href: '#/vacancies',
                    text: 'all_vacancies'
                },
                {
                    href: `#/vacancies/${vacancyLocalId}`,
                    text: vacancyPosition
                },
                {
                    text:"Vacancy report"
                }],
            reports : [
                {
                    href: '#/reports',
                    text: 'Reports'
                },
                {
                    href: '#/reports/vacancy',
                    text: "Report"
                },
                {
                    text:"Vacancy report"
                }]
        };
    }

    report.breadcrumbs = function({breadcrumbsType, vacancyLocalId, vacancyPosition}) {
        if(!breadcrumbsType) return report.breadcrumbs.breadcrumbs[report.breadcrumbs.type];
        else setBreadcrumbs({breadcrumbsType, vacancyLocalId, vacancyPosition});

        report.breadcrumbs.type = breadcrumbsType;

        return report.breadcrumbs.breadcrumbs[report.breadcrumbs.type];
    };

    report.breadcrumbs.type = 'vacancy';
    report.breadcrumbs.breadcrumbs = {};

    report.funnel = function(id, arr) {
        const canvas = document.getElementById(id),
              ctx = canvas.getContext('2d');
              ctx.translate(0.5, 0.5);

        canvas.width = 400;

        let width = canvas.width;
        let height = 30;

        canvas.height = arr.length * height;

        new chartBars(canvas, arr, width, height).init();
    };


    class chartBars {
        constructor(c, data, width, height) {
            this.c = c;
            this.ctx = c.getContext('2d');
            this.data = data;
            this.width = width;
            this.height = height;
            this.bars = [];
            this.initialBarWidth = 0;
            this.barsWidth = [];
        }

        drawBars() {
            for(let i = 0; i < this.data.length; i++) {
                const closestBar = this._getClosestBar(i);

                let barProps = {
                    c: this.c,
                    ctx: this.ctx,
                    value: this.data[i],
                    x: this.bars[i - 1] && this.bars[i - 1].width ?
                                        this.bars[i - 1].x - this.barsWidth[i]/2 + this.barsWidth[i - 1]/2 : closestBar ?
                                        closestBar.x - this.barsWidth[closestBar.index]/2 + this.barsWidth[closestBar.index]/2 : this.c.width/2 - this.width/2, // сделать нормальный if
                    y: i * this.height,
                    width: this.barsWidth[i],
                    height: this.height - 1,
                    nextBarWidth: this.barsWidth[i + 1],
                    index: i
                };

                if(i !== this.data.length - 1 && !barProps.nextBarWidth && i !== this._getLastBarIndex()) { // if this is not the last char bar, we have to display it as a rectangle, not as a triangle
                    barProps.nextBarWidth = barProps.width;
                }

                if(barProps.width && barProps.height) {
                    const bar = new chartBar({...barProps});
                    bar.draw();
                    this.bars.push(bar);
                } else {
                    this.bars.push({});
                }
            }
        }

        _getLastBarIndex() {
            for(let i = this.data.length - 1; i >= 0; i--) {
                if(this.data[i] !== 0) {
                    return i;
                }
            }
        }

        _getBarsWidth() {
            this.barsWidth = this.data.map((element,i) => {
                return this.data[i]/this._getInitialBarWidth() * this.width;
            });
        }

        _getInitialBarWidth() {
            if(this.initialBarWidth) return this.initialBarWidth;

            this.data.map((element, i) => {
               if(element && !this.initialBarWidth) {
                   this.initialBarWidth = element
               }
            });

            return this.initialBarWidth;
        }

        _getClosestBar(start) {
            for(let i = start; i >= 0; i--) {
                if(this.bars[i] && this.bars[i].width) {
                    return this.bars[i];
                }
            }
        }

        _initBarsHover() {
            let wrapper = document.getElementById("wrapper"),
                buffer = document.getElementById("buffer"),
                bufferCtx = buffer.getContext('2d'),
                self = this;

                bufferCtx.translate(0.5, 0.5);


            buffer.width = 400;
            buffer.height = (this.data.length + 2) * 30;

            wrapper.onmousemove = function (e) {

                let rect = self.c.getBoundingClientRect(),
                    x = e.clientX - rect.left,
                    y = e.clientY - rect.top,
                    i = 0, r;

                let tooltip = {
                    width: 26,
                    height: 26,
                    x: function() { return x - this.width/2 },
                    y: function() { return y - self.bars[self._getLastBarIndex()].height - this.height/2 + (2 * self.bars[self._getLastBarIndex()].height) }
                };

                while (r = self.bars[i++]) {
                    self.ctx.beginPath();
                    self.ctx.rect(r.x, r.y, r.width, r.height);
                    bufferCtx.clearRect(0,0, buffer.width, buffer.height);

                    if(self.ctx.isPointInPath(x, y)) {
                        bufferCtx.beginPath();
                        bufferCtx.rect(tooltip.x(), tooltip.y(), tooltip.width, tooltip.height);

                        bufferCtx.strokeStyle = "#fff";
                        bufferCtx.fillStyle = self.bars[i - 1].color;
                        bufferCtx.lineWidth = "2";

                        bufferCtx.font="16px font";
                        bufferCtx.textAlign="center";
                        bufferCtx.textBaseline = "middle";

                        bufferCtx.stroke();
                        bufferCtx.fill();
                        bufferCtx.fillStyle = "#fff";
                        bufferCtx.fillText(self.bars[i - 1].value, tooltip.x() + tooltip.width/2, tooltip.y() + tooltip.height/2);

                        break;
                    } else {
                        bufferCtx.clearRect(0,0, buffer.width, buffer.height);
                    }
                }
            };
        }

        init() {
            this._getBarsWidth();
            this.drawBars();
            this._initBarsHover();
        }
    }

    class chartBar {
        constructor({c, ctx, value, x, y, width, height, nextBarWidth, index}) {
            this.c = c;
            this.ctx = ctx;
            this.value = value;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.nextBarWidth = nextBarWidth || 0;
            this.index = index;
            this.color = this._getRndColor();
        }

        draw() {
            let x = [];

            x[0] = this.x;
            x[1] = x[0] + this.width;
            x[2] = x[1] - (this.width - this.nextBarWidth)/2;
            x[3] = x[2] - this.nextBarWidth;
            this.ctx.beginPath();

            this.ctx.fillStyle = this.color;
            this.ctx.strokeStyle = this.color;

            x = x.map(coord => {
                return parseInt(coord) + 0.5; // It was made in order to canvas API , to get a high quality image. Works with ctx.translate(0.5, 0.5);
            });

            this.y = parseInt(this.y) + 0.5;
            this.ctx.moveTo(x[0],this.y);
            this.ctx.lineTo(x[1],this.y);
            this.ctx.lineTo(x[2],this.y + this.height);
            this.ctx.lineTo(x[3],this.y + this.height);
            this.ctx.closePath();

            this.ctx.stroke();
            this.ctx.fill();
        }

        _getRndColor() {
            const colors = ['#29a2cc','#d31e1e','#7ca82b','#ef8535','#a14bc9','#a05f18',
                '#265e96','#6b7075','#96c245','#b5a603','#492658','#515e82',
                '#791f47','#525f82','#7a2149','#bba33b','#e66508','#980826'];

            return colors[this.index % colors.length];
        }
    }

        return report;
    }]);
