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
            groups: [],
            recharge: []
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
        rechargeCountChart: null
      }
    },
    mounted() {
      //this.initChart();
    },
    beforeDestroy() {
      if (!this.rechargeCountChart) {
        return
      }
      this.rechargeCountChart.dispose();
      this.rechargeCountChart = null;
    },
    methods: {
      initChart() {
        this.rechargeCountChart = echarts.init(document.getElementById(this.id));
        this.rechargeCountChart.setOption({
          // 标题
          title: {
            text: '充值分析',
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
              dataView: { readOnly: true },
              magicType: { type: ['line', 'bar'] },
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
            data: ['充值金额']
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
            data: this.data.groups
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
            name: '充值金额',
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
            data: this.data.recharge
          }]
        })
      }
    },
    watch: {
      data: {
        handler: function(curVal, oldVal) {
          this.rechargeCountChart.setOption({
            // 标题
            title: {
              text: '充值分析',
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
                dataView: { readOnly: true },
                magicType: { type: ['line', 'bar'] },
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
              data: ['充值金额']
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
              data: curVal.groups
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
              name: '充值金额',
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
              data: curVal.recharge
            }]
          })
        }
      },
      witch: {
        handler: function(curVal, oldVal) {
          if (curVal === 4) {
            this.initChart();
          }
        }
      }
    }
  }
</script>
