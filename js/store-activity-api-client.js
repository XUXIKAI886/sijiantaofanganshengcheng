/**
 * 店铺活动方案生成 - API客户端
 * 负责与Gemini 2.0 Flash Lite API的通信
 */

class StoreActivityAPIClient {
    constructor() {
        // API配置 - 只使用Gemini 2.5 Flash Lite
        this.apiConfigs = {
            'gemini-2.5-flash-lite': {
                name: 'Gemini 2.5 Flash Lite (jeniya.top)',
                baseURL: 'https://jeniya.top/v1/chat/completions',
                apiKey: 'sk-AHP64E0ntf5VEltYLSV17wTLYeV4WZ3ucJzf72u0UHXf0Hos',
                model: 'gemini-2.5-flash-lite',
                temperature: 0.8,
                max_tokens: 16384,
                timeout: 360000,
                description: 'Gemini 2.5 Flash Lite模型，专业的文本生成',
                features: ['文本生成', '逻辑推理', '创意写作', '快速响应'],
                status: 'stable',
                icon: 'fas fa-bolt',
                color: '#4285f4'
            }
        };

        // 默认使用Gemini 2.5 Flash Lite
        this.currentApiKey = 'gemini-2.5-flash-lite';
        this.config = this.getCurrentConfig();

        this.retryConfig = {
            maxRetries: 3,
            retryDelay: 1000, // 1秒
            backoffMultiplier: 2
        };

        console.log(`[店铺活动-API] 使用API: ${this.apiConfigs[this.currentApiKey].name}`);
    }

    /**
     * 获取当前API配置
     * @returns {Object} - 当前API配置
     */
    getCurrentConfig() {
        const apiConfig = this.apiConfigs[this.currentApiKey];
        return {
            baseURL: this.getAPIBaseURL(apiConfig.baseURL),
            apiKey: apiConfig.apiKey,
            model: apiConfig.model,
            temperature: apiConfig.temperature,
            max_tokens: apiConfig.max_tokens,
            timeout: apiConfig.timeout
        };
    }

    /**
     * 获取API基础URL
     * @param {string} originalURL - 原始URL
     * @returns {string} - 处理后的URL
     */
    getAPIBaseURL(originalURL) {
        // 检测是否在本地开发环境
        const isLocalhost = window.location.hostname === 'localhost' ||
                           window.location.hostname === '127.0.0.1' ||
                           window.location.protocol === 'file:';

        if (isLocalhost && window.location.port === '8080') {
            // 使用本地代理服务器
            return 'http://localhost:8080/api/chat/completions';
        } else {
            // 使用原始API地址
            return originalURL;
        }
    }

    /**
     * 切换API
     * @param {string} apiKey - API键名
     */
    switchAPI(apiKey) {
        if (this.apiConfigs[apiKey]) {
            this.currentApiKey = apiKey;
            this.config = this.getCurrentConfig();
            console.log(`[店铺活动-API] 已切换到: ${this.apiConfigs[apiKey].name}`);
        } else {
            console.error(`[店铺活动-API] 未知的API: ${apiKey}`);
        }
    }

    /**
     * 发送聊天请求
     * @param {Array} messages - 消息数组
     * @param {Object} options - 可选参数
     * @returns {Promise<Object>} - API响应
     */
    async sendChatRequest(messages, options = {}) {
        const requestConfig = {
            ...this.config,
            ...options
        };

        const requestBody = {
            model: requestConfig.model,
            messages: messages,
            temperature: requestConfig.temperature,
            max_tokens: requestConfig.max_tokens,
            stream: false
        };

        console.log('[店铺活动-API] 发送请求:', {
            url: requestConfig.baseURL,
            model: requestConfig.model,
            messagesCount: messages.length,
            maxTokens: requestConfig.max_tokens
        });

        let lastError = null;

        for (let attempt = 1; attempt <= this.retryConfig.maxRetries; attempt++) {
            try {
                const response = await this.makeRequest(requestConfig, requestBody, attempt);
                
                if (response.choices && response.choices.length > 0) {
                    const content = response.choices[0].message.content;
                    console.log(`[店铺活动-API] 请求成功 (尝试 ${attempt}/${this.retryConfig.maxRetries})`);
                    console.log(`[店铺活动-API] 响应长度: ${content.length} 字符`);
                    
                    return {
                        success: true,
                        content: content,
                        usage: response.usage,
                        model: requestConfig.model,
                        api: this.apiConfigs[this.currentApiKey].name
                    };
                } else {
                    throw new Error('API响应格式错误：缺少choices字段');
                }

            } catch (error) {
                lastError = error;
                console.error(`[店铺活动-API] 请求失败 (尝试 ${attempt}/${this.retryConfig.maxRetries}):`, error.message);

                if (attempt < this.retryConfig.maxRetries) {
                    const delay = this.retryConfig.retryDelay * Math.pow(this.retryConfig.backoffMultiplier, attempt - 1);
                    console.log(`[店铺活动-API] ${delay}ms 后重试...`);
                    await this.sleep(delay);
                }
            }
        }

        // 所有重试都失败了
        console.error('[店铺活动-API] 所有重试都失败了');
        throw new Error(`API请求失败: ${lastError?.message || '未知错误'}`);
    }

    /**
     * 执行HTTP请求
     * @param {Object} config - 请求配置
     * @param {Object} body - 请求体
     * @param {number} attempt - 尝试次数
     * @returns {Promise<Object>} - 响应数据
     */
    async makeRequest(config, body, attempt) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.timeout);

        try {
            const response = await fetch(config.baseURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.apiKey}`
                },
                body: JSON.stringify(body),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                
                try {
                    const errorData = JSON.parse(errorText);
                    if (errorData.error && errorData.error.message) {
                        errorMessage = errorData.error.message;
                    }
                } catch (e) {
                    // 忽略JSON解析错误，使用默认错误消息
                }
                
                throw new Error(errorMessage);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw new Error(`请求超时 (${config.timeout}ms)`);
            }
            
            throw error;
        }
    }

    /**
     * 生成活动方案
     * @param {string} prompt - 提示词
     * @returns {Promise<Object>} - 生成结果
     */
    async generateActivityPlan(prompt) {
        const messages = [
            {
                role: 'system',
                content: '你是一位专业的美团外卖店铺活动策划专家，擅长根据店铺信息制定有效的营销活动方案。'
            },
            {
                role: 'user',
                content: prompt
            }
        ];

        try {
            console.log('[店铺活动-API] 开始生成活动方案...');
            const result = await this.sendChatRequest(messages);
            
            if (result.success) {
                console.log('[店铺活动-API] 活动方案生成成功');
                return result;
            } else {
                throw new Error('活动方案生成失败');
            }
        } catch (error) {
            console.error('[店铺活动-API] 生成活动方案时发生错误:', error);
            throw error;
        }
    }

    /**
     * 获取可用的API列表
     * @returns {Array} - API配置列表
     */
    getAvailableAPIs() {
        return Object.keys(this.apiConfigs).map(key => ({
            key: key,
            ...this.apiConfigs[key],
            isCurrent: key === this.currentApiKey
        }));
    }

    /**
     * 检查API状态
     * @param {string} apiKey - API键名
     * @returns {Promise<boolean>} - API是否可用
     */
    async checkAPIStatus(apiKey) {
        const originalApiKey = this.currentApiKey;
        
        try {
            this.switchAPI(apiKey);
            
            const testMessages = [
                {
                    role: 'user',
                    content: '测试连接'
                }
            ];
            
            await this.sendChatRequest(testMessages);
            return true;
        } catch (error) {
            console.error(`[店铺活动-API] API ${apiKey} 状态检查失败:`, error);
            return false;
        } finally {
            this.switchAPI(originalApiKey);
        }
    }

    /**
     * 睡眠函数
     * @param {number} ms - 毫秒数
     * @returns {Promise} - Promise对象
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 获取当前API信息
     * @returns {Object} - 当前API信息
     */
    getCurrentAPIInfo() {
        return {
            key: this.currentApiKey,
            ...this.apiConfigs[this.currentApiKey]
        };
    }

    /**
     * 获取使用统计
     * @returns {Object} - 使用统计信息
     */
    getUsageStats() {
        // 这里可以添加使用统计逻辑
        return {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            averageResponseTime: 0
        };
    }
}

// 确保类在全局作用域中可用
window.StoreActivityAPIClient = StoreActivityAPIClient;

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StoreActivityAPIClient;
}
