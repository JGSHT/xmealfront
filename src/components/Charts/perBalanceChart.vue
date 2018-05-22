<template>
  <div :id="id" :style="{height: height, width: width}"></div>
</template>

<script>

  import echarts from 'echarts';

  export default {
    props: {
      id: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '1500px'
      },
      height: {
        type: String,
        default: '900px'
      },
      data: {
        type: Object,
        default() {
          return {
            specialChartData: [],
            groups: []
          }
        }
      },
      witch: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        timeSaleChart: null,
        currIndex: 0
      }
    },
    mounted() {
      // this.initChart();
    },
    beforeDestroy() {
      if (!this.timeSaleChart) {
        return
      }
      this.timeSaleChart.dispose();
      this.timeSaleChart = null;
    },
    methods: {
      initChart() {
        this.timeSaleChart = echarts.init(document.getElementById(this.id));
        this.timeSaleChart.setOption({
          baseOption: {
            timeline: {
              axisType: 'category',
              show: true,
              autoPlay: true,
              playInterval: 2000,
              currentIndex: this.currIndex,
              checkpointStyle: {
                color: '#04a5f1',
                borderColor: 'rgba(4, 165, 261, .5)'
              },
              itemStyle: {
                normal: {
                  color: '#04a5f1'
                },
                emphasis: {
                  color: '#04a5f1'
                }
              },
              lineStyle: {
                color: '#ddd'
              },
              data: this.data.groups
            },
            title: {
              subtext: '单位:元',
              left: 'center'
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              left: '90%',
              data: ['笔单价']
            },
            toolbox: {
              show: true,
              orient: 'vertical',
              top: 'center',
              feature: {
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
                saveAsImage: { show: true }
              }
            },
            grid: {
              top: 80,
              bottom: 100,
              containLabel: true
            },
            xAxis: [{
              type: 'category',
              name: '时间',
              data: ['0点', '1点', '2点', '3点', '4点', '5点', '6点', '7点', '8点', '9点', '10点',
                '11点', '12点', '13点', '14点', '15点', '16点', '17点', '18点', '19点', '20点',
                '21点', '22点', '23点']
            }],
            yAxis: { type: 'value', name: '笔单价(元)' },
            series: [
              {
                name: '笔单价',
                type: 'bar',
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(
                      0, 1, 0, 0, [{
                        offset: 0,
                        color: '#2af598'
                      }, {
                        offset: 1,
                        color: '#009efd'
                      }]
                    ),
                    barBorderRadius: 4
                  },
                  emphasis: {
                    color: new echarts.graphic.LinearGradient(
                      0, 1, 0, 0, [{
                        offset: 0,
                        color: '#2af598'
                      }, {
                        offset: 1,
                        color: '#009efd'
                      }]
                    ),
                    barBorderRadius: 4
                  }
                },
                label: {
                  normal: {
                    show: true,
                    position: 'top',
                    formatter: '{c}'
                  }
                }
              }
            ]
          },
          // 变量则写在options中
          options: this.data.specialChartData
        });
      }
    },
    watch: {
      data: {
        handler: function(curVal, oldVal) {
          this.timeSaleChart.setOption({
            baseOption: {
              timeline: {
                axisType: 'category',
                show: true,
                autoPlay: true,
                currentIndex: this.currIndex,
                playInterval: 2000,
                checkpointStyle: {
                  color: '#04a5f1',
                  borderColor: 'rgba(4, 165, 261, .5)'
                },
                itemStyle: {
                  normal: {
                    color: '#04a5f1'
                  },
                  emphasis: {
                    color: '#04a5f1'
                  }
                },
                lineStyle: {
                  color: '#ddd'
                },
                data: curVal.groups
              },
              title: {
                subtext: '单位:元',
                left: 'center'
              },
              tooltip: {
                trigger: 'axis'
              },
              legend: {
                left: '90%',
                data: ['笔单价']
              },
              toolbox: {
                show: true,
                orient: 'vertical',
                top: 'center',
                feature: {
                  magicType: { show: true, type: ['line', 'bar'] },
                  restore: { show: true },
                  saveAsImage: { show: true }
                }
              },
              grid: {
                top: 80,
                bottom: 100,
                containLabel: true
              },
              xAxis: [{
                type: 'category',
                name: '时间',
                data: ['0点', '1点', '2点', '3点', '4点', '5点', '6点', '7点', '8点', '9点', '10点',
                  '11点', '12点', '13点', '14点', '15点', '16点', '17点', '18点', '19点', '20点',
                  '21点', '22点', '23点']
              }],
              yAxis: { type: 'value', name: '笔单价(元)' },
              series: [
                {
                  name: '笔单价',
                  type: 'bar',
                  itemStyle: {
                    normal: {
                      color: new echarts.graphic.LinearGradient(
                        0, 1, 0, 0, [{
                          offset: 0,
                          color: '#2af598'
                        }, {
                          offset: 1,
                          color: '#009efd'
                        }]
                      ),
                      barBorderRadius: 4
                    },
                    emphasis: {
                      color: new echarts.graphic.LinearGradient(
                        0, 1, 0, 0, [{
                          offset: 0,
                          color: '#2af598'
                        }, {
                          offset: 1,
                          color: '#009efd'
                        }]
                      ),
                      barBorderRadius: 4
                    }
                  },
                  label: {
                    normal: {
                      show: true,
                      position: 'top',
                      formatter: '{c}'
                    }
                  }
                }
              ]
            },
            // 变量则写在options中
            options: curVal.specialChartData
          })
        }
      },
      witch: {
        handler: function(curVal, oldVal) {
          if (curVal === 3) {
            this.initChart();
          }
        }
      }
    }
  }
</script>
