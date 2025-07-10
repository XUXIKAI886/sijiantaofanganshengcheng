/**
 * API备用方案 - 模拟API响应用于演示
 * 当真实API不可用时，提供模拟数据
 */

class APIFallback {
    constructor() {
        this.isEnabled = true;
        this.delay = 2000; // 模拟网络延迟
    }

    /**
     * 模拟品牌分析API响应
     */
    async generateBrandAnalysis(formData) {
        console.log('[API备用] 生成品牌分析模拟数据...');
        
        // 模拟网络延迟
        await this.sleep(this.delay);
        
        const mockResponse = `
<div class="analysis-section">
    <h2 class="section-title">一、产品定位分析</h2>
    <div class="analysis-content">
        <h3>现状分析</h3>
        <ul>
            <li><strong>市场定位</strong>：${formData.storeName}在${formData.category}细分市场中定位为中端品牌，主要面向${formData.targetGroup}群体，价格区间人均${formData.priceRange}元属于中等消费水平。</li>
            <li><strong>差异化优势</strong>：主营产品"${formData.mainProducts}"具有快速出餐的优势，在同类竞品中具备时间效率的差异化特色。</li>
            <li><strong>产品特色</strong>：以"${formData.features}"为核心价值主张，满足快节奏生活下的用餐需求。</li>
            <li><strong>匹配度评估</strong>：产品定位与目标客群需求匹配度较高，符合白领上班族对便捷、健康餐饮的需求。</li>
        </ul>
        <h3>优化建议</h3>
        <ul>
            <li><strong>定位优化</strong>：建议进一步强化"健康快餐"的定位，突出营养搭配和食材新鲜度。</li>
            <li><strong>产品升级</strong>：可考虑增加轻食、沙拉等健康选项，满足不同饮食偏好。</li>
            <li><strong>差异化策略</strong>：建立标准化出餐流程，确保5分钟内完成制作，形成时间优势。</li>
        </ul>
        <h3>预期效果</h3>
        <p>通过定位优化，预期可提升品牌认知度15-20%，客户满意度提升10-15%，复购率增长8-12%。</p>
    </div>
</div>

<div class="analysis-section">
    <h2 class="section-title">二、主营招牌分析</h2>
    <div class="analysis-content">
        <h3>现状分析</h3>
        <ul>
            <li><strong>招牌产品评估</strong>：${formData.mainProducts}作为主营产品，具有制作简单、成本可控、口味稳定的优势。</li>
            <li><strong>品牌价值</strong>：招牌产品承载了品牌的核心价值，是客户认知的重要载体。</li>
            <li><strong>盈利能力</strong>：盖饭类产品毛利率通常在60-70%，具有良好的盈利空间。</li>
            <li><strong>竞品对比</strong>：在同类快餐中，盖饭炒饭类产品竞争激烈，需要在口味和服务上形成差异。</li>
        </ul>
        <h3>优化建议</h3>
        <ul>
            <li><strong>产品优化</strong>：开发3-5款特色招牌盖饭，形成产品矩阵，满足不同口味需求。</li>
            <li><strong>推广策略</strong>：通过限时特价、套餐组合等方式推广招牌产品。</li>
            <li><strong>组合策略</strong>：设计"招牌盖饭+汤+小菜"的套餐，提升客单价。</li>
        </ul>
        <h3>预期效果</h3>
        <p>招牌产品优化后，预期主营产品销量提升20-25%，客单价增长15-20%。</p>
    </div>
</div>

<div class="analysis-section">
    <h2 class="section-title">三、目标客群分析</h2>
    <div class="analysis-content">
        <h3>客群画像</h3>
        <ul>
            <li><strong>人口统计特征</strong>：主要为25-40岁的白领上班族，月收入5000-15000元，大专以上学历。</li>
            <li><strong>消费心理</strong>：追求便捷、健康、性价比，注重用餐效率和营养搭配。</li>
            <li><strong>行为偏好</strong>：习惯线上点餐，偏好固定用餐时间，对品牌忠诚度较高。</li>
            <li><strong>生活方式</strong>：工作节奏快，注重健康饮食，愿意为品质付费。</li>
        </ul>
        <h3>覆盖分析</h3>
        <ul>
            <li><strong>当前覆盖评估</strong>：目标客群定位准确，覆盖了核心消费群体的80%。</li>
            <li><strong>潜在客群识别</strong>：可拓展至学生群体和居家办公人群。</li>
            <li><strong>客群细分</strong>：按消费频次分为高频用户、中频用户、低频用户三类。</li>
        </ul>
        <h3>营销策略</h3>
        <ul>
            <li><strong>获客策略</strong>：通过写字楼地推、线上广告投放精准获客。</li>
            <li><strong>留存策略</strong>：建立会员体系，提供积分奖励和专属优惠。</li>
            <li><strong>传播策略</strong>：利用社交媒体和口碑营销扩大品牌影响力。</li>
        </ul>
    </div>
</div>

<div class="analysis-section">
    <h2 class="section-title">四、消费模式分析</h2>
    <div class="analysis-content">
        <h3>消费行为分析</h3>
        <ul>
            <li><strong>消费频次</strong>：目标客群平均每周消费2-3次，高频用户可达每日一次。</li>
            <li><strong>消费时段</strong>：主要集中在11:30-13:30午餐时段和18:00-20:00晚餐时段。</li>
            <li><strong>消费金额</strong>：平均客单价${formData.priceRange}元，价格敏感度中等。</li>
            <li><strong>决策过程</strong>：决策时间短，主要考虑口味、价格、配送时间三个因素。</li>
        </ul>
        <h3>模式特征</h3>
        <ul>
            <li><strong>季节性特征</strong>：夏季订单量略有下降，冬季需求相对稳定。</li>
            <li><strong>场景化特征</strong>：主要为工作日午餐场景，周末订单量下降明显。</li>
            <li><strong>群体性特征</strong>：以个人消费为主，偶有团体订餐需求。</li>
        </ul>
        <h3>优化建议</h3>
        <ul>
            <li><strong>频次提升</strong>：推出"周卡"、"月卡"等优惠套餐，提升消费频次。</li>
            <li><strong>客单价优化</strong>：通过套餐搭配和加料服务提升客单价。</li>
            <li><strong>时段优化</strong>：在非高峰时段推出特价活动，平衡订单分布。</li>
        </ul>
    </div>
</div>

<div class="analysis-section">
    <h2 class="section-title">五、消费场景分析</h2>
    <div class="analysis-content">
        <h3>场景识别</h3>
        <ul>
            <li><strong>主要消费场景</strong>：办公室用餐占70%，居家用餐占20%，其他场景占10%。</li>
            <li><strong>场景频次</strong>：工作日午餐为最高频场景，晚餐次之。</li>
            <li><strong>场景需求</strong>：办公室场景注重快速配送，居家场景更关注口味和分量。</li>
            <li><strong>场景体验</strong>：当前配送时效基本满足办公室场景需求。</li>
        </ul>
        <h3>场景优化</h3>
        <ul>
            <li><strong>场景化产品</strong>：针对办公室场景推出"轻食套餐"，居家场景推出"家庭装"。</li>
            <li><strong>场景化服务</strong>：提供预约配送、定时送达等个性化服务。</li>
            <li><strong>场景化营销</strong>：在不同时段推送适合的产品推荐。</li>
        </ul>
        <h3>新场景拓展</h3>
        <p>可考虑拓展夜宵场景和周末休闲场景，增加营收时段。</p>
    </div>
</div>

<div class="analysis-section">
    <h2 class="section-title">六、价格策略分析</h2>
    <div class="analysis-content">
        <h3>价格竞争力分析</h3>
        <ul>
            <li><strong>市场定位</strong>：人均${formData.priceRange}元的价格在同类产品中属于中等水平，具有一定竞争力。</li>
            <li><strong>价值感知</strong>：客户对当前价格的接受度较高，认为性价比合理。</li>
            <li><strong>价格敏感度</strong>：目标客群对价格敏感度中等，更注重品质和服务。</li>
            <li><strong>竞品对比</strong>：与主要竞品价格差异在5-10元范围内，处于合理区间。</li>
        </ul>
        <h3>定价策略</h3>
        <ul>
            <li><strong>定价模式</strong>：采用成本加成定价法，确保合理利润空间。</li>
            <li><strong>价格结构</strong>：建立基础款、标准款、豪华款三档价格体系。</li>
            <li><strong>促销策略</strong>：定期推出限时特价、满减优惠等促销活动。</li>
        </ul>
        <h3>价格优化建议</h3>
        <ul>
            <li><strong>调价建议</strong>：可考虑将部分产品价格上调2-3元，测试市场接受度。</li>
            <li><strong>套餐设计</strong>：推出"超值套餐"，通过组合销售提升客单价。</li>
            <li><strong>动态定价</strong>：在高峰时段适当上调价格，低峰时段推出优惠。</li>
        </ul>
    </div>
</div>

<div class="analysis-section">
    <h2 class="section-title">七、品牌形象分析</h2>
    <div class="analysis-content">
        <h3>品牌现状</h3>
        <ul>
            <li><strong>品牌认知</strong>：${formData.storeName}在目标客群中具有一定知名度，但品牌形象有待提升。</li>
            <li><strong>品牌联想</strong>：客户主要将品牌与"快速"、"便宜"联系，健康形象不够突出。</li>
            <li><strong>品牌价值</strong>：当前品牌价值主要体现在便利性，缺乏情感连接。</li>
            <li><strong>传播效果</strong>：主要依靠平台推广，自主品牌传播力度不足。</li>
        </ul>
        <h3>形象优化</h3>
        <ul>
            <li><strong>视觉识别</strong>：设计统一的品牌LOGO和包装，提升视觉识别度。</li>
            <li><strong>品牌故事</strong>：构建"为忙碌生活提供健康美味"的品牌故事。</li>
            <li><strong>品牌体验</strong>：从产品、服务、包装等全方位提升品牌体验。</li>
        </ul>
        <h3>传播策略</h3>
        <p>建立多渠道品牌传播矩阵，包括社交媒体、内容营销、口碑传播等。</p>
    </div>
</div>

<div class="analysis-section">
    <h2 class="section-title">八、渠道策略分析</h2>
    <div class="analysis-content">
        <h3>当前渠道分析</h3>
        <ul>
            <li><strong>渠道优势</strong>：外卖平台覆盖面广，获客成本相对较低，操作简便。</li>
            <li><strong>渠道局限</strong>：过度依赖单一平台，缺乏自主客户资源，平台抽成较高。</li>
            <li><strong>渠道效率</strong>：当前渠道运营效率良好，但缺乏差异化竞争优势。</li>
            <li><strong>客户触达</strong>：主要通过平台推荐和搜索触达客户，主动营销能力有限。</li>
        </ul>
        <h3>渠道拓展</h3>
        <ul>
            <li><strong>多渠道布局</strong>：建议开发微信小程序、企业团餐等新渠道。</li>
            <li><strong>渠道整合</strong>：建立统一的订单管理系统，实现多渠道协同。</li>
            <li><strong>新渠道探索</strong>：考虑社群营销、直播带货等新兴渠道。</li>
        </ul>
        <h3>实施计划</h3>
        <ul>
            <li><strong>优先级排序</strong>：优先开发微信小程序，其次拓展企业团餐渠道。</li>
            <li><strong>实施步骤</strong>：第一阶段建立自有渠道，第二阶段整合多渠道，第三阶段优化运营。</li>
            <li><strong>风险控制</strong>：避免过度分散资源，确保核心渠道稳定运营。</li>
        </ul>
    </div>
</div>`;

        return mockResponse;
    }

    /**
     * 模拟商圈调研API响应
     */
    async generateMarketAnalysis(formData) {
        console.log('[API备用] 生成商圈调研模拟数据...');
        
        // 模拟网络延迟
        await this.sleep(this.delay);
        
        const mockResponse = `
<!-- 商圈概况卡片 -->
<div class="market-overview-section">
    <h2 class="market-section-title">商圈概况</h2>
    <div class="market-overview-cards">
        <div class="market-overview-card">
            <h3>商圈评级</h3>
            <div class="market-score">A级</div>
            <p>优质商圈，发展潜力大</p>
        </div>
        <div class="market-overview-card">
            <h3>投资潜力</h3>
            <div class="market-score">8.5分</div>
            <p>投资回报预期良好</p>
        </div>
        <div class="market-overview-card">
            <h3>竞争激烈度</h3>
            <div class="market-score">7.2分</div>
            <p>竞争较为激烈</p>
        </div>
        <div class="market-overview-card">
            <h3>推荐指数</h3>
            <div class="market-score">8.8分</div>
            <p>强烈推荐投资</p>
        </div>
    </div>
</div>

<!-- 可视化图表数据区域 -->
<div class="market-charts-section">
    <h2 class="market-section-title">数据可视化分析</h2>
    <div class="market-charts-container">
        <!-- 人流量分析图表 -->
        <div class="market-chart-item">
            <h3>人流量时段分析</h3>
            <div class="chart-data" data-chart-type="line" data-chart-title="人流量时段分析">
                [{"time": "8:00", "value": 45}, {"time": "10:00", "value": 65}, {"time": "12:00", "value": 95}, {"time": "14:00", "value": 75}, {"time": "16:00", "value": 60}, {"time": "18:00", "value": 85}, {"time": "20:00", "value": 70}, {"time": "22:00", "value": 35}]
            </div>
        </div>
        
        <!-- 竞争对手分析图表 -->
        <div class="market-chart-item">
            <h3>竞争对手评分对比</h3>
            <div class="chart-data" data-chart-type="radar" data-chart-title="竞争对手评分对比">
                [{"name": "产品质量", "value": 8.5}, {"name": "价格竞争力", "value": 7.2}, {"name": "服务水平", "value": 8.0}, {"name": "品牌知名度", "value": 6.8}, {"name": "位置优势", "value": 9.0}, {"name": "营销能力", "value": 7.5}]
            </div>
        </div>
        
        <!-- 消费水平分布图表 -->
        <div class="market-chart-item">
            <h3>消费水平分布</h3>
            <div class="chart-data" data-chart-type="pie" data-chart-title="消费水平分布">
                [{"category": "高消费(>100元)", "value": 25}, {"category": "中高消费(50-100元)", "value": 35}, {"category": "中等消费(30-50元)", "value": 30}, {"category": "低消费(<30元)", "value": 10}]
            </div>
        </div>
        
        <!-- 业态分布图表 -->
        <div class="market-chart-item">
            <h3>商圈业态分布</h3>
            <div class="chart-data" data-chart-type="column" data-chart-title="商圈业态分布">
                [{"category": "餐饮", "value": 40}, {"category": "零售", "value": 25}, {"category": "服务", "value": 20}, {"category": "娱乐", "value": 10}, {"category": "其他", "value": 5}]
            </div>
        </div>
    </div>
</div>

<div class="market-analysis-section">
    <h2 class="market-section-title">一、地理位置分析</h2>
    <div class="market-analysis-content">
        <h3>位置优势分析</h3>
        <ul>
            <li><strong>交通便利性</strong>：${formData.areaName}位于${formData.location}，地铁、公交线路密集，交通便利度极高，可达性强。</li>
            <li><strong>地理优势</strong>：处于城市核心商业区，周边配套完善，具有显著的地理位置优势。</li>
            <li><strong>周边配套</strong>：周边有大型购物中心、写字楼群、住宅区，形成完整的商业生态圈。</li>
            <li><strong>可达性分析</strong>：目标客群可在15分钟内到达，覆盖半径3公里内有大量潜在客户。</li>
            <li><strong>成本影响</strong>：优越位置带来的租金成本较高，但客流量和品牌价值可以覆盖成本。</li>
        </ul>
        <h3>位置劣势分析</h3>
        <ul>
            <li><strong>交通限制</strong>：高峰期交通拥堵，可能影响配送效率。</li>
            <li><strong>环境因素</strong>：商业区噪音较大，但对外卖业务影响有限。</li>
            <li><strong>竞争密度</strong>：同类餐饮店铺密集，竞争激烈。</li>
        </ul>
        <h3>优化建议</h3>
        <ul>
            <li><strong>位置营销</strong>：充分利用地理位置优势进行品牌宣传。</li>
            <li><strong>交通引导</strong>：与周边写字楼建立合作，提供便民服务。</li>
            <li><strong>配套利用</strong>：与周边商业设施形成互补，共同吸引客流。</li>
        </ul>
        <h3>评分</h3>
        <div class="market-score-display">地理位置评分：9.2分 - 位置优势明显，发展潜力巨大</div>
    </div>
</div>

<div class="market-analysis-section">
    <h2 class="market-section-title">二、人流量分析</h2>
    <div class="market-analysis-content">
        <h3>人流量特征</h3>
        <ul>
            <li><strong>流量规模</strong>：日均人流量约8000-12000人次，工作日高峰期可达15000人次。</li>
            <li><strong>时段分布</strong>：上午10-12点、下午17-19点为人流高峰，符合餐饮消费规律。</li>
            <li><strong>客群构成</strong>：白领占60%，购物人群占25%，居民占15%，客群质量较高。</li>
            <li><strong>停留时间</strong>：平均停留时间45分钟，有充足的消费决策时间。</li>
            <li><strong>季节性变化</strong>：夏季人流量略有下降，冬季相对稳定，整体波动不大。</li>
        </ul>
        <h3>人流质量评估</h3>
        <ul>
            <li><strong>消费转化率</strong>：人流向消费的转化率约12-15%，高于行业平均水平。</li>
            <li><strong>目标客群占比</strong>：目标客群在总人流中占比约65%，匹配度较高。</li>
            <li><strong>重复访问率</strong>：周重复访问率约40%，客户粘性良好。</li>
        </ul>
        <h3>引流策略</h3>
        <ul>
            <li><strong>高峰期策略</strong>：在人流高峰期推出限时优惠，最大化转化。</li>
            <li><strong>低峰期激活</strong>：通过特价套餐、积分活动激活低峰时段。</li>
            <li><strong>客群引导</strong>：针对不同客群设计差异化营销策略。</li>
        </ul>
        <h3>评分</h3>
        <div class="market-score-display">人流量评分：8.8分 - 人流量充足，质量较高</div>
    </div>
</div>`;

        return mockResponse;
    }

    /**
     * 睡眠函数
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 导出备用API
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIFallback;
}
