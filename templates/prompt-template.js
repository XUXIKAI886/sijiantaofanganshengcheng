/**
 * DeepSeek API 提示词模板
 * 基于现有的品牌定位分析提示词模板
 */

class PromptTemplate {
    /**
     * 构建品牌定位分析提示词
     * @param {Object} storeData - 店铺数据
     * @returns {string} - 完整的提示词
     */
    static buildAnalysisPrompt(storeData) {
        const {
            storeName,
            category,
            address,
            targetGroup,
            priceRange,
            mainProducts,
            features
        } = storeData;
        
        return `# 角色设定
你是一位资深的餐饮行业品牌分析专家，拥有超过10年的品牌定位和市场分析经验。你擅长从多个维度深入分析餐饮品牌，提供专业、详细、可操作的分析报告和建议。

## 店铺基础信息
- **店铺名称**：${storeName}
- **经营品类**：${category}
- **店铺地址**：${address || '未提供'}
- **目标客群**：${targetGroup || '未指定'}
- **价格区间**：人均${priceRange || '未指定'}元
- **主营产品**：${mainProducts || '未提供'}
- **经营特色**：${features || '未提供'}

## 专业分析要求
请基于以上信息，进行深度的8维度品牌定位分析。每个维度需要包含：
1. **详细的现状分析**（至少3-4个要点）
2. **专业的数据洞察**（结合行业趋势和市场数据）
3. **具体的优化建议**（可操作的实施方案）
4. **预期效果评估**（量化的改进预期）

### 分析维度要求：

#### 1. 产品定位分析
- 深度分析产品在细分市场中的定位和差异化优势
- 评估产品与目标客群需求的匹配度
- 分析产品生命周期阶段和发展潜力
- 提供产品升级和创新的具体建议

#### 2. 主营招牌分析
- 评估招牌产品的市场吸引力和盈利能力
- 分析招牌产品的品牌价值和传播效果
- 对比同类竞品的招牌产品策略
- 提供招牌产品优化和推广的实施方案

#### 3. 目标客群分析
- 精准描绘目标客群的人口统计学特征
- 深入分析客群的消费心理和行为偏好
- 评估当前客群覆盖的准确性和完整性
- 制定客群拓展和维护的营销策略

#### 4. 消费模式分析
- 分析目标客群的消费频次和消费时段
- 研究消费决策过程和影响因素
- 评估消费模式的季节性和周期性特征
- 提供消费模式优化的具体措施

#### 5. 消费场景分析
- 识别和分析主要消费场景的特点
- 评估不同场景下的用户体验和满意度
- 分析场景化营销的机会和挑战
- 制定场景化产品和服务策略

#### 6. 价格策略分析
- 分析价格在同类竞品中的竞争地位
- 评估价格敏感度和价格弹性
- 研究价格与品质感知的关系
- 提供动态定价和促销策略建议

#### 7. 品牌形象分析
- 评估店铺名称的品牌价值和传播效果
- 分析品牌形象与目标定位的一致性
- 研究品牌在消费者心中的认知和联想
- 提供品牌形象提升的具体方案

#### 8. 渠道策略分析
- 分析当前销售渠道的优势和局限性
- 评估多渠道布局的必要性和可行性
- 研究渠道整合和协同的机会
- 制定渠道拓展和优化的实施计划

## 输出格式要求
请严格按照以下HTML格式输出分析结果，确保内容详细、专业、可操作：

<div class="analysis-section">
    <h2 class="section-title">一、产品定位分析</h2>
    <div class="analysis-content">
        <h3>现状分析</h3>
        <ul>
            <li><strong>市场定位</strong>：[详细分析产品在细分市场中的定位，包括价格档次、品质层级、目标市场等]</li>
            <li><strong>差异化优势</strong>：[深入分析产品的独特卖点和竞争优势，对比同类产品]</li>
            <li><strong>产品特色</strong>：[分析产品的核心特色和价值主张]</li>
            <li><strong>匹配度评估</strong>：[评估产品与目标客群需求的匹配程度]</li>
        </ul>
        <h3>优化建议</h3>
        <ul>
            <li><strong>定位优化</strong>：[提供具体的定位调整建议]</li>
            <li><strong>产品升级</strong>：[提供产品改进和创新的具体方案]</li>
            <li><strong>差异化策略</strong>：[制定差异化竞争的实施计划]</li>
        </ul>
        <h3>预期效果</h3>
        <p>[量化预期改进效果，如销量提升、客户满意度改善等]</p>
    </div>
</div>

<div class="analysis-section">
    <h2 class="section-title">二、主营招牌分析</h2>
    <div class="analysis-content">
        <h3>现状分析</h3>
        <ul>
            <li><strong>招牌产品评估</strong>：[分析当前主营产品的市场表现和竞争力]</li>
            <li><strong>品牌价值</strong>：[评估招牌产品的品牌价值和传播效果]</li>
            <li><strong>盈利能力</strong>：[分析招牌产品的盈利能力和成本结构]</li>
            <li><strong>竞品对比</strong>：[对比同类竞品的招牌产品策略]</li>
        </ul>
        <h3>优化建议</h3>
        <ul>
            <li><strong>产品优化</strong>：[提供招牌产品改进的具体建议]</li>
            <li><strong>推广策略</strong>：[制定招牌产品推广的实施方案]</li>
            <li><strong>组合策略</strong>：[建议产品组合和套餐设计]</li>
        </ul>
        <h3>预期效果</h3>
        <p>[预期招牌产品优化后的效果提升]</p>
    </div>
</div>

<div class="analysis-section">
    <h2 class="section-title">三、目标客群分析</h2>
    <div class="analysis-content">
        <h3>客群画像</h3>
        <ul>
            <li><strong>人口统计特征</strong>：[详细描述年龄、性别、收入、职业等特征]</li>
            <li><strong>消费心理</strong>：[分析客群的消费动机和心理需求]</li>
            <li><strong>行为偏好</strong>：[分析消费习惯、购买决策过程等]</li>
            <li><strong>生活方式</strong>：[分析客群的生活方式和价值观]</li>
        </ul>
        <h3>覆盖分析</h3>
        <ul>
            <li><strong>当前覆盖评估</strong>：[评估当前客群覆盖的准确性]</li>
            <li><strong>潜在客群识别</strong>：[识别未覆盖的潜在客群]</li>
            <li><strong>客群细分</strong>：[提供更精细的客群细分建议]</li>
        </ul>
        <h3>营销策略</h3>
        <ul>
            <li><strong>获客策略</strong>：[制定针对性的获客方案]</li>
            <li><strong>留存策略</strong>：[提供客户留存和复购的策略]</li>
            <li><strong>传播策略</strong>：[设计有效的品牌传播方案]</li>
        </ul>
    </div>
</div>

<div class="analysis-section">
    <h2 class="section-title">四、消费模式分析</h2>
    <div class="analysis-content">
        <h3>消费行为分析</h3>
        <ul>
            <li><strong>消费频次</strong>：[分析客群的消费频率和周期性]</li>
            <li><strong>消费时段</strong>：[分析主要消费时间段和高峰期]</li>
            <li><strong>消费金额</strong>：[分析平均消费金额和价格敏感度]</li>
            <li><strong>决策过程</strong>：[分析消费决策的影响因素]</li>
        </ul>
        <h3>模式特征</h3>
        <ul>
            <li><strong>季节性特征</strong>：[分析消费的季节性变化]</li>
            <li><strong>场景化特征</strong>：[分析不同场景下的消费模式]</li>
            <li><strong>群体性特征</strong>：[分析个人消费vs群体消费的特点]</li>
        </ul>
        <h3>优化建议</h3>
        <ul>
            <li><strong>频次提升</strong>：[提供提升消费频次的具体措施]</li>
            <li><strong>客单价优化</strong>：[制定提升客单价的策略]</li>
            <li><strong>时段优化</strong>：[优化不同时段的运营策略]</li>
        </ul>
    </div>
</div>

<div class="analysis-section">
    <h2 class="section-title">五、消费场景分析</h2>
    <div class="analysis-content">
        <h3>场景识别</h3>
        <ul>
            <li><strong>主要消费场景</strong>：[详细分析主要的消费场景和特点]</li>
            <li><strong>场景频次</strong>：[分析各场景的使用频率和重要性]</li>
            <li><strong>场景需求</strong>：[分析不同场景下的用户需求差异]</li>
            <li><strong>场景体验</strong>：[评估当前各场景下的用户体验]</li>
        </ul>
        <h3>场景优化</h3>
        <ul>
            <li><strong>场景化产品</strong>：[设计针对不同场景的产品策略]</li>
            <li><strong>场景化服务</strong>：[制定场景化的服务方案]</li>
            <li><strong>场景化营销</strong>：[设计场景化的营销策略]</li>
        </ul>
        <h3>新场景拓展</h3>
        <p>[识别和开发新的消费场景机会]</p>
    </div>
</div>

<div class="analysis-section">
    <h2 class="section-title">六、价格策略分析</h2>
    <div class="analysis-content">
        <h3>价格竞争力分析</h3>
        <ul>
            <li><strong>市场定位</strong>：[分析价格在同类产品中的竞争地位]</li>
            <li><strong>价值感知</strong>：[评估价格与品质感知的匹配度]</li>
            <li><strong>价格敏感度</strong>：[分析目标客群的价格敏感程度]</li>
            <li><strong>竞品对比</strong>：[对比主要竞品的价格策略]</li>
        </ul>
        <h3>定价策略</h3>
        <ul>
            <li><strong>定价模式</strong>：[分析当前定价模式的合理性]</li>
            <li><strong>价格结构</strong>：[优化产品价格结构和梯度]</li>
            <li><strong>促销策略</strong>：[制定有效的促销和折扣策略]</li>
        </ul>
        <h3>价格优化建议</h3>
        <ul>
            <li><strong>调价建议</strong>：[提供具体的价格调整建议]</li>
            <li><strong>套餐设计</strong>：[设计有吸引力的套餐组合]</li>
            <li><strong>动态定价</strong>：[考虑时段和需求的动态定价]</li>
        </ul>
    </div>
</div>

<div class="analysis-section">
    <h2 class="section-title">七、品牌形象分析</h2>
    <div class="analysis-content">
        <h3>品牌现状</h3>
        <ul>
            <li><strong>品牌认知</strong>：[分析消费者对品牌的认知和印象]</li>
            <li><strong>品牌联想</strong>：[分析品牌在消费者心中的联想]</li>
            <li><strong>品牌价值</strong>：[评估品牌的价值主张和差异化]</li>
            <li><strong>传播效果</strong>：[评估当前品牌传播的效果]</li>
        </ul>
        <h3>形象优化</h3>
        <ul>
            <li><strong>视觉识别</strong>：[优化品牌视觉识别系统]</li>
            <li><strong>品牌故事</strong>：[构建有吸引力的品牌故事]</li>
            <li><strong>品牌体验</strong>：[提升整体品牌体验]</li>
        </ul>
        <h3>传播策略</h3>
        <p>[制定系统性的品牌传播和推广策略]</p>
    </div>
</div>

<div class="analysis-section">
    <h2 class="section-title">八、渠道策略分析</h2>
    <div class="analysis-content">
        <h3>当前渠道分析</h3>
        <ul>
            <li><strong>渠道优势</strong>：[分析当前销售渠道的优势和特点]</li>
            <li><strong>渠道局限</strong>：[识别当前渠道的局限性和风险]</li>
            <li><strong>渠道效率</strong>：[评估渠道的运营效率和成本]</li>
            <li><strong>客户触达</strong>：[分析渠道的客户覆盖能力]</li>
        </ul>
        <h3>渠道拓展</h3>
        <ul>
            <li><strong>多渠道布局</strong>：[制定多渠道发展策略]</li>
            <li><strong>渠道整合</strong>：[设计渠道整合和协同方案]</li>
            <li><strong>新渠道探索</strong>：[探索新兴销售渠道的机会]</li>
        </ul>
        <h3>实施计划</h3>
        <ul>
            <li><strong>优先级排序</strong>：[确定渠道拓展的优先级]</li>
            <li><strong>实施步骤</strong>：[制定详细的实施计划]</li>
            <li><strong>风险控制</strong>：[识别和控制渠道拓展风险]</li>
        </ul>
    </div>
</div>

## 专业要求和注意事项

### 内容质量要求
1. **深度分析**：每个维度至少提供4-6个具体分析要点，避免泛泛而谈
2. **数据支撑**：尽可能结合行业数据、市场趋势进行分析
3. **专业术语**：使用准确的商业和营销专业术语
4. **逻辑性**：确保分析逻辑清晰，前后一致

### 建议可操作性
1. **具体措施**：提供具体的、可执行的改进措施
2. **实施步骤**：对复杂建议提供分步实施方案
3. **资源评估**：考虑实施建议所需的资源和成本
4. **效果预期**：提供量化的预期效果评估

### 格式规范
1. **严格HTML格式**：必须按照指定的HTML结构输出
2. **标签完整性**：确保所有HTML标签正确开启和闭合
3. **内容充实**：每个分析要点都要有实质性内容，不能空泛
4. **专业表达**：使用专业、准确的商业分析语言

### 个性化要求
1. **结合实际**：所有分析都要紧密结合该店铺的具体情况
2. **行业特色**：充分考虑${category}行业的特点和趋势
3. **地域因素**：考虑地理位置对经营的影响
4. **目标导向**：所有建议都要围绕提升经营效果的目标

请基于以上要求，开始进行深度专业的品牌定位分析：`;
    }
    
    /**
     * 构建简化版提示词（用于测试）
     * @param {Object} storeData - 店铺数据
     * @returns {string} - 简化的提示词
     */
    static buildSimplePrompt(storeData) {
        const { storeName, category } = storeData;
        
        return `请对"${storeName}"（经营品类：${category}）进行简要的品牌定位分析，包含以下3个方面：

1. 产品定位分析
2. 人群定位分析
3. 价格定位分析

请以HTML格式输出，使用以下结构：
<div class="analysis-section">
    <h2>一、产品定位分析</h2>
    <ul>
        <li>分析要点1</li>
        <li>分析要点2</li>
    </ul>
</div>

请确保分析内容专业、具体、有针对性。`;
    }
    
    /**
     * 构建测试连接提示词
     * @returns {string} - 测试提示词
     */
    static buildTestPrompt() {
        return '请回复"API连接成功，品牌定位分析应用已就绪"';
    }
    
    /**
     * 验证店铺数据完整性
     * @param {Object} storeData - 店铺数据
     * @returns {Object} - 验证结果
     */
    static validateStoreData(storeData) {
        const errors = [];
        const warnings = [];
        
        // 必填字段检查
        if (!storeData.storeName) {
            errors.push('店铺名称不能为空');
        }
        
        if (!storeData.category) {
            errors.push('经营品类不能为空');
        }
        
        // 可选字段建议
        if (!storeData.address) {
            warnings.push('建议提供店铺地址以获得更准确的分析');
        }
        
        if (!storeData.targetGroup) {
            warnings.push('建议指定目标客群以获得更精准的分析');
        }
        
        if (!storeData.mainProducts) {
            warnings.push('建议提供主营产品信息以获得更详细的分析');
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }
    
    /**
     * 获取提示词统计信息
     * @param {string} prompt - 提示词
     * @returns {Object} - 统计信息
     */
    static getPromptStats(prompt) {
        return {
            length: prompt.length,
            wordCount: prompt.split(/\s+/).length,
            estimatedTokens: Math.ceil(prompt.length / 4) // 粗略估算
        };
    }
}

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PromptTemplate;
}
