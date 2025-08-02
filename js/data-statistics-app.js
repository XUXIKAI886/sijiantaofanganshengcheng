/**
 * 数据统计分析应用主程序
 * 负责协调各个模块的工作
 */

class DataStatisticsApp {
    constructor() {
        this.formHandler = null;
        this.apiClient = null;
        this.contentGenerator = null;
        this.reportRenderer = null;
        this.isGenerating = false;
        
        this.init();
    }

    /**
     * 初始化应用
     */
    init() {
        console.log('[数据统计分析] 应用初始化开始');
        
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeModules());
        } else {
            this.initializeModules();
        }
    }

    /**
     * 初始化各个模块
     */
    initializeModules() {
        try {
            // 初始化API客户端
            this.apiClient = new DataStatisticsApiClient();
            
            // 初始化内容生成器
            this.contentGenerator = new DataStatisticsContentGenerator();
            
            // 初始化报告渲染器
            this.reportRenderer = new DataStatisticsReportRenderer();
            
            // 初始化表单处理器
            this.formHandler = new DataStatisticsFormHandler();
            
            // 绑定事件
            this.bindEvents();
            
            console.log('[数据统计分析] 所有模块初始化完成');
        } catch (error) {
            console.error('[数据统计分析] 模块初始化失败:', error);
            this.showError('应用初始化失败，请刷新页面重试');
        }
    }

    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // 表单提交事件
        const form = document.getElementById('data-statistics-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // 新建分析按钮
        const newAnalysisBtn = document.getElementById('new-analysis');
        if (newAnalysisBtn) {
            newAnalysisBtn.addEventListener('click', () => this.startNewAnalysis());
        }

        // 复制报告名称按钮
        const copyBtn = document.getElementById('copy-report-name');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyReportName());
        }

        // 导出报告按钮
        const exportBtn = document.getElementById('export-report');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportReport());
        }

        // 监听转化率自动计算
        this.bindConversionCalculation();
    }

    /**
     * 绑定转化率自动计算
     */
    bindConversionCalculation() {
        const exposureInput = document.getElementById('exposure-count');
        const visitInput = document.getElementById('visit-count');
        const orderInput = document.getElementById('order-count');

        [exposureInput, visitInput, orderInput].forEach(input => {
            if (input) {
                input.addEventListener('input', () => this.calculateConversions());
            }
        });
    }

    /**
     * 自动计算转化率
     */
    calculateConversions() {
        const exposureCount = parseFloat(document.getElementById('exposure-count').value) || 0;
        const visitCount = parseFloat(document.getElementById('visit-count').value) || 0;
        const orderCount = parseFloat(document.getElementById('order-count').value) || 0;

        // 计算入店转化率
        if (exposureCount > 0 && visitCount > 0) {
            const visitConversion = ((visitCount / exposureCount) * 100).toFixed(2);
            document.getElementById('visit-conversion').value = visitConversion;
        }

        // 计算下单转化率
        if (visitCount > 0 && orderCount > 0) {
            const orderConversion = ((orderCount / visitCount) * 100).toFixed(2);
            document.getElementById('order-conversion').value = orderConversion;
        }
    }

    /**
     * 处理表单提交
     */
    async handleFormSubmit(event) {
        event.preventDefault();

        if (this.isGenerating) {
            console.log('[数据统计分析] 正在生成中，忽略重复提交');
            return;
        }

        try {
            // 验证表单
            const formData = this.formHandler.validateAndGetFormData();
            if (!formData) {
                return;
            }

            // 开始生成
            this.isGenerating = true;
            this.showLoading();

            // 生成内容
            const prompt = this.contentGenerator.generatePrompt(formData);
            console.log('[数据统计分析] 提示词生成完成');

            // 调用API
            const response = await this.apiClient.generateReport(prompt);
            console.log('[数据统计分析] API调用成功');

            // 渲染报告
            this.reportRenderer.renderReport(response, formData);

            // 显示报告
            this.showReport();

        } catch (error) {
            console.error('[数据统计分析] 生成报告失败:', error);
            this.showError(`生成报告失败：${error.message || '请检查网络连接和输入数据'}`);
        } finally {
            this.isGenerating = false;
            this.hideLoading();
        }
    }

    /**
     * 显示加载状态
     */
    showLoading() {
        const inputSection = document.getElementById('input-section');
        const loadingSection = document.getElementById('loading-section');
        const reportSection = document.getElementById('report-section');

        if (inputSection) inputSection.style.display = 'none';
        if (loadingSection) {
            loadingSection.style.display = 'block';
            loadingSection.classList.remove('hidden');
        }
        if (reportSection) {
            reportSection.style.display = 'none';
            reportSection.classList.add('hidden');
        }

        // 启动进度条动画
        this.startProgressAnimation();
    }

    /**
     * 隐藏加载状态
     */
    hideLoading() {
        const loadingSection = document.getElementById('loading-section');
        if (loadingSection) {
            loadingSection.style.display = 'none';
            loadingSection.classList.add('hidden');
        }

        // 停止进度条动画
        this.stopProgressAnimation();
    }

    /**
     * 显示报告
     */
    showReport() {
        const inputSection = document.getElementById('input-section');
        const reportSection = document.getElementById('report-section');

        if (inputSection) inputSection.style.display = 'none';
        if (reportSection) {
            reportSection.style.display = 'block';
            reportSection.classList.remove('hidden');
        }

        // 滚动到报告区域
        setTimeout(() => {
            reportSection?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }

    /**
     * 开始新分析
     */
    startNewAnalysis() {
        const inputSection = document.getElementById('input-section');
        const reportSection = document.getElementById('report-section');

        if (inputSection) inputSection.style.display = 'block';
        if (reportSection) {
            reportSection.style.display = 'none';
            reportSection.classList.add('hidden');
        }

        // 滚动到表单区域
        setTimeout(() => {
            inputSection?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }

    /**
     * 复制报告名称
     */
    async copyReportName() {
        try {
            const storeName = document.getElementById('store-name')?.value || '未命名店铺';
            const reportName = `${storeName}-数据统计分析报告-${new Date().toLocaleDateString()}`;
            
            await navigator.clipboard.writeText(reportName);
            this.showToast('报告名称已复制到剪贴板', 'success');
        } catch (error) {
            console.error('[数据统计分析] 复制失败:', error);
            this.showToast('复制失败，请手动复制', 'error');
        }
    }

    /**
     * 导出报告
     */
    exportReport() {
        try {
            const reportContent = document.getElementById('report-content');
            if (!reportContent) {
                this.showToast('没有可导出的报告内容', 'warning');
                return;
            }

            const storeName = document.getElementById('store-name')?.value || '未命名店铺';
            const fileName = `${storeName}-数据统计分析报告-${new Date().toLocaleDateString()}.html`;

            // 创建完整的HTML文档
            const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fileName}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .stats-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .stats-table th, .stats-table td { border: 1px solid #ddd; padding: 12px; text-align: center; }
        .stats-table th { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
        .chart-container { margin: 20px 0; text-align: center; }
    </style>
</head>
<body>
    ${reportContent.innerHTML}
</body>
</html>`;

            // 创建下载链接
            const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.click();
            URL.revokeObjectURL(url);

            this.showToast('报告导出成功', 'success');
        } catch (error) {
            console.error('[数据统计分析] 导出失败:', error);
            this.showToast('导出失败，请重试', 'error');
        }
    }

    /**
     * 启动进度条动画
     */
    startProgressAnimation() {
        const progressBar = document.getElementById('progress-bar');
        if (!progressBar) return;

        let progress = 0;
        this.progressInterval = setInterval(() => {
            progress += Math.random() * 3;
            if (progress > 90) progress = 90;
            progressBar.value = progress;
        }, 200);
    }

    /**
     * 停止进度条动画
     */
    stopProgressAnimation() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }

        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.value = 100;
        }
    }

    /**
     * 显示错误信息
     */
    showError(message) {
        this.hideLoading();
        this.showToast(message, 'error');
        
        // 重新显示输入区域
        const inputSection = document.getElementById('input-section');
        if (inputSection) {
            inputSection.style.display = 'block';
        }
    }

    /**
     * 显示提示信息
     */
    showToast(message, type = 'info') {
        // 创建toast元素
        const toast = document.createElement('div');
        toast.className = `alert alert-${type === 'error' ? 'error' : type === 'success' ? 'success' : 'info'} fixed top-4 right-4 z-50 max-w-sm`;
        toast.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'} mr-2"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(toast);

        // 3秒后移除
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }
}

// 初始化应用
let dataStatisticsApp;

document.addEventListener('DOMContentLoaded', function() {
    dataStatisticsApp = new DataStatisticsApp();
    console.log('[数据统计分析] 应用已启动');
});

// 全局错误处理
window.addEventListener('error', function(event) {
    console.error('[数据统计分析] 全局错误:', event.error);
});

// 导出到全局作用域供其他模块使用
window.DataStatisticsApp = DataStatisticsApp;