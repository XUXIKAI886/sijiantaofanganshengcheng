/**
 * 店铺活动方案生成 - 主应用逻辑文件
 * 负责应用的初始化和整体流程控制
 */

class StoreActivityApp {
    constructor() {
        this.currentSection = 'input';
        this.storeData = null;
        this.reportData = null;
        
        this.init();
    }
    
    /**
     * 初始化应用
     */
    init() {
        console.log('[店铺活动] 店铺活动方案生成应用初始化...');
        
        // 绑定事件监听器
        this.bindEvents();
        
        // 初始化表单处理器
        if (typeof StoreActivityFormHandler !== 'undefined') {
            this.formHandler = new StoreActivityFormHandler();
        }
        
        // 初始化API客户端
        if (typeof StoreActivityAPIClient !== 'undefined') {
            this.apiClient = new StoreActivityAPIClient();
        }
        
        // 初始化内容生成器
        if (typeof StoreActivityContentGenerator !== 'undefined') {
            this.contentGenerator = new StoreActivityContentGenerator(this.apiClient);
        }
        
        // 初始化报告渲染器
        if (typeof StoreActivityReportRenderer !== 'undefined') {
            this.reportRenderer = new StoreActivityReportRenderer();
        }
        
        // 加载历史数据
        this.loadHistoryData();
        
        // 初始化主题切换器
        this.initThemeSelector();
        
        console.log('[店铺活动] 应用初始化完成');
    }
    
    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // 表单提交事件
        const form = document.getElementById('store-activity-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
        
        // 复制报告名称按钮
        const copyBtn = document.getElementById('copy-report-name');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyReportName());
        }
        
        // 新建分析按钮
        const newBtn = document.getElementById('new-analysis');
        if (newBtn) {
            newBtn.addEventListener('click', () => this.newAnalysis());
        }
        
        // 主题切换事件
        document.querySelectorAll('[data-theme]').forEach(element => {
            element.addEventListener('click', (e) => {
                const theme = e.target.getAttribute('data-theme');
                this.changeTheme(theme);
            });
        });
    }
    
    /**
     * 处理表单提交
     */
    async handleFormSubmit(event) {
        event.preventDefault();
        
        try {
            console.log('[店铺活动] 开始处理表单提交...');
            
            // 收集表单数据
            this.storeData = this.formHandler.collectFormData();
            
            if (!this.storeData) {
                throw new Error('表单数据收集失败');
            }
            
            console.log('[店铺活动] 收集到的店铺数据:', this.storeData);
            
            // 显示加载状态
            this.showLoading();
            
            // 生成活动方案报告
            this.reportData = await this.contentGenerator.generateActivityPlan(this.storeData);
            console.log('[店铺活动] 生成的报告数据:', this.reportData);
            
            // 渲染报告
            this.reportRenderer.renderReport(this.reportData, this.storeData);
            
            // 保存到历史记录
            this.saveToHistory(this.storeData, this.reportData);
            
            // 显示报告区域
            this.showReportSection();
            
        } catch (error) {
            console.error('[店铺活动] 处理表单提交失败:', error);
            this.handleError(error);
        } finally {
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
            loadingSection.classList.remove('hidden');
            loadingSection.style.display = 'block';
        }
        if (reportSection) reportSection.style.display = 'none';
        
        // 启动进度条动画
        this.startProgressAnimation();
        
        this.currentSection = 'loading';
    }
    
    /**
     * 隐藏加载状态
     */
    hideLoading() {
        const loadingSection = document.getElementById('loading-section');
        if (loadingSection) {
            loadingSection.classList.add('hidden');
            loadingSection.style.display = 'none';
        }
        
        // 停止进度条动画
        this.stopProgressAnimation();
    }
    
    /**
     * 显示报告区域
     */
    showReportSection() {
        const inputSection = document.getElementById('input-section');
        const reportSection = document.getElementById('report-section');
        
        if (inputSection) inputSection.style.display = 'none';
        if (reportSection) {
            reportSection.classList.remove('hidden');
            reportSection.style.display = 'block';
            reportSection.classList.add('fade-in-up');
        }
        
        this.currentSection = 'report';
        
        // 滚动到报告区域
        setTimeout(() => {
            reportSection?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
    }
    
    /**
     * 启动进度条动画
     */
    startProgressAnimation() {
        const progressBar = document.getElementById('progress-bar');
        if (!progressBar) return;
        
        let progress = 0;
        this.progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 90) progress = 90;
            progressBar.value = progress;
        }, 1000);
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
     * 复制报告名称
     */
    async copyReportName() {
        if (!this.storeData) return;
        
        const reportName = `${this.storeData.storeName}_活动方案_${new Date().toLocaleDateString('zh-CN')}`;
        
        try {
            await navigator.clipboard.writeText(reportName);
            this.showToast('报告名称已复制到剪贴板', 'success');
        } catch (error) {
            console.error('[店铺活动] 复制失败:', error);
            this.showToast('复制失败，请手动复制', 'error');
        }
    }
    
    /**
     * 新建分析
     */
    newAnalysis() {
        // 重置表单
        const form = document.getElementById('store-activity-form');
        if (form) {
            form.reset();
        }
        
        // 显示输入区域
        const inputSection = document.getElementById('input-section');
        const reportSection = document.getElementById('report-section');
        
        if (inputSection) inputSection.style.display = 'block';
        if (reportSection) {
            reportSection.classList.add('hidden');
            reportSection.style.display = 'none';
        }
        
        this.currentSection = 'input';
        this.storeData = null;
        this.reportData = null;
        
        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    /**
     * 处理错误
     */
    handleError(error) {
        console.error('[店铺活动] 错误处理:', error);
        
        let errorMessage = '生成活动方案时发生错误，请稍后重试';
        
        if (error.message) {
            if (error.message.includes('网络')) {
                errorMessage = '网络连接失败，请检查网络后重试';
            } else if (error.message.includes('API')) {
                errorMessage = 'AI服务暂时不可用，请稍后重试';
            } else if (error.message.includes('数据')) {
                errorMessage = '请检查输入的店铺信息是否完整';
            }
        }
        
        this.showToast(errorMessage, 'error');
        
        // 显示输入区域
        this.newAnalysis();
    }
    
    /**
     * 显示提示消息
     */
    showToast(message, type = 'info') {
        // 创建toast元素
        const toast = document.createElement('div');
        toast.className = `alert alert-${type} fixed top-4 right-4 w-auto max-w-sm z-50 shadow-lg`;
        toast.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // 3秒后自动移除
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }
    
    /**
     * 保存到历史记录
     */
    saveToHistory(storeData, reportData) {
        try {
            const historyKey = 'storeActivityHistory';
            let history = JSON.parse(localStorage.getItem(historyKey) || '[]');
            
            const record = {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                storeData: storeData,
                reportData: reportData
            };
            
            history.unshift(record);
            
            // 只保留最近10条记录
            if (history.length > 10) {
                history = history.slice(0, 10);
            }
            
            localStorage.setItem(historyKey, JSON.stringify(history));
            console.log('[店铺活动] 历史记录已保存');
        } catch (error) {
            console.error('[店铺活动] 保存历史记录失败:', error);
        }
    }
    
    /**
     * 加载历史数据
     */
    loadHistoryData() {
        try {
            const historyKey = 'storeActivityHistory';
            const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
            console.log(`[店铺活动] 加载了 ${history.length} 条历史记录`);
        } catch (error) {
            console.error('[店铺活动] 加载历史数据失败:', error);
        }
    }
    
    /**
     * 主题切换
     */
    changeTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('storeActivityTheme', theme);
        console.log(`[店铺活动] 主题已切换为: ${theme}`);
    }
    
    /**
     * 初始化主题选择器
     */
    initThemeSelector() {
        // 加载保存的主题
        const savedTheme = localStorage.getItem('storeActivityTheme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        console.log(`[店铺活动] 主题选择器已初始化，当前主题: ${savedTheme}`);
    }
}

// 当DOM加载完成后初始化店铺活动应用
document.addEventListener('DOMContentLoaded', function() {
    // 确保在其他应用之后初始化，避免冲突
    setTimeout(() => {
        if (typeof StoreActivityApp !== 'undefined') {
            window.storeActivityApp = new StoreActivityApp();
            console.log('[店铺活动] 店铺活动方案生成应用已启动');
        } else {
            console.error('[店铺活动] StoreActivityApp类未定义');
        }
    }, 100);
});

// 确保类在全局作用域中可用
window.StoreActivityApp = StoreActivityApp;

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StoreActivityApp;
}
