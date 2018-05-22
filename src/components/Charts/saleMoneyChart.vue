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
        default: {
          balanceSales: [],
          wechatSales: [],
          alipaySales: [],
          douyaSales: [],
          groups: [],
          totalSales: []
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
            text: '销售金额数量分析',
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
            left: '2%',
            top: 'top',
            textStyle: {
              color: '#90979c'
            },
            data: ['微信支付', '余额支付', '支付宝支付', '豆芽支付', '合计']
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
            name: '微信支付',
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
            data: this.data.wechatSales
          }, {
            name: '余额支付',
            type: 'bar',
            symbolSize: 20,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: 'rgba(0,191,183,1)',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'top',
                  formatter: function(p) {
                    return p.value > 0 ? p.value : '';
                  }
                }
              }
            },
            data: this.data.balanceSales
          }, {
            name: '支付宝支付',
            type: 'bar',
            symbolSize: 20,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: 'rgba(90,120,145,1)',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'top',
                  formatter: function(p) {
                    return p.value > 0 ? p.value : '';
                  }
                }
              }
            },
            data: this.data.alipaySales
          }, {
            name: '豆芽支付',
            type: 'bar',
            symbolSize: 20,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: 'rgba(197,137,107,1)',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'top',
                  formatter: function(p) {
                    return p.value > 0 ? p.value : '';
                  }
                }
              }
            },
            data: this.data.douyaSales
          }, {
            name: '合计',
            type: 'bar',
            symbolSize: 20,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: 'rgba(252,230,48,1)',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'top',
                  formatter: function(p) {
                    return p.value > 0 ? p.value : '';
                  }
                }
              }
            },
            data: this.data.totalSales
          }]
        })
      }
    },
    watch: {
      data: {
        handler: function(curVal, oldVal) {
          this.chart.setOption({
            // 标题
            title: {
              text: '销售分析',
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
              left: '2%',
              top: 'top',
              textStyle: {
                color: '#90979c'
              },
              data: ['微信支付', '余额支付', '支付宝支付', '豆芽支付', '合计']
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
              bottom: 30,
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
              name: '微信支付',
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
              data: curVal.wechatSales
            }, {
              name: '余额支付',
              type: 'bar',
              symbolSize: 20,
              symbol: 'circle',
              itemStyle: {
                normal: {
                  color: 'rgba(0,191,183,1)',
                  barBorderRadius: 0,
                  label: {
                    show: true,
                    position: 'top',
                    formatter: function(p) {
                      return p.value > 0 ? p.value : '';
                    }
                  }
                }
              },
              data: curVal.balanceSales
            }, {
              name: '支付宝支付',
              type: 'bar',
              symbolSize: 20,
              symbol: 'circle',
              itemStyle: {
                normal: {
                  color: 'rgba(90,120,145,1)',
                  barBorderRadius: 0,
                  label: {
                    show: true,
                    position: 'top',
                    formatter: function(p) {
                      return p.value > 0 ? p.value : '';
                    }
                  }
                }
              },
              data: curVal.alipaySales
            }, {
              name: '豆芽支付',
              type: 'bar',
              symbolSize: 20,
              symbol: 'circle',
              itemStyle: {
                normal: {
                  color: 'rgba(197,137,107,1)',
                  barBorderRadius: 0,
                  label: {
                    show: true,
                    position: 'top',
                    formatter: function(p) {
                      return p.value > 0 ? p.value : '';
                    }
                  }
                }
              },
              data: curVal.douyaSales
            }, {
              name: '合计',
              type: 'bar',
              symbolSize: 20,
              symbol: 'circle',
              itemStyle: {
                normal: {
                  color: 'rgba(252,230,48,1)',
                  barBorderRadius: 0,
                  label: {
                    show: true,
                    position: 'top',
                    formatter: function(p) {
                      return p.value > 0 ? p.value : '';
                    }
                  }
                }
              },
              data: curVal.totalSales
            }]
          })
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
