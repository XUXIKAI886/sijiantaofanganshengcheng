/**
 * 报告渲染器
 * 负责将生成的分析内容渲染为美观的HTML报告
 */

class ReportRenderer {
    constructor() {
        this.reportContainer = document.getElementById('brand-report-content');
    }
    
    /**
     * 渲染完整报告
     * @param {Object} reportData - 报告数据
     * @param {Object} storeData - 店铺数据
     */
    renderReport(reportData, storeData) {
        if (!this.reportContainer) {
            throw new Error('报告容器未找到');
        }

        // 检查是否是示例报告，如果是就不要覆盖
        if (this.reportContainer.getAttribute('data-sample-report') === 'true') {
            console.log('[品牌分析] 检测到示例报告，跳过渲染');
            return;
        }

        console.log('开始渲染报告...', reportData);

        try {
            // 清空容器
            this.reportContainer.innerHTML = '';
            
            // 渲染报告标题
            this.renderReportTitle(storeData);
            
            // 渲染店铺基本信息
            this.renderStoreInfo(storeData);
            
            // 渲染分析内容
            this.renderAnalysisContent(reportData.content);
            
            // 渲染报告元数据（可选）
            if (reportData.metadata) {
                this.renderMetadata(reportData.metadata);
            }
            
            // 添加动画效果
            this.addAnimations();
            
            console.log('报告渲染完成');
            
        } catch (error) {
            console.error('报告渲染失败:', error);
            this.renderError('报告渲染失败: ' + error.message);
        }
    }
    
    /**
     * 渲染报告标题
     * @param {Object} storeData - 店铺数据
     */
    renderReportTitle(storeData) {
        console.log('[品牌分析] 开始渲染报告标题 - 应用主题变量');
        const titleHTML = `
            <div class="brand-report-header-section" style="
                text-align: center;
                margin-bottom: 3rem;
                padding: 2.5rem 0;
                background: linear-gradient(135deg, var(--theme-primary, #1E3A8A), var(--theme-secondary, #3B82F6)) !important;
                color: white !important;
                border-radius: 16px !important;
                box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
            ">
                <h1 class="brand-report-title" style="
                    font-size: 2.8rem !important;
                    font-weight: 800 !important;
                    margin: 0 0 0.5rem 0 !important;
                    color: white !important;
                    letter-spacing: 0.5px !important;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
                ">${storeData.storeName ? `${storeData.storeName} 品牌定位分析报告` : '品牌定位分析报告'}</h1>
                <p class="brand-report-subtitle" style="
                    font-size: 1.3rem !important;
                    margin: 0 !important;
                    color: white !important;
                    font-weight: 500 !important;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.15) !important;
                ">${storeData.category || storeData.location || '呈尚策划运营部专业分析'}</p>
            </div>
        `;

        this.reportContainer.insertAdjacentHTML('beforeend', titleHTML);
    }
    
    /**
     * 渲染店铺基本信息
     * @param {Object} storeData - 店铺数据
     */
    renderStoreInfo(storeData) {
        const infoHTML = `
            <div class="store-info" style="
                background: white;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                margin-bottom: 30px;
                border: 1px solid var(--theme-accent, #E5E7EB);
            ">
                <h3 class="store-info-title" style="
                    color: var(--theme-primary, #1E3A8A);
                    font-size: 1.6rem;
                    font-weight: 600;
                    margin: 0 0 25px 0;
                    padding-bottom: 15px;
                    border-bottom: 2px solid var(--theme-accent, #E5E7EB);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                ">
                    <span style="
                        background: var(--theme-primary, #1E3A8A);
                        color: white;
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 16px;
                    ">🏪</span>
                    店铺基本信息
                </h3>
                <div class="info-grid" style="
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                ">
                    <div class="info-item store-name" style="
                        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                        padding: 20px;
                        border-radius: 10px;
                        border: 1px solid var(--theme-accent, #E5E7EB);
                        display: flex;
                        align-items: center;
                        gap: 15px;
                    ">
                        <div class="info-icon" style="
                            background: var(--theme-primary, #1E3A8A);
                            color: white;
                            width: 40px;
                            height: 40px;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 16px;
                        ">
                            🏢
                        </div>
                        <div class="info-content" style="flex: 1;">
                            <span class="info-label" style="
                                display: block;
                                color: #666;
                                font-size: 14px;
                                margin-bottom: 5px;
                            ">店铺名称</span>
                            <span class="info-value" style="
                                color: var(--theme-primary, #1E3A8A);
                                font-weight: 600;
                                font-size: 16px;
                            ">${storeData.storeName}</span>
                        </div>
                    </div>
                    ${storeData.category ? `
                    <div class="info-item category" style="
                        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                        padding: 20px;
                        border-radius: 10px;
                        border: 1px solid var(--theme-accent, #E5E7EB);
                        display: flex;
                        align-items: center;
                        gap: 15px;
                    ">
                        <div class="info-icon" style="
                            background: var(--theme-primary, #1E3A8A);
                            color: white;
                            width: 40px;
                            height: 40px;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 16px;
                        ">
                            🍽️
                        </div>
                        <div class="info-content" style="flex: 1;">
                            <span class="info-label" style="
                                display: block;
                                color: #666;
                                font-size: 14px;
                                margin-bottom: 5px;
                            ">经营品类</span>
                            <span class="info-value" style="
                                color: var(--theme-primary, #1E3A8A);
                                font-weight: 600;
                                font-size: 16px;
                            ">${storeData.category}</span>
                        </div>
                    </div>
                    ` : ''}
                    ${this.renderInfoItem(storeData.address, '店铺地址', '📍', storeData.address)}
                    ${this.renderInfoItem(storeData.targetGroup, '目标客群', '👥', storeData.targetGroup)}
                    ${this.renderInfoItem(storeData.priceRange, '价格区间', '💰', `人均 ${storeData.priceRange} 元`)}
                    ${this.renderInfoItem(storeData.mainProducts, '主营产品', '🍔', storeData.mainProducts)}
                    ${this.renderInfoItem(storeData.features, '经营特色', '⭐', storeData.features)}
                </div>
            </div>
        `;

        this.reportContainer.insertAdjacentHTML('beforeend', infoHTML);
    }

    /**
     * 渲染信息项的辅助方法
     * @param {string} condition - 条件值
     * @param {string} label - 标签
     * @param {string} icon - 图标
     * @param {string} value - 值
     * @returns {string} - HTML字符串
     */
    renderInfoItem(condition, label, icon, value) {
        if (!condition) return '';

        return `
            <div class="info-item" style="
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                padding: 20px;
                border-radius: 10px;
                border: 1px solid var(--theme-accent, #E5E7EB);
                display: flex;
                align-items: center;
                gap: 15px;
            ">
                <div class="info-icon" style="
                    background: var(--theme-primary, #1E3A8A);
                    color: white;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                ">
                    ${icon}
                </div>
                <div class="info-content" style="flex: 1;">
                    <span class="info-label" style="
                        display: block;
                        color: #666;
                        font-size: 14px;
                        margin-bottom: 5px;
                    ">${label}</span>
                    <span class="info-value" style="
                        color: var(--theme-primary, #1E3A8A);
                        font-weight: 600;
                        font-size: 16px;
                    ">${value}</span>
                </div>
            </div>
        `;
    }

    /**
     * 渲染分析内容
     * @param {string} content - 分析内容HTML
     */
    renderAnalysisContent(content) {
        if (!content) {
            this.renderError('分析内容为空');
            return;
        }

        try {
            // 检查内容格式 - 新的HTML格式 vs 旧的文本格式
            if (content && typeof content === 'string') {
                console.log('[品牌分析] 渲染HTML格式内容');
                // 使用完整的HTML包装器渲染内容
                this.renderHTMLContent(content);
            } else {
                console.log('[品牌分析] 使用旧的格式化方法');
                // 旧格式：使用基础格式化
                this.renderBasicContent(content);
            }

        } catch (error) {
            console.error('分析内容渲染失败:', error);
            this.renderError('分析内容格式错误: ' + error.message);
        }
    }

    /**
     * 渲染HTML格式的内容（新方法，参考商圈调研实现）
     * @param {string} htmlContent - HTML内容
     */
    renderHTMLContent(htmlContent) {
        // 格式化AI返回的文本内容
        const formattedContent = this.formatAIContent(htmlContent);

        // 获取店铺数据用于标题栏
        const storeData = this.getStoreDataFromStorage();

        // 为HTML内容添加完整的样式包装，包含标题栏
        const wrappedHTML = `
            <div class="brand-report-wrapper" style="
                max-width: 1200px;
                margin: 0 auto;
                line-height: 1.6;
                color: #333333;
                font-family: 'Microsoft YaHei', Arial, sans-serif;
            ">
                <!-- 标题栏 -->
                <div class="brand-report-header-section" style="
                    text-align: center;
                    margin-bottom: 3rem;
                    padding: 2.5rem 0;
                    background: linear-gradient(135deg, var(--theme-primary, #1E3A8A), var(--theme-secondary, #3B82F6));
                    color: white;
                    border-radius: 16px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                ">
                    <h1 class="brand-report-title" style="
                        font-size: 2.8rem !important;
                        font-weight: 800 !important;
                        margin: 0 0 0.5rem 0 !important;
                        color: white !important;
                        letter-spacing: 0.5px !important;
                        text-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
                    ">${storeData?.storeName ? `${storeData.storeName} 品牌定位分析报告` : '品牌定位分析报告'}</h1>
                    <p class="brand-report-subtitle" style="
                        font-size: 1.3rem !important;
                        margin: 0 !important;
                        color: white !important;
                        font-weight: 500 !important;
                        text-shadow: 0 1px 2px rgba(0,0,0,0.15) !important;
                    ">${storeData?.category || '呈尚策划运营部专业分析'}</p>
                </div>

                <!-- AI生成的内容 -->
                <div class="brand-ai-content" style="
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    margin-bottom: 2rem;
                    border: 1px solid var(--theme-accent, #E5E7EB);
                ">
                    ${formattedContent}
                </div>
            </div>
        `;

        this.reportContainer.innerHTML = wrappedHTML;
    }

    /**
     * 渲染基础内容（旧方法，保持向后兼容）
     * @param {string} content - 内容
     */
    renderBasicContent(content) {
        // 创建分析内容容器
        const analysisContainer = document.createElement('div');
        analysisContainer.className = 'analysis-container';

        // 格式化AI返回的内容
        const formattedContent = this.formatAIContent(content);

        // 插入格式化后的HTML内容
        analysisContainer.innerHTML = formattedContent;

        // 验证和修复HTML结构
        this.validateAndFixHTML(analysisContainer);

        // 添加到报告容器
        this.reportContainer.appendChild(analysisContainer);
    }

    /**
     * 格式化AI返回的文本内容
     * @param {string} content - AI返回的原始文本
     * @returns {string} - 格式化后的HTML
     */
    formatAIContent(content) {
        if (!content || typeof content !== 'string') {
            return '<p style="margin: 1rem 0; line-height: 1.6; color: #666;">暂无内容</p>';
        }

        // 如果内容已经包含HTML标签，进行基础清理后返回
        if (content.includes('<') && content.includes('>')) {
            return this.enhanceExistingHTML(content);
        }

        // 将纯文本转换为HTML格式
        let formattedContent = content
            // 转义HTML特殊字符
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            // 处理主标题（一、二、三等）
            .replace(/^([一二三四五六七八九十]+[、．.]?\s*.+)$/gm, '<h2 style="color: var(--theme-primary, #1E3A8A); font-weight: 700; margin: 2rem 0 1rem 0; font-size: 1.4rem; border-bottom: 3px solid var(--theme-primary, #1E3A8A); padding-bottom: 0.8rem; background: linear-gradient(90deg, var(--theme-light, #EFF6FF) 0%, transparent 100%); padding-left: 1rem;">$1</h2>')
            // 处理数字标题（1. 2. 3.等）
            .replace(/^(\d+\.\s*.+)$/gm, '<h3 style="color: var(--theme-secondary, #3B82F6); font-weight: 600; margin: 1.5rem 0 1rem 0; font-size: 1.2rem; border-left: 4px solid var(--theme-secondary, #3B82F6); padding-left: 1rem; background: var(--theme-bg, #F8FAFC);">$1</h3>')
            // 处理子标题（以字母或中文开头，后跟冒号的行）
            .replace(/^([A-Za-z\u4e00-\u9fa5]+[：:].*)$/gm, '<h4 style="color: var(--theme-secondary, #60A5FA); font-weight: 500; margin: 1rem 0 0.5rem 0; font-size: 1.1rem; padding: 0.5rem 0; border-bottom: 1px solid var(--theme-accent, #E5E7EB);">$1</h4>')
            // 处理列表项（以-或•开头的行）
            .replace(/^[-•]\s*(.+)$/gm, '<li style="margin: 0.5rem 0; padding: 0.3rem 0.5rem; background: var(--theme-bg, #F9FAFB); border-left: 3px solid var(--theme-secondary, #60A5FA); border-radius: 0 4px 4px 0;">$1</li>')
            // 处理评分（数字/数字格式）
            .replace(/(\d+\/\d+)/g, '<span style="background: linear-gradient(135deg, var(--theme-secondary, #3B82F6), var(--theme-secondary, #60A5FA)); color: white; padding: 0.3rem 0.6rem; border-radius: 6px; font-weight: 600; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);">$1</span>')
            // 处理强调文本（加粗）
            .replace(/\*\*(.+?)\*\*/g, '<strong style="color: var(--theme-primary, #1E3A8A); background: var(--theme-light, #EFF6FF); padding: 0.2rem 0.4rem; border-radius: 4px; font-weight: 600;">$1</strong>')
            // 处理双换行为段落分隔
            .replace(/\n\s*\n/g, '</p><p style="margin: 1rem 0; line-height: 1.8; color: var(--theme-text, #374151); text-align: justify;">')
            // 处理单换行为<br>
            .replace(/\n/g, '<br>');

        // 包装在段落标签中
        if (!formattedContent.startsWith('<')) {
            formattedContent = '<p style="margin: 1rem 0; line-height: 1.8; color: var(--theme-text, #374151); text-align: justify;">' + formattedContent + '</p>';
        }

        // 处理连续的列表项，包装在ul标签中
        formattedContent = formattedContent.replace(/(<li[^>]*>.*?<\/li>)(\s*<li[^>]*>.*?<\/li>)*/g, function(match) {
            return '<ul style="margin: 1.5rem 0; padding-left: 0; list-style: none; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">' + match + '</ul>';
        });

        // 清理多余的段落标签
        formattedContent = formattedContent
            .replace(/<p[^>]*><\/p>/g, '')
            .replace(/<p[^>]*>\s*<h/g, '<h')
            .replace(/<\/h(\d)>\s*<\/p>/g, '</h$1>');

        return formattedContent;
    }

    /**
     * 增强现有HTML内容的样式
     * @param {string} htmlContent - 现有HTML内容
     * @returns {string} - 增强后的HTML
     */
    enhanceExistingHTML(htmlContent) {
        // 为现有HTML添加基础样式
        return htmlContent
            .replace(/<h1([^>]*)>/g, '<h1$1 style="color: #1E3A8A; font-weight: 700; margin: 2rem 0 1rem 0; font-size: 1.6rem; text-align: center;">')
            .replace(/<h2([^>]*)>/g, '<h2$1 style="color: #1E3A8A; font-weight: 700; margin: 2rem 0 1rem 0; font-size: 1.4rem; border-bottom: 3px solid #1E3A8A; padding-bottom: 0.8rem;">')
            .replace(/<h3([^>]*)>/g, '<h3$1 style="color: #3B82F6; font-weight: 600; margin: 1.5rem 0 1rem 0; font-size: 1.2rem; border-left: 4px solid #3B82F6; padding-left: 1rem;">')
            .replace(/<h4([^>]*)>/g, '<h4$1 style="color: #60A5FA; font-weight: 500; margin: 1rem 0 0.5rem 0; font-size: 1.1rem;">')
            .replace(/<p([^>]*)>/g, '<p$1 style="margin: 1rem 0; line-height: 1.8; color: #374151; text-align: justify;">')
            .replace(/<ul([^>]*)>/g, '<ul$1 style="margin: 1.5rem 0; padding-left: 2rem; list-style-type: disc;">')
            .replace(/<li([^>]*)>/g, '<li$1 style="margin: 0.5rem 0; line-height: 1.6;">');
    }

    /**
     * 验证和修复HTML结构
     * @param {HTMLElement} container - 容器元素
     */
    validateAndFixHTML(container) {
        // 确保所有分析区块都有正确的类名
        const sections = container.querySelectorAll('div');
        sections.forEach((section, index) => {
            if (!section.className.includes('analysis-section')) {
                section.className = 'analysis-section';
            }
        });
        
        // 确保所有标题都有正确的类名
        const titles = container.querySelectorAll('h2');
        titles.forEach(title => {
            if (!title.className.includes('section-title')) {
                title.className = 'section-title';
            }
        });
        
        // 处理列表项，添加强调样式
        const listItems = container.querySelectorAll('li');
        listItems.forEach(item => {
            const text = item.textContent;
            
            // 检测并高亮关键词
            const keywords = ['建议', '优势', '劣势', '特点', '策略', '分析', '改进'];
            keywords.forEach(keyword => {
                if (text.includes(keyword + '：') || text.includes(keyword + ':')) {
                    const regex = new RegExp(`(${keyword}[：:])`, 'g');
                    item.innerHTML = item.innerHTML.replace(regex, '<strong>$1</strong>');
                }
            });
        });
    }
    
    /**
     * 渲染元数据信息（已禁用）
     * @param {Object} metadata - 元数据
     */
    renderMetadata(metadata) {
        // 不再渲染底部的报告信息
        // 保留方法以避免调用错误，但不执行任何操作
    }
    
    /**
     * 渲染错误信息
     * @param {string} message - 错误消息
     */
    renderError(message) {
        const errorHTML = `
            <div class="error-container">
                <div class="error-icon">⚠️</div>
                <h3>报告生成出现问题</h3>
                <p class="error-message">${message}</p>
                <div class="error-actions">
                    <button onclick="window.brandAnalysisApp.showInputSection()" class="btn btn-primary">
                        返回重新生成
                    </button>
                </div>
            </div>
        `;
        
        this.reportContainer.innerHTML = errorHTML;
    }
    
    /**
     * 添加动画效果
     */
    addAnimations() {
        // 为分析区块添加渐入动画
        const sections = this.reportContainer.querySelectorAll('.analysis-section');
        sections.forEach((section, index) => {
            section.style.animationDelay = `${index * 0.1}s`;
            section.classList.add('fade-in');
        });
        
        // 为报告容器添加整体动画
        this.reportContainer.classList.add('report-fade-in');
    }
    
    /**
     * 获取报告HTML（用于PDF导出）
     * @returns {string} - 完整的报告HTML
     */
    getReportHTML() {
        if (!this.reportContainer) {
            return '';
        }
        
        // 克隆容器以避免修改原始内容
        const clone = this.reportContainer.cloneNode(true);
        
        // 移除动画类（PDF不需要）
        const animatedElements = clone.querySelectorAll('.fade-in, .report-fade-in');
        animatedElements.forEach(el => {
            el.classList.remove('fade-in', 'report-fade-in');
        });
        
        return clone.innerHTML;
    }
    
    /**
     * 清空报告内容
     */
    clearReport() {
        if (this.reportContainer) {
            this.reportContainer.innerHTML = '';
        }
    }
    
    /**
     * 更新报告样式主题
     * @param {string} theme - 主题名称
     */
    updateTheme(theme) {
        console.log('品牌分析报告主题切换:', theme);

        // 获取报告容器
        const reportContainer = this.reportContainer;
        if (!reportContainer) {
            console.warn('报告容器未找到，无法切换主题');
            return;
        }

        // 主题配置
        const themes = {
            blue: {
                primary: '#1E3A8A',
                secondary: '#3B82F6',
                accent: '#E5E7EB',
                light: '#EFF6FF',
                text: '#374151',
                bg: '#F8FAFC'
            },
            green: {
                primary: '#059669',
                secondary: '#10B981',
                accent: '#D1FAE5',
                light: '#ECFDF5',
                text: '#374151',
                bg: '#F0FDF4'
            },
            purple: {
                primary: '#7C3AED',
                secondary: '#8B5CF6',
                accent: '#E9D5FF',
                light: '#F3E8FF',
                text: '#374151',
                bg: '#FAF5FF'
            },
            orange: {
                primary: '#EA580C',
                secondary: '#F97316',
                accent: '#FED7AA',
                light: '#FFF7ED',
                text: '#374151',
                bg: '#FFFBEB'
            },
            red: {
                primary: '#DC2626',
                secondary: '#EF4444',
                accent: '#FECACA',
                light: '#FEF2F2',
                text: '#374151',
                bg: '#FFFBFB'
            }
        };

        const themeColors = themes[theme] || themes.blue;

        // 更新CSS变量
        const root = document.documentElement;
        root.style.setProperty('--theme-primary', themeColors.primary);
        root.style.setProperty('--theme-secondary', themeColors.secondary);
        root.style.setProperty('--theme-accent', themeColors.accent);
        root.style.setProperty('--theme-light', themeColors.light);
        root.style.setProperty('--theme-text', themeColors.text);
        root.style.setProperty('--theme-bg', themeColors.bg);

        console.log('品牌分析报告主题已切换到:', theme);
    }

    /**
     * 从localStorage获取店铺数据
     * @returns {Object|null} - 店铺数据对象或null
     */
    getStoreDataFromStorage() {
        try {
            const storeDataStr = localStorage.getItem('brandAnalysisStoreData');
            if (storeDataStr) {
                return JSON.parse(storeDataStr);
            }
        } catch (error) {
            console.error('[品牌分析] 从localStorage获取店铺数据失败:', error);
        }
        return null;
    }
}

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReportRenderer;
}
