<template>
  <div :id="id" :style="{height: height, width: width}"></div>
</template>

<script>
  import echarts from 'echarts'

  export default {
    props: {
      id: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '1100px'
      },
      height: {
        type: String,
        default: '600px'
      },
      data: {
        type: Object,
        default: {
          pieGroup: [],
          funnelData: [],
          perBalance: []
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
          title: {
            text: '笔单价区间分析',
            left: '5%'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a}<br/>{b}: {c} ({d}%)'
          },
          toolbox: {
            feature: {
              restore: {},
              saveAsImage: {}
            }
          },
          legend: {
            orient: 'vertical',
            left: 'right',
            top: '10%',
            zlevel: 1,
            data: this.data.pieGroup
          },
          grid: [{
            top: 50,
            width: '50%',
            left: 10,
            containLabel: true
          }, {
            top: '55%',
            width: '50%',
            bottom: 0,
            left: 10,
            containLabel: true
          }],
          calculable: true,
          series: [{
            name: '笔单价',
            type: 'funnel',
            // 按数据排序
            sort: 'none',
            gap: 2,
            funnelAlign: 'center',
            label: {
              normal: {
                show: true,
                position: 'inside'
              },
              emphasis: {
                textStyle: {
                  fontSize: 20
                }
              }
            },
            labelLine: {
              normal: {
                length: 10,
                lineStyle: {
                  width: 1,
                  type: 'solid'
                }
              }
            },
            itemStyle: {
              normal: {
                borderColor: '#fff',
                borderWidth: 1,
                color: function(params) {
                  const colorList = [
                    '#26C0C0',
                    '#61a0a8',
                    '#60C0DD',
                    '#9BCA63',
                    '#C6E579',
                    '#27727B',
                    '#91c7ae',
                    '#749f83',
                    '#bda29a',
                    '#6e7074',
                    '#546570',
                    '#C1232B',
                    '#B5C334',
                    '#FCCE10',
                    '#E87C25',
                    '#D7504B',
                    '#F0805A',
                    '#c4ccd3'
                  ];
                  return colorList[params.dataIndex]
                }
              }
            },
            data: this.data.funnelData
          }, {
            name: '笔单价占比',
            type: 'pie',
            roseType: true,
            // 图大小
            radius: [0, '100px'],
            // 圆心位置
            center: ['15%', '75%'],
            itemStyle: {
              normal: {
              color: function(params) {
                const colorList = [
                  '#26C0C0',
                  '#61a0a8',
                  '#60C0DD',
                  '#9BCA63',
                  '#C6E579',
                  '#27727B',
                  '#91c7ae',
                  '#749f83',
                  '#bda29a',
                  '#6e7074',
                  '#546570',
                  '#C1232B',
                  '#B5C334',
                  '#FCCE10',
                  '#E87C25',
                  '#D7504B',
                  '#F0805A',
                  '#c4ccd3'
                ];
                return colorList[params.dataIndex]
              }
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            data: this.data.perBalance
          }]
        })
      }
    },
    watch: {
      data: {
        handler: function(curVal, oldVal) {
          this.chart.setOption({
            title: {
              text: '笔单价区间分析',
              left: '5%'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a}<br/>{b}: {c} ({d}%)'
            },
            toolbox: {
              feature: {
                restore: {},
                saveAsImage: {}
              }
            },
            legend: {
              orient: 'vertical',
              left: 'right',
              top: '10%',
              zlevel: 1,
              data: curVal.pieGroup
            },
            grid: [{
              top: 50,
              width: '50%',
              left: 10,
              containLabel: true
            }, {
              top: '55%',
              width: '50%',
              bottom: 0,
              left: 10,
              containLabel: true
            }],
            calculable: true,
            series: [{
              name: '笔单价',
              type: 'funnel',
              // 按数据排序
              sort: 'none',
              gap: 2,
              funnelAlign: 'center',
              label: {
                normal: {
                  show: true,
                  position: 'inside'
                },
                emphasis: {
                  textStyle: {
                    fontSize: 20
                  }
                }
              },
              labelLine: {
                normal: {
                  length:10,
                  lineStyle: {
                    width: 1,
                    type: 'solid'
                  }
                }
              },
              itemStyle: {
                normal: {
                  borderColor: '#fff',
                  borderWidth: 1,
                  color: function(params) {
                    const colorList = [
                      '#26C0C0',
                      '#61a0a8',
                      '#60C0DD',
                      '#9BCA63',
                      '#C6E579',
                      '#27727B',
                      '#91c7ae',
                      '#749f83',
                      '#bda29a',
                      '#6e7074',
                      '#546570',
                      '#C1232B',
                      '#B5C334',
                      '#FCCE10',
                      '#E87C25',
                      '#D7504B',
                      '#F0805A',
                      '#c4ccd3'
                    ];
                    return colorList[params.dataIndex]
                  }
                }
              },
              data: curVal.funnelData
            }, {
              name: '笔单价占比',
              type: 'pie',
              roseType: true,
              // 图大小
              radius: [0, '100px'],
              // 圆心位置
              center: ['15%', '75%'],
              itemStyle: {
                normal: {
                  color: function(params) {
                    const colorList = [
                      '#26C0C0',
                      '#61a0a8',
                      '#60C0DD',
                      '#9BCA63',
                      '#C6E579',
                      '#27727B',
                      '#91c7ae',
                      '#749f83',
                      '#bda29a',
                      '#6e7074',
                      '#546570',
                      '#C1232B',
                      '#B5C334',
                      '#FCCE10',
                      '#E87C25',
                      '#D7504B',
                      '#F0805A',
                      '#c4ccd3'
                    ];
                    return colorList[params.dataIndex]
                  }
                },
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              data: curVal.perBalance
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
