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
        type: Object,
        default: {
          firstPieData: [],
          secondPieData: []
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
      this.initChart();
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
            text: '销售金额占比分析',
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
            data: ['余额实际收入', '余额退款', '微信实际收入', '微信退款', '支付宝实际收入', '支付宝退款']
          },
          series: [
            {
              name: '金额占比',
              type: 'pie',
              selectedMode: 'single',
              radius: [0, '35%'],

              label: {
                normal: {
                  position: 'inner'
                }
              },
              labelLine: {
                normal: {
                  show: true
                }
              },
              data: this.data.firstPieData
            },
            {
              name: '金额占比',
              type: 'pie',
              radius: ['45%', '60%'],

              data: this.data.secondPieData
            }
          ]
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
                text: '销售金额占比分析',
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
                data: ['余额实际收入', '余额退款', '微信实际收入', '微信退款', '支付宝实际收入', '支付宝退款']
              },
              series: [
                {
                  name: '金额占比',
                  type: 'pie',
                  selectedMode: 'single',
                  radius: [0, '30%'],

                  label: {
                    normal: {
                      position: 'inner'
                    }
                  },
                  labelLine: {
                    normal: {
                      show: true
                    }
                  },
                  data: curVal.firstPieData
                },
                {
                  name: '金额占比',
                  type: 'pie',
                  radius: ['40%', '55%'],
                  data: curVal.secondPieData
                }
              ]
            })
          }
        }
      },
      witch: {
        handler: function(curVal, oldVal) {
          if (curVal === 1) {
            this.initChart();
          }
        }
      }
    }
  }
</script>

