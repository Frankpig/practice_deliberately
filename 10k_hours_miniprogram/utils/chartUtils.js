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
  
  // 获取实际的画布尺寸
  const canvasWidth = 600; // 增加画布宽度以容纳图例
  const canvasHeight = 350;
  
  // 计算饼图中心和半径
  const centerX = 180;
  const centerY = canvasHeight / 2 - 50; // 上移50像素，比之前再多上移20像素
  const radius = 100;
  
  // 清空画布
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  
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
  
  // 绘制图例，传入饼图参数使其显示在正下方
  drawLegend(ctx, labels, colors, darkMode, centerX, centerY, radius);
  
  // 绘制完成
  ctx.draw();
};

/**
 * 初始化柱状图（水平显示，x和y轴调换）
 * @param {string} canvasId - 画布ID
 * @param {Object} data - 图表数据
 * @param {boolean} darkMode - 是否为深色模式
 */
export const initBarChart = function(canvasId, data, darkMode) {
  // 确保有数据
  if (!data || !data.labels || !data.datasets || data.labels.length === 0) {
    console.error('柱状图数据无效');
    return;
  }
  
  const ctx = wx.createCanvasContext(canvasId);
  const { labels, datasets } = data;
  let chartData = datasets[0].data;
  const barColor = datasets[0].backgroundColor;
  
  // 将标签和数据组合，并按数据从高到低排序
  const sortedData = labels.map((label, index) => ({
    label,
    value: chartData[index]
  })).sort((a, b) => b.value - a.value);
  
  // 从排序后的数据中提取标签和数据
  const sortedLabels = sortedData.map(item => item.label);
  chartData = sortedData.map(item => item.value);
  
  // 固定画布尺寸
  const width = 600;  // 画布宽度
  const height = 650; // 画布高度
  const leftPadding = 150; // 左侧padding，为Y轴标签留出空间
  const rightPadding = 50; // 右侧padding
  const topPadding = 50; // 顶部padding
  const bottomPadding = 50; // 底部padding
  const barHeight = Math.max(10, (height - topPadding - bottomPadding) / sortedLabels.length * 0.3); // 进一步减小柱状图高度系数和最小高度，使上下宽度更小
  
  // 调试：打印标签数据，确认有内容
  console.log('绘制水平柱状图，技能标签数量：', labels.length);
  console.log('技能标签列表：', labels);
  console.log('对应数据：', chartData);
  console.log('图表尺寸：宽=' + width + ', 高=' + height + ', 左侧边距=' + leftPadding);
  
  // 清空画布
  ctx.clearRect(0, 0, width, height);
  
  // 计算最大值，动态调整X轴范围
  const maxValue = Math.max(...chartData);
  const displayMaxValue = maxValue < 20 ? 20 : Math.ceil(maxValue * 1.1);
  
  // 调试：打印排序后的数据
  console.log('排序后的数据：', chartData);
  console.log('排序后的标签：', sortedLabels);
  
  // 绘制坐标轴 - 增强可见性
  ctx.beginPath();
  ctx.setStrokeStyle(darkMode ? '#ccc' : '#333'); // 更明显的颜色，增加对比度
  ctx.setLineWidth(3); // 增加线宽
  
  // Y轴（水平柱状图的分类轴）- 靠左对齐
  const yAxisX = 0;
  ctx.moveTo(yAxisX, topPadding);
  ctx.lineTo(yAxisX, height - bottomPadding);
  
  // X轴（水平柱状图的值轴）- 移至上方
  const xAxisY = topPadding;
  ctx.moveTo(yAxisX, xAxisY);
  ctx.lineTo(width - rightPadding, xAxisY);
  ctx.stroke();
  
  // 特别绘制原点，使其更突出
  ctx.beginPath();
  ctx.setFillStyle(darkMode ? '#fff' : '#000'); // 原点颜色
  ctx.arc(yAxisX, xAxisY, 4, 0, 2 * Math.PI); // 绘制原点小圆点
  ctx.fill();
  
  // 绘制网格线
  ctx.beginPath();
  ctx.setStrokeStyle(darkMode ? '#444' : '#ddd');
  ctx.setLineWidth(0.5);
  
  // 垂直线 - 从上方X轴延伸到下方
  const gridLineCount = 5;
  for (let i = 0; i <= gridLineCount; i++) {
    const x = yAxisX + (i * (width - rightPadding - yAxisX) / gridLineCount);
    ctx.moveTo(x, topPadding);
    ctx.lineTo(x, height - bottomPadding);
    
    // X轴刻度 - 调整到X轴上方
    ctx.setFontSize(12);
    ctx.setFillStyle(darkMode ? '#e0e0e0' : '#333');
    ctx.setTextAlign('center');
    ctx.setTextBaseline('bottom');
    ctx.fillText((i * displayMaxValue / gridLineCount).toFixed(0) + '%', x, xAxisY - 5);
  }
  ctx.stroke();
  
  // 为柱状图添加图例 - 移至图表下方居中
  const legendY = height - 30; // 图表底部位置
  const legendText = '练习时间分布';
  ctx.setFontSize(12);
  const textMetrics = ctx.measureText(legendText);
  const legendWidth = 16 + 12 + textMetrics.width; // 颜色块宽度 + 间距 + 文本宽度
  const legendX = (width - legendWidth) / 2; // 计算居中的X坐标
  
  ctx.beginPath();
  ctx.setFillStyle(barColor);
  ctx.fillRect(legendX, legendY - 8, 16, 16);
  
  ctx.setFontSize(12);
  ctx.setFillStyle(darkMode ? '#ffffff' : '#000000');
  ctx.setTextAlign('left');
  ctx.setTextBaseline('middle');
  ctx.fillText(legendText, legendX + 24, legendY);
  
  // 绘制水平柱状图
  chartData.forEach((value, index) => {
    // 计算柱子位置
    const barSpacing = (height - topPadding - bottomPadding) / sortedLabels.length * 0.8; // 减小技能之间的间距
    const y = topPadding + index * barSpacing + (barSpacing - barHeight) / 2 + barHeight / 2;
    
    // 计算柱子宽度，保持柱子紧贴Y轴，同时使用缩小系数0.8使柱子变窄
    const barWidth = (value / displayMaxValue) * (width - rightPadding - yAxisX) * 0.8;
    const x = yAxisX; // 让柱子紧贴Y轴
    
    // 确保即使很小的值也能显示
    const finalBarWidth = Math.max(barWidth, 10); // 最小宽度10像素
    
    console.log('绘制水平柱子 ' + index + ' (', sortedLabels[index], '): x=' + x + ', y=' + y + ', 宽=' + finalBarWidth + ', 高=' + barHeight);
    
    // 绘制柱子
    ctx.beginPath();
    ctx.setFillStyle(barColor);
    ctx.fillRect(x, y - barHeight / 2, finalBarWidth, barHeight);
    
    // 为柱子添加边框
    ctx.setStrokeStyle(darkMode ? '#ffffff' : '#333');
    ctx.setLineWidth(1.5);
    ctx.strokeRect(x, y - barHeight / 2, finalBarWidth, barHeight);
    
    // 绘制数值
    if (finalBarWidth > 30) { // 只有当柱子足够宽时才显示数值
      ctx.setFontSize(12);
      ctx.setFillStyle(darkMode ? '#ffffff' : '#000000');
      ctx.setTextAlign('center');
      ctx.setTextBaseline('middle');
      ctx.fillText(value.toFixed(1) + '%', x + finalBarWidth / 2, y);
    }
  });
  
  // 绘制Y轴标签
  sortedLabels.forEach((label, index) => {
    // 计算标签位置
    const barSpacing = (height - topPadding - bottomPadding) / sortedLabels.length * 0.8; // 减小技能之间的间距
    const y = topPadding + index * barSpacing + (barSpacing - barHeight) / 2 + barHeight / 2;
    
    console.log('绘制标签 ' + index + ' (', label, '): y=' + y);
    
    // 设置文本样式
    ctx.setFontSize(14);
    ctx.setFillStyle(darkMode ? '#ffffff' : '#000000');
    ctx.setTextAlign('right');
    ctx.setTextBaseline('bottom');
    // 将标签移至柱子下方
    ctx.fillText(label, leftPadding - 15, y + barHeight / 2 + 20);
  });
  
  // 添加X轴标题"完成度"
  ctx.setFontSize(16);
  ctx.setFillStyle(darkMode ? '#ffffff' : '#000000');
  ctx.setTextAlign('center');
  ctx.setTextBaseline('top');
  ctx.fillText('完成度 (%)', (yAxisX + width - rightPadding) / 2, height - 20);
  
  // 确保所有绘制操作生效
  ctx.draw(false, () => {
    console.log('水平柱状图绘制完成回调');
  });
  
  console.log('水平柱状图绘制完成');
};

/**
 * 绘制饼图图例
 * @param {CanvasContext} ctx - 画布上下文
 * @param {Array} labels - 标签数组
 * @param {Array} colors - 颜色数组
 * @param {boolean} darkMode - 是否为深色模式
 */
function drawLegend(ctx, labels, colors, darkMode, centerX, centerY, radius) {
  // 使用简化的固定位置显示图例，确保可见
  const legendX = 30; // 固定X坐标，确保在画布左侧可见
  const legendY = 220; // 固定Y坐标，确保在饼图下方可见
  const itemHeight = 25;
  
  // 只显示最多6个图例项，超过的显示为"更多..."
  const displayLabels = labels.length > 6 ? labels.slice(0, 6) : labels;
  
  displayLabels.forEach((label, index) => {
    // 绘制颜色块
    ctx.beginPath();
    ctx.setFillStyle(colors[index % colors.length]);
    ctx.fillRect(legendX, legendY + index * itemHeight, 16, 16);
    
    // 绘制标签
    ctx.setFontSize(14);
    ctx.setFillStyle(darkMode ? '#ffffff' : '#000000'); // 使用更明显的对比色
    ctx.setTextAlign('left');
    ctx.setTextBaseline('middle');
    
    // 处理长文本，截断显示
    const maxLabelLength = 8;
    const displayLabel = label.length > maxLabelLength ? label.substring(0, maxLabelLength) + '...' : label;
    ctx.fillText(displayLabel, legendX + 24, legendY + index * itemHeight + 8);
  });
  
  // 如果标签数量超过6个，显示"更多..."
  if (labels.length > 6) {
    ctx.setFontSize(14);
    ctx.setFillStyle(darkMode ? '#ffffff' : '#000000'); // 使用更明显的对比色
    ctx.setTextAlign('left');
    ctx.setTextBaseline('middle');
    ctx.fillText(`+${labels.length - 6} 更多...`, legendX, legendY + displayLabels.length * itemHeight);
  }
}

/**
 * 获取系统信息，获取实际的画布尺寸
 */
function getCanvasDimensions(canvasId) {
  try {
    const query = wx.createSelectorQuery();
    query.select(`#${canvasId}`).fields({
      size: true
    });
    
    return new Promise((resolve) => {
      query.exec((res) => {
        if (res && res[0]) {
          resolve({ width: res[0].width, height: res[0].height });
        } else {
          // 默认尺寸
          resolve({ width: 300, height: 300 });
        }
      });
    });
  } catch (error) {
    console.error('获取画布尺寸失败:', error);
    return { width: 300, height: 300 };
  }
}