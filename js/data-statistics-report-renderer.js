/**
 * 数据统计分析报告渲染器
 * 负责将AI生成的内容渲染到页面上
 */

class DataStatisticsReportRenderer {
    constructor() {
        this.reportContainer = document.getElementById('report-content');
        
        console.log('[数据统计渲染] 渲染器初始化完成');
    }

    /**
     * 渲染完整报告
     * @param {string} apiResponse - AI API响应内容
     * @param {Object} formData - 原始表单数据
     */
    renderReport(apiResponse, formData) {
        try {
            console.log('[数据统计渲染] 开始渲染报告');

            if (!this.reportContainer) {
                throw new Error('报告容器未找到');
            }

            // 清理之前的内容和图表
            this.cleanup();

            // 处理AI响应内容
            let processedContent = this.processAIResponse(apiResponse);

            // 插入报告头部
            const reportHeader = this.generateReportHeader(formData);
            processedContent = reportHeader + processedContent;

            // 渲染到页面
            this.reportContainer.innerHTML = processedContent;

            console.log('[数据统计渲染] 报告渲染完成');

        } catch (error) {
            console.error('[数据统计渲染] 渲染失败:', error);
            this.renderErrorMessage(error.message);
        }
    }

    /**
     * 处理AI响应内容
     * @param {string} content - AI原始响应
     * @returns {string} - 处理后的内容
     */
    processAIResponse(content) {
        if (!content) {
            throw new Error('AI响应内容为空');
        }

        // 移除可能的markdown标记
        content = content.replace(/^```html\s*\n?/i, '');
        content = content.replace(/\n?\s*```$/i, '');
        content = content.replace(/^```\s*\n?/i, '');
        content = content.replace(/\n?\s*```$/i, '');

        // 确保内容不是完整的HTML文档
        if (content.includes('<!DOCTYPE') || content.includes('<html')) {
            // 提取body内容
            const bodyMatch = content.match(/<body[^>]*>([\s\S]*)<\/body>/i);
            if (bodyMatch) {
                content = bodyMatch[1];
            }
        }

        // 添加基础样式类
        content = this.addBasicStyles(content);

        return content.trim();
    }

    /**
     * 生成报告头部
     * @param {Object} formData - 表单数据
     * @returns {string} - 报告头部HTML
     */
    generateReportHeader(formData) {
        const currentDate = new Date().toLocaleDateString('zh-CN');

        return `
        <div class="report-header" style="
            background: #1E40AF;
            color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(30, 64, 175, 0.2);
        ">
            <h1 style="
                font-size: 1.8rem;
                font-weight: 700;
                margin: 0;
                color: #ffffff;
            ">
                <i class="fas fa-table" style="margin-right: 8px;"></i>
                ${formData.storeName} - 数据统计报告
            </h1>
            <p style="
                margin: 8px 0 0 0;
                color: #ffffff;
                font-size: 14px;
            ">
                生成时间：${currentDate} | 分析周期：近30天
            </p>
        </div>`;
    }

    /**
     * 添加基础样式
     * @param {string} content - 原始内容
     * @returns {string} - 添加样式后的内容
     */
    addBasicStyles(content) {
        // 为表格添加样式类和容器
        content = content.replace(/<table(?![^>]*class=)/gi, '<table class="stats-table"');
        
        // 为整个内容添加容器
        if (!content.includes('table-container')) {
            content = `<div class="table-container">${content}</div>`;
        }
        
        // 移除数字高亮样式 - 改为普通文本显示
        // content = content.replace(/(\d+(?:\.\d+)?%)/g, '<span class="number-highlight">$1</span>');
        // content = content.replace(/(\d{1,3}(?:,\d{3})*(?:\.\d+)?(?:元|人|公里|分钟))/g, '<span class="number-highlight">$1</span>');
        
        // 为不同类型的单元格添加样式类
        content = content.replace(/<td>([^<]*(?:店铺基本信息|30天运营数据|配送服务设置|店铺权重配置)[^<]*)<\/td>/gi, '<td class="category-cell">$1</td>');
        content = content.replace(/<td>([^<]*(?:分析|评估|对比|效果)[^<]*)<\/td>/gi, '<td class="analysis-cell">$1</td>');
        content = content.replace(/<td>([^<]*(?:建议|策略|优化|提升)[^<]*)<\/td>/gi, '<td class="suggestion-cell">$1</td>');
        
        // 为表格行添加随机的淡绿色和淡黄色背景标记
        content = this.addRandomRowHighlights(content);
        

        // 添加高端大气的内联样式
        const styles = `
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', Arial, sans-serif;
                margin: 0;
                padding: 30px;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                min-height: 100vh;
            }
            
            .table-container {
                background: white;
                border-radius: 16px;
                padding: 40px;
                max-width: 1200px;
                margin: 0 auto;
                box-shadow: 0 20px 60px rgba(102, 126, 234, 0.12);
                position: relative;
                overflow: hidden;
            }
            
            .table-container::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 6px;
                background: linear-gradient(90deg, #667eea, #764ba2, #667eea);
            }
            
            h1 {
                text-align: center;
                font-size: 32px;
                font-weight: 700;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin-bottom: 30px;
                text-shadow: 0 2px 10px rgba(102, 126, 234, 0.2);
            }
            
            .stats-table {
                width: 100%;
                border-collapse: separate;
                border-spacing: 0;
                margin: 20px 0;
                box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15);
                border-radius: 12px;
                overflow: hidden;
                border: 2px solid transparent;
                background: linear-gradient(white, white) padding-box, 
                           linear-gradient(135deg, #667eea, #764ba2) border-box;
            }

            .stats-table th {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%);
                color: white;
                padding: 18px 16px;
                text-align: center;
                font-weight: 700;
                font-size: 14px;
                text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                position: relative;
                border: none;
            }
            
            .stats-table th::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 1px;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            }

            .stats-table td {
                padding: 16px;
                text-align: center;
                border: none;
                background: white;
                font-size: 13px;
                color: #4a5568;
                border-bottom: 1px solid #f1f5f9;
                transition: all 0.3s ease;
                vertical-align: middle;
            }

            /* 移除默认的隔行变色，使用随机背景色 */
            
            .stats-table tbody tr:hover td {
                background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%);
                transform: scale(1.01);
                box-shadow: 0 4px 20px rgba(102, 126, 234, 0.1);
            }

            /* 移除数字高亮样式，改为普通文本显示 */
            
            .category-cell {
                font-weight: 600;
                color: #2d3748;
                background: linear-gradient(135deg, #e6fffa 0%, #f0fff4 100%) !important;
            }
            
            .item-cell {
                font-weight: 500;
                color: #4a5568;
            }
            
            .analysis-cell {
                color: #2d3748;
                font-style: italic;
                background: linear-gradient(135deg, #fef5e7 0%, #fefcbf 100%) !important;
            }
            
            .suggestion-cell {
                color: #2d3748;
                font-weight: 500;
                background: linear-gradient(135deg, #f0fff4 0%, #dcfce7 100%) !important;
            }
            
            /* 响应式设计 */
            @media (max-width: 768px) {
                body {
                    padding: 15px;
                }
                
                .table-container {
                    padding: 20px;
                }
                
                h1 {
                    font-size: 24px;
                }
                
                .stats-table {
                    font-size: 12px;
                }
                
                .stats-table th,
                .stats-table td {
                    padding: 12px 8px;
                }
            }
            
            /* 动画效果 */
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .table-container {
                animation: fadeInUp 0.8s ease-out;
            }
            
            .stats-table {
                animation: fadeInUp 1s ease-out 0.2s both;
            }
        </style>`;

        return styles + content;
    }

    /**
     * 为表格行添加随机的淡绿色和淡黄色背景标记
     * @param {string} content - HTML内容
     * @returns {string} - 处理后的内容
     */
    addRandomRowHighlights(content) {
        // 匹配所有表格行（排除表头）
        const trPattern = /<tr(?![^>]*<th)([^>]*)>(.*?)<\/tr>/gi;
        let match;
        let processedContent = content;
        const highlights = [];
        
        // 找到所有非表头行
        while ((match = trPattern.exec(content)) !== null) {
            highlights.push({
                fullMatch: match[0],
                attributes: match[1],
                content: match[2]
            });
        }
        
        // 为每行随机分配背景色
        highlights.forEach((row, index) => {
            // 30%概率淡绿色，30%概率淡黄色，40%概率无特殊背景
            const rand = Math.random();
            let newRowHtml = row.fullMatch;
            
            if (rand < 0.3) {
                // 淡绿色背景
                newRowHtml = `<tr${row.attributes} style="background: linear-gradient(135deg, #f0fff4 0%, #dcfce7 50%, #bbf7d0 100%) !important;">${row.content}</tr>`;
            } else if (rand < 0.6) {
                // 淡黄色背景
                newRowHtml = `<tr${row.attributes} style="background: linear-gradient(135deg, #fefcbf 0%, #fef3c7 50%, #fed7aa 100%) !important;">${row.content}</tr>`;
            }
            
            processedContent = processedContent.replace(row.fullMatch, newRowHtml);
        });
        
        return processedContent;
    }

    /**
     * 渲染错误信息
     * @param {string} errorMessage - 错误信息
     */
    renderErrorMessage(errorMessage) {
        if (!this.reportContainer) return;

        this.reportContainer.innerHTML = `
        <div style="
            text-align: center;
            padding: 60px 20px;
            background: #fef2f2;
            border-radius: 12px;
            border: 1px solid #fecaca;
        ">
            <i class="fas fa-exclamation-triangle" style="
                font-size: 3rem;
                color: #ef4444;
                margin-bottom: 20px;
            "></i>
            <h3 style="color: #dc2626; margin-bottom: 15px;">报告生成失败</h3>
            <p style="color: #7f1d1d; margin-bottom: 25px;">${errorMessage}</p>
            <button onclick="dataStatisticsApp.startNewAnalysis()" 
                    style="
                        background: #ef4444;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 16px;
                    ">
                <i class="fas fa-redo mr-2"></i>
                重新生成
            </button>
        </div>`;
    }

    /**
     * 清理资源
     */
    cleanup() {
        // 清空容器
        if (this.reportContainer) {
            this.reportContainer.innerHTML = '';
        }
    }

    /**
     * 获取渲染统计信息
     * @returns {Object} - 渲染统计
     */
    getRenderStats() {
        return {
            containerExists: !!this.reportContainer,
            renderedAt: new Date().toISOString()
        };
    }
}

// 导出到全局作用域
window.DataStatisticsReportRenderer = DataStatisticsReportRenderer;