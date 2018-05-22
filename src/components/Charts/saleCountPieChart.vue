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
        default: '1000px'
      },
      height: {
        type: String,
        default: '600px'
      },
      data: {
        type: Array,
        default() {
          return [{
            value: 0,
            name: '已付款订单'
          }, {
            value: 0,
            name: '未付款订单'
          }];
        }
      },
      witch: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        chart: null
      }
    },
    mounted() {
      // this.initChart();
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose();
      this.chart = null;
    },
    methods: {
      initChart() {
        this.chart = echarts.init(document.getElementById(this.id));
        this.chart.setOption({
          // 标题
          title: {
            text: '订单占比分析',
            left: 'center',
            top: 'top'
          },
          // 提示框
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          toolbox: {
            show: true,
            feature: {
              dataView: { readOnly: true },
              restore: {},
              saveAsImage: {}
            }
          },
          legend: {
            orient: 'vertical',
            x: 'left',
            data: ['已付款订单', '未付款订单']
          },
          series: [{
            name: '订单占比',
            type: 'pie',
            center: ['50%', '50%'],
            clockwise: false,
            radius: '68%',
            label: {
              normal: {
                position: 'inner'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                borderWidth: 4,
                borderColor: '#ffffff'
              },
              emphasis: {
                borderWidth: 0,
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            data: this.data
          }]
        })
      }
    },
    watch: {
      data: {
        handler: function(curVal, oldVal) {
          if (this.chart) {
            this.chart.setOption({
              // 标题
              title: {
                text: '订单占比分析',
                left: 'center',
                top: 'top'
              },
              // 提示框
              tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
              },
              toolbox: {
                show: true,
                feature: {
                  dataView: { readOnly: true },
                  restore: {},
                  saveAsImage: {}
                }
              },
              legend: {
                orient: 'vertical',
                x: 'left',
                data: ['已付款订单', '未付款订单']
              },
              series: [{
                name: '订单占比',
                type: 'pie',
                center: ['50%', '50%'],
                clockwise: false,
                radius: '68%',
                label: {
                  normal: {
                    position: 'inner'
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                itemStyle: {
                  normal: {
                    borderWidth: 4,
                    borderColor: '#fff'
                  },
                  emphasis: {
                    borderWidth: 0,
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                },
                data: curVal
              }]
            })
          }
        }
      },
      witch: {
        handler: function(curVal, oldVal) {
          if (curVal === 2) {
            this.initChart();
          }
        }
      }
    }
  }
</script>
