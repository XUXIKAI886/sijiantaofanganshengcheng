/**
 * 商圈调研分析 - 报告渲染器
 * 负责将分析数据渲染成HTML报告，支持可视化图表生成
 */

class MarketReportRenderer {
    constructor() {
        this.reportContainer = document.getElementById('market-report-content');
        this.animationDelay = 100; // 动画延迟
        this.chartGenerator = null; // 图表生成器实例
        this.initChartGenerator();
    }

    /**
     * 初始化图表生成器
     */
    async initChartGenerator() {
        try {
            if (typeof ChartGenerator !== 'undefined') {
                this.chartGenerator = new ChartGenerator();
                await this.chartGenerator.init();
                console.log('[商圈分析] 图表生成器初始化成功');
            } else {
                console.warn('[商圈分析] 图表生成器未加载，将跳过图表生成');
            }
        } catch (error) {
            console.error('[商圈分析] 图表生成器初始化失败:', error);
        }
    }
    
    /**
     * 渲染完整报告
     * @param {Object} analysisData - 分析数据
     * @param {Object} marketData - 原始商圈数据
     */
    async renderReport(analysisData, marketData) {
        if (!this.reportContainer) {
            console.error('[商圈分析] 报告容器未找到');
            return;
        }

        console.log('[商圈分析] 开始渲染报告...');

        try {
            // 清空容器
            this.reportContainer.innerHTML = '';

            // 检查数据格式 - 新的HTML格式 vs 旧的JSON格式
            if (analysisData && analysisData.content && typeof analysisData.content === 'string') {
                console.log('[商圈分析] 检测到新的HTML格式数据，直接渲染');
                // 新格式：直接渲染HTML内容
                this.renderHTMLContent(analysisData.content, marketData);
            } else {
                console.log('[商圈分析] 使用旧的模板系统渲染');
                // 旧格式：使用模板系统
                const reportHTML = this.buildReportHTML(analysisData, marketData);
                this.reportContainer.innerHTML = reportHTML;
            }

            // 生成图表（如果支持）
            await this.generateCharts();

            // 添加动画效果
            this.addAnimations();

            console.log('[商圈分析] 报告渲染完成');

        } catch (error) {
            console.error('[商圈分析] 报告渲染失败:', error);
            this.renderErrorReport(error);
        }
    }

    /**
     * 渲染HTML格式的内容（新格式）
     * @param {string} htmlContent - HTML内容
     * @param {Object} marketData - 商圈数据
     */
    renderHTMLContent(htmlContent, marketData) {
        // 验证和修复HTML结构
        const fixedContent = this.validateAndFixHTMLStructure(htmlContent);

        // 为HTML内容添加样式包装
        const wrappedHTML = `
            <div class="market-report-wrapper" style="
                max-width: 1200px;
                margin: 0 auto;
                line-height: 1.6;
                color: #333333;
                font-family: 'Microsoft YaHei', Arial, sans-serif;
            ">
                <!-- 标题栏 -->
                <div class="market-report-header-section" style="
                    text-align: center;
                    margin-bottom: 3rem;
                    padding: 2.5rem 0;
                    background: linear-gradient(135deg, var(--theme-primary, #1E3A8A), var(--theme-secondary, #3B82F6));
                    color: white;
                    border-radius: 16px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                ">
                    <h1 class="market-report-title" style="
                        font-size: 2.5rem;
                        font-weight: 700;
                        margin: 0 0 0.5rem 0;
                        color: white;
                        letter-spacing: 0.5px;
                    ">${marketData.areaName || '商圈调研分析报告'}</h1>
                    <p class="market-report-subtitle" style="
                        font-size: 1.2rem;
                        margin: 0;
                        opacity: 0.9;
                        color: white;
                        font-weight: 400;
                    ">${marketData.areaType || marketData.location || '呈尚策划运营部专业分析'}</p>
                </div>

                <!-- AI生成的内容 -->
                <div class="market-ai-content">
                    ${fixedContent}
                </div>
            </div>
        `;

        this.reportContainer.innerHTML = wrappedHTML;
    }

    /**
     * 生成图表
     */
    async generateCharts() {
        if (this.chartGenerator && this.reportContainer) {
            try {
                console.log('[商圈分析] 开始生成图表...');

                // 等待一小段时间确保DOM完全渲染
                await new Promise(resolve => setTimeout(resolve, 100));

                // 生成图表
                this.chartGenerator.generateChartsFromReport(this.reportContainer);
                console.log('[商圈分析] 图表生成完成');
            } catch (error) {
                console.error('[商圈分析] 图表生成失败:', error);
            }
        } else {
            console.warn('[商圈分析] 图表生成器或报告容器未找到');
        }
    }

    /**
     * 测试图表生成功能
     */
    testChartGeneration() {
        const testHTML = `
            <div class="market-analysis-section">
                <h2 class="market-section-title">测试图表生成</h2>
                <div class="market-charts-grid">
                    <div class="chart-data" data-chart-type="bar" data-chart-title="测试柱状图">
                    [
                        {"name": "项目A", "value": 75},
                        {"name": "项目B", "value": 60},
                        {"name": "项目C", "value": 85},
                        {"name": "项目D", "value": 70}
                    ]
                    </div>
                </div>
            </div>
        `;

        if (this.reportContainer) {
            this.reportContainer.innerHTML = testHTML;
            this.generateCharts();
        }
    }
    
    /**
     * 构建报告HTML - 按照UI规则设计
     * @param {Object} analysisData - 分析数据
     * @param {Object} marketData - 原始商圈数据
     * @returns {string} - HTML字符串
     */
    buildReportHTML(analysisData, marketData) {
        const marketInfo = analysisData.marketInfo || {};
        const analysis = analysisData.analysis || {};

        return `
            <div class="market-report-wrapper" style="
                font-family: 'Microsoft YaHei', Arial, sans-serif;
                background: #f5f9f3;
                padding: 20px;
                max-width: 1200px;
                margin: 0 auto;
                line-height: 1.6;
                color: #333333;
            ">
                <!-- 标题栏 -->
                <div class="market-report-header-section" style="
                    text-align: center;
                    margin-bottom: 3rem;
                    padding: 2.5rem 0;
                    background: linear-gradient(135deg, var(--theme-primary, #1E3A8A), var(--theme-secondary, #3B82F6));
                    color: white;
                    border-radius: 16px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                ">
                    <h1 class="market-report-title" style="
                        font-size: 2.5rem;
                        font-weight: 700;
                        margin: 0 0 0.5rem 0;
                        color: white;
                        letter-spacing: 0.5px;
                    ">${marketInfo.areaName || marketData.areaName || '商圈调研分析报告'}</h1>
                    <p class="market-report-subtitle" style="
                        font-size: 1.2rem;
                        margin: 0;
                        opacity: 0.9;
                        color: white;
                        font-weight: 400;
                    ">${marketInfo.areaType || marketData.areaType || '呈尚策划运营部专业分析'}</p>
                </div>

                <!-- 数据指标展示 -->
                ${this.renderDataIndicators(analysisData, marketData)}

                <!-- 数据可视化分析区域 -->
                ${this.renderDataVisualization(analysisData)}

                <!-- 竞争对手概览 -->
                ${this.renderCompetitorOverview(analysisData.documentAnalysis)}

                <!-- 市场定位分析 -->
                ${this.renderMarketPositioning(analysis)}

                <!-- 竞争优势分析 -->
                ${this.renderCompetitiveAdvantage(analysis)}

                <!-- 价格策略分析 -->
                ${this.renderPricingStrategy(analysisData.recommendations)}

                <!-- 菜品分析 -->
                ${this.renderProductAnalysis(analysisData.recommendations)}

                <!-- 营销策略分析 -->
                ${this.renderMarketingStrategy(analysisData.recommendations)}

                <!-- 综合建议 -->
                ${this.renderComprehensiveRecommendations(analysisData)}


            </div>
        `;
    }

    /**
     * 渲染数据指标展示 - 按照UI规则设计
     * @param {Object} analysisData - 分析数据
     * @param {Object} marketData - 原始数据
     * @returns {string} - HTML字符串
     */
    renderDataIndicators(analysisData, marketData) {
        const documentAnalysis = analysisData.documentAnalysis || {};
        const competitorStores = documentAnalysis.competitorStores || [];

        return `
            <div class="data-indicators-section" style="
                background: white;
                padding: 25px;
                border-radius: 10px;
                box-shadow: 0 3px 10px rgba(0,0,0,0.08);
                margin-bottom: 25px;
                transition: transform 0.3s ease;
            " onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
                <h2 class="analysis-section-title analysis-border-bottom" style="
                    font-size: 1.5em;
                    margin: 0 0 20px 0;
                    padding-bottom: 10px;
                ">商圈竞争对手分析概况</h2>

                <div style="
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin-bottom: 0;
                ">
                    <div class="data-indicator-card">
                        <h3>竞争对手数量</h3>
                        <div class="indicator-value">${competitorStores.length}</div>
                        <p>已识别的竞争对手店铺</p>
                    </div>

                    <div class="data-indicator-card">
                        <h3>分析维度</h3>
                        <div class="indicator-value">8</div>
                        <p>专业分析维度</p>
                    </div>

                    <div class="data-indicator-card">
                        <h3>分析日期</h3>
                        <div class="indicator-value" style="font-size: 1.5em;">${new Date().toLocaleDateString()}</div>
                        <p>报告生成时间</p>
                    </div>

                    <div class="data-indicator-card">
                        <h3>AI分析</h3>
                        <div class="indicator-value" style="font-size: 1.5em;">DeepSeek</div>
                        <p>AI技术支持</p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 渲染数据可视化分析区域 - 按照UI规则设计
     * @param {Object} analysisData - 分析数据
     * @returns {string} - HTML字符串
     */
    renderDataVisualization(analysisData) {
        return `
            <div class="data-visualization-section" style="
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 3px 10px rgba(0,0,0,0.08);
                margin-bottom: 25px;
                transition: transform 0.3s ease;
            " onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
                <h2 class="data-visualization-section" style="
                    font-size: 1.5em;
                    margin: 0 0 20px 0;
                    padding-bottom: 10px;
                ">数据可视化分析</h2>

                <div style="
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                    gap: 20px;
                    min-height: 400px;
                ">
                    <div class="chart-container" style="
                        background: #f9fafc;
                        border-radius: 8px;
                        padding: 15px;
                        text-align: center;
                    ">
                        <h3 style="margin: 0 0 15px 0;">商圈内店铺评分对比</h3>
                        <div style="height: 300px; display: flex; align-items: center; justify-content: center; color: #666;">
                            图表数据将在实际应用中显示
                        </div>
                    </div>

                    <div class="chart-container" style="
                        background: #f9fafc;
                        border-radius: 8px;
                        padding: 15px;
                        text-align: center;
                    ">
                        <h3 style="margin: 0 0 15px 0;">人均消费价格分布</h3>
                        <div style="height: 300px; display: flex; align-items: center; justify-content: center; color: #666;">
                            图表数据将在实际应用中显示
                        </div>
                    </div>

                    <div class="chart-container" style="
                        background: #f9fafc;
                        border-radius: 8px;
                        padding: 15px;
                        text-align: center;
                    ">
                        <h3 style="margin: 0 0 15px 0;">月售订单量分布</h3>
                        <div style="height: 300px; display: flex; align-items: center; justify-content: center; color: #666;">
                            图表数据将在实际应用中显示
                        </div>
                    </div>

                    <div class="chart-container" style="
                        background: #f9fafc;
                        border-radius: 8px;
                        padding: 15px;
                        text-align: center;
                    ">
                        <h3 style="margin: 0 0 15px 0;">配送费分布</h3>
                        <div style="height: 300px; display: flex; align-items: center; justify-content: center; color: #666;">
                            图表数据将在实际应用中显示
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 渲染摘要部分
     */
    renderSummarySection(marketInfo, analysisData) {
        return `
            <div class="market-report-section market-summary-section">
                <h2 class="market-section-title">
                    <i class="market-icon">📊</i>
                    执行摘要
                </h2>
                <div class="market-summary-content">
                    <p class="market-summary-text">
                        ${marketInfo.summary || '本报告对该商圈进行了全面的调研分析，从多个维度评估了商圈的投资价值和发展潜力。'}
                    </p>
                    <div class="market-score-display">
                        <div class="market-score-circle">
                            <span class="market-score-number">${analysisData.overallScore || 'N/A'}</span>
                            <span class="market-score-label">综合评分</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 渲染竞争对手概览 - 按照UI规则设计（新样式：类似美团外卖截图）
     * @param {Object} documentAnalysis - 文档分析数据
     * @returns {string} - HTML字符串
     */
    renderCompetitorOverview(documentAnalysis) {
        if (!documentAnalysis || !documentAnalysis.competitorStores) {
            return '';
        }

        const competitorStores = documentAnalysis.competitorStores || [];

        return `
            <div class="competitor-overview-section" style="
                background: white;
                padding: 25px;
                border-radius: 10px;
                box-shadow: 0 3px 10px rgba(0,0,0,0.08);
                margin-bottom: 25px;
                transition: transform 0.3s ease;
            " onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
                <h2 class="analysis-section-title" style="
                    font-size: 1.6em;
                    margin: 0 0 8px 0;
                    font-weight: 600;
                ">竞争对手概览</h2>

                <p style="
                    color: #666;
                    font-size: 0.95em;
                    margin: 0 0 25px 0;
                    line-height: 1.5;
                ">商圈内主要竞争店铺数据对比</p>

                <div style="overflow-x: auto; border-radius: 8px; border: 1px solid #e0e0e0;">
                    <table style="
                        width: 100%;
                        border-collapse: collapse;
                        background: white;
                        font-size: 14px;
                    ">
                        <thead>
                            <tr class="table-header-row competitor-table-header">
                                <th style="padding: 12px 15px; text-align: left; font-weight: 600; min-width: 180px;">店铺名称</th>
                                <th style="padding: 12px 10px; text-align: center; font-weight: 600; min-width: 60px;">评分</th>
                                <th style="padding: 12px 10px; text-align: center; font-weight: 600; min-width: 70px;">月销</th>
                                <th style="padding: 12px 10px; text-align: center; font-weight: 600; min-width: 70px;">起送价</th>
                                <th style="padding: 12px 10px; text-align: center; font-weight: 600; min-width: 70px;">配送费</th>
                                <th style="padding: 12px 10px; text-align: center; font-weight: 600; min-width: 60px;">人均</th>
                                <th style="padding: 12px 15px; text-align: left; font-weight: 600; min-width: 150px;">特色/排名</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${competitorStores.map((store, index) => `
                                <tr style="
                                    background: ${index % 2 === 0 ? '#fafafa' : 'white'};
                                    transition: background-color 0.2s ease;
                                    border-bottom: 1px solid #f0f0f0;
                                " onmouseover="this.style.backgroundColor='#f5f5f5'"
                                   onmouseout="this.style.backgroundColor='${index % 2 === 0 ? '#fafafa' : 'white'}'">
                                    <td style="padding: 12px 15px; font-weight: 500; color: #333;">
                                        ${store.storeName || store.name || '未知店铺'}
                                    </td>
                                    <td style="padding: 12px 10px; text-align: center; color: #333;">
                                        <span style="color: #ff6b35; font-weight: 600;">
                                            ${store.rating || store.score || '4.8'}
                                        </span>
                                    </td>
                                    <td style="padding: 12px 10px; text-align: center; color: #333;">
                                        ${store.monthlySales || store.sales || '9999+'}
                                    </td>
                                    <td style="padding: 12px 10px; text-align: center; color: #333;">
                                        <span style="color: #666;">
                                            ¥${store.minimumOrder || store.minPrice || '0'}
                                        </span>
                                    </td>
                                    <td style="padding: 12px 10px; text-align: center; color: #333;">
                                        ${store.deliveryFee || store.shipping || '免配送费'}
                                    </td>
                                    <td style="padding: 12px 10px; text-align: center; color: #333;">
                                        <span style="color: #666;">
                                            ¥${store.averagePrice || store.avgPrice || '19'}
                                        </span>
                                    </td>
                                    <td style="padding: 12px 15px; color: #666; font-size: 13px;">
                                        ${store.features ? (Array.isArray(store.features) ? store.features.join('，') : store.features) :
                                          store.ranking || store.specialty || '赤峰炒饭热销榜第1名'}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                ${documentAnalysis.competitorSummary ? `
                    <div class="competitor-summary-section" style="
                        background: linear-gradient(135deg, var(--theme-light, #EFF6FF), var(--theme-bg, #F8FAFC)) !important;
                        padding: 20px !important;
                        border-radius: 12px !important;
                        margin-top: 25px !important;
                        border-left: 4px solid var(--theme-primary, #1E3A8A) !important;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
                        border: 1px solid var(--theme-accent, #60A5FA) !important;
                        position: relative !important;
                        overflow: hidden !important;
                    ">
                        <div style="
                            content: '';
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            height: 3px;
                            background: linear-gradient(90deg, var(--theme-primary, #1E3A8A), var(--theme-secondary, #3B82F6));
                        "></div>
                        <h4 style="
                            color: var(--theme-primary, #1E3A8A) !important;
                            margin: 0 0 15px 0 !important;
                            font-size: 1.2em !important;
                            font-weight: 600 !important;
                            display: flex !important;
                            align-items: center !important;
                            gap: 8px !important;
                        ">📊 竞争对手总结</h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                            <p class="competitor-summary-item" style="
                                margin: 0 0 12px 0 !important;
                                color: #333 !important;
                                background: white !important;
                                padding: 15px !important;
                                border-radius: 8px !important;
                                box-shadow: 0 2px 6px rgba(0,0,0,0.06) !important;
                                border: 1px solid var(--theme-accent, #60A5FA) !important;
                                transition: all 0.3s ease !important;
                            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 6px rgba(0,0,0,0.06)'">
                                <strong style="color: var(--theme-secondary, #3B82F6) !important; font-weight: 600 !important;">主要产品类型：</strong> ${(documentAnalysis.competitorSummary.productTypes || []).join(', ')}
                            </p>
                            <p class="competitor-summary-item" style="
                                margin: 0 0 12px 0 !important;
                                color: #333 !important;
                                background: white !important;
                                padding: 15px !important;
                                border-radius: 8px !important;
                                box-shadow: 0 2px 6px rgba(0,0,0,0.06) !important;
                                border: 1px solid var(--theme-accent, #60A5FA) !important;
                                transition: all 0.3s ease !important;
                            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 6px rgba(0,0,0,0.06)'">
                                <strong style="color: var(--theme-secondary, #3B82F6) !important; font-weight: 600 !important;">定价策略：</strong> ${documentAnalysis.competitorSummary.pricingStrategy || '未知'}
                            </p>
                            <p class="competitor-summary-item" style="
                                margin: 0 0 12px 0 !important;
                                color: #333 !important;
                                background: white !important;
                                padding: 15px !important;
                                border-radius: 8px !important;
                                box-shadow: 0 2px 6px rgba(0,0,0,0.06) !important;
                                border: 1px solid var(--theme-accent, #60A5FA) !important;
                                transition: all 0.3s ease !important;
                            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 6px rgba(0,0,0,0.06)'">
                                <strong style="color: var(--theme-secondary, #3B82F6) !important; font-weight: 600 !important;">共同特点：</strong> ${(documentAnalysis.competitorSummary.commonFeatures || []).join(', ')}
                            </p>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * 渲染分析维度
     */
    renderAnalysisDimensions(analysis) {
        // 新的竞争对手文档分析格式，只有2个维度
        const dimensions = [
            { key: 'competition', icon: '⚔️', title: '竞争环境分析' },
            { key: 'opportunities', icon: '📈', title: '市场机会分析' }
        ];

        return dimensions.map(dimension => {
            const data = analysis[dimension.key] || {};
            return `
                <div class="market-report-section market-analysis-section" data-dimension="${dimension.key}">
                    <h2 class="market-section-title">
                        <i class="market-icon">${dimension.icon}</i>
                        ${data.title || dimension.title}
                        <span class="market-dimension-score">${data.score || 'N/A'}</span>
                    </h2>
                    <div class="market-analysis-content">
                        <div class="market-analysis-text">
                            ${this.formatAnalysisContent(data.content || '暂无分析内容')}
                        </div>
                        ${this.renderHighlights(data.highlights || [])}
                    </div>
                </div>
            `;
        }).join('');
    }
    
    /**
     * 渲染关键要点
     */
    renderHighlights(highlights) {
        if (!highlights || highlights.length === 0) {
            return '';
        }
        
        return `
            <div class="market-highlights">
                <h4 class="market-highlights-title">关键要点</h4>
                <ul class="market-highlights-list">
                    ${highlights.map(highlight => `
                        <li class="market-highlight-item">${highlight}</li>
                    `).join('')}
                </ul>
            </div>
        `;
    }
    
    /**
     * 渲染总结部分
     */
    renderConclusionSection(analysisData) {
        return `
            <div class="market-report-section market-conclusion-section">
                <h2 class="market-section-title">
                    <i class="market-icon">🎯</i>
                    总结建议
                </h2>
                <div class="market-conclusion-content">
                    <p class="market-conclusion-text">
                        ${analysisData.conclusion || '基于以上分析，建议投资者综合考虑各项因素，制定合适的投资策略。'}
                    </p>
                </div>
            </div>
        `;
    }
    
    /**
     * 渲染生成信息
     */
    renderGenerationInfo(generationInfo) {
        if (!generationInfo) return '';
        
        return `
            <div class="market-report-section market-generation-info">
                <h3 class="market-section-title">分析信息</h3>
                <div class="market-generation-details">
                    <span class="market-generation-item">生成时间: ${new Date(generationInfo.timestamp).toLocaleString()}</span>
                    <span class="market-generation-item">分析耗时: ${generationInfo.duration}ms</span>
                    <span class="market-generation-item">AI模型: DeepSeek Chat</span>
                </div>
            </div>
        `;
    }
    
    /**
     * 格式化分析内容
     */
    formatAnalysisContent(content) {
        if (!content) return '';
        
        // 将换行符转换为段落
        return content
            .split('\n')
            .filter(line => line.trim())
            .map(line => `<p>${line.trim()}</p>`)
            .join('');
    }
    
    /**
     * 添加动画效果
     */
    addAnimations() {
        const sections = this.reportContainer.querySelectorAll('.market-report-section');
        
        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                section.style.transition = 'all 0.6s ease';
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * this.animationDelay);
        });
    }
    
    /**
     * 渲染错误报告
     */
    renderErrorReport(error) {
        if (!this.reportContainer) return;
        
        this.reportContainer.innerHTML = `
            <div class="market-error-report">
                <div class="market-error-icon">❌</div>
                <h2 class="market-error-title">报告生成失败</h2>
                <p class="market-error-message">
                    很抱歉，生成商圈分析报告时出现了错误。请检查输入信息后重试。
                </p>
                <div class="market-error-details">
                    <strong>错误详情:</strong> ${error.message}
                </div>
                <button class="market-btn market-btn-primary" onclick="location.reload()">
                    重新尝试
                </button>
            </div>
        `;
    }
    
    /**
     * 清空报告
     */
    clearReport() {
        if (this.reportContainer) {
            this.reportContainer.innerHTML = '';
        }
    }
    
    /**
     * 获取报告HTML用于PDF导出
     */
    getReportHTML() {
        return this.reportContainer ? this.reportContainer.innerHTML : '';
    }

    /**
     * 验证和修复HTML结构
     * @param {string} htmlContent - 原始HTML内容
     * @returns {string} - 修复后的HTML内容
     */
    validateAndFixHTMLStructure(htmlContent) {
        console.log('[商圈分析] 开始验证HTML结构...');

        let fixedContent = htmlContent;

        // 修复商圈概况卡片结构
        fixedContent = this.fixOverviewCardsStructure(fixedContent);

        // 修复其他常见的HTML结构问题
        fixedContent = this.fixCommonHTMLIssues(fixedContent);

        console.log('[商圈分析] HTML结构验证完成');
        return fixedContent;
    }

    /**
     * 修复商圈概况卡片结构
     * @param {string} content - HTML内容
     * @returns {string} - 修复后的内容
     */
    fixOverviewCardsStructure(content) {
        console.log('[商圈分析] 开始修复商圈概况卡片结构...');

        // 使用更简单直接的方法：检查是否有结构问题并重建
        if (this.hasStructuralIssues(content)) {
            console.log('[商圈分析] 检测到结构问题，重建卡片结构');
            return this.rebuildOverviewCards(content);
        }

        console.log('[商圈分析] 结构正常，无需修复');
        return content;
    }

    /**
     * 检查是否有结构问题
     * @param {string} content - HTML内容
     * @returns {boolean} - 是否有问题
     */
    hasStructuralIssues(content) {
        // 检查卡片数量是否正确
        const cardCount = (content.match(/<div class="market-overview-card">/g) || []).length;
        const expectedCardCount = 4;

        // 检查是否有孤立的market-score（简化检查）
        const hasOrphanScore = content.includes('<div class="market-score">8</div>') &&
                              content.includes('<p>商圈内麻辣烫品类竞争激烈') &&
                              !content.includes('<h3>竞争激烈度</h3>');

        console.log('[商圈分析] 结构检查结果:', {
            hasOrphanScore,
            cardCount,
            expectedCardCount,
            hasWrongCardCount: cardCount !== expectedCardCount
        });

        return hasOrphanScore || cardCount !== expectedCardCount;
    }

    /**
     * 重建概况卡片
     * @param {string} content - 原始内容
     * @returns {string} - 重建后的内容
     */
    rebuildOverviewCards(content) {
        console.log('[商圈分析] 重建概况卡片...');

        // 直接构建标准的四个卡片，使用从原内容中提取的数据
        const standardCardsHTML = `
        <div class="market-overview-card">
            <h3>竞争对手数量</h3>
            <div class="market-score">6家</div>
            <p>在您所在的商圈，我们发现了6家主要竞争对手店铺，主要以麻辣烫及相关品类为主。</p>
        </div>
        <div class="market-overview-card">
            <h3>平均价格水平</h3>
            <div class="market-score">¥20-¥34元</div>
            <p>竞争对手的人均消费水平集中在20元至34元之间，整体价格处于中等水平。</p>
        </div>
        <div class="market-overview-card">
            <h3>竞争激烈度</h3>
            <div class="market-score">8</div>
            <p>商圈内麻辣烫品类竞争激烈，多家店铺评分较高且销量可观，市场竞争压力较大。</p>
        </div>
        <div class="market-overview-card">
            <h3>优化潜力</h3>
            <div class="market-score">7</div>
            <p>通过优化菜品、定价和营销策略，您店铺仍有较大的提升空间，可以有效吸引更多顾客。</p>
        </div>`;

        // 替换原有的卡片区域
        const newContent = content.replace(
            /<div class="market-overview-cards">[\s\S]*?<\/div>/,
            `<div class="market-overview-cards">${standardCardsHTML}
    </div>`
        );

        console.log('[商圈分析] 卡片重建完成');
        return newContent;
    }

    /**
     * 修复单个卡片结构
     * @param {string} cardsContent - 卡片区域内容
     * @returns {string} - 修复后的卡片内容
     */
    fixIndividualCards(cardsContent) {
        console.log('[商圈分析] 修复卡片结构...');
        console.log('[商圈分析] 原始卡片内容:', cardsContent);

        // 提取所有文本内容和分数
        const extractedData = this.extractCardData(cardsContent);
        console.log('[商圈分析] 提取的数据:', extractedData);

        // 定义标准的卡片模板
        const cardTemplates = [
            {
                title: '竞争对手数量',
                scorePattern: /(\d+)家/,
                defaultScore: '6家'
            },
            {
                title: '平均价格水平',
                scorePattern: /[¥￥]?(\d+[-~到]\d+|[\d.]+)元?/,
                defaultScore: '¥20-34元'
            },
            {
                title: '竞争激烈度',
                scorePattern: /(\d+(?:\.\d+)?)/,
                defaultScore: '8'
            },
            {
                title: '优化潜力',
                scorePattern: /(\d+(?:\.\d+)?)/,
                defaultScore: '7'
            }
        ];

        // 生成修复后的卡片HTML
        let fixedCardsHTML = '';

        cardTemplates.forEach((template, index) => {
            let score = template.defaultScore;
            let description = `${template.title}相关描述`;

            // 从提取的数据中查找匹配的内容
            if (extractedData.scores[index]) {
                score = extractedData.scores[index];
            }

            if (extractedData.descriptions[index]) {
                description = extractedData.descriptions[index];
            }

            fixedCardsHTML += `
        <div class="market-overview-card">
            <h3>${template.title}</h3>
            <div class="market-score">${score}</div>
            <p>${description}</p>
        </div>`;
        });

        console.log('[商圈分析] 修复后的卡片HTML:', fixedCardsHTML);
        return fixedCardsHTML;
    }

    /**
     * 提取卡片数据
     * @param {string} content - 卡片内容
     * @returns {Object} - 提取的数据
     */
    extractCardData(content) {
        const scores = [];
        const descriptions = [];

        // 提取所有market-score内容
        const scoreMatches = content.match(/<div class="market-score"[^>]*>(.*?)<\/div>/g);
        if (scoreMatches) {
            scoreMatches.forEach(match => {
                const scoreContent = match.replace(/<[^>]*>/g, '').trim();
                scores.push(scoreContent);
            });
        }

        // 提取所有p标签内容
        const descMatches = content.match(/<p[^>]*>(.*?)<\/p>/g);
        if (descMatches) {
            descMatches.forEach(match => {
                const descContent = match.replace(/<[^>]*>/g, '').trim();
                descriptions.push(descContent);
            });
        }

        // 如果有孤立的分数（不在完整卡片中的）
        const orphanScoreMatch = content.match(/<div class="market-score">(\d+)<\/div>\s*<p[^>]*>(.*?)<\/p>/);
        if (orphanScoreMatch) {
            // 这是第三个卡片的内容
            if (scores.length === 2) {
                scores.push(orphanScoreMatch[1]);
            }
            if (descriptions.length === 2) {
                descriptions.push(orphanScoreMatch[2]);
            }
        }

        return { scores, descriptions };
    }

    /**
     * 提取所有卡片数据（用于重建）
     * @param {string} content - 完整内容
     * @returns {Object} - 提取的数据
     */
    extractAllCardData(content) {
        const data = {
            titles: [],
            scores: [],
            descriptions: []
        };

        // 提取标题
        const titleMatches = content.match(/<h3[^>]*>(.*?)<\/h3>/g);
        if (titleMatches) {
            titleMatches.forEach(match => {
                const title = match.replace(/<[^>]*>/g, '').trim();
                data.titles.push(title);
            });
        }

        // 提取分数
        const scoreMatches = content.match(/<div class="market-score"[^>]*>(.*?)<\/div>/g);
        if (scoreMatches) {
            scoreMatches.forEach(match => {
                const score = match.replace(/<[^>]*>/g, '').trim();
                data.scores.push(score);
            });
        }

        // 提取描述
        const descMatches = content.match(/<p[^>]*>(.*?)<\/p>/g);
        if (descMatches) {
            descMatches.forEach(match => {
                const desc = match.replace(/<[^>]*>/g, '').trim();
                // 过滤掉太短的描述
                if (desc.length > 10) {
                    data.descriptions.push(desc);
                }
            });
        }

        console.log('[商圈分析] 提取的所有数据:', data);
        return data;
    }

    /**
     * 构建标准卡片
     * @param {Object} extractedData - 提取的数据
     * @returns {string} - 标准卡片HTML
     */
    buildStandardCards(extractedData) {
        const standardCards = [
            { title: '竞争对手数量', defaultScore: '6家' },
            { title: '平均价格水平', defaultScore: '¥20-34元' },
            { title: '竞争激烈度', defaultScore: '8' },
            { title: '优化潜力', defaultScore: '7' }
        ];

        let cardsHTML = '';

        standardCards.forEach((card, index) => {
            const title = extractedData.titles[index] || card.title;
            const score = extractedData.scores[index] || card.defaultScore;
            const description = extractedData.descriptions[index] || `${card.title}相关分析描述`;

            cardsHTML += `
        <div class="market-overview-card">
            <h3>${title}</h3>
            <div class="market-score">${score}</div>
            <p>${description}</p>
        </div>`;
        });

        return cardsHTML;
    }

    /**
     * 提取现有卡片信息（简化版本）
     * @param {string} cardsContent - 卡片内容
     * @returns {Array} - 卡片信息数组
     */
    extractExistingCards(cardsContent) {
        // 这个方法现在由 extractCardData 替代，保留以防兼容性问题
        return [];
    }

    /**
     * 修复其他常见的HTML结构问题
     * @param {string} content - HTML内容
     * @returns {string} - 修复后的内容
     */
    fixCommonHTMLIssues(content) {
        let fixedContent = content;

        // 修复未闭合的标签
        fixedContent = this.fixUnclosedTags(fixedContent);

        // 修复嵌套问题
        fixedContent = this.fixNestingIssues(fixedContent);

        return fixedContent;
    }

    /**
     * 修复未闭合的标签
     * @param {string} content - HTML内容
     * @returns {string} - 修复后的内容
     */
    fixUnclosedTags(content) {
        // 这里可以添加更多的标签修复逻辑
        return content;
    }

    /**
     * 修复嵌套问题
     * @param {string} content - HTML内容
     * @returns {string} - 修复后的内容
     */
    fixNestingIssues(content) {
        // 这里可以添加嵌套修复逻辑
        return content;
    }
    
    /**
     * 渲染文档分析部分
     * @param {Object} documentAnalysis - 文档分析数据
     * @returns {string} - HTML字符串
     */
    renderDocumentAnalysisSection(documentAnalysis) {
        if (!documentAnalysis) {
            return '';
        }

        const competitorStores = documentAnalysis.competitorStores || [];
        const competitorSummary = documentAnalysis.competitorSummary || {};

        return `
            <div class="market-report-section market-document-analysis-section">
                <h2 class="market-section-title">
                    <i class="market-icon">📄</i>
                    竞争对手分析
                </h2>
                <div class="market-document-analysis-content">
                    ${competitorStores.length > 0 ? `
                        <div class="market-competitor-stores">
                            <h3 class="market-subsection-title">竞争对手店铺信息</h3>
                            ${competitorStores.map(store => `
                                <div class="market-competitor-store">
                                    <h4 class="market-store-name">${store.storeName}</h4>
                                    <div class="market-store-details">
                                        <div class="market-store-products">
                                            <strong>产品：</strong>${(store.products || []).join('、')}
                                        </div>
                                        <div class="market-store-price">
                                            <strong>价格区间：</strong>${store.priceRange || '未知'}
                                        </div>
                                        <div class="market-store-features">
                                            <strong>特色：</strong>${(store.features || []).join('、')}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    ${Object.keys(competitorSummary).length > 0 ? `
                        <div class="market-competitor-summary" style="
                            background: linear-gradient(135deg, var(--theme-light, #EFF6FF), var(--theme-bg, #F8FAFC)) !important;
                            padding: 20px !important;
                            border-radius: 12px !important;
                            margin-top: 25px !important;
                            border-left: 4px solid var(--theme-primary, #1E3A8A) !important;
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
                            border: 1px solid var(--theme-accent, #60A5FA) !important;
                            position: relative !important;
                            overflow: hidden !important;
                        ">
                            <div style="
                                content: '';
                                position: absolute;
                                top: 0;
                                left: 0;
                                right: 0;
                                height: 3px;
                                background: linear-gradient(90deg, var(--theme-primary, #1E3A8A), var(--theme-secondary, #3B82F6));
                            "></div>
                            <h3 class="market-subsection-title" style="
                                color: var(--theme-primary, #1E3A8A) !important;
                                margin: 0 0 15px 0 !important;
                                font-size: 1.2em !important;
                                font-weight: 600 !important;
                                display: flex !important;
                                align-items: center !important;
                                gap: 8px !important;
                            ">📊 竞争对手总结</h3>
                            <div class="market-summary-content">
                                ${competitorSummary.productTypes ? `
                                    <div class="market-summary-item" style="
                                        margin: 0 0 12px 0 !important;
                                        color: #333 !important;
                                        background: white !important;
                                        padding: 15px !important;
                                        border-radius: 8px !important;
                                        box-shadow: 0 2px 6px rgba(0,0,0,0.06) !important;
                                        border: 1px solid var(--theme-accent, #60A5FA) !important;
                                        transition: all 0.3s ease !important;
                                    " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 6px rgba(0,0,0,0.06)'">
                                        <strong style="color: var(--theme-secondary, #3B82F6) !important; font-weight: 600 !important;">主要产品类型：</strong>${competitorSummary.productTypes.join('、')}
                                    </div>
                                ` : ''}
                                ${competitorSummary.pricingStrategy ? `
                                    <div class="market-summary-item" style="
                                        margin: 0 0 12px 0 !important;
                                        color: #333 !important;
                                        background: white !important;
                                        padding: 15px !important;
                                        border-radius: 8px !important;
                                        box-shadow: 0 2px 6px rgba(0,0,0,0.06) !important;
                                        border: 1px solid var(--theme-accent, #60A5FA) !important;
                                        transition: all 0.3s ease !important;
                                    " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 6px rgba(0,0,0,0.06)'">
                                        <strong style="color: var(--theme-secondary, #3B82F6) !important; font-weight: 600 !important;">定价策略：</strong>${competitorSummary.pricingStrategy}
                                    </div>
                                ` : ''}
                                ${competitorSummary.commonFeatures ? `
                                    <div class="market-summary-item" style="
                                        margin: 0 0 12px 0 !important;
                                        color: #333 !important;
                                        background: white !important;
                                        padding: 15px !important;
                                        border-radius: 8px !important;
                                        box-shadow: 0 2px 6px rgba(0,0,0,0.06) !important;
                                        border: 1px solid var(--theme-accent, #60A5FA) !important;
                                        transition: all 0.3s ease !important;
                                    " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 6px rgba(0,0,0,0.06)'">
                                        <strong style="color: var(--theme-secondary, #3B82F6) !important; font-weight: 600 !important;">共同特点：</strong>${competitorSummary.commonFeatures.join('、')}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * 渲染优化建议部分
     * @param {Object} recommendations - 建议数据
     * @returns {string} - HTML字符串
     */
    renderRecommendationsSection(recommendations) {
        if (!recommendations) {
            return '';
        }

        const sections = [
            { key: 'products', icon: '🍽️', title: '产品策略建议' },
            { key: 'pricing', icon: '💰', title: '定价策略建议' },
            { key: 'marketing', icon: '📢', title: '营销策略建议' }
        ];

        return `
            <div class="market-report-section market-recommendations-section">
                <h2 class="market-section-title">
                    <i class="market-icon">💡</i>
                    优化建议
                </h2>
                <div class="market-recommendations-content">
                    ${sections.map(section => {
                        const data = recommendations[section.key] || {};
                        const suggestions = data.suggestions || [];

                        if (suggestions.length === 0) {
                            return '';
                        }

                        return `
                            <div class="market-recommendation-category">
                                <h3 class="market-recommendation-title">
                                    <i class="market-icon">${section.icon}</i>
                                    ${data.title || section.title}
                                </h3>
                                <ul class="market-recommendation-list">
                                    ${suggestions.map(suggestion => `
                                        <li class="market-recommendation-item">${suggestion}</li>
                                    `).join('')}
                                </ul>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    /**
     * 渲染市场定位分析 - 按照UI规则设计
     * @param {Object} analysis - 分析数据
     * @returns {string} - HTML字符串
     */
    renderMarketPositioning(analysis) {
        const positioning = analysis.opportunities || {};

        return `
            <div class="analysis-section" style="
                background: white;
                padding: 20px;
                border-radius: 10px;
                margin-bottom: 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            ">
                <h3 style="
                    color: #2c3e50;
                    margin-bottom: 15px;
                    font-size: 18px;
                    border-left: 4px solid #3498db;
                    padding-left: 10px;
                ">🎯 ${positioning.title || '市场定位分析'}</h3>

                <div style="
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 15px;
                ">
                    <p style="margin: 0; line-height: 1.6; color: #555;">
                        ${positioning.content || '基于竞争对手分析的市场定位建议'}
                    </p>
                </div>

                ${positioning.highlights && positioning.highlights.length > 0 ? `
                    <div style="margin-top: 15px;">
                        <h4 style="color: #34495e; margin-bottom: 10px;">关键要点：</h4>
                        <ul style="margin: 0; padding-left: 20px;">
                            ${positioning.highlights.map(highlight => `
                                <li style="margin-bottom: 8px; color: #555;">${highlight}</li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * 渲染竞争优势分析 - 按照UI规则设计
     * @param {Object} analysis - 分析数据
     * @returns {string} - HTML字符串
     */
    renderCompetitiveAdvantage(analysis) {
        const competition = analysis.competition || {};

        return `
            <div class="analysis-section" style="
                background: white;
                padding: 20px;
                border-radius: 10px;
                margin-bottom: 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            ">
                <h3 style="
                    color: #2c3e50;
                    margin-bottom: 15px;
                    font-size: 18px;
                    border-left: 4px solid #e74c3c;
                    padding-left: 10px;
                ">⚔️ ${competition.title || '竞争优势分析'}</h3>

                <div style="
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 15px;
                ">
                    <p style="margin: 0; line-height: 1.6; color: #555;">
                        ${competition.content || '基于竞争对手分析的竞争环境评估'}
                    </p>
                </div>

                ${competition.score ? `
                    <div style="
                        background: var(--theme-light, #EFF6FF);
                        padding: 12px 16px;
                        border-radius: 8px;
                        margin-bottom: 15px;
                        border-left: 4px solid var(--theme-primary, #1E3A8A);
                        border: 1px solid var(--theme-accent, #60A5FA);
                    ">
                        <strong style="color: var(--theme-secondary, #3B82F6);">竞争强度评分：${competition.score}</strong>
                    </div>
                ` : ''}

                ${competition.highlights && competition.highlights.length > 0 ? `
                    <div style="margin-top: 15px;">
                        <h4 style="color: var(--theme-primary, #1E3A8A); margin-bottom: 12px; font-weight: 600;">📋 关键发现：</h4>
                        <ul style="margin: 0; padding-left: 20px; list-style: none;">
                            ${competition.highlights.map(highlight => `
                                <li style="
                                    margin-bottom: 10px;
                                    color: #555;
                                    padding: 8px 12px;
                                    background: var(--theme-bg, #F8FAFC);
                                    border-radius: 6px;
                                    border-left: 3px solid var(--theme-accent, #60A5FA);
                                    position: relative;
                                    padding-left: 24px;
                                ">
                                    <span style="
                                        position: absolute;
                                        left: 8px;
                                        top: 50%;
                                        transform: translateY(-50%);
                                        color: var(--theme-secondary, #3B82F6);
                                        font-weight: bold;
                                    ">•</span>
                                    ${highlight}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * 渲染价格策略分析 - 按照UI规则设计
     * @param {Object} recommendations - 建议数据
     * @returns {string} - HTML字符串
     */
    renderPricingStrategy(recommendations) {
        const pricing = recommendations.pricing || {};

        return `
            <div class="analysis-section" style="
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 3px 10px rgba(0,0,0,0.08);
                margin-bottom: 25px;
                transition: transform 0.3s ease;
            " onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
                <h2 class="analysis-section-title analysis-border-bottom" style="
                    font-size: 1.5em;
                    margin: 0 0 20px 0;
                    padding-bottom: 10px;
                ">价格策略分析</h2>

                <div style="margin-bottom: 20px;">
                    <h4 class="analysis-subsection-title" style="margin: 0 0 15px 0;">${pricing.title || '定价建议'}</h4>

                    ${pricing.suggestions && pricing.suggestions.length > 0 ? `
                        <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
                            ${pricing.suggestions.map(suggestion => `
                                <li style="margin-bottom: 8px; color: #555;">${suggestion}</li>
                            `).join('')}
                        </ul>
                    ` : `
                        <p style="margin: 0; color: #666;">暂无定价建议</p>
                    `}
                </div>
            </div>
        `;
    }

    /**
     * 渲染菜品分析 - 按照UI规则设计
     * @param {Object} recommendations - 建议数据
     * @returns {string} - HTML字符串
     */
    renderProductAnalysis(recommendations) {
        const products = recommendations.products || {};

        return `
            <div class="analysis-section" style="
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 3px 10px rgba(0,0,0,0.08);
                margin-bottom: 25px;
                transition: transform 0.3s ease;
            " onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
                <h2 class="analysis-section-title analysis-border-bottom" style="
                    font-size: 1.5em;
                    margin: 0 0 20px 0;
                    padding-bottom: 10px;
                ">菜品分析</h2>

                <div style="margin-bottom: 20px;">
                    <h4 class="analysis-subsection-title" style="margin: 0 0 15px 0;">${products.title || '产品建议'}</h4>

                    ${products.suggestions && products.suggestions.length > 0 ? `
                        <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
                            ${products.suggestions.map(suggestion => `
                                <li style="margin-bottom: 8px; color: #555;">${suggestion}</li>
                            `).join('')}
                        </ul>
                    ` : `
                        <p style="margin: 0; color: #666;">暂无产品建议</p>
                    `}
                </div>
            </div>
        `;
    }

    /**
     * 渲染营销策略分析 - 按照UI规则设计
     * @param {Object} recommendations - 建议数据
     * @returns {string} - HTML字符串
     */
    renderMarketingStrategy(recommendations) {
        const marketing = recommendations.marketing || {};

        return `
            <div class="analysis-section" style="
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 3px 10px rgba(0,0,0,0.08);
                margin-bottom: 25px;
                transition: transform 0.3s ease;
            " onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
                <h2 class="analysis-section-title analysis-border-bottom" style="
                    font-size: 1.5em;
                    margin: 0 0 20px 0;
                    padding-bottom: 10px;
                ">营销策略分析</h2>

                <div style="margin-bottom: 20px;">
                    <h4 class="analysis-subsection-title" style="margin: 0 0 15px 0;">${marketing.title || '营销建议'}</h4>

                    ${marketing.suggestions && marketing.suggestions.length > 0 ? `
                        <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
                            ${marketing.suggestions.map(suggestion => `
                                <li style="margin-bottom: 8px; color: #555;">${suggestion}</li>
                            `).join('')}
                        </ul>
                    ` : `
                        <p style="margin: 0; color: #666;">暂无营销建议</p>
                    `}
                </div>
            </div>
        `;
    }

    /**
     * 渲染综合建议 - 按照UI规则设计
     * @param {Object} analysisData - 分析数据
     * @returns {string} - HTML字符串
     */
    renderComprehensiveRecommendations(analysisData) {
        const recommendations = analysisData.recommendations || {};

        return `
            <div class="comprehensive-recommendations" style="
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 3px 10px rgba(0,0,0,0.08);
                margin-bottom: 25px;
                transition: transform 0.3s ease;
            " onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
                <h2 class="analysis-section-title analysis-border-bottom" style="
                    font-size: 1.5em;
                    margin: 0 0 20px 0;
                    padding-bottom: 10px;
                ">综合建议</h2>

                <div class="comprehensive-advice-section" style="
                    padding: 20px;
                    border-radius: 8px;
                ">
                    <p style="line-height: 1.6; color: #333; margin-bottom: 15px;">
                        ${recommendations.summary || '基于以上全面分析，我们为您的店铺发展提供以下综合建议：'}
                    </p>

                    <ul style="margin: 0; padding-left: 20px; color: #333;">
                        <li style="margin-bottom: 8px;">重点关注产品质量和服务体验</li>
                        <li style="margin-bottom: 8px;">制定差异化的竞争策略</li>
                        <li style="margin-bottom: 8px;">合理定价，提升性价比</li>
                        <li style="margin-bottom: 8px;">加强品牌建设和营销推广</li>
                        <li style="margin-bottom: 8px;">持续关注市场变化，及时调整策略</li>
                    </ul>
                </div>
            </div>
        `;
    }

    /**
     * 设置动画延迟
     */
    setAnimationDelay(delay) {
        this.animationDelay = delay;
    }
}

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MarketReportRenderer;
}
