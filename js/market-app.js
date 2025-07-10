/**
 * 商圈调研分析 - 主应用逻辑文件
 * 负责商圈调研分析应用的初始化和整体流程控制
 */

class MarketAnalysisApp {
    constructor() {
        this.currentSection = 'input';
        this.marketData = null;
        this.reportData = null;
        
        this.init();
    }
    
    /**
     * 初始化应用
     */
    init() {
        console.log('[商圈分析] 商圈调研分析应用初始化...');
        
        // 绑定事件监听器
        this.bindEvents();
        
        // 初始化表单处理器
        if (typeof MarketFormHandler !== 'undefined') {
            this.formHandler = new MarketFormHandler();
        }
        
        // 初始化API客户端
        if (typeof MarketAPIClient !== 'undefined') {
            this.apiClient = new MarketAPIClient();
        }
        
        // 初始化内容生成器
        if (typeof MarketContentGenerator !== 'undefined') {
            this.contentGenerator = new MarketContentGenerator(this.apiClient);
        }
        
        // 初始化报告渲染器
        if (typeof MarketReportRenderer !== 'undefined') {
            this.reportRenderer = new MarketReportRenderer();
        }
        

        
        // 加载历史数据
        this.loadHistoryData();
        
        console.log('[商圈分析] 应用初始化完成');
    }
    
    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // 表单提交事件
        const form = document.getElementById('market-survey-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
        
        // 复制名称按钮
        const copyNameBtn = document.getElementById('market-copyNameBtn');
        if (copyNameBtn) {
            copyNameBtn.addEventListener('click', () => this.copyReportName());
        }

        // 初始化主题选择器
        this.initThemeSelector();

        console.log('[商圈分析] 事件监听器绑定完成');
    }
    
    /**
     * 处理表单提交
     */
    async handleFormSubmit(event) {
        event.preventDefault();
        
        console.log('[商圈分析] 开始处理表单提交...');
        
        try {
            // 验证表单
            if (!this.formHandler.validateForm()) {
                console.log('[商圈分析] 表单验证失败');
                return;
            }
            
            // 收集表单数据
            this.marketData = this.formHandler.collectFormData();

            // 收集截图文件（如果有）
            const screenshotFile = this.formHandler.getScreenshotFile();
            if (screenshotFile && this.marketData.enableScreenshotAnalysis) {
                this.marketData.screenshotFile = screenshotFile;
                console.log('[商圈分析] 收集到截图文件:', screenshotFile.name, screenshotFile.size);
            }

            console.log('[商圈分析] 收集到的商圈数据:', this.marketData);
            
            // 显示加载状态
            this.showLoading();
            
            // 生成分析报告
            this.reportData = await this.contentGenerator.generateAnalysis(this.marketData);
            console.log('[商圈分析] 生成的报告数据:', this.reportData);
            
            // 渲染报告
            this.reportRenderer.renderReport(this.reportData, this.marketData);
            
            // 保存到历史记录
            this.saveToHistory(this.marketData, this.reportData);
            
            // 显示报告区域
            this.showReportSection();
            
        } catch (error) {
            console.error('[商圈分析] 处理表单提交失败:', error);
            this.handleError(error);
        } finally {
            this.hideLoading();
        }
    }
    

    
    /**
     * 显示输入区域
     */
    showInputSection() {
        const inputSection = document.getElementById('market-input-section');
        const reportSection = document.getElementById('market-report-section');

        if (inputSection && reportSection) {
            inputSection.style.display = 'block';
            reportSection.style.display = 'none';
            this.currentSection = 'input';

            // 重新显示生成按钮（返回输入界面时需要显示）
            const generateBtn = document.getElementById('market-generateBtn');
            if (generateBtn) {
                generateBtn.style.display = 'inline-block';
            }

            console.log('[商圈分析] 切换到输入区域，已显示生成按钮');
        }
    }
    
    /**
     * 显示报告区域
     */
    showReportSection() {
        const inputSection = document.getElementById('market-input-section');
        const reportSection = document.getElementById('market-report-section');

        if (inputSection && reportSection) {
            inputSection.style.display = 'none';
            reportSection.style.display = 'block';
            this.currentSection = 'report';

            // 隐藏生成按钮（报告生成后不需要显示）
            const generateBtn = document.getElementById('market-generateBtn');
            if (generateBtn) {
                generateBtn.style.display = 'none';
            }

            console.log('[商圈分析] 切换到报告区域，已隐藏生成按钮');
        }
    }
    
    /**
     * 显示加载状态
     */
    showLoading() {
        const loadingOverlay = document.getElementById('market-loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.setProperty('display', 'flex', 'important');
        }

        // 禁用提交按钮
        const submitBtn = document.getElementById('market-generateBtn');
        if (submitBtn) {
            submitBtn.disabled = true;
            const btnText = submitBtn.querySelector('.market-btn-text');
            const btnLoading = submitBtn.querySelector('.market-btn-loading');

            if (btnText) btnText.style.display = 'none';
            if (btnLoading) btnLoading.style.display = 'inline-flex';
        }
    }
    
    /**
     * 隐藏加载状态
     */
    hideLoading() {
        const loadingOverlay = document.getElementById('market-loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.setProperty('display', 'none', 'important');
        }

        // 恢复提交按钮
        const submitBtn = document.getElementById('market-generateBtn');
        if (submitBtn) {
            submitBtn.disabled = false;
            const btnText = submitBtn.querySelector('.market-btn-text');
            const btnLoading = submitBtn.querySelector('.market-btn-loading');

            if (btnText) btnText.style.display = 'inline';
            if (btnLoading) btnLoading.style.display = 'none';
        }
    }
    
















    /**
     * 处理错误
     */
    handleError(error) {
        console.error('[商圈分析] 应用错误:', error);
        
        // 显示错误信息
        this.showErrorMessage(error.message || '发生未知错误');
        
        // 如果在报告生成过程中出错，返回输入界面
        if (this.currentSection === 'report') {
            this.showInputSection();
        }
    }
    
    /**
     * 显示成功消息
     */
    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }
    
    /**
     * 显示错误消息
     */
    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }
    
    /**
     * 显示消息
     */
    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `market-message market-message-${type}`;
        messageDiv.textContent = message;
        
        // 添加样式
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        `;
        
        document.body.appendChild(messageDiv);
        
        // 3秒后自动移除
        setTimeout(() => {
            if (messageDiv.parentElement) {
                messageDiv.remove();
            }
        }, 3000);
    }
    
    /**
     * 保存到历史记录
     */
    saveToHistory(marketData, reportData) {
        try {
            const historyItem = {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                marketData,
                reportData
            };
            
            let history = JSON.parse(localStorage.getItem('marketAnalysisHistory') || '[]');
            history.unshift(historyItem);
            
            // 只保留最近10条记录
            history = history.slice(0, 10);
            
            localStorage.setItem('marketAnalysisHistory', JSON.stringify(history));
            console.log('[商圈分析] 已保存到历史记录');
        } catch (error) {
            console.error('[商圈分析] 保存历史记录失败:', error);
        }
    }
    
    /**
     * 加载历史数据
     */
    loadHistoryData() {
        try {
            const history = JSON.parse(localStorage.getItem('marketAnalysisHistory') || '[]');
            console.log(`[商圈分析] 加载了 ${history.length} 条历史记录`);
            // TODO: 实现历史记录UI显示
        } catch (error) {
            console.error('[商圈分析] 加载历史记录失败:', error);
        }
    }
    
    /**
     * 获取应用状态
     */
    getAppStatus() {
        return {
            currentSection: this.currentSection,
            hasMarketData: !!this.marketData,
            hasReportData: !!this.reportData,
            isLoading: document.getElementById('market-loading-overlay')?.style.display === 'flex'
        };
    }

    /**
     * 提取文档文本内容
     * @param {Object} fileContent - 文件内容对象
     * @returns {string} - 提取的文本内容
     */
    extractDocumentText(fileContent) {
        if (!fileContent) return '';

        console.log('[商圈分析] 🔍 提取文档文本，文件类型:', fileContent.type);

        try {
            // 根据文件类型处理
            if (fileContent.type.startsWith('text/')) {
                // 纯文本文件
                return fileContent.content;
            } else if (fileContent.type.startsWith('image/')) {
                // 图片文件 - 返回文件信息供AI分析
                return `这是一个图片文件：${fileContent.name}，文件大小：${this.formatFileSize(fileContent.size)}。请分析图片中包含的商圈竞争对手信息。`;
            } else if (fileContent.type === 'application/pdf') {
                // PDF文件 - 返回文件信息供AI分析
                return `这是一个PDF文件：${fileContent.name}，文件大小：${this.formatFileSize(fileContent.size)}。请分析PDF中包含的商圈竞争对手信息。`;
            } else if (fileContent.type.includes('excel') || fileContent.type.includes('spreadsheet')) {
                // Excel文件 - 返回文件信息供AI分析
                return `这是一个Excel文件：${fileContent.name}，文件大小：${this.formatFileSize(fileContent.size)}。请分析Excel中包含的商圈竞争对手信息，包括店铺名称、产品、价格等数据。`;
            } else if (fileContent.type.includes('word') || fileContent.type.includes('document')) {
                // Word文件 - 返回文件信息供AI分析
                return `这是一个Word文档：${fileContent.name}，文件大小：${this.formatFileSize(fileContent.size)}。请分析文档中包含的商圈竞争对手信息。`;
            } else {
                // 其他文件类型
                return `这是一个文件：${fileContent.name}（${fileContent.type}），文件大小：${this.formatFileSize(fileContent.size)}。请分析文件中包含的商圈竞争对手信息。`;
            }
        } catch (error) {
            console.error('[商圈分析] 文档文本提取失败:', error);
            return `文档：${fileContent.name}，无法提取文本内容，请手动描述文档中的竞争对手信息。`;
        }
    }

    /**
     * 格式化文件大小
     * @param {number} bytes - 字节数
     * @returns {string} - 格式化的文件大小
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * 复制报告名称到剪贴板
     */
    async copyReportName() {
        try {
            if (!this.marketData || !this.marketData.storeName) {
                this.showError('无法获取店铺名称');
                return;
            }

            const reportName = `${this.marketData.storeName}商圈调研分析`;

            // 使用现代剪贴板API
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(reportName);
            } else {
                // 降级方案：使用传统方法
                const textArea = document.createElement('textarea');
                textArea.value = reportName;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                textArea.remove();
            }

            // 显示成功提示
            this.showCopySuccess(reportName);
            console.log('[商圈分析] 已复制报告名称:', reportName);

        } catch (error) {
            console.error('[商圈分析] 复制失败:', error);
            this.showError('复制失败，请手动复制');
        }
    }

    /**
     * 显示复制成功提示
     */
    showCopySuccess(reportName) {
        // 创建临时提示元素
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-size: 14px;
            max-width: 300px;
            word-break: break-all;
        `;
        toast.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            已复制：${reportName}
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
     * 初始化主题选择器
     */
    initThemeSelector() {
        const themeOptions = document.querySelectorAll('.theme-option');
        const reportSection = document.getElementById('market-report-section');

        if (!themeOptions.length || !reportSection) return;

        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                // 移除所有主题类
                reportSection.classList.remove('theme-blue', 'theme-green', 'theme-purple', 'theme-orange', 'theme-red');

                // 移除所有active状态
                themeOptions.forEach(opt => opt.classList.remove('active'));

                // 添加选中的主题类
                const theme = option.dataset.theme;
                reportSection.classList.add(`theme-${theme}`);

                // 添加active状态
                option.classList.add('active');

                // 保存主题选择到localStorage
                localStorage.setItem('marketResearchTheme', theme);

                console.log(`[商圈分析] 主题已切换为: ${theme}`);
            });
        });

        // 加载保存的主题
        const savedTheme = localStorage.getItem('marketResearchTheme') || 'blue';
        const savedThemeOption = document.querySelector(`[data-theme="${savedTheme}"]`);
        if (savedThemeOption) {
            // 延迟执行，确保DOM完全加载
            setTimeout(() => {
                savedThemeOption.click();
            }, 100);
        }

        console.log(`[商圈分析] 主题选择器已初始化，当前主题: ${savedTheme}`);
    }
}

// 当DOM加载完成后初始化商圈分析应用
document.addEventListener('DOMContentLoaded', function() {
    // 确保在品牌分析应用之后初始化，避免冲突
    setTimeout(() => {
        if (typeof MarketAnalysisApp !== 'undefined') {
            window.marketAnalysisApp = new MarketAnalysisApp();
            console.log('[商圈分析] 商圈调研分析应用已启动');
        } else {
            console.error('[商圈分析] MarketAnalysisApp类未定义');
        }
    }, 100);
});

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MarketAnalysisApp;
}
