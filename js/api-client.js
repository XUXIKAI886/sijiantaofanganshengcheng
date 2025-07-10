/**
 * DeepSeek API 客户端
 * 负责与DeepSeek API的通信，专业的品牌分析服务
 */

class APIClient {
    constructor() {
        this.config = {
            baseURL: this.getAPIBaseURL(),
            apiKey: 'sk-e4f35cb4efca4f5a8d8efcb7afb400ca',
            model: 'deepseek-chat',
            temperature: 0.8,
            max_tokens: 8192,
            timeout: 360000 // 360秒超时，支持更复杂的分析
        };

        // 初始化备用API
        this.fallback = null;
        this.initFallback();

        this.retryConfig = {
            maxRetries: 3,
            retryDelay: 1000, // 1秒
            backoffMultiplier: 2
        };
    }

    /**
     * 初始化备用API
     */
    async initFallback() {
        try {
            if (typeof APIFallback !== 'undefined') {
                this.fallback = new APIFallback();
                console.log('[品牌分析] 备用API已初始化');
            }
        } catch (error) {
            console.warn('[品牌分析] 备用API初始化失败:', error);
        }
    }

    /**
     * 获取API基础URL - 自动检测是否使用代理
     * @returns {string} - API基础URL
     */
    getAPIBaseURL() {
        // 检测是否在本地开发环境
        const isLocalhost = window.location.hostname === 'localhost' ||
                           window.location.hostname === '127.0.0.1' ||
                           window.location.protocol === 'file:';

        if (isLocalhost && window.location.port === '3000') {
            // 使用本地代理服务器
            return 'http://localhost:3000/api/chat/completions';
        } else {
            // 使用DeepSeek官方API
            return 'https://api.deepseek.com/chat/completions';
        }
    }
    
    /**
     * 调用DeepSeek API生成内容
     * @param {string} prompt - 提示词
     * @param {Object} options - 可选配置
     * @returns {Promise<string>} - 生成的内容
     */
    async generateContent(prompt, options = {}) {
        try {
            const requestConfig = {
                ...this.config,
                ...options
            };

            const requestBody = {
                model: requestConfig.model,
                messages: [
                    {
                        role: 'system',
                        content: '你是一位资深的餐饮行业品牌分析专家，拥有超过10年的品牌定位和市场分析经验。你擅长从多个维度深入分析餐饮品牌，提供专业、详细、可操作的分析报告和建议。你的分析风格严谨专业，数据驱动，注重实用性和可执行性。'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: requestConfig.temperature,
                max_tokens: requestConfig.max_tokens,
                stream: false
            };

            return await this.makeRequestWithRetry(requestBody);

        } catch (error) {
            console.warn('[品牌分析] API调用失败，尝试使用备用方案:', error.message);

            // 如果API调用失败，使用备用方案
            if (this.fallback) {
                console.log('[品牌分析] 使用备用API生成内容...');

                // 从prompt中提取表单数据（简单解析）
                const formData = this.extractFormDataFromPrompt(prompt);
                return await this.fallback.generateBrandAnalysis(formData);
            }

            throw error;
        }
    }

    /**
     * 从提示词中提取表单数据
     * @param {string} prompt - 提示词
     * @returns {Object} - 表单数据
     */
    extractFormDataFromPrompt(prompt) {
        const defaultData = {
            storeName: '示例餐厅',
            category: '中式快餐',
            address: '商业区',
            targetGroup: '白领上班族',
            priceRange: '30',
            mainProducts: '盖饭、炒饭',
            features: '快速出餐、健康美味'
        };

        try {
            // 简单的正则提取（可以根据实际prompt格式优化）
            const storeNameMatch = prompt.match(/店铺名称[：:]\s*(.+)/);
            const categoryMatch = prompt.match(/经营品类[：:]\s*(.+)/);
            const addressMatch = prompt.match(/店铺地址[：:]\s*(.+)/);
            const targetGroupMatch = prompt.match(/目标客群[：:]\s*(.+)/);
            const priceRangeMatch = prompt.match(/价格区间[：:]\s*人均(\d+)/);
            const mainProductsMatch = prompt.match(/主营产品[：:]\s*(.+)/);
            const featuresMatch = prompt.match(/经营特色[：:]\s*(.+)/);

            return {
                storeName: storeNameMatch ? storeNameMatch[1].trim() : defaultData.storeName,
                category: categoryMatch ? categoryMatch[1].trim() : defaultData.category,
                address: addressMatch ? addressMatch[1].trim() : defaultData.address,
                targetGroup: targetGroupMatch ? targetGroupMatch[1].trim() : defaultData.targetGroup,
                priceRange: priceRangeMatch ? priceRangeMatch[1] : defaultData.priceRange,
                mainProducts: mainProductsMatch ? mainProductsMatch[1].trim() : defaultData.mainProducts,
                features: featuresMatch ? featuresMatch[1].trim() : defaultData.features
            };
        } catch (error) {
            console.warn('[品牌分析] 提取表单数据失败，使用默认数据:', error);
            return defaultData;
        }
    }
    
    /**
     * 带重试机制的请求
     * @param {Object} requestBody - 请求体
     * @returns {Promise<string>} - API响应内容
     */
    async makeRequestWithRetry(requestBody) {
        let lastError;
        
        for (let attempt = 1; attempt <= this.retryConfig.maxRetries; attempt++) {
            try {
                console.log(`API调用尝试 ${attempt}/${this.retryConfig.maxRetries}`);
                
                const response = await this.makeRequest(requestBody);
                console.log('API调用成功');
                return response;
                
            } catch (error) {
                lastError = error;
                console.error(`API调用失败 (尝试 ${attempt}/${this.retryConfig.maxRetries}):`, error.message);
                
                // 如果是最后一次尝试，直接抛出错误
                if (attempt === this.retryConfig.maxRetries) {
                    break;
                }
                
                // 如果是客户端错误（4xx），不重试
                if (error.status && error.status >= 400 && error.status < 500) {
                    console.log('客户端错误，不重试');
                    break;
                }
                
                // 等待后重试
                const delay = this.retryConfig.retryDelay * Math.pow(this.retryConfig.backoffMultiplier, attempt - 1);
                console.log(`等待 ${delay}ms 后重试...`);
                await this.sleep(delay);
            }
        }
        
        throw lastError;
    }
    
    /**
     * 发起API请求
     * @param {Object} requestBody - 请求体
     * @returns {Promise<string>} - API响应内容
     */
    async makeRequest(requestBody) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
        
        try {
            const response = await fetch(this.config.baseURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.apiKey}`
                },
                body: JSON.stringify(requestBody),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new APIError(
                    `API请求失败: ${response.status} ${response.statusText}`,
                    response.status,
                    errorData
                );
            }
            
            const data = await response.json();
            
            if (!data.choices || data.choices.length === 0) {
                throw new APIError('API返回数据格式异常：没有choices字段');
            }
            
            const content = data.choices[0].message?.content;
            if (!content) {
                throw new APIError('API返回数据格式异常：没有content字段');
            }
            
            return content;
            
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw new APIError('API请求超时', 408);
            }
            
            if (error instanceof APIError) {
                throw error;
            }
            
            // 网络错误
            throw new APIError(`网络错误: ${error.message}`);
        }
    }
    
    /**
     * 流式生成内容（暂未实现）
     * @param {string} prompt - 提示词
     * @param {Function} onChunk - 接收数据块的回调函数
     * @param {Object} options - 可选配置
     */
    async generateContentStream(prompt, onChunk, options = {}) {
        // TODO: 实现流式输出
        console.log('流式输出功能暂未实现，使用普通模式');
        const content = await this.generateContent(prompt, options);
        onChunk(content);
    }
    
    /**
     * 验证API连接
     * @returns {Promise<boolean>} - 连接是否成功
     */
    async testConnection() {
        try {
            console.log('测试API连接...');
            
            const testPrompt = '请简单回复"连接成功"';
            const response = await this.generateContent(testPrompt, {
                max_tokens: 50,
                temperature: 0
            });
            
            console.log('API连接测试成功:', response);
            return true;
            
        } catch (error) {
            console.error('API连接测试失败:', error);
            return false;
        }
    }
    
    /**
     * 获取API使用统计（模拟）
     * @returns {Object} - 使用统计信息
     */
    getUsageStats() {
        // TODO: 实现真实的使用统计
        return {
            totalRequests: 0,
            totalTokens: 0,
            lastRequestTime: null
        };
    }
    
    /**
     * 更新API配置
     * @param {Object} newConfig - 新的配置
     */
    updateConfig(newConfig) {
        this.config = {
            ...this.config,
            ...newConfig
        };
        console.log('API配置已更新:', this.config);
    }
    
    /**
     * 睡眠函数
     * @param {number} ms - 毫秒数
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/**
 * API错误类
 */
class APIError extends Error {
    constructor(message, status = null, data = null) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.data = data;
    }
}

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { APIClient, APIError };
}
