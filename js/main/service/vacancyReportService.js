angular.module('services.vacancyReport', [
    'ngResource',
    'ngCookies'
]).factory('vacancyReport', ['$resource', 'serverAddress', '$filter', '$localStorage', 'notificationService','$rootScope',
    function ($resource, serverAddress, $filter, $localStorage, notificationService, $rootScope) {

        let report = {};


        report.funnel = function(id, arr) {
            const array = arr;
            const canvas = document.getElementById(id),
                ctx = canvas.getContext('2d');

            let width = canvas.width;
            let height = 25;
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
                            height: this.height - 3
                        };

                        const block = new chartBlock(blockData.x , blockData.y, blockData.width, blockData.height,this.blocksWidth[i + 1]);
                        block.draw();
                        this.addBlock(block);
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
                constructor(x, y, width, height, nextBlockWidth) {
                    this.x = x;
                    this.y = y;
                    this.width = width;
                    this.height = height;
                    this.nextBlockWidth = nextBlockWidth || 0;
                }

                draw() {
                    const x = [];
                    x[0] = this.x;
                    x[1] = x[0] + this.width;
                    x[2] = x[1] - (this.width - this.nextBlockWidth)/2;
                    x[3] = x[2] - this.nextBlockWidth;
                    ctx.beginPath();

                    ctx.fillStyle = getRndColor();
                    ctx.moveTo(x[0],this.y);
                    ctx.lineTo(x[1],this.y);
                    ctx.lineTo(x[2],this.y + this.height);
                    ctx.lineTo(x[3],this.y + this.height);
                    ctx.closePath();

                    ctx.stroke();
                    ctx.fill();
                }
            }


            function getRndColor() {
                let r = 255*Math.random()|0,
                    g = 255*Math.random()|0,
                    b = 255*Math.random()|0;
                console.log(r,g,b);
                return 'rgb(' + r + ',' + g + ',' + b + ')';
            }

            const blocks = new chartBlocks(array,width,height);
        };


        return report;
    }]);
