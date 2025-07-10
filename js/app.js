/**
 * 主应用逻辑文件
 * 负责应用的初始化和整体流程控制
 */

class BrandAnalysisApp {
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
        console.log('品牌定位分析应用初始化...');
        
        // 绑定事件监听器
        this.bindEvents();
        
        // 初始化表单处理器
        if (typeof FormHandler !== 'undefined') {
            this.formHandler = new FormHandler();
        }
        
        // 初始化API客户端
        if (typeof APIClient !== 'undefined') {
            this.apiClient = new APIClient();
        }
        
        // 初始化内容生成器
        if (typeof ContentGenerator !== 'undefined') {
            this.contentGenerator = new ContentGenerator(this.apiClient);
        }
        
        // 初始化报告渲染器
        if (typeof ReportRenderer !== 'undefined') {
            this.reportRenderer = new ReportRenderer();
        }
        

        
        // 加载历史数据
        this.loadHistoryData();
        
        console.log('应用初始化完成');
    }
    
    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // 表单提交事件
        const form = document.getElementById('brand-store-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // 复制名称按钮
        const copyNameBtn = document.getElementById('brand-copyNameBtn');
        if (copyNameBtn) {
            copyNameBtn.addEventListener('click', () => this.copyReportName());
        }

        // 初始化主题选择器
        this.initThemeSelector();

        // 价格滑块事件
        const priceRange = document.getElementById('priceRange');
        const priceValue = document.getElementById('priceValue');
        if (priceRange && priceValue) {
            priceRange.addEventListener('input', (e) => {
                priceValue.textContent = e.target.value;
            });
        }
        

        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 's':
                        e.preventDefault();
                        if (this.currentSection === 'report') {
                            // PDF功能已移除
                        }
                        break;
                    case 'e':
                        e.preventDefault();
                        if (this.currentSection === 'report') {
                            this.showInputSection();
                        }
                        break;
                }
            }
        });
    }
    
    /**
     * 处理表单提交
     */
    async handleFormSubmit(event) {
        event.preventDefault();
        
        console.log('开始处理表单提交...');
        
        try {
            // 验证表单
            if (!this.formHandler.validateForm()) {
                console.log('表单验证失败');
                return;
            }
            
            // 收集表单数据
            this.storeData = this.formHandler.collectFormData();
            console.log('收集到的店铺数据:', this.storeData);

            // 保存店铺数据到localStorage供报告渲染器使用
            try {
                localStorage.setItem('brandAnalysisStoreData', JSON.stringify(this.storeData));
                console.log('[品牌分析] 店铺数据已保存到localStorage');
            } catch (error) {
                console.error('[品牌分析] 保存店铺数据到localStorage失败:', error);
            }

            // 显示加载状态
            this.showLoading();
            
            // 生成分析报告
            this.reportData = await this.contentGenerator.generateAnalysis(this.storeData);
            console.log('生成的报告数据:', this.reportData);
            
            // 渲染报告
            this.reportRenderer.renderReport(this.reportData, this.storeData);
            
            // 保存到历史记录
            this.saveToHistory(this.storeData, this.reportData);
            
            // 显示报告区域
            this.showReportSection();
            
        } catch (error) {
            console.error('生成报告时发生错误:', error);
            this.showError('生成报告失败，请检查网络连接或稍后重试。\n错误信息：' + error.message);
        } finally {
            this.hideLoading();
        }
    }
    
    /**
     * 显示输入区域
     */
    showInputSection() {
        this.currentSection = 'input';
        document.getElementById('brand-input-section').style.display = 'block';
        document.getElementById('brand-report-section').style.display = 'none';

        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    /**
     * 显示报告区域
     */
    showReportSection() {
        this.currentSection = 'report';
        document.getElementById('brand-input-section').style.display = 'none';
        document.getElementById('brand-report-section').style.display = 'block';

        // 添加动画效果
        const reportSection = document.getElementById('brand-report-section');
        reportSection.classList.add('fade-in');

        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    /**
     * 显示加载状态
     */
    showLoading() {
        const loadingOverlay = document.getElementById('brand-loading-overlay');
        const generateBtn = document.getElementById('brand-generateBtn');

        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }

        if (generateBtn) {
            generateBtn.disabled = true;
            generateBtn.querySelector('.btn-text').style.display = 'none';
            generateBtn.querySelector('.btn-loading').style.display = 'flex';
        }
    }
    
    /**
     * 隐藏加载状态
     */
    hideLoading() {
        const loadingOverlay = document.getElementById('brand-loading-overlay');
        const generateBtn = document.getElementById('brand-generateBtn');

        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }

        if (generateBtn) {
            generateBtn.disabled = false;
            generateBtn.querySelector('.btn-text').style.display = 'inline';
            generateBtn.querySelector('.btn-loading').style.display = 'none';
        }
    }
    
    /**
     * 显示错误信息
     */
    showError(message) {
        console.error('应用错误:', message);
        alert('错误：' + message);
        // TODO: 实现更优雅的错误提示UI
    }

    /**
     * 显示成功信息
     */
    showSuccess(message) {
        console.log('操作成功:', message);
        alert('成功：' + message);
        // TODO: 实现更优雅的成功提示UI
    }
    








    /**
     * 确保样式正确应用到目标元素 - 强制内联化所有样式
     */
    async ensureStylesApplied(targetElement) {
        console.log('开始强制内联化样式...');

        // 应用报告容器样式
        this.applyReportContainerStyles(targetElement);

        // 应用标题样式
        const titleElements = targetElement.querySelectorAll('.report-title, h1');
        titleElements.forEach(el => this.applyTitleStyles(el));

        // 应用店铺信息样式
        const storeInfoElements = targetElement.querySelectorAll('.store-info');
        storeInfoElements.forEach(el => this.applyStoreInfoStyles(el));

        // 应用分析区块样式
        const analysisElements = targetElement.querySelectorAll('.analysis-section');
        analysisElements.forEach(el => this.applyAnalysisSectionStyles(el));

        // 应用其他元素样式
        const h2Elements = targetElement.querySelectorAll('h2, .section-title');
        h2Elements.forEach(el => this.applySectionTitleStyles(el));

        const listElements = targetElement.querySelectorAll('ul, li');
        listElements.forEach(el => this.applyListStyles(el));

        console.log('样式内联化完成');
    }

    applyReportContainerStyles(element) {
        element.style.cssText = `
            background: #fff !important;
            border-radius: 10px !important;
            padding: 40px !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;
            font-family: 'Microsoft YaHei', Arial, sans-serif !important;
            color: #333 !important;
        `;
    }

    applyTitleStyles(element) {
        element.style.cssText = `
            color: #2d3e50 !important;
            font-size: 2rem !important;
            text-align: center !important;
            margin-bottom: 30px !important;
            border-bottom: 2px solid #e0e0e0 !important;
            padding-bottom: 15px !important;
            font-weight: bold !important;
        `;
    }

    applyStoreInfoStyles(element) {
        element.style.cssText = `
            background: #f9f9f9 !important;
            padding: 20px !important;
            border-radius: 8px !important;
            margin-bottom: 30px !important;
            border-left: 4px solid #1e88e5 !important;
        `;

        // 应用子元素样式
        const h3Elements = element.querySelectorAll('h3');
        h3Elements.forEach(h3 => {
            h3.style.cssText = `
                color: #2d3e50 !important;
                margin-bottom: 15px !important;
                font-size: 1.2rem !important;
                font-weight: bold !important;
            `;
        });

        const infoItems = element.querySelectorAll('.info-item');
        infoItems.forEach(item => {
            item.style.cssText = `
                margin-bottom: 8px !important;
                font-size: 14px !important;
            `;
        });

        const labels = element.querySelectorAll('.info-label');
        labels.forEach(label => {
            label.style.cssText = `
                font-weight: 500 !important;
                color: #2d3e50 !important;
                display: inline-block !important;
                min-width: 80px !important;
            `;
        });

        const values = element.querySelectorAll('.info-value');
        values.forEach(value => {
            value.style.cssText = `
                color: #666 !important;
            `;
        });
    }

    applyAnalysisSectionStyles(element) {
        element.style.cssText = `
            margin-bottom: 32px !important;
            padding: 25px !important;
            background: #fff !important;
            border-radius: 8px !important;
            border: 1px solid #e0e0e0 !important;
        `;
    }

    applySectionTitleStyles(element) {
        element.style.cssText = `
            color: #1e88e5 !important;
            font-size: 1.4rem !important;
            margin-bottom: 15px !important;
            padding-bottom: 8px !important;
            border-bottom: 2px solid #e0e0e0 !important;
            font-weight: bold !important;
        `;
    }

    applyListStyles(element) {
        if (element.tagName === 'UL') {
            element.style.cssText = `
                margin: 10px 0 !important;
                padding-left: 20px !important;
                list-style-type: disc !important;
            `;
        } else if (element.tagName === 'LI') {
            element.style.cssText = `
                margin: 8px 0 !important;
                line-height: 1.6 !important;
                color: #333 !important;
            `;
        }
    }
    
    /**
     * 保存到历史记录
     */
    saveToHistory(storeData, reportData) {
        try {
            const historyItem = {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                storeData,
                reportData
            };
            
            let history = JSON.parse(localStorage.getItem('brandAnalysisHistory') || '[]');
            history.unshift(historyItem);
            
            // 只保留最近10条记录
            history = history.slice(0, 10);
            
            localStorage.setItem('brandAnalysisHistory', JSON.stringify(history));
            console.log('已保存到历史记录');
        } catch (error) {
            console.error('保存历史记录失败:', error);
        }
    }
    
    /**
     * 加载历史数据
     */
    loadHistoryData() {
        try {
            const history = JSON.parse(localStorage.getItem('brandAnalysisHistory') || '[]');
            console.log(`加载了 ${history.length} 条历史记录`);
            // TODO: 实现历史记录UI显示
        } catch (error) {
            console.error('加载历史记录失败:', error);
        }
    }
    
    /**
     * 复制报告名称到剪贴板
     */
    async copyReportName() {
        try {
            if (!this.storeData || !this.storeData.storeName) {
                this.showError('无法获取店铺名称');
                return;
            }

            const reportName = `${this.storeData.storeName}品牌定位分析`;

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
            console.log('[品牌分析] 已复制报告名称:', reportName);

        } catch (error) {
            console.error('[品牌分析] 复制失败:', error);
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
        const reportSection = document.getElementById('brand-report-section');

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

                // 更新报告渲染器的主题
                if (this.reportRenderer) {
                    this.reportRenderer.updateTheme(theme);
                }

                // 保存主题选择到localStorage
                localStorage.setItem('brandAnalysisTheme', theme);

                console.log(`[品牌分析] 主题已切换为: ${theme}`);
            });
        });

        // 加载保存的主题
        const savedTheme = localStorage.getItem('brandAnalysisTheme') || 'blue';
        const savedThemeOption = document.querySelector(`[data-theme="${savedTheme}"]`);
        if (savedThemeOption) {
            // 延迟执行，确保DOM完全加载
            setTimeout(() => {
                savedThemeOption.click();
            }, 100);
        }

        console.log(`[品牌分析] 主题选择器已初始化，当前主题: ${savedTheme}`);
    }

    /**
     * 获取应用状态
     */
    getAppState() {
        return {
            currentSection: this.currentSection,
            storeData: this.storeData,
            reportData: this.reportData
        };
    }
}

// 当DOM加载完成后初始化品牌分析应用
document.addEventListener('DOMContentLoaded', () => {
    window.brandAnalysisApp = new BrandAnalysisApp();
    console.log('[品牌分析] 品牌定位分析应用已启动');
});

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BrandAnalysisApp;
}
