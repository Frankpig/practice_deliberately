Page({
  data: {
  },

  onLoad: function () {
    // 页面加载后绘制测试图表
    wx.nextTick(() => {
      this.drawTestChart();
    });
  },

  // 绘制测试图表
  drawTestChart: function () {
    console.log('开始绘制简单测试图表');
    const ctx = wx.createCanvasContext('simpleCanvas', this);
    
    // 清空画布
    ctx.clearRect(0, 0, 300, 300);
    
    // 绘制坐标轴
    ctx.setStrokeStyle('#000');
    ctx.setLineWidth(2);
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(50, 250);
    ctx.lineTo(250, 250);
    ctx.stroke();
    
    // 绘制标签
    ctx.setFillStyle('#000');
    ctx.setFontSize(12);
    ctx.fillText('X轴', 260, 255);
    ctx.save();
    ctx.translate(30, 150);
    ctx.rotate(-Math.PI/2);
    ctx.fillText('Y轴', 0, 0);
    ctx.restore();
    
    // 绘制柱状图
    const barWidth = 30;
    const barData = [50, 80, 60, 90, 70];
    
    for (let i = 0; i < barData.length; i++) {
      const x = 70 + i * 40;
      const height = barData[i];
      const y = 250 - height;
      
      ctx.setFillStyle('#61dafb');
      ctx.fillRect(x, y, barWidth, height);
      
      // 绘制数值标签
      ctx.setFillStyle('#000');
      ctx.setFontSize(10);
      ctx.setTextAlign('center');
      ctx.fillText(barData[i], x + barWidth/2, y - 5);
      
      // 绘制X轴标签
      ctx.fillText('标签' + (i+1), x + barWidth/2, 270);
    }
    
    ctx.draw(false, () => {
      console.log('简单测试图表绘制完成');
    });
  },

  // 清空画布
  clearCanvas: function () {
    const ctx = wx.createCanvasContext('simpleCanvas', this);
    ctx.clearRect(0, 0, 300, 300);
    ctx.draw();
    console.log('画布已清空');
  }
});