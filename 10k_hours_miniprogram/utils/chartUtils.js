// chartUtils.js

/**
 * 初始化饼图
 * @param {string} canvasId - 画布ID
 * @param {Object} data - 图表数据
 * @param {boolean} darkMode - 是否为深色模式
 */
export const initPieChart = function(canvasId, data, darkMode) {
  const ctx = wx.createCanvasContext(canvasId);
  const { labels, datasets } = data;
  const chartData = datasets[0].data;
  const colors = datasets[0].backgroundColor;
  
  // 计算饼图中心和半径
  const centerX = 150;
  const centerY = 150;
  const radius = 100;
  
  // 清空画布
  ctx.clearRect(0, 0, 300, 300);
  
  // 计算总数值
  const total = chartData.reduce((sum, value) => sum + value, 0);
  
  // 绘制饼图
  let startAngle = -Math.PI / 2;
  chartData.forEach((value, index) => {
    const sliceAngle = (value / total) * 2 * Math.PI;
    
    // 绘制扇形
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
    ctx.lineTo(centerX, centerY);
    ctx.setFillStyle(colors[index % colors.length]);
    ctx.fill();
    
    // 绘制边框
    ctx.setStrokeStyle(darkMode ? '#333' : '#fff');
    ctx.setLineWidth(2);
    ctx.stroke();
    
    // 更新起始角度
    startAngle += sliceAngle;
  });
  
  // 绘制中心空白区域
  ctx.beginPath();
  ctx.arc(centerX, centerY, 40, 0, 2 * Math.PI);
  ctx.setFillStyle(darkMode ? '#2a2a2a' : '#fff');
  ctx.fill();
  
  // 绘制中心文字
  ctx.setFontSize(14);
  ctx.setFillStyle(darkMode ? '#e0e0e0' : '#333');
  ctx.setTextAlign('center');
  ctx.setTextBaseline('middle');
  ctx.fillText('总练习', centerX, centerY - 10);
  ctx.fillText(total.toFixed(1) + '小时', centerX, centerY + 10);
  
  // 绘制图例
  drawLegend(ctx, labels, colors, darkMode);
  
  // 绘制完成
  ctx.draw();
};

/**
 * 初始化柱状图
 * @param {string} canvasId - 画布ID
 * @param {Object} data - 图表数据
 * @param {boolean} darkMode - 是否为深色模式
 */
export const initBarChart = function(canvasId, data, darkMode) {
  const ctx = wx.createCanvasContext(canvasId);
  const { labels, datasets } = data;
  const chartData = datasets[0].data;
  const barColor = datasets[0].backgroundColor;
  
  // 设置图表尺寸
  const width = 300;
  const height = 300;
  const padding = 40;
  const barWidth = (width - padding * 2) / labels.length * 0.6;
  
  // 清空画布
  ctx.clearRect(0, 0, width, height);
  
  // 计算最大值
  const maxValue = Math.max(...chartData, 100);
  
  // 绘制坐标轴
  ctx.beginPath();
  ctx.setStrokeStyle(darkMode ? '#555' : '#ddd');
  ctx.setLineWidth(1);
  
  // X轴
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  
  // Y轴
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.stroke();
  
  // 绘制网格线
  ctx.beginPath();
  ctx.setStrokeStyle(darkMode ? '#333' : '#eee');
  ctx.setLineWidth(0.5);
  
  // 水平线
  for (let i = 0; i <= 5; i++) {
    const y = height - padding - (i * (height - 2 * padding) / 5);
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    
    // Y轴刻度
    ctx.setFontSize(10);
    ctx.setFillStyle(darkMode ? '#aaa' : '#666');
    ctx.setTextAlign('right');
    ctx.setTextBaseline('middle');
    ctx.fillText((i * maxValue / 5).toFixed(0) + '%', padding - 10, y);
  }
  ctx.stroke();
  
  // 绘制柱状图
  chartData.forEach((value, index) => {
    const x = padding + index * (width - padding * 2) / labels.length + (width - padding * 2) / labels.length * 0.2;
    const barHeight = (value / maxValue) * (height - 2 * padding);
    const y = height - padding - barHeight;
    
    // 绘制柱子
    ctx.beginPath();
    ctx.setFillStyle(barColor);
    ctx.fillRect(x, y, barWidth, barHeight);
    
    // 绘制数值
    ctx.setFontSize(10);
    ctx.setFillStyle(darkMode ? '#e0e0e0' : '#333');
    ctx.setTextAlign('center');
    ctx.setTextBaseline('bottom');
    ctx.fillText(value.toFixed(1) + '%', x + barWidth / 2, y - 5);
  });
  
  // 绘制X轴标签
  labels.forEach((label, index) => {
    const x = padding + index * (width - padding * 2) / labels.length + (width - padding * 2) / labels.length * 0.5;
    
    ctx.setFontSize(10);
    ctx.setFillStyle(darkMode ? '#aaa' : '#666');
    ctx.setTextAlign('center');
    ctx.setTextBaseline('top');
    
    // 处理长文本，截断显示
    const maxLabelLength = 8;
    const displayLabel = label.length > maxLabelLength ? label.substring(0, maxLabelLength) + '...' : label;
    ctx.fillText(displayLabel, x, height - padding + 10);
  });
  
  // 绘制完成
  ctx.draw();
};

/**
 * 绘制饼图图例
 * @param {CanvasContext} ctx - 画布上下文
 * @param {Array} labels - 标签数组
 * @param {Array} colors - 颜色数组
 * @param {boolean} darkMode - 是否为深色模式
 */
function drawLegend(ctx, labels, colors, darkMode) {
  const legendX = 320;
  const legendY = 50;
  const itemHeight = 20;
  
  labels.forEach((label, index) => {
    // 绘制颜色块
    ctx.beginPath();
    ctx.setFillStyle(colors[index % colors.length]);
    ctx.fillRect(legendX, legendY + index * itemHeight, 12, 12);
    
    // 绘制标签
    ctx.setFontSize(12);
    ctx.setFillStyle(darkMode ? '#e0e0e0' : '#333');
    ctx.setTextAlign('left');
    ctx.setTextBaseline('middle');
    ctx.fillText(label, legendX + 20, legendY + index * itemHeight + 6);
  });
}