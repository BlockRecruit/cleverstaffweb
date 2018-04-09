angular.module('services.vacancyReport', [
    'ngResource',
    'ngCookies'
]).factory('vacancyReport', [function () {
        let report = {};


        report.funnel = function(id, arr) {
            const array = arr;
            const canvas = document.getElementById(id),
                ctx = canvas.getContext('2d');
                ctx.translate(0.5, 0.5);

            canvas.width = 400;

            let width = canvas.width;
            let height = 30;

            canvas.height = array.length * height;

            class chartBlocks {
                constructor(data, width, height) {
                    this.data = data;
                    this.width = width;
                    this.height = height;
                    this.blocks = [];
                    this.blocksWidth = [];
                    this.dataAmmount = null;
                    this.getBlocksWidth();
                    this.getBlocksSumm();
                    this.drawBLocks();
                }

                drawBLocks() {
                    let blockData = {};
                    for(let i = 0; i < this.data.length; i++) {
                        blockData = {
                            x: this.blocks[i - 1] ? this.blocks[i - 1].x - this.blocksWidth[i]/2 + this.blocksWidth[i - 1]/2 : canvas.width/2 - this.width/2,
                            y: i * this.height,
                            width: this.blocksWidth[i],
                            height: this.height - 1
                        };

                        if(blockData.width && blockData.height) {
                            const block = new chartBlock(blockData.x , blockData.y, blockData.width, blockData.height,this.blocksWidth[i + 1], i);
                            block.draw();
                            this.addBlock(block);
                        }
                    }
                }

                addBlock(block) {
                    this.blocks.push(block);
                }

                getBlocksSumm() {
                    this.dataAmmount = this.data.reduce((prev, element) => {
                        return prev += element;
                    });
                    return this.dataAmmount;
                }

                getBlocksWidth() {
                    this.blocksWidth = this.data.map((element,i) => {
                        return this.data[i]/this.data[0] * this.width;
                    });
                    return this.blocksWidth;
                }
            }

            class chartBlock {
                constructor(x, y, width, height, nextBlockWidth, index) {
                    this.x = x;
                    this.y = y;
                    this.width = width;
                    this.height = height;
                    this.nextBlockWidth = nextBlockWidth || 0;
                    this.index = index;
                }

                draw() {
                    let x = [];

                    x[0] = this.x;
                    x[1] = x[0] + this.width;
                    x[2] = x[1] - (this.width - this.nextBlockWidth)/2;
                    x[3] = x[2] - this.nextBlockWidth;
                    ctx.beginPath();

                    ctx.fillStyle = this.getRndColor();
                    ctx.strokeStyle = this.getRndColor();

                    x = x.map(coord => {
                        return parseInt(coord) + 0.5;
                    });

                    this.y = parseInt(this.y) + 0.5;
                    ctx.moveTo(x[0],this.y);
                    ctx.lineTo(x[1],this.y);
                    ctx.lineTo(x[2],this.y + this.height);
                    ctx.lineTo(x[3],this.y + this.height);
                    ctx.closePath();

                    ctx.stroke();
                    ctx.fill();
                }

                getRndColor() {
                    const colors = ['#29a2cc','#d31e1e','#7ca82b','#ef8535','#a14bc9','#a05f18',
                                    '#265e96','#6b7075','#96c245','#b5a603','#492658','#515e82',
                                    '#791f47','#525f82','#7a2149','#bba33b','#e66508','#980826'];

                    return colors[this.index % colors.length];
                }
            }

            const blocks = new chartBlocks(array,width,height);
        };


        return report;
    }]);
