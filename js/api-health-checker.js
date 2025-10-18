/**
 * API健康检查器
 * 在应用启动时测试多个API端点，自动选择可用的URL
 */

class APIHealthChecker {
    constructor() {
        // 候选API URL列表（按优先级排序）
        this.candidateURLs = [
            {
                id: 'jeniya-base',
                name: 'Jeniya API (基础路径)',
                baseURL: 'https://jeniya.top',
                endpoint: '/v1/chat/completions',
                priority: 1
            },
            {
                id: 'jeniya-v1',
                name: 'Jeniya API (v1路径)',
                baseURL: 'https://jeniya.top/v1',
                endpoint: '/chat/completions',
                priority: 2
            },
            {
                id: 'jeniya-full',
                name: 'Jeniya API (完整路径)',
                baseURL: 'https://jeniya.top/v1/chat/completions',
                endpoint: '',
                priority: 3
            }
        ];

        // 当前可用的URL
        this.availableURL = null;
        this.lastCheckTime = null;
        this.checkInterval = 5 * 60 * 1000; // 5分钟重新检查一次
    }

    /**
     * 测试单个API端点是否可用
     * @param {Object} urlConfig - URL配置对象
     * @returns {Promise<boolean>} - 是否可用
     */
    async testEndpoint(urlConfig) {
        const testURL = urlConfig.baseURL + urlConfig.endpoint;
        const startTime = Date.now();

        try {
            console.log(`[健康检查] 测试 ${urlConfig.name}: ${testURL}`);

            // 发送一个轻量级的测试请求
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时

            const response = await fetch(testURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gemini-2.5-flash-lite',
                    messages: [
                        { role: 'user', content: 'test' }
                    ],
                    max_tokens: 10
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            const responseTime = Date.now() - startTime;

            // 检查响应状态
            if (response.ok || response.status === 401) {
                // 401说明端点存在，只是需要有效密钥
                console.log(`✅ [健康检查] ${urlConfig.name} 可用 (${responseTime}ms)`);
                return true;
            } else {
                console.warn(`⚠️ [健康检查] ${urlConfig.name} 返回 ${response.status}`);
                return false;
            }

        } catch (error) {
            const responseTime = Date.now() - startTime;

            if (error.name === 'AbortError') {
                console.warn(`⏱️ [健康检查] ${urlConfig.name} 超时 (>5000ms)`);
            } else if (error.message.includes('Failed to fetch') || error.message.includes('ERR_NAME_NOT_RESOLVED')) {
                console.error(`❌ [健康检查] ${urlConfig.name} DNS解析失败或网络错误`);
            } else {
                console.error(`❌ [健康检查] ${urlConfig.name} 失败: ${error.message}`);
            }

            return false;
        }
    }

    /**
     * 并行测试所有候选URL，返回第一个可用的
     * @returns {Promise<Object|null>} - 可用的URL配置对象
     */
    async findAvailableURL() {
        console.log('🔍 [健康检查] 开始测试API端点...');
        console.log(`[健康检查] 候选URL数量: ${this.candidateURLs.length}`);

        // 并行测试所有URL
        const testResults = await Promise.all(
            this.candidateURLs.map(async (urlConfig) => {
                const isAvailable = await this.testEndpoint(urlConfig);
                return { urlConfig, isAvailable };
            })
        );

        // 找出所有可用的URL
        const availableURLs = testResults
            .filter(result => result.isAvailable)
            .map(result => result.urlConfig)
            .sort((a, b) => a.priority - b.priority); // 按优先级排序

        if (availableURLs.length > 0) {
            const selected = availableURLs[0];
            console.log(`✅ [健康检查] 选择API: ${selected.name}`);
            console.log(`[健康检查] 完整URL: ${selected.baseURL}${selected.endpoint}`);

            this.availableURL = selected;
            this.lastCheckTime = Date.now();

            return selected;
        } else {
            console.error('❌ [健康检查] 所有API端点都不可用！');
            this.availableURL = null;
            return null;
        }
    }

    /**
     * 获取当前可用的API URL
     * @returns {Promise<Object|null>} - URL配置对象
     */
    async getAvailableURL() {
        // 如果从未检查过，或距离上次检查超过指定时间，重新检查
        if (!this.availableURL ||
            !this.lastCheckTime ||
            (Date.now() - this.lastCheckTime) > this.checkInterval) {

            await this.findAvailableURL();
        }

        return this.availableURL;
    }

    /**
     * 获取完整的API地址
     * @returns {Promise<string|null>} - 完整的API URL
     */
    async getAPIBaseURL() {
        const urlConfig = await this.getAvailableURL();

        if (!urlConfig) {
            console.error('[健康检查] 无可用API端点');
            return null;
        }

        return urlConfig.baseURL + urlConfig.endpoint;
    }

    /**
     * 强制重新检查所有端点
     */
    async forceRecheck() {
        console.log('[健康检查] 强制重新检查API端点');
        this.lastCheckTime = null;
        this.availableURL = null;
        return await this.findAvailableURL();
    }

    /**
     * 添加新的候选URL
     * @param {Object} urlConfig - URL配置对象
     */
    addCandidateURL(urlConfig) {
        this.candidateURLs.push(urlConfig);
        console.log(`[健康检查] 添加候选URL: ${urlConfig.name}`);
    }

    /**
     * 获取健康检查报告
     * @returns {Object} - 健康状态报告
     */
    getHealthReport() {
        return {
            currentURL: this.availableURL,
            lastCheckTime: this.lastCheckTime,
            timeSinceLastCheck: this.lastCheckTime
                ? Date.now() - this.lastCheckTime
                : null,
            totalCandidates: this.candidateURLs.length,
            isHealthy: this.availableURL !== null
        };
    }
}

// 创建全局健康检查器实例
window.apiHealthChecker = window.apiHealthChecker || new APIHealthChecker();
