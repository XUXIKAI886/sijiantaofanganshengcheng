/**
 * PDF生成器 v5.0
 * 修复样式和标题重复问题
 */

class PDFGenerator {
    constructor() {
        this.isGenerating = false;
        this.moduleConfig = {
            'brand': { name: '品牌定位分析报告', color: '#3b82f6' },
            'market': { name: '商圈调研分析报告', color: '#8b5cf6' },
            'store-activity': { name: '店铺活动方案', color: '#f97316' },
            'data-statistics': { name: '数据统计分析报告', color: '#667eea' }
        };
    }

    /**
     * 清理内容中的重复标题
     */
    cleanContent(contentElement) {
        const clone = contentElement.cloneNode(true);

        // 移除报告头部区域（避免重复）
        const selectors = [
            '.report-header', '[class*="report-header"]',
            '.header-section', '[class*="header-section"]',
            '.report-title-section', '.title-section'
        ];
        selectors.forEach(sel => {
            clone.querySelectorAll(sel).forEach(el => el.remove());
        });

        return clone.innerHTML;
    }

    /**
     * 生成并下载PDF
     */
    async generatePDF(moduleType, contentElement, filename, extraData = {}) {
        if (this.isGenerating) {
            alert('正在生成PDF，请稍候...');
            return;
        }

        if (typeof html2pdf === 'undefined') {
            alert('PDF库未加载，请刷新页面重试');
            return;
        }

        this.isGenerating = true;
        const moduleInfo = this.moduleConfig[moduleType] || this.moduleConfig['brand'];
        const dateStr = new Date().toLocaleDateString('zh-CN');

        // 显示加载提示
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'pdf-loading';
        loadingDiv.innerHTML = `
            <div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);
                        display:flex;align-items:center;justify-content:center;z-index:99999;">
                <div style="background:white;padding:30px 50px;border-radius:10px;text-align:center;">
                    <div style="font-size:18px;margin-bottom:10px;">正在生成PDF...</div>
                    <div style="color:#666;">请稍候</div>
                </div>
            </div>
        `;
        document.body.appendChild(loadingDiv);

        try {
            // 清理内容，移除重复标题
            const cleanedContent = this.cleanContent(contentElement);

            // 创建PDF内容容器
            const pdfDiv = document.createElement('div');
            pdfDiv.id = 'pdf-content-wrapper';
            pdfDiv.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 794px;
                background: white;
                z-index: 99998;
                padding: 20px;
                box-sizing: border-box;
                font-family: "Microsoft YaHei", "PingFang SC", sans-serif;
                font-size: 14px;
                line-height: 1.8;
                color: #333;
            `;

            // 构建PDF内容（带内嵌样式）
            pdfDiv.innerHTML = this.buildPDFContent(moduleInfo, extraData, dateStr, cleanedContent);

            document.body.appendChild(pdfDiv);

            // 滚动到顶部确保内容可见
            window.scrollTo(0, 0);

            // 等待渲染和图片加载
            await new Promise(r => setTimeout(r, 800));

            console.log('[PDF] pdfDiv尺寸:', pdfDiv.offsetWidth, 'x', pdfDiv.offsetHeight);
            console.log('[PDF] pdfDiv内容长度:', pdfDiv.innerHTML.length);

            // PDF配置 - 优化html2canvas设置
            const opt = {
                margin: 10,
                filename: `${filename}_${this.getDateStr()}.pdf`,
                image: { type: 'jpeg', quality: 0.95 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    logging: true,
                    allowTaint: true,
                    scrollX: 0,
                    scrollY: 0,
                    windowWidth: 794,
                    windowHeight: pdfDiv.offsetHeight + 100,
                    x: 0,
                    y: 0,
                    width: 794,
                    height: pdfDiv.offsetHeight
                },
                jsPDF: {
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'portrait'
                }
            };

            console.log('[PDF] 开始生成...');

            // 生成PDF
            await html2pdf().set(opt).from(pdfDiv).save();

            console.log('[PDF] 生成完成');

            // 清理
            document.body.removeChild(pdfDiv);

            alert('PDF下载成功！');

        } catch (error) {
            console.error('[PDF] 生成失败:', error);
            alert('PDF生成失败: ' + error.message);

            // 清理
            const wrapper = document.getElementById('pdf-content-wrapper');
            if (wrapper) document.body.removeChild(wrapper);
        } finally {
            this.isGenerating = false;
            const loading = document.getElementById('pdf-loading');
            if (loading) document.body.removeChild(loading);
        }
    }

    getDateStr() {
        const d = new Date();
        return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
    }

    /**
     * 构建PDF内容HTML
     */
    buildPDFContent(moduleInfo, extraData, dateStr, content) {
        const color = moduleInfo.color;
        return `
            <style>
                .pdf-body h2 { font-size: 16px; color: #fff; background: ${color}; padding: 8px 15px; margin: 20px 0 12px 0; font-weight: bold; border-radius: 6px; }
                .pdf-body h3 { font-size: 15px; color: ${color}; margin: 15px 0 8px 0; font-weight: 600; border-bottom: 2px solid ${color}; padding-bottom: 5px; }
                .pdf-body h4 { font-size: 14px; color: #374151; margin: 12px 0 6px 0; font-weight: 600; }
                .pdf-body p { margin: 8px 0; text-align: justify; color: #4b5563; line-height: 1.8; }
                .pdf-body ul, .pdf-body ol { margin: 8px 0; padding-left: 24px; }
                .pdf-body li { margin: 6px 0; line-height: 1.7; color: #4b5563; }
                .pdf-body strong { color: ${color}; font-weight: 600; }
                .pdf-body .section { margin: 15px 0; padding: 12px; background: #f9fafb; border-radius: 8px; }
            </style>
            <!-- 页眉 -->
            <div style="background: linear-gradient(135deg, ${color}, #60a5fa); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-size: 22px; font-weight: bold; margin-bottom: 5px; color: white;">${extraData.title || moduleInfo.name}</div>
                        <div style="font-size: 13px; opacity: 0.9; color: white;">${extraData.subtitle || '呈尚策划 · 专业数据分析'}</div>
                    </div>
                    <div style="text-align: right; font-size: 12px; color: white;">
                        <div style="opacity: 0.8;">生成日期</div>
                        <div>${dateStr}</div>
                    </div>
                </div>
            </div>
            <!-- 报告内容 -->
            <div class="pdf-body">${content}</div>
            <!-- 页脚 -->
            <div style="margin-top: 25px; padding: 15px; background: #f5f5f5; border-top: 3px solid ${color};">
                <div style="display: flex; justify-content: space-between; font-size: 11px; color: #666;">
                    <div><span style="color: ${color}; font-weight: bold;">呈尚策划</span> | Gemini AI</div>
                    <div>${moduleInfo.name}</div>
                </div>
            </div>
        `;
    }
}

window.pdfGenerator = new PDFGenerator();
console.log('[PDF生成器] v5.0 已加载');
