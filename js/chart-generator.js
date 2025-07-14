/**
 * 图表生成器 - 基于AI生成的数据创建可视化图表
 * 支持多种图表类型：线图、柱状图、饼图、雷达图等
 */

class ChartGenerator {
    constructor() {
        this.chartInstances = new Map(); // 存储图表实例
        this.chartColors = {
            primary: '#1E3A8A',        // 深蓝色 - 主色调
            secondary: '#3B82F6',      // 中蓝色 - 辅助色
            accent: '#F59E0B',         // 橙色 - 强调色
            background: '#EFF6FF',     // 浅蓝色 - 背景色
            text: '#374151',           // 深灰色 - 文字色
            success: '#10B981',        // 成功色 - 绿色
            warning: '#F59E0B',        // 警告色 - 橙色
            error: '#EF4444',          // 错误色 - 红色
            info: '#3B82F6'            // 信息色 - 蓝色
        };
    }

    /**
     * 初始化图表生成器
     */
    init() {
        console.log('[图表生成器] 初始化图表生成器...');
        this.loadChartLibrary();
    }

    /**
     * 加载图表库
     */
    async loadChartLibrary() {
        try {
            // 检查是否已加载Chart.js
            if (typeof Chart === 'undefined') {
                console.log('[图表生成器] Chart.js 未检测到，等待加载...');

                // 等待Chart.js加载，最多等待10秒
                const maxWaitTime = 10000; // 10秒
                const checkInterval = 100; // 100毫秒检查一次
                let waitTime = 0;

                while (typeof Chart === 'undefined' && waitTime < maxWaitTime) {
                    await new Promise(resolve => setTimeout(resolve, checkInterval));
                    waitTime += checkInterval;
                }

                if (typeof Chart !== 'undefined') {
                    console.log('[图表生成器] Chart.js 加载成功');
                } else {
                    console.error('[图表生成器] Chart.js 加载超时，尝试备用加载方案');
                    await this.loadChartWithFallback();
                }
            } else {
                console.log('[图表生成器] Chart.js 已存在，跳过加载');
            }
        } catch (error) {
            console.error('[图表生成器] 图表库加载失败:', error);
            await this.loadChartWithFallback();
        }
    }

    /**
     * 备用Chart.js加载方案
     */
    async loadChartWithFallback() {
        const fallbackCDNs = [
            'https://unpkg.com/chart.js@4.4.0/dist/chart.umd.js',
            'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.js'
        ];

        for (const cdn of fallbackCDNs) {
            try {
                console.log(`[图表生成器] 尝试从备用CDN加载: ${cdn}`);
                await this.loadScript(cdn);

                if (typeof Chart !== 'undefined') {
                    console.log(`[图表生成器] 从备用CDN加载成功: ${cdn}`);
                    return;
                }
            } catch (error) {
                console.warn(`[图表生成器] 备用CDN加载失败: ${cdn}`, error);
            }
        }

        console.error('[图表生成器] 所有CDN都加载失败，将使用文本显示替代图表');
    }

    /**
     * 动态加载脚本
     */
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * 解析报告中的图表数据并生成图表
     * @param {HTMLElement} reportContainer - 报告容器
     */
    generateChartsFromReport(reportContainer) {
        console.log('[图表生成器] 开始解析报告中的图表数据...');

        const chartElements = reportContainer.querySelectorAll('.chart-data');
        console.log(`[图表生成器] 找到 ${chartElements.length} 个图表数据元素`);

        let chartsGenerated = 0;

        chartElements.forEach((element, index) => {
            try {
                const chartType = element.getAttribute('data-chart-type');
                const chartTitle = element.getAttribute('data-chart-title');
                const chartDataText = element.textContent.trim();

                console.log(`[图表生成器] 处理图表 ${index + 1}:`, {
                    type: chartType,
                    title: chartTitle,
                    dataLength: chartDataText.length
                });

                // 解析JSON数据
                const chartData = this.parseChartData(chartDataText);

                if (chartData && chartData.length > 0) {
                    console.log(`[图表生成器] 图表数据解析成功:`, chartData);

                    // 创建图表容器
                    const chartContainer = this.createChartContainer(chartTitle, index);
                    element.parentNode.replaceChild(chartContainer, element);

                    // 生成图表
                    this.createChart(chartContainer.querySelector('canvas'), chartType, chartData, chartTitle);
                    chartsGenerated++;
                } else {
                    console.warn(`[图表生成器] 图表数据为空或解析失败:`, chartDataText);
                }
            } catch (error) {
                console.error('[图表生成器] 图表生成失败:', error);
                // 保留原始数据显示
                element.style.display = 'none';
            }
        });

        console.log(`[图表生成器] 成功生成 ${chartsGenerated} 个图表`);
    }

    /**
     * 解析图表数据
     * @param {string} dataText - 数据文本
     * @returns {Array} - 解析后的数据
     */
    parseChartData(dataText) {
        try {
            // 移除可能的markdown标记
            const cleanData = dataText.replace(/```json|```/g, '').trim();
            
            // 尝试解析JSON
            if (cleanData.startsWith('[') && cleanData.endsWith(']')) {
                return JSON.parse(cleanData);
            }
            
            // 如果不是JSON格式，尝试解析其他格式
            return this.parseAlternativeFormat(cleanData);
        } catch (error) {
            console.warn('[图表生成器] 数据解析失败，使用默认数据:', error);
            return this.getDefaultChartData();
        }
    }

    /**
     * 解析其他格式的数据
     * @param {string} dataText - 数据文本
     * @returns {Array} - 解析后的数据
     */
    parseAlternativeFormat(dataText) {
        // 尝试解析简单的键值对格式
        const lines = dataText.split('\n').filter(line => line.trim());
        const data = [];

        lines.forEach(line => {
            const match = line.match(/(.+?)[:：]\s*(.+)/);
            if (match) {
                const key = match[1].trim();
                const value = parseFloat(match[2]) || Math.random() * 100;
                data.push({ name: key, value: value });
            }
        });

        return data.length > 0 ? data : this.getDefaultChartData();
    }

    /**
     * 获取默认图表数据
     * @returns {Array} - 默认数据
     */
    getDefaultChartData() {
        return [
            { name: '数据1', value: 75 },
            { name: '数据2', value: 60 },
            { name: '数据3', value: 85 },
            { name: '数据4', value: 70 }
        ];
    }

    /**
     * 创建图表容器
     * @param {string} title - 图表标题
     * @param {number} index - 图表索引
     * @returns {HTMLElement} - 图表容器
     */
    createChartContainer(title, index) {
        const container = document.createElement('div');
        container.className = 'market-chart-container';
        container.style.cssText = `
            background: #f9fafc;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        `;

        container.innerHTML = `
            <div class="market-chart-header" style="margin-bottom: 15px;">
                <h4 class="market-chart-title" style="
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                    color: #374151;
                    text-align: center;
                ">${title || `图表 ${index + 1}`}</h4>
            </div>
            <div class="market-chart-body" style="
                position: relative;
                height: 300px;
                width: 100%;
            ">
                <canvas id="chart-${index}-${Date.now()}" style="
                    max-width: 100%;
                    max-height: 100%;
                "></canvas>
            </div>
        `;
        return container;
    }

    /**
     * 创建图表
     * @param {HTMLCanvasElement} canvas - 画布元素
     * @param {string} type - 图表类型
     * @param {Array} data - 图表数据
     * @param {string} title - 图表标题
     * @param {Object} options - 额外配置选项
     */
    createChart(canvas, type, data, title, options = {}) {
        if (typeof Chart === 'undefined') {
            console.error('[图表生成器] Chart.js 未加载，使用文本替代方案');
            this.createTextFallback(canvas, type, data, title);
            return null;
        }

        // 确保canvas有正确的尺寸
        const container = canvas.parentElement;
        if (container) {
            const containerRect = container.getBoundingClientRect();
            canvas.style.width = '100%';
            canvas.style.height = '100%';
        }

        const ctx = canvas.getContext('2d');
        const chartConfig = this.getChartConfig(type, data, title);

        // 强制设置稳定的配置
        chartConfig.options.responsive = true;
        chartConfig.options.maintainAspectRatio = true;
        chartConfig.options.aspectRatio = 1.5;

        // 应用额外配置选项
        if (options.responsive !== undefined) {
            chartConfig.options.responsive = options.responsive;
        }
        if (options.maintainAspectRatio !== undefined) {
            chartConfig.options.maintainAspectRatio = options.maintainAspectRatio;
        }
        if (options.aspectRatio !== undefined) {
            chartConfig.options.aspectRatio = options.aspectRatio;
        }

        try {
            // 销毁可能存在的旧图表
            if (this.chartInstances.has(canvas.id)) {
                this.chartInstances.get(canvas.id).destroy();
                this.chartInstances.delete(canvas.id);
            }

            const chart = new Chart(ctx, chartConfig);
            this.chartInstances.set(canvas.id, chart);
            console.log(`[图表生成器] ${type} 图表创建成功:`, title);
            return chart;
        } catch (error) {
            console.error('[图表生成器] 图表创建失败:', error);
            this.createTextFallback(canvas, type, data, title);
            return null;
        }
    }

    /**
     * 创建文本替代方案
     * @param {HTMLCanvasElement} canvas - 画布元素
     * @param {string} type - 图表类型
     * @param {Array} data - 图表数据
     * @param {string} title - 图表标题
     */
    createTextFallback(canvas, type, data, title) {
        const container = canvas.parentElement;
        const fallbackHTML = `
            <div class="chart-fallback" style="
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                border: 2px dashed #cbd5e0;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
                min-height: 300px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            ">
                <div style="
                    background: #3182ce;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 15px;
                ">${title}</div>

                <div style="
                    background: white;
                    border-radius: 6px;
                    padding: 15px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    max-width: 300px;
                    width: 100%;
                ">
                    <div style="
                        font-size: 16px;
                        font-weight: 600;
                        color: #2d3748;
                        margin-bottom: 10px;
                    ">数据概览 (${this.getChartTypeText(type)})</div>

                    <div style="
                        font-size: 14px;
                        color: #4a5568;
                        line-height: 1.5;
                    ">
                        ${this.formatDataForText(data)}
                    </div>
                </div>

                <div style="
                    margin-top: 15px;
                    font-size: 12px;
                    color: #718096;
                    font-style: italic;
                ">
                    <i class="fas fa-info-circle" style="margin-right: 5px;"></i>
                    图表库加载失败，显示文本数据
                </div>
            </div>
        `;

        container.innerHTML = fallbackHTML;
        console.log(`[图表生成器] 为 ${title} 创建了文本替代方案`);
    }

    /**
     * 获取图表类型文本
     * @param {string} type - 图表类型
     * @returns {string} - 图表类型文本
     */
    getChartTypeText(type) {
        const typeMap = {
            'bar': '柱状图',
            'pie': '饼图',
            'doughnut': '环形图',
            'radar': '雷达图',
            'line': '折线图'
        };
        return typeMap[type] || type;
    }

    /**
     * 格式化数据为文本显示
     * @param {Array} data - 图表数据
     * @returns {string} - 格式化的文本
     */
    formatDataForText(data) {
        if (!Array.isArray(data) || data.length === 0) {
            return '暂无数据';
        }

        return data.slice(0, 5).map((item, index) => {
            const name = item.name || item.label || `项目${index + 1}`;
            const value = item.value || item.y || item.data || 0;
            return `• ${name}: ${value}`;
        }).join('<br>') + (data.length > 5 ? '<br>...' : '');
    }

    /**
     * 获取图表配置
     * @param {string} type - 图表类型
     * @param {Array} data - 图表数据
     * @param {string} title - 图表标题
     * @returns {Object} - 图表配置
     */
    getChartConfig(type, data, title) {
        const baseConfig = {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.5, // 固定宽高比
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: { size: 14, weight: 'bold' },
                    color: this.chartColors.text
                },
                legend: {
                    display: true,
                    position: 'bottom'
                }
            },
            layout: {
                padding: {
                    top: 10,
                    bottom: 10,
                    left: 10,
                    right: 10
                }
            }
        };

        switch (type) {
            case 'line':
                return this.getLineChartConfig(data, baseConfig);
            case 'column':
            case 'bar':
                return this.getBarChartConfig(data, baseConfig);
            case 'pie':
                return this.getPieChartConfig(data, baseConfig);
            case 'doughnut':
                return this.getDoughnutChartConfig(data, baseConfig);
            case 'radar':
                return this.getRadarChartConfig(data, baseConfig);
            case 'polarArea':
                return this.getPolarAreaChartConfig(data, baseConfig);
            case 'scatter':
                return this.getScatterChartConfig(data, baseConfig);
            default:
                return this.getBarChartConfig(data, baseConfig);
        }
    }

    /**
     * 获取线图配置
     */
    getLineChartConfig(data, baseConfig) {
        return {
            type: 'line',
            data: {
                labels: data.map(item => item.time || item.name || item.category),
                datasets: [{
                    label: '数值',
                    data: data.map(item => item.value),
                    borderColor: this.chartColors.primary,
                    backgroundColor: this.chartColors.background,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                ...baseConfig,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: '#E0E0E0' }
                    },
                    x: {
                        grid: { color: '#E0E0E0' }
                    }
                }
            }
        };
    }

    /**
     * 获取柱状图配置
     */
    getBarChartConfig(data, baseConfig) {
        return {
            type: 'bar',
            data: {
                labels: data.map(item => item.name || item.category),
                datasets: [{
                    label: '数值',
                    data: data.map(item => item.value),
                    backgroundColor: this.chartColors.primary,
                    borderColor: this.chartColors.secondary,
                    borderWidth: 1
                }]
            },
            options: {
                ...baseConfig,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: '#E0E0E0' }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        };
    }

    /**
     * 获取饼图配置
     */
    getPieChartConfig(data, baseConfig) {
        const colors = [
            this.chartColors.primary,     // 深蓝色
            this.chartColors.secondary,   // 中蓝色
            this.chartColors.accent,      // 橙色
            this.chartColors.success,     // 绿色
            this.chartColors.warning,     // 警告橙色
            this.chartColors.info,        // 信息蓝色
            '#8B5CF6',                    // 紫色
            '#EC4899',                    // 粉色
            '#06B6D4',                    // 青色
            '#84CC16'                     // 青绿色
        ];

        return {
            type: 'pie',
            data: {
                labels: data.map(item => item.name || item.category),
                datasets: [{
                    data: data.map(item => item.value),
                    backgroundColor: colors.slice(0, data.length),
                    borderWidth: 2,
                    borderColor: '#FFFFFF'
                }]
            },
            options: baseConfig
        };
    }

    /**
     * 获取环形图配置
     */
    getDoughnutChartConfig(data, baseConfig) {
        const colors = [
            this.chartColors.primary,     // 深蓝色
            this.chartColors.secondary,   // 中蓝色
            this.chartColors.accent,      // 橙色
            this.chartColors.success,     // 绿色
            this.chartColors.warning,     // 警告橙色
            this.chartColors.info,        // 信息蓝色
            '#8B5CF6',                    // 紫色
            '#EC4899',                    // 粉色
            '#06B6D4',                    // 青色
            '#84CC16'                     // 青绿色
        ];

        return {
            type: 'doughnut',
            data: {
                labels: data.map(item => item.name || item.category),
                datasets: [{
                    data: data.map(item => item.value),
                    backgroundColor: colors.slice(0, data.length),
                    borderWidth: 3,
                    borderColor: '#FFFFFF',
                    hoverBorderWidth: 4,
                    cutout: '60%' // 环形图中心空洞大小
                }]
            },
            options: {
                ...baseConfig,
                plugins: {
                    ...baseConfig.plugins,
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        };
    }

    /**
     * 获取雷达图配置
     */
    getRadarChartConfig(data, baseConfig) {
        return {
            type: 'radar',
            data: {
                labels: data.map(item => item.name || item.category),
                datasets: [{
                    label: '数值',
                    data: data.map(item => item.value),
                    backgroundColor: this.chartColors.background + '80', // 添加透明度
                    borderColor: this.chartColors.primary,
                    borderWidth: 3,
                    pointBackgroundColor: this.chartColors.secondary,
                    pointBorderColor: '#FFFFFF',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                ...baseConfig,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: Math.max(...data.map(item => item.value)) * 1.2, // 动态设置最大值
                        grid: { color: '#E0E0E0' },
                        angleLines: { color: '#E0E0E0' },
                        pointLabels: {
                            font: { size: 12 },
                            color: this.chartColors.text
                        },
                        ticks: {
                            display: false // 隐藏刻度标签
                        }
                    }
                }
            }
        };
    }

    /**
     * 获取极坐标图配置
     */
    getPolarAreaChartConfig(data, baseConfig) {
        const colors = [
            this.chartColors.primary,     // 深蓝色
            this.chartColors.secondary,   // 中蓝色
            this.chartColors.accent,      // 橙色
            this.chartColors.success,     // 绿色
            this.chartColors.warning,     // 警告橙色
            this.chartColors.info,        // 信息蓝色
            '#8B5CF6',                    // 紫色
            '#EC4899',                    // 粉色
            '#06B6D4',                    // 青色
            '#84CC16'                     // 青绿色
        ];

        return {
            type: 'polarArea',
            data: {
                labels: data.map(item => item.name || item.category),
                datasets: [{
                    data: data.map(item => item.value),
                    backgroundColor: colors.slice(0, data.length).map(color => color + '80'), // 添加透明度
                    borderColor: colors.slice(0, data.length),
                    borderWidth: 2
                }]
            },
            options: {
                ...baseConfig,
                scales: {
                    r: {
                        beginAtZero: true,
                        grid: { color: '#E0E0E0' },
                        angleLines: { color: '#E0E0E0' },
                        pointLabels: {
                            font: { size: 12 },
                            color: this.chartColors.text
                        }
                    }
                }
            }
        };
    }

    /**
     * 获取散点图配置
     */
    getScatterChartConfig(data, baseConfig) {
        return {
            type: 'scatter',
            data: {
                datasets: [{
                    label: '数据点',
                    data: data.map(item => ({
                        x: item.x || item.value,
                        y: item.y || item.value
                    })),
                    backgroundColor: this.chartColors.primary,
                    borderColor: this.chartColors.secondary,
                    borderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                ...baseConfig,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        grid: { color: '#E0E0E0' }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: '#E0E0E0' }
                    }
                }
            }
        };
    }

    /**
     * 销毁所有图表实例
     */
    destroyAllCharts() {
        this.chartInstances.forEach(chart => {
            chart.destroy();
        });
        this.chartInstances.clear();
        console.log('[图表生成器] 所有图表已销毁');
    }
}

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChartGenerator;
}
