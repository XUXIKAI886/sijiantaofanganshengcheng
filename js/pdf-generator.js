/**
 * PDF生成器 v6.0
 * 简化版 - 直接使用原始内容
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
        this.showLoading();

        try {
            const contentHTML = contentElement.innerHTML;
            console.log('[PDF] 内容长度:', contentHTML.length);

            if (!contentHTML || contentHTML.length < 100) {
                throw new Error('报告内容为空');
            }

            // 创建PDF容器
            const pdfDiv = document.createElement('div');
            pdfDiv.id = 'pdf-content-wrapper';
            pdfDiv.style.cssText = 'position:absolute;top:0;left:0;width:794px;background:white;z-index:99998;padding:20px;box-sizing:border-box;';

            // 直接使用原始内容，添加内嵌样式
            pdfDiv.innerHTML = this.getStyles(moduleInfo.color) + '<div class="pdf-content">' + contentHTML + '</div>';

            document.body.appendChild(pdfDiv);
            window.scrollTo(0, 0);
            await new Promise(r => setTimeout(r, 500));

            console.log('[PDF] 容器尺寸:', pdfDiv.offsetWidth, 'x', pdfDiv.offsetHeight);

            const opt = {
                margin: 10,
                filename: filename + '_' + this.getDateStr() + '.pdf',
                image: { type: 'jpeg', quality: 0.95 },
                html2canvas: { scale: 2, useCORS: true, logging: false, allowTaint: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            await html2pdf().set(opt).from(pdfDiv).save();
            document.body.removeChild(pdfDiv);
            alert('PDF下载成功！');

        } catch (error) {
            console.error('[PDF] 生成失败:', error);
            alert('PDF生成失败: ' + error.message);
            const wrapper = document.getElementById('pdf-content-wrapper');
            if (wrapper) document.body.removeChild(wrapper);
        } finally {
            this.isGenerating = false;
            this.hideLoading();
        }
    }

    getStyles(color) {
        return `<style>
            .pdf-content { font-family: "Microsoft YaHei", sans-serif; font-size: 14px; line-height: 1.8; color: #333; }
            .pdf-content h2 { font-size: 16px; color: #fff; background: ${color}; padding: 8px 15px; margin: 20px 0 12px; border-radius: 6px; }
            .pdf-content h3 { font-size: 15px; color: ${color}; margin: 15px 0 8px; border-bottom: 2px solid ${color}; padding-bottom: 5px; }
            .pdf-content h4 { font-size: 14px; color: #374151; margin: 12px 0 6px; }
            .pdf-content p { margin: 8px 0; color: #4b5563; }
            .pdf-content ul, .pdf-content ol { margin: 8px 0; padding-left: 24px; }
            .pdf-content li { margin: 6px 0; color: #4b5563; }
            .pdf-content strong { color: ${color}; }
        </style>`;
    }

    showLoading() {
        const div = document.createElement('div');
        div.id = 'pdf-loading';
        div.innerHTML = '<div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:99999;"><div style="background:white;padding:30px 50px;border-radius:10px;text-align:center;"><div style="font-size:18px;margin-bottom:10px;">正在生成PDF...</div><div style="color:#666;">请稍候</div></div></div>';
        document.body.appendChild(div);
    }

    hideLoading() {
        const el = document.getElementById('pdf-loading');
        if (el) document.body.removeChild(el);
    }

    getDateStr() {
        const d = new Date();
        return d.getFullYear() + String(d.getMonth()+1).padStart(2,'0') + String(d.getDate()).padStart(2,'0');
    }
}

window.pdfGenerator = new PDFGenerator();
console.log('[PDF生成器] v6.0 已加载');
