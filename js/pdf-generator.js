/**
 * PDF生成器 v4.0
 * 修复空白页面问题 - 使用absolute定位确保html2canvas正确捕获
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
            // 创建PDF内容容器 - 使用absolute定位，确保在视口内可见
            const pdfDiv = document.createElement('div');
            pdfDiv.id = 'pdf-content-wrapper';
            pdfDiv.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 794px;
                background: white;
                z-index: 99998;
                padding: 30px;
                box-sizing: border-box;
                overflow: visible;
            `;

            // 构建PDF内容
            pdfDiv.innerHTML = `
                <!-- 页眉 -->
                <div style="background: linear-gradient(135deg, ${moduleInfo.color}, #60a5fa);
                            color: white; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-size: 24px; font-weight: bold; margin-bottom: 5px;
                                        color: white !important; -webkit-text-fill-color: white !important;
                                        background: none !important; text-shadow: none !important;">
                                ${extraData.title || moduleInfo.name}
                            </div>
                            <div style="font-size: 14px; opacity: 0.9;
                                        color: white !important; -webkit-text-fill-color: white !important;">
                                ${extraData.subtitle || '呈尚策划 · 专业数据分析'}
                            </div>
                        </div>
                        <div style="text-align: right; font-size: 13px;
                                    color: white !important; -webkit-text-fill-color: white !important;">
                            <div style="opacity: 0.8;">生成日期</div>
                            <div>${dateStr}</div>
                        </div>
                    </div>
                </div>

                <!-- 报告内容 -->
                <div style="min-height: 500px; line-height: 1.8; color: #333;">
                    ${contentElement.innerHTML}
                </div>

                <!-- 页脚 -->
                <div style="margin-top: 30px; padding: 20px; background: #f5f5f5;
                            border-top: 3px solid ${moduleInfo.color}; border-radius: 0 0 12px 12px;">
                    <div style="display: flex; justify-content: space-between; font-size: 12px; color: #666;">
                        <div>
                            <span style="color: ${moduleInfo.color}; font-weight: bold;">呈尚策划</span>
                            &nbsp;|&nbsp; Gemini AI 智能分析
                        </div>
                        <div>${moduleInfo.name}</div>
                    </div>
                </div>
            `;

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
}

window.pdfGenerator = new PDFGenerator();
console.log('[PDF生成器] v4.0 已加载');
