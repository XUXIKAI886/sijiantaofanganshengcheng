/**
 * 店铺活动方案生成 - 报告渲染器
 * 负责将生成的活动方案渲染为HTML报告
 */

class StoreActivityReportRenderer {
    constructor() {
        this.reportContainer = 'report-content';
        this.animationDelay = 100; // 动画延迟
        
        console.log('[店铺活动-渲染] 报告渲染器初始化完成');
    }
    
    /**
     * 渲染活动方案报告
     * @param {Object} reportData - 报告数据
     * @param {Object} storeData - 店铺数据
     */
    renderReport(reportData, storeData) {
        try {
            console.log('[店铺活动-渲染] 开始渲染报告...');
            
            const container = document.getElementById(this.reportContainer);
            if (!container) {
                throw new Error('找不到报告容器元素');
            }
            
            // 清空容器
            container.innerHTML = '';
            
            // 渲染报告头部
            this.renderReportHeader(container, storeData, reportData.metadata);
            
            // 渲染店铺信息概览
            this.renderStoreOverview(container, storeData);
            
            // 渲染活动方案内容
            this.renderActivityContent(container, reportData.content);
            
            // 渲染报告尾部
            this.renderReportFooter(container, reportData.metadata);
            
            // 添加动画效果
            this.addAnimations(container);
            
            console.log('[店铺活动-渲染] 报告渲染完成');
            
        } catch (error) {
            console.error('[店铺活动-渲染] 渲染报告失败:', error);
            this.renderErrorMessage(error.message);
        }
    }
    
    /**
     * 渲染报告头部
     * @param {HTMLElement} container - 容器元素
     * @param {Object} storeData - 店铺数据
     * @param {Object} metadata - 元数据
     */
    renderReportHeader(container, storeData, metadata) {
        const headerHTML = `
            <div class="report-header bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-lg mb-6 shadow-lg">
                <div class="flex items-center">
                    <div>
                        <h1 class="text-3xl font-bold mb-2" style="color: white !important;">
                            <i class="fas fa-store mr-3"></i>
                            ${storeData.storeName} - 活动方案报告
                        </h1>
                        <p class="text-orange-100 text-lg">
                            <i class="fas fa-calendar-alt mr-2"></i>
                            生成时间：${new Date(metadata.timestamp).toLocaleString('zh-CN')}
                        </p>
                    </div>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', headerHTML);
    }
    
    /**
     * 渲染店铺信息概览
     * @param {HTMLElement} container - 容器元素
     * @param {Object} storeData - 店铺数据
     */
    renderStoreOverview(container, storeData) {
        const overviewHTML = `
            <div class="store-overview bg-gradient-to-br from-orange-50 to-red-50 border-l-4 border-orange-500 p-6 rounded-lg mb-6 shadow-sm">
                <h2 class="text-2xl font-bold text-gray-800 mb-4">
                    <i class="fas fa-info-circle text-orange-500 mr-2"></i>
                    店铺信息概览
                </h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="info-item">
                        <div class="flex items-center mb-2">
                            <i class="fas fa-store-alt text-orange-500 mr-2"></i>
                            <span class="font-semibold text-gray-700">店铺名称</span>
                        </div>
                        <p class="text-gray-600 ml-6">${storeData.storeName}</p>
                    </div>
                    
                    <div class="info-item">
                        <div class="flex items-center mb-2">
                            <i class="fas fa-map-marker-alt text-red-500 mr-2"></i>
                            <span class="font-semibold text-gray-700">店铺地址</span>
                        </div>
                        <p class="text-gray-600 ml-6">${storeData.storeAddress}</p>
                    </div>
                    
                    <div class="info-item">
                        <div class="flex items-center mb-2">
                            <i class="fas fa-utensils text-green-500 mr-2"></i>
                            <span class="font-semibold text-gray-700">经营品类</span>
                        </div>
                        <p class="text-gray-600 ml-6">${storeData.businessCategory}</p>
                    </div>
                    
                    <div class="info-item">
                        <div class="flex items-center mb-2">
                            <i class="fas fa-clock text-blue-500 mr-2"></i>
                            <span class="font-semibold text-gray-700">营业时间</span>
                        </div>
                        <p class="text-gray-600 ml-6">${storeData.businessHours}</p>
                    </div>
                </div>
                
                <div class="mt-4 pt-4 border-t border-orange-200">
                    <div class="flex items-center">
                        <i class="fas fa-list-ul text-purple-500 mr-2"></i>
                        <span class="font-semibold text-gray-700">菜品数量</span>
                        <span class="ml-2 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm font-medium">
                            ${storeData.menuItems?.length || 0} 个菜品
                        </span>
                    </div>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', overviewHTML);
    }
    
    /**
     * 渲染活动方案内容
     * @param {HTMLElement} container - 容器元素
     * @param {string} content - 活动方案内容
     */
    renderActivityContent(container, content) {
        const contentHTML = `
            <div class="activity-content bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
                <div class="content-body prose max-w-none">
                    ${this.enhanceContent(content)}
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', contentHTML);
    }
    
    /**
     * 增强内容显示效果
     * @param {string} content - 原始内容
     * @returns {string} - 增强后的内容
     */
    enhanceContent(content) {
        let enhancedContent = content;
        
        // 增强标题样式
        enhancedContent = enhancedContent.replace(
            /<h3([^>]*)>/g, 
            '<h3$1 class="text-xl font-bold text-orange-600 mt-6 mb-3 flex items-center"><i class="fas fa-chevron-right text-orange-400 mr-2"></i>'
        );
        
        enhancedContent = enhancedContent.replace(/<\/h3>/g, '</h3>');
        
        // 增强列表样式
        enhancedContent = enhancedContent.replace(
            /<ul([^>]*)>/g, 
            '<ul$1 class="list-none space-y-3 ml-4">'
        );
        
        enhancedContent = enhancedContent.replace(
            /<li>/g, 
            '<li class="flex items-start"><i class="fas fa-check-circle text-green-500 mr-2 mt-1 flex-shrink-0"></i><span>'
        );
        
        enhancedContent = enhancedContent.replace(/<\/li>/g, '</span></li>');
        
        // 增强段落样式
        enhancedContent = enhancedContent.replace(
            /<p([^>]*)>/g, 
            '<p$1 class="text-gray-700 leading-relaxed mb-4">'
        );
        
        // 添加活动卡片样式
        enhancedContent = this.wrapActivitySections(enhancedContent);
        
        return enhancedContent;
    }
    
    /**
     * 包装活动部分为卡片
     * @param {string} content - 内容
     * @returns {string} - 包装后的内容
     */
    wrapActivitySections(content) {
        const sections = [
            { keyword: '满减活动', icon: 'fas fa-tags', color: 'blue' },
            { keyword: '减配送费', icon: 'fas fa-shipping-fast', color: 'green' },
            { keyword: '返券活动', icon: 'fas fa-ticket-alt', color: 'purple' },
            { keyword: '套餐搭配', icon: 'fas fa-utensils', color: 'orange' }
        ];
        
        sections.forEach(section => {
            const regex = new RegExp(
                `(<h3[^>]*>${section.keyword}[^<]*</h3>)(.*?)(?=<h3|$)`, 
                'gs'
            );
            
            content = content.replace(regex, (match, title, body) => {
                return `
                    <div class="activity-section bg-gradient-to-br from-${section.color}-50 to-${section.color}-100 border-l-4 border-${section.color}-500 rounded-lg p-5 mb-6 shadow-sm">
                        <div class="flex items-center mb-4">
                            <i class="${section.icon} text-${section.color}-600 text-xl mr-3"></i>
                            ${title.replace('<h3', '<h3 class="text-xl font-bold text-' + section.color + '-800 mb-0"')}
                        </div>
                        <div class="content-body ml-8">
                            ${body}
                        </div>
                    </div>
                `;
            });
        });
        
        return content;
    }
    
    /**
     * 渲染报告尾部
     * @param {HTMLElement} container - 容器元素
     * @param {Object} metadata - 元数据
     */
    renderReportFooter(container, metadata) {
        const footerHTML = `
            <div class="report-footer bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
                <div class="flex items-center justify-center">
                    <div class="text-center">
                        <p class="text-xs text-gray-500">
                            本报告由呈尚策划运营部生成，会结合店铺实际情况进行调整和优化
                        </p>
                    </div>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', footerHTML);
    }
    
    /**
     * 添加动画效果
     * @param {HTMLElement} container - 容器元素
     */
    addAnimations(container) {
        const elements = container.querySelectorAll('.report-header, .store-overview, .activity-content, .activity-section, .report-footer');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease-out';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * this.animationDelay);
        });
    }
    
    /**
     * 渲染错误消息
     * @param {string} message - 错误消息
     */
    renderErrorMessage(message) {
        const container = document.getElementById(this.reportContainer);
        if (!container) return;
        
        const errorHTML = `
            <div class="error-message bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div class="mb-4">
                    <i class="fas fa-exclamation-triangle text-red-500 text-4xl"></i>
                </div>
                <h3 class="text-xl font-bold text-red-800 mb-2">报告生成失败</h3>
                <p class="text-red-600 mb-4">${message}</p>
                <button onclick="window.storeActivityApp?.newAnalysis()" 
                        class="btn bg-red-500 text-white hover:bg-red-600">
                    <i class="fas fa-redo mr-2"></i>
                    重新生成
                </button>
            </div>
        `;
        
        container.innerHTML = errorHTML;
    }
    
    /**
     * 清空报告内容
     */
    clearReport() {
        const container = document.getElementById(this.reportContainer);
        if (container) {
            container.innerHTML = '';
        }
    }
    
    /**
     * 导出报告为HTML
     * @returns {string} - HTML内容
     */
    exportReportHTML() {
        const container = document.getElementById(this.reportContainer);
        if (!container) return '';
        
        return container.innerHTML;
    }
    
    /**
     * 打印报告
     */
    printReport() {
        const container = document.getElementById(this.reportContainer);
        if (!container) return;
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>店铺活动方案报告</title>
                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                <style>
                    @media print {
                        body { font-size: 12px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body class="bg-white">
                ${container.innerHTML}
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.print();
    }
}

// 确保类在全局作用域中可用
window.StoreActivityReportRenderer = StoreActivityReportRenderer;

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StoreActivityReportRenderer;
}
