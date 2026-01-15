/**
 * PDF服务端生成模块 v1.0
 * 负责与后端Puppeteer API通信，请求生成高质量PDF
 */

class PDFService {
    constructor() {
        this.apiEndpoint = '/api/generate-pdf';
        this.isGenerating = false;

        this.moduleConfig = {
            'brand': {
                name: '品牌定位分析报告',
                color: '#3b82f6',
                headerGradient: 'linear-gradient(135deg, #1E3A8A, #3B82F6)'
            },
            'market': {
                name: '商圈调研分析报告',
                color: '#8b5cf6',
                headerGradient: 'linear-gradient(135deg, #7c3aed, #8b5cf6)'
            },
            'store-activity': {
                name: '店铺活动方案',
                color: '#f97316',
                headerGradient: 'linear-gradient(135deg, #ef4444, #f97316)'
            },
            'data-statistics': {
                name: '数据统计分析报告',
                color: '#667eea',
                headerGradient: 'linear-gradient(135deg, #667eea, #764ba2)'
            }
        };
    }

    /**
     * 生成PDF
     * @param {string} moduleType - 模块类型
     * @param {HTMLElement} contentElement - 报告内容DOM元素
     * @param {string} filename - 文件名
     * @param {object} extraData - 额外数据（标题、副标题等）
     */
    async generatePDF(moduleType, contentElement, filename, extraData = {}) {
        if (this.isGenerating) {
            alert('正在生成PDF，请稍候...');
            return;
        }

        this.isGenerating = true;
        this.showLoading();

        try {
            const moduleInfo = this.moduleConfig[moduleType] || this.moduleConfig['brand'];
            const fullHTML = this.buildFullHTML(contentElement, moduleInfo, extraData);

            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    html: fullHTML,
                    filename: filename,
                    moduleType: moduleType,
                    options: {
                        format: 'A4',
                        margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' }
                    }
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMsg = 'PDF生成失败';
                try {
                    const error = JSON.parse(errorText);
                    errorMsg = error.message || errorMsg;
                } catch (e) {
                    errorMsg = errorText || errorMsg;
                }
                throw new Error(errorMsg);
            }

            // 下载PDF文件 - 确保正确的MIME类型
            const arrayBuffer = await response.arrayBuffer();
            const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
            this.downloadBlob(blob, `${filename}_${this.getDateStr()}.pdf`);
            alert('PDF下载成功！');

        } catch (error) {
            console.error('[PDF Service] 生成失败:', error);
            alert('PDF生成失败: ' + error.message);
        } finally {
            this.isGenerating = false;
            this.hideLoading();
        }
    }

    /**
     * 下载Blob文件
     */
    downloadBlob(blob, filename) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    /**
     * 构建完整的HTML文档
     */
    buildFullHTML(contentElement, moduleInfo, extraData) {
        const dateStr = new Date().toLocaleDateString('zh-CN');
        const clonedContent = contentElement.cloneNode(true);

        // 移除重复的标题区域（报告头部）
        const headerSections = clonedContent.querySelectorAll('[class*="header-section"], [class*="report-header"], .report-title-section');
        headerSections.forEach(el => el.remove());

        // 转换Canvas为图片
        this.convertCanvasToImages(clonedContent, contentElement);

        return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>${extraData.title || moduleInfo.name}</title>
    <style>${this.getEmbeddedStyles(moduleInfo)}</style>
</head>
<body>
    <div class="pdf-container">
        <header class="pdf-header" style="background: ${moduleInfo.headerGradient};">
            <div class="header-content">
                <div class="header-left">
                    <h1>${extraData.title || moduleInfo.name}</h1>
                    <p>${extraData.subtitle || '呈尚策划 · 专业分析报告'}</p>
                </div>
                <div class="header-right">
                    <div class="date-label">生成日期</div>
                    <div class="date-value">${dateStr}</div>
                </div>
            </div>
        </header>
        <main class="pdf-body">${clonedContent.innerHTML}</main>
        <footer class="pdf-footer" style="border-top-color: ${moduleInfo.color};">
            <div class="footer-content">
                <div class="footer-left">
                    <span class="brand" style="color: ${moduleInfo.color};">呈尚策划</span>
                    <span class="separator">|</span>
                    <span>专业分析报告</span>
                </div>
                <div class="footer-right">${moduleInfo.name}</div>
            </div>
        </footer>
    </div>
</body>
</html>`;
    }

    /**
     * 将Canvas元素转换为图片
     */
    convertCanvasToImages(clonedContent, originalContent) {
        const originalCanvases = originalContent.querySelectorAll('canvas');
        const clonedCanvases = clonedContent.querySelectorAll('canvas');

        clonedCanvases.forEach((canvas, index) => {
            try {
                const originalCanvas = originalCanvases[index];
                if (originalCanvas) {
                    const img = document.createElement('img');
                    img.src = originalCanvas.toDataURL('image/png');
                    img.style.cssText = 'max-width: 100%; height: auto;';
                    canvas.parentNode.replaceChild(img, canvas);
                }
            } catch (e) {
                console.warn('[PDF Service] Canvas转换失败:', e);
            }
        });
    }

    /**
     * 获取内嵌样式
     */
    getEmbeddedStyles(moduleInfo) {
        return `
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Microsoft YaHei', sans-serif; font-size: 12px; line-height: 1.6; color: #333; background: #fff; }
.pdf-container { max-width: 210mm; margin: 0 auto; padding: 8px; }
.pdf-header { color: white; padding: 18px 22px; border-radius: 6px; margin-bottom: 12px; }
.header-content { display: flex; justify-content: space-between; align-items: center; }
.header-left h1 { font-size: 18px; font-weight: bold; margin-bottom: 3px; color: white !important; -webkit-text-fill-color: white !important; background: none !important; }
.header-left p { font-size: 11px; opacity: 0.9; color: white !important; -webkit-text-fill-color: white !important; }
.header-right { text-align: right; font-size: 10px; color: white !important; -webkit-text-fill-color: white !important; }
.pdf-body { padding: 0 3px; }
.pdf-body h2 { font-size: 14px; color: #fff; background: ${moduleInfo.color}; padding: 6px 12px; margin: 12px 0 8px 0; font-weight: bold; border-radius: 4px; }
.pdf-body h3 { font-size: 13px; color: ${moduleInfo.color}; margin: 10px 0 5px 0; font-weight: 600; border-bottom: 1px solid #e5e7eb; padding-bottom: 3px; }
.pdf-body h4 { font-size: 12px; color: #374151; margin: 8px 0 4px 0; font-weight: 600; }
.pdf-body p { margin: 4px 0; text-align: justify; color: #4b5563; font-size: 11px; }
.pdf-body strong { color: ${moduleInfo.color}; font-weight: 600; }
.pdf-body ul, .pdf-body ol { margin: 4px 0; padding-left: 16px; }
.pdf-body li { margin: 2px 0; line-height: 1.5; color: #4b5563; font-size: 11px; }
.pdf-body .store-overview { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 12px; margin: 8px 0; }
.pdf-body .store-overview h2 { background: none; color: ${moduleInfo.color}; padding: 0; margin: 0 0 8px 0; border-radius: 0; }
.pdf-body .info-item { display: inline-block; margin: 3px 0; }
.pdf-body .activity-content { margin: 6px 0; padding: 8px 10px; background: #fefce8; border-left: 3px solid ${moduleInfo.color}; border-radius: 0 4px 4px 0; }
.pdf-body .numbered-item { margin: 4px 0; padding: 4px 8px; background: #f9fafb; border-radius: 3px; }
.pdf-footer { margin-top: 12px; padding: 8px 12px; background: #f1f5f9; border-top: 2px solid ${moduleInfo.color}; }
.footer-content { display: flex; justify-content: space-between; font-size: 9px; color: #64748b; }
.footer-left .brand { font-weight: bold; color: ${moduleInfo.color}; }
.report-header, [class*="report-header"] { display: none; }
.grid { display: flex; flex-wrap: wrap; gap: 6px; }
.grid > div { flex: 1; min-width: 45%; }
@media print { body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } }
        `;
    }

    showLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'pdf-loading';
        loadingDiv.innerHTML = `
            <div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:99999;">
                <div style="background:white;padding:30px 50px;border-radius:10px;text-align:center;">
                    <div style="font-size:18px;margin-bottom:10px;">正在生成PDF...</div>
                    <div style="color:#666;">服务端渲染中，请稍候</div>
                </div>
            </div>`;
        document.body.appendChild(loadingDiv);
    }

    hideLoading() {
        const loading = document.getElementById('pdf-loading');
        if (loading) document.body.removeChild(loading);
    }

    getDateStr() {
        const d = new Date();
        return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
    }
}

// 全局实例
window.pdfService = new PDFService();
console.log('[PDF Service] 服务端PDF生成模块 v1.0 已加载');
