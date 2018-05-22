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
          return [{
            personCount: [],
            groups: []
          }]
        }
      },
      witch: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        personCountChart: null
      }
    },
    mounted() {
      // this.initChart();
    },
    beforeDestroy() {
      if (!this.personCountChart) {
        return
      }
      this.personCountChart.dispose();
      this.personCountChart = null;
    },
    methods: {
      initChart() {
        console.log(this.data)
        this.personCountChart = echarts.init(document.getElementById(this.id));
        this.personCountChart.setOption({
          // 标题
          title: {
            text: '购买人数分析',
            left: 'center',
            top: 'top'
          },
          // 提示框
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
              textStyle: {
                color: '#fff'
              }
            }
          },
          toolbox: {
            show: true,
            left: '80%',
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              dataView: {readOnly: true},
              magicType: {type: ['line', 'bar']},
              restore: {},
              saveAsImage: {}
            }
          },
          // 坐标轴
          grid: {
            borderWidth: 0,
            top: 110,
            bottom: 95,
            textStyle: {
              color: '#fff'
            }
          },
          // 图例
          legend: {
            left: '5%',
            top: 'top',
            textStyle: {
              color: '#90979c'
            },
            data: ['购买人数']
          },
          calculable: true,
          // X轴
          xAxis: [{
            type: 'category',
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitArea: {
              show: false
            },
            axisLabel: {
              interval: 0,
              rotate: 25
            },
            data: this.data.groups,
          }],
          // Y轴
          yAxis: [{
            type: 'value',
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0

            },
            splitArea: {
              show: false
            },
            data: []
          }],
          // 缩放
          dataZoom: [{
            show: true,
            height: 30,
            xAxisIndex: [
              0
            ],
            bottom: 10,
            start: 10,
            end: 80,
            handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
            handleSize: '110%',
            handleStyle: {
              color: '#d3dee5',
            },
            textStyle: {
              color: '#000'
            },
            borderColor: '#90979c'
          }, {
            type: 'inside',
            show: true,
            height: 15,
            start: 1,
            end: 35
          }],
          series: [{
            name: '购买人数',
            type: 'bar',
            itemStyle: {
              normal: {
                color: 'rgba(255,144,128,1)',
                label: {
                  show: true,
                  position: 'top',
                  formatter: function(p) {
                    return p.value > 0 ? p.value : '';
                  }
                }
              }
            },
            data: this.data.personCount
          }]
        })
      }
    },
    watch: {
      data: {
        handler: function(curVal, oldVal) {
          this.personCountChart.setOption({
            // 标题
            title: {
              text: '购买人数分析',
              left: 'center',
              top: 'top'
            },
            // 提示框
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow',
                textStyle: {
                  color: '#fff'
                }
              }
            },
            toolbox: {
              show: true,
              feature: {
                dataZoom: {
                  yAxisIndex: 'none'
                },
                dataView: {readOnly: true},
                magicType: {type: ['line', 'bar']},
                restore: {},
                saveAsImage: {}
              }
            },
            // 坐标轴
            grid: {
              borderWidth: 0,
              top: 110,
              bottom: 95,
              textStyle: {
                color: '#fff'
              }
            },
            // 图例
            legend: {
              left: '5%',
              top: 'top',
              textStyle: {
                color: '#90979c'
              },
              data: ['购买人数']
            },
            calculable: true,
            // X轴
            xAxis: [{
              type: 'category',
              axisLine: {
                lineStyle: {
                  color: '#90979c'
                }
              },
              splitLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              splitArea: {
                show: false
              },
              axisLabel: {
                interval: 0,
                rotate: 25
              },
              data: curVal.groups,
            }],
            // Y轴
            yAxis: [{
              type: 'value',
              splitLine: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: '#90979c'
                }
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                interval: 0
              },
              splitArea: {
                show: false
              },
              data: []
            }],
            // 缩放
            dataZoom: [{
              show: true,
              height: 30,
              xAxisIndex: [
                0
              ],
              bottom: 10,
              start: 10,
              end: 80,
              handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
              handleSize: '110%',
              handleStyle: {
                color: '#d3dee5'
              },
              textStyle: {
                color: '#000'
              },
              borderColor: '#90979c'
            }, {
              type: 'inside',
              show: true,
              height: 15,
              start: 1,
              end: 35
            }],
            series: [{
              name: '购买人数',
              type: 'bar',
              itemStyle: {
                normal: {
                  color: 'rgba(255,144,128,1)',
                  label: {
                    show: true,
                    position: 'top',
                    formatter: function(p) {
                      return p.value > 0 ? p.value : '';
                    }
                  }
                }
              },
              data: curVal.personCount
            }]
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
