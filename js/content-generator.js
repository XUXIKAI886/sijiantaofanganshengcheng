/**
 * 内容生成器
 * 协调API调用和内容生成流程
 */

class ContentGenerator {
    constructor(apiClient) {
        this.apiClient = apiClient;
        this.isGenerating = false;
    }
    
    /**
     * 生成品牌定位分析
     * @param {Object} storeData - 店铺数据
     * @returns {Promise<Object>} - 生成的分析报告数据
     */
    async generateAnalysis(storeData) {
        if (this.isGenerating) {
            throw new Error('正在生成中，请稍候...');
        }
        
        this.isGenerating = true;
        
        try {
            console.log('开始生成品牌定位分析...', storeData);
            
            // 验证数据
            const validation = PromptTemplate.validateStoreData(storeData);
            if (!validation.isValid) {
                throw new Error('数据验证失败: ' + validation.errors.join(', '));
            }
            
            // 显示警告信息
            if (validation.warnings.length > 0) {
                console.warn('数据警告:', validation.warnings);
            }
            
            // 构建提示词
            const prompt = PromptTemplate.buildAnalysisPrompt(storeData);
            console.log('提示词构建完成，长度:', prompt.length);
            
            // 获取提示词统计
            const promptStats = PromptTemplate.getPromptStats(prompt);
            console.log('提示词统计:', promptStats);
            
            // 调用API生成内容
            const rawContent = await this.apiClient.generateContent(prompt, {
                temperature: 0.7,
                max_tokens: 4096
            });
            
            console.log('API调用成功，原始内容长度:', rawContent.length);
            
            // 处理和验证生成的内容
            const processedContent = this.processGeneratedContent(rawContent);
            
            // 构建报告数据
            const reportData = {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                storeData,
                content: processedContent,
                rawContent,
                promptStats,
                metadata: {
                    generationTime: Date.now(),
                    apiModel: this.apiClient.config.model,
                    contentLength: processedContent.length
                }
            };
            
            console.log('品牌定位分析生成完成');
            return reportData;
            
        } catch (error) {
            console.error('生成品牌定位分析失败:', error);
            throw new Error(`生成失败: ${error.message}`);
        } finally {
            this.isGenerating = false;
        }
    }
    
    /**
     * 处理生成的内容
     * @param {string} rawContent - 原始生成内容
     * @returns {string} - 处理后的内容
     */
    processGeneratedContent(rawContent) {
        let content = rawContent.trim();
        
        // 移除可能的markdown代码块标记
        content = content.replace(/^```html\s*/i, '');
        content = content.replace(/\s*```$/i, '');
        
        // 移除可能的额外空行
        content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
        
        // 验证HTML结构
        if (!this.validateHTMLStructure(content)) {
            console.warn('生成的内容HTML结构可能不完整');
            // 尝试修复基本结构
            content = this.fixHTMLStructure(content);
        }
        
        return content;
    }
    
    /**
     * 验证HTML结构
     * @param {string} content - HTML内容
     * @returns {boolean} - 是否有效
     */
    validateHTMLStructure(content) {
        // 检查是否包含必要的HTML标签
        const requiredPatterns = [
            /<div[^>]*class="analysis-section"[^>]*>/i,
            /<h2[^>]*class="section-title"[^>]*>/i,
            /<ul>/i,
            /<li>/i
        ];
        
        return requiredPatterns.every(pattern => pattern.test(content));
    }
    
    /**
     * 修复HTML结构
     * @param {string} content - 原始内容
     * @returns {string} - 修复后的内容
     */
    fixHTMLStructure(content) {
        // 如果内容不包含HTML标签，尝试转换为HTML格式
        if (!content.includes('<div') && !content.includes('<h2')) {
            console.log('尝试将纯文本转换为HTML格式');
            return this.convertTextToHTML(content);
        }
        
        return content;
    }
    
    /**
     * 将纯文本转换为HTML格式
     * @param {string} text - 纯文本内容
     * @returns {string} - HTML格式内容
     */
    convertTextToHTML(text) {
        if (!text || typeof text !== 'string') {
            return '<div class="analysis-section"><p>暂无内容</p></div>';
        }

        // 如果内容已经包含HTML标签，直接返回
        if (text.includes('<div class="analysis-section">') || text.includes('<h2 class="section-title">')) {
            return text;
        }

        // 按行分割文本
        const lines = text.split('\n').filter(line => line.trim());
        let html = '';
        let currentSection = null;
        let inList = false;
        let currentContent = '';

        for (const line of lines) {
            const trimmedLine = line.trim();

            // 检测中文标题（一、二、三等）
            const chineseTitleMatch = trimmedLine.match(/^([一二三四五六七八九十]、.+)/);
            if (chineseTitleMatch) {
                // 关闭之前的列表和区块
                if (inList) {
                    currentContent += '</ul>\n';
                    inList = false;
                }
                if (currentSection) {
                    html += `<div class="analysis-section">\n<h2 class="section-title">${currentSection}</h2>\n${currentContent}</div>\n\n`;
                }

                // 开始新区块
                currentSection = chineseTitleMatch[1];
                currentContent = '';
                continue;
            }

            // 检测数字标题（1. 2. 3.等）
            const numberTitleMatch = trimmedLine.match(/^(\d+\.\s*.+)/);
            if (numberTitleMatch) {
                if (inList) {
                    currentContent += '</ul>\n';
                    inList = false;
                }
                currentContent += `<h3>${numberTitleMatch[1]}</h3>\n`;
                continue;
            }

            // 检测子标题（冒号结尾）
            const subTitleMatch = trimmedLine.match(/^([A-Za-z\u4e00-\u9fa5]+[：:].*)$/);
            if (subTitleMatch) {
                if (inList) {
                    currentContent += '</ul>\n';
                    inList = false;
                }
                currentContent += `<h3>${subTitleMatch[1]}</h3>\n`;
                continue;
            }

            // 检测列表项（-、•、*开头）
            const listItemMatch = trimmedLine.match(/^[-•*]\s*(.+)/);
            if (listItemMatch) {
                if (!inList) {
                    currentContent += '<ul>\n';
                    inList = true;
                }
                let listContent = listItemMatch[1];
                // 处理评分格式
                listContent = listContent.replace(/(\d+\/\d+)/g, '<span class="highlight">$1</span>');
                // 处理强调文本
                listContent = listContent.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
                currentContent += `<li>${listContent}</li>\n`;
                continue;
            }

            // 检测数字列表（1. 2. 3.开头的列表项）
            const numberListMatch = trimmedLine.match(/^\d+\.\s*(.+)/);
            if (numberListMatch && currentSection) {
                if (!inList) {
                    currentContent += '<ul>\n';
                    inList = true;
                }
                let listContent = numberListMatch[1];
                // 处理评分格式
                listContent = listContent.replace(/(\d+\/\d+)/g, '<span class="highlight">$1</span>');
                // 处理强调文本
                listContent = listContent.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
                currentContent += `<li>${listContent}</li>\n`;
                continue;
            }

            // 普通段落
            if (trimmedLine && currentSection) {
                if (inList) {
                    currentContent += '</ul>\n';
                    inList = false;
                }
                let paragraphContent = trimmedLine;
                // 处理评分格式
                paragraphContent = paragraphContent.replace(/(\d+\/\d+)/g, '<span class="highlight">$1</span>');
                // 处理强调文本
                paragraphContent = paragraphContent.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
                currentContent += `<p>${paragraphContent}</p>\n`;
            }
        }

        // 关闭最后的标签
        if (inList) {
            currentContent += '</ul>\n';
        }
        if (currentSection) {
            html += `<div class="analysis-section">\n<h2 class="section-title">${currentSection}</h2>\n${currentContent}</div>\n`;
        }

        // 如果没有识别到任何结构，将整个内容包装为一个分析区块
        if (!html.trim()) {
            let formattedText = text
                // 处理评分格式
                .replace(/(\d+\/\d+)/g, '<span class="highlight">$1</span>')
                // 处理强调文本
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                // 处理换行
                .replace(/\n\s*\n/g, '</p><p>')
                .replace(/\n/g, '<br>');

            html = `<div class="analysis-section">\n<h2 class="section-title">品牌分析报告</h2>\n<p>${formattedText}</p>\n</div>`;
        }

        return html;
    }
    
    /**
     * 生成简化版分析（用于测试）
     * @param {Object} storeData - 店铺数据
     * @returns {Promise<Object>} - 简化的分析报告
     */
    async generateSimpleAnalysis(storeData) {
        try {
            const prompt = PromptTemplate.buildSimplePrompt(storeData);
            const content = await this.apiClient.generateContent(prompt, {
                temperature: 0.5,
                max_tokens: 1000
            });
            
            return {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                storeData,
                content: this.processGeneratedContent(content),
                isSimple: true
            };
        } catch (error) {
            throw new Error(`简化分析生成失败: ${error.message}`);
        }
    }
    
    /**
     * 测试API连接
     * @returns {Promise<boolean>} - 连接是否成功
     */
    async testConnection() {
        try {
            const prompt = PromptTemplate.buildTestPrompt();
            const response = await this.apiClient.generateContent(prompt, {
                max_tokens: 50,
                temperature: 0
            });
            
            console.log('连接测试响应:', response);
            return response.includes('连接成功') || response.includes('就绪');
        } catch (error) {
            console.error('连接测试失败:', error);
            return false;
        }
    }
    
    /**
     * 获取生成状态
     * @returns {boolean} - 是否正在生成
     */
    isGeneratingContent() {
        return this.isGenerating;
    }
    
    /**
     * 取消生成（如果支持）
     */
    cancelGeneration() {
        // TODO: 实现取消功能
        console.log('取消生成功能暂未实现');
    }
}

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentGenerator;
}
