/**
 * 数据统计分析提示词模板
 * 用于生成给AI的专业提示词
 */

class DataStatisticsPromptTemplate {
    /**
     * 生成主要的分析提示词
     * @param {Object} formData - 表单数据
     * @returns {string} - 完整的提示词
     */
    static generateMainPrompt(formData) {
        return `# 生成外卖店铺数据统计表格

请根据以下数据，生成一个简洁的HTML表格形式的数据统计页面。

## 店铺基本信息
- **店铺名称**: ${formData.storeName}
- **店铺地址**: ${formData.storeAddress}
- **经营品类**: ${formData.businessCategory}
- **营业时间**: ${formData.businessHours}

## 30天运营数据
- **曝光人数**: ${formData.exposureCount.toLocaleString()}人
- **入店人数**: ${formData.visitCount.toLocaleString()}人
- **下单人数**: ${formData.orderCount.toLocaleString()}人
- **入店转化率**: ${formData.visitConversion}%
- **下单转化率**: ${formData.orderConversion}%

## 配送服务设置
- **起送价**: ${formData.minOrderPrice}元
- **配送费**: ${formData.deliveryFee}元
- **配送范围**: ${formData.deliveryRange}公里

## 店铺权重配置
- **闲时出餐时长**: ${formData.idleCookingTime || '未设置'}分钟
- **忙时出餐时长**: ${formData.busyCookingTime || '未设置'}分钟
- **青山公益**: ${formData.greenCharity || '未设置'}
- **到店自取**: ${formData.selfPickup || '未设置'}
- **接受预订单**: ${formData.preOrder || '未设置'}
- **准时宝**: ${formData.onTimeGuarantee || '未设置'}
- **放心吃**: ${formData.foodSafety || '未设置'}

## 输出要求

请生成一个HTML页面，包含：

1. **页面标题**: ${formData.storeName} - 数据统计报告

2. **主要数据表格**: 将上述所有数据整理成一个5列的表格，表格结构如下：
   
   | 数据类别 | 具体项目 | 数值/状态 | 数据分析 | 优化建议 |
   |---------|---------|----------|---------|---------|
   | 店铺基本信息 | 店铺名称 | ${formData.storeName} | 店铺名称具有辨识度 | 持续维护品牌形象 |
   | 店铺基本信息 | 店铺地址 | ${formData.storeAddress} | 地理位置便民度分析 | 结合位置做营销 |
   | 店铺基本信息 | 经营品类 | ${formData.businessCategory} | 品类市场竞争情况 | 差异化经营策略 |
   | 店铺基本信息 | 营业时间 | ${formData.businessHours} | 营业时长合理性评估 | 优化营业时间建议 |
   | 30天运营数据 | 曝光人数 | ${formData.exposureCount.toLocaleString()}人 | 曝光量行业对比分析 | 提升曝光度策略 |
   | 30天运营数据 | 入店人数 | ${formData.visitCount.toLocaleString()}人 | 流量质量评估 | 优化店铺吸引力 |
   | 30天运营数据 | 下单人数 | ${formData.orderCount.toLocaleString()}人 | 转化效果分析 | 提升下单转化率 |
   | 30天运营数据 | 入店转化率 | ${formData.visitConversion}% | 与行业平均值比较 | 针对性改进措施 |
   | 30天运营数据 | 下单转化率 | ${formData.orderConversion}% | 购买决策效率分析 | 优化购买流程 |
   | 配送服务设置 | 起送价 | ${formData.minOrderPrice}元 | 价格竞争力评估 | 起送价优化建议 |
   | 配送服务设置 | 配送费 | ${formData.deliveryFee}元 | 配送费合理性分析 | 配送策略调整 |
   | 配送服务设置 | 配送范围 | ${formData.deliveryRange}公里 | 覆盖范围充足性 | 扩大服务半径建议 |
   | 店铺权重配置 | 闲时出餐时长 | ${formData.idleCookingTime || '未设置'}分钟 | 出餐效率评估 | 优化出餐流程 |
   | 店铺权重配置 | 忙时出餐时长 | ${formData.busyCookingTime || '未设置'}分钟 | 高峰期效率分析 | 提升忙时产能 |
   | 店铺权重配置 | 青山公益 | ${formData.greenCharity || '未设置'} | 环保形象影响 | 参与公益的价值 |
   | 店铺权重配置 | 到店自取 | ${formData.selfPickup || '未设置'} | 服务便民性评估 | 开通自取的优势 |
   | 店铺权重配置 | 接受预订单 | ${formData.preOrder || '未设置'} | 预订服务价值 | 预订功能效益分析 |
   | 店铺权重配置 | 准时宝 | ${formData.onTimeGuarantee || '未设置'} | 时效保障重要性 | 准时配送提升策略 |
   | 店铺权重配置 | 放心吃 | ${formData.foodSafety || '未设置'} | 食品安全保障度 | 安全认证价值 |

3. **高端表格样式要求**:
   - 表头使用深度渐变效果 (background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%))
   - 表头文字加粗，白色，带阴影效果
   - 表格整体阴影: box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15)
   - 边框使用渐变: border: 2px solid transparent; background: linear-gradient(white, white) padding-box, linear-gradient(135deg, #667eea, #764ba2) border-box
   - 数据居中对齐，字体使用微软雅黑
   - 隔行变色使用渐变效果
   - 表格宽度100%，最大宽度1200px，居中显示
   - 单元格padding: 16px
   - 重要数值用蓝色胶囊样式高亮显示
   - 表格圆角: border-radius: 12px

4. **页面整体要求**:
   - 页面背景使用淡雅渐变
   - 标题使用大字号，居中，带渐变文字效果
   - 表格外层容器添加白色背景和阴影
   - 响应式设计，适配移动端
   - 整体风格现代、专业、高端

请生成具有视觉冲击力的高质量HTML页面，每个数据分析和优化建议要具体、实用、有针对性。`;
    }

    /**
     * 生成图表配置提示词（已停用）
     * @param {Object} formData - 表单数据
     * @returns {string} - 空字符串
     */
    static generateChartPrompt(formData) {
        return '';
    }

    /**
     * 生成行业对比提示词（已停用）
     * @param {Object} formData - 表单数据
     * @returns {string} - 空字符串
     */
    static generateBenchmarkPrompt(formData) {
        return '';
    }
}

// 导出到全局作用域
window.DataStatisticsPromptTemplate = DataStatisticsPromptTemplate;