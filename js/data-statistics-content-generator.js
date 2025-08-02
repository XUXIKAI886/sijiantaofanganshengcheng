/**
 * 数据统计分析内容生成器
 * 负责生成AI提示词和处理内容生成逻辑
 */

class DataStatisticsContentGenerator {
    constructor() {
        console.log('[数据统计内容] 生成器初始化完成');
    }

    /**
     * 生成完整的AI提示词
     * @param {Object} formData - 表单数据
     * @returns {string} - 完整的提示词
     */
    generatePrompt(formData) {
        try {
            // 验证数据完整性
            this.validateFormData(formData);

            // 生成简化的表格提示词
            let prompt = DataStatisticsPromptTemplate.generateMainPrompt(formData);

            console.log('[数据统计内容] 提示词生成完成，长度:', prompt.length);
            return prompt;

        } catch (error) {
            console.error('[数据统计内容] 提示词生成失败:', error);
            throw new Error(`提示词生成失败: ${error.message}`);
        }
    }

    /**
     * 验证表单数据完整性
     * @param {Object} formData - 表单数据
     */
    validateFormData(formData) {
        const requiredFields = [
            'storeName', 'storeAddress', 'businessCategory', 'businessHours',
            'exposureCount', 'visitCount', 'orderCount'
        ];

        for (const field of requiredFields) {
            if (!formData[field] && formData[field] !== 0) {
                throw new Error(`缺少必要字段: ${field}`);
            }
        }

        // 验证数据逻辑
        if (formData.visitCount > formData.exposureCount) {
            throw new Error('入店人数不能超过曝光人数');
        }

        if (formData.orderCount > formData.visitCount) {
            throw new Error('下单人数不能超过入店人数');
        }
    }

    /**
     * 生成特殊分析要求
     * @param {Object} formData - 表单数据
     * @returns {string} - 特殊分析提示词
     */
    generateSpecialAnalysis(formData) {
        let specialAnalysis = '\n## 特殊分析要求\n\n';

        // 根据转化率水平提供不同的分析重点
        if (formData.visitConversion < 5) {
            specialAnalysis += '### 低转化率重点分析\n';
            specialAnalysis += '- 当前入店转化率较低，请重点分析曝光质量和店铺吸引力问题\n';
            specialAnalysis += '- 提供提升店铺首页展示效果的具体建议\n';
            specialAnalysis += '- 分析可能的流量质量问题\n\n';
        } else if (formData.visitConversion > 20) {
            specialAnalysis += '### 高转化率优势分析\n';
            specialAnalysis += '- 当前入店转化率表现优秀，请分析成功因素\n';
            specialAnalysis += '- 提供保持高转化率的策略建议\n';
            specialAnalysis += '- 探讨进一步提升曝光量的可能性\n\n';
        }

        if (formData.orderConversion < 15) {
            specialAnalysis += '### 下单转化率改进分析\n';
            specialAnalysis += '- 当前下单转化率有待提升，请重点分析用户购买决策障碍\n';
            specialAnalysis += '- 提供菜品价格、促销活动的优化建议\n';
            specialAnalysis += '- 分析配送设置对下单转化的影响\n\n';
        }

        // 配送设置分析
        if (formData.minOrderPrice > 30) {
            specialAnalysis += '### 起送价优化分析\n';
            specialAnalysis += `- 当前起送价${formData.minOrderPrice}元可能偏高，请分析对订单量的影响\n`;
            specialAnalysis += '- 提供起送价调整的建议和预期效果\n\n';
        }

        if (formData.deliveryFee > 5) {
            specialAnalysis += '### 配送费竞争力分析\n';
            specialAnalysis += `- 当前配送费${formData.deliveryFee}元需要重点分析竞争力\n`;
            specialAnalysis += '- 提供配送费优化策略和替代方案\n\n';
        }

        // 服务功能分析
        const serviceFeatures = [
            { key: 'greenCharity', name: '青山公益' },
            { key: 'selfPickup', name: '到店自取' },
            { key: 'preOrder', name: '接受预订单' },
            { key: 'onTimeGuarantee', name: '准时宝' },
            { key: 'foodSafety', name: '放心吃' }
        ];

        const enabledServices = serviceFeatures.filter(service => formData[service.key] === '是');
        const disabledServices = serviceFeatures.filter(service => formData[service.key] !== '是');

        if (disabledServices.length > 2) {
            specialAnalysis += '### 服务功能完善分析\n';
            specialAnalysis += `- 当前有${disabledServices.length}项服务功能未开通\n`;
            specialAnalysis += '- 请分析各项功能对店铺权重和用户体验的影响\n';
            specialAnalysis += '- 提供功能开通的优先级建议\n\n';
        }

        // 出餐时长分析
        if (formData.busyCookingTime === '20' || formData.idleCookingTime === '20') {
            specialAnalysis += '### 出餐效率优化分析\n';
            specialAnalysis += '- 当前出餐时长设置对用户体验和平台权重的影响\n';
            specialAnalysis += '- 提供出餐效率提升的具体建议\n\n';
        }

        return specialAnalysis;
    }

    /**
     * 生成格式要求
     * @returns {string} - 格式要求提示词
     */
    generateFormatRequirements() {
        return `
## 最终输出格式要求

### HTML结构要求
1. **完整的HTML结构**: 包含标题、表格、分析内容等
2. **内联CSS样式**: 所有样式必须写在style标签或内联样式中
3. **表格样式**: 使用以下CSS样式模板

\`\`\`css
.stats-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-family: Arial, sans-serif;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.stats-table th {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 15px;
    text-align: center;
    font-weight: 600;
    border: 1px solid #5a67d8;
}

.stats-table td {
    padding: 12px 15px;
    text-align: center;
    border: 1px solid #e2e8f0;
    background: white;
}

.stats-table tr:nth-child(even) td {
    background: #f8fafc;
}

.stats-table tr:hover td {
    background: #edf2f7;
}

.highlight-value {
    font-weight: bold;
    color: #667eea;
}

.section-title {
    color: #4a5568;
    border-bottom: 2px solid #667eea;
    padding-bottom: 10px;
    margin: 30px 0 20px 0;
}
\`\`\`

### 内容组织要求
1. **报告标题**: 明确标注店铺名称和报告类型
2. **数据表格**: 关键指标必须以表格形式展示
3. **分析章节**: 清晰的章节划分和小标题
4. **可视化建议**: 描述建议创建的图表类型和数据
5. **实用建议**: 每个建议都要具体可执行

### 数据展示要求
- 所有数字都要格式化显示（千分位分隔符）
- 百分比保留2位小数
- 重要数据使用加粗或颜色突出显示
- 对比数据使用表格并排展示

### 专业性要求
- 使用专业的数据分析术语
- 提供具体的改进数值目标
- 包含行业标准对比数据
- 给出可操作的实施建议

请严格按照以上要求生成报告，确保输出的是纯净的HTML内容，不包含任何markdown标记。
        `;
    }

    /**
     * 生成数据汇总信息
     * @param {Object} formData - 表单数据
     * @returns {Object} - 数据汇总对象
     */
    generateDataSummary(formData) {
        return {
            // 基础数据
            totalExposure: formData.exposureCount,
            totalVisits: formData.visitCount,
            totalOrders: formData.orderCount,
            
            // 转化率
            visitConversion: formData.visitConversion,
            orderConversion: formData.orderConversion,
            
            // 配送设置
            deliverySettings: {
                minOrder: formData.minOrderPrice,
                deliveryFee: formData.deliveryFee,
                range: formData.deliveryRange
            },
            
            // 服务功能统计
            serviceFeatures: this.analyzeServiceFeatures(formData),
            
            // 竞争力评分
            competitiveScore: this.calculateCompetitiveScore(formData),
            
            // 改进优先级
            improvementPriorities: this.generateImprovementPriorities(formData)
        };
    }

    /**
     * 分析服务功能开通情况
     * @param {Object} formData - 表单数据
     * @returns {Object} - 服务功能分析结果
     */
    analyzeServiceFeatures(formData) {
        const features = [
            { key: 'greenCharity', name: '青山公益', weight: 0.15 },
            { key: 'selfPickup', name: '到店自取', weight: 0.2 },
            { key: 'preOrder', name: '接受预订单', weight: 0.2 },
            { key: 'onTimeGuarantee', name: '准时宝', weight: 0.25 },
            { key: 'foodSafety', name: '放心吃', weight: 0.2 }
        ];

        const enabled = features.filter(f => formData[f.key] === '是');
        const disabled = features.filter(f => formData[f.key] !== '是');

        const completionRate = (enabled.length / features.length * 100).toFixed(1);
        const weightedScore = enabled.reduce((sum, f) => sum + f.weight, 0) * 100;

        return {
            enabled: enabled.map(f => f.name),
            disabled: disabled.map(f => f.name),
            completionRate: parseFloat(completionRate),
            weightedScore: Math.round(weightedScore),
            recommendations: disabled.slice(0, 2).map(f => f.name) // 推荐开通前2个
        };
    }

    /**
     * 计算综合竞争力评分
     * @param {Object} formData - 表单数据
     * @returns {number} - 竞争力评分 (0-100)
     */
    calculateCompetitiveScore(formData) {
        let score = 0;

        // 转化率评分 (40分)
        const visitScore = Math.min(formData.visitConversion * 2, 20);
        const orderScore = Math.min(formData.orderConversion * 0.8, 20);
        score += visitScore + orderScore;

        // 配送设置评分 (30分)
        let deliveryScore = 0;
        if (formData.minOrderPrice <= 20) deliveryScore += 10;
        else if (formData.minOrderPrice <= 30) deliveryScore += 7;
        else if (formData.minOrderPrice <= 40) deliveryScore += 4;

        if (formData.deliveryFee <= 3) deliveryScore += 10;
        else if (formData.deliveryFee <= 5) deliveryScore += 7;
        else if (formData.deliveryFee <= 8) deliveryScore += 4;

        if (formData.deliveryRange >= 5) deliveryScore += 10;
        else if (formData.deliveryRange >= 3) deliveryScore += 7;

        score += Math.min(deliveryScore, 30);

        // 服务功能评分 (30分)
        const serviceAnalysis = this.analyzeServiceFeatures(formData);
        score += (serviceAnalysis.weightedScore * 0.3);

        return Math.min(Math.round(score), 100);
    }

    /**
     * 生成改进优先级建议
     * @param {Object} formData - 表单数据
     * @returns {Array} - 优先级建议列表
     */
    generateImprovementPriorities(formData) {
        const priorities = [];

        // 转化率改进
        if (formData.visitConversion < 10) {
            priorities.push({
                category: '流量质量',
                priority: 'high',
                description: '提升曝光质量和店铺吸引力',
                impact: '直接影响进店率'
            });
        }

        if (formData.orderConversion < 20) {
            priorities.push({
                category: '下单转化',
                priority: 'high',
                description: '优化菜品价格和促销策略',
                impact: '直接影响订单量'
            });
        }

        // 配送设置改进
        if (formData.minOrderPrice > 30) {
            priorities.push({
                category: '配送设置',
                priority: 'medium',
                description: '考虑降低起送价至25-30元',
                impact: '提升订单频次'
            });
        }

        if (formData.deliveryFee > 5) {
            priorities.push({
                category: '配送费用',
                priority: 'medium',
                description: '优化配送费或推出免配送费活动',
                impact: '提升用户下单意愿'
            });
        }

        // 服务功能改进
        const serviceAnalysis = this.analyzeServiceFeatures(formData);
        if (serviceAnalysis.completionRate < 60) {
            priorities.push({
                category: '服务功能',
                priority: 'low',
                description: `开通${serviceAnalysis.recommendations.join('、')}等功能`,
                impact: '提升平台权重和用户体验'
            });
        }

        return priorities.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }

    /**
     * 格式化数字显示
     * @param {number} number - 要格式化的数字
     * @returns {string} - 格式化后的字符串
     */
    formatNumber(number) {
        if (typeof number !== 'number') return number;
        return number.toLocaleString();
    }

    /**
     * 格式化百分比显示
     * @param {number} percentage - 百分比数值
     * @returns {string} - 格式化后的百分比字符串
     */
    formatPercentage(percentage) {
        if (typeof percentage !== 'number') return percentage;
        return `${percentage.toFixed(2)}%`;
    }
}

// 导出到全局作用域
window.DataStatisticsContentGenerator = DataStatisticsContentGenerator;