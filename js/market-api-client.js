/**
 * 商圈调研分析 - Gemini 2.5 Flash Lite API客户端
 * 负责与Gemini 2.5 Flash Lite API的通信，支持多模态分析
 */

class MarketAPIClient {
    constructor() {
        // API配置 - 只使用Gemini 2.5 Flash Lite
        this.apiConfigs = {
            'gemini-2.5-flash-lite': {
                name: 'Gemini 2.5 Flash Lite (jeniya.top)',
                baseURL: 'https://jeniya.top/v1/chat/completions',
                apiKey: 'sk-AHP64E0ntf5VEltYLSV17wTLYeV4WZ3ucJzf72u0UHXf0Hos',
                model: 'gemini-2.5-flash-lite',
                temperature: 0.8,
                max_tokens: 16384, // 增加到16K tokens
                timeout: 360000,
                description: 'Gemini 2.5 Flash Lite模型，支持截图分析，性能稳定',
                features: ['支持截图分析', '响应快速', '性能稳定', '多模态支持'],
                status: 'stable',
                icon: 'fas fa-bolt',
                color: '#ff6b35',
                // API能力标记
                capabilities: {
                    textGeneration: true,
                    imageAnalysis: true,  // 确认支持截图分析
                    multiModal: true      // 确认支持多模态
                }
            }
        };

        // 使用唯一的Gemini 2.5 Flash Lite API
        this.currentApiKey = 'gemini-2.5-flash-lite';

        // 启用健康检查功能
        this.useHealthCheck = true;
        this.healthCheckInitialized = false;

        this.config = this.getCurrentConfig();

        this.retryConfig = {
            maxRetries: 3,
            retryDelay: 1000, // 1秒
            backoffMultiplier: 2
        };

        // 初始化备用API
        this.fallback = null;
        this.initFallback();

        // 启动时进行健康检查
        this.initHealthCheck();

        console.log(`[商圈分析] 使用API: ${this.apiConfigs[this.currentApiKey].name}`);
    }

    /**
     * 初始化健康检查
     */
    async initHealthCheck() {
        if (!this.useHealthCheck || this.healthCheckInitialized) {
            return;
        }

        try {
            if (typeof window.apiHealthChecker !== 'undefined') {
                console.log('[商圈分析] 启动API健康检查...');
                await window.apiHealthChecker.findAvailableURL();
                this.healthCheckInitialized = true;

                // 获取健康报告
                const report = window.apiHealthChecker.getHealthReport();
                if (report.isHealthy) {
                    console.log(`[商圈分析] 健康检查完成，使用: ${report.currentURL.name}`);
                } else {
                    console.warn('[商圈分析] 健康检查警告：所有API端点不可用');
                }
            }
        } catch (error) {
            console.error('[商圈分析] 健康检查失败:', error);
        }
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
     * 获取API信息
     * @returns {Object} - API信息
     */
    getAPIInfo() {
        return {
            key: this.currentApiKey,
            name: this.apiConfigs[this.currentApiKey].name,
            description: this.apiConfigs[this.currentApiKey].description,
            model: this.apiConfigs[this.currentApiKey].model,
            features: this.apiConfigs[this.currentApiKey].features,
            status: this.apiConfigs[this.currentApiKey].status,
            icon: this.apiConfigs[this.currentApiKey].icon,
            color: this.apiConfigs[this.currentApiKey].color
        };
    }

    /**
     * 初始化备用API
     */
    async initFallback() {
        try {
            if (typeof APIFallback !== 'undefined') {
                this.fallback = new APIFallback();
                console.log('[商圈分析] 备用API已初始化');
            }
        } catch (error) {
            console.warn('[商圈分析] 备用API初始化失败:', error);
        }
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
     * 检查当前API是否支持指定功能
     * @param {string} capability - 功能名称 (textGeneration, imageAnalysis, multiModal)
     * @returns {boolean} - 是否支持
     */
    supportsCapability(capability) {
        const currentAPI = this.apiConfigs[this.currentApiKey];
        return currentAPI.capabilities && currentAPI.capabilities[capability] === true;
    }

    /**
     * 检查是否可以处理多模态请求
     * @param {boolean} hasImage - 是否包含图片
     * @returns {Object} - 检查结果
     */
    checkMultiModalSupport(hasImage) {
        if (!hasImage) {
            return { supported: true, reason: '纯文本请求，所有API都支持' };
        }

        if (this.supportsCapability('multiModal')) {
            return { supported: true, reason: '当前API支持多模态请求' };
        }

        return {
            supported: false,
            reason: `当前API (${this.apiConfigs[this.currentApiKey].name}) 暂不支持图片分析功能`,
            suggestion: '请切换到 Gemini Pro (annyun.cn) 进行图片分析'
        };
    }

    /**
     * 获取API基础URL - 智能检测环境并使用最佳代理方案
     * @param {string} originalURL - 原始API URL（直连地址）
     * @returns {Promise<string>|string} - 实际使用的API地址
     */
    getAPIBaseURL(originalURL) {
        const hostname = window.location.hostname;
        const port = window.location.port;
        const protocol = window.location.protocol;

        // 1. 本地开发环境（localhost:8090）
        if ((hostname === 'localhost' || hostname === '127.0.0.1') && port === '8090') {
            console.log('[商圈分析] 环境检测: 本地开发环境，使用本地代理');
            return 'http://localhost:8090/api/chat/completions';
        }

        // 2. Vercel/Netlify等支持Serverless Functions的平台
        const serverlessPlatforms = [
            '.vercel.app',
            '.netlify.app',
            '.netlify.com'
        ];

        const isServerlessPlatform = serverlessPlatforms.some(domain => hostname.includes(domain));

        if (isServerlessPlatform || (protocol === 'https:' && !hostname.includes('.github.io'))) {
            console.log('[商圈分析] 环境检测: Serverless平台，使用API代理');
            return '/api/chat/completions';
        }

        // 3. GitHub Pages或其他纯静态托管 - 使用健康检查器
        if (hostname.includes('.github.io') || protocol === 'file:' || protocol === 'https:') {
            if (this.useHealthCheck && typeof window.apiHealthChecker !== 'undefined') {
                console.log('[商圈分析] 环境检测: 使用健康检查器选择最佳API');
                // 异步获取健康检查结果
                return this.getHealthCheckedURL(originalURL);
            }
        }

        // 4. file:// 协议警告
        if (protocol === 'file:') {
            console.error('[商圈分析] 错误: 请勿直接打开HTML文件');
            console.error('[商圈分析] 请启动开发服务器: npm start');
        }

        // 默认：直连原始API
        console.log('[商圈分析] 环境检测: 直连API模式');
        return originalURL;
    }

    /**
     * 使用健康检查器获取最佳URL
     * @param {string} fallbackURL - 降级URL
     * @returns {Promise<string>} - 最佳API URL
     */
    async getHealthCheckedURL(fallbackURL) {
        try {
            const availableURL = await window.apiHealthChecker.getAPIBaseURL();

            if (availableURL) {
                console.log(`[商圈分析] 健康检查选择: ${availableURL}`);
                return availableURL;
            } else {
                console.warn('[商圈分析] 健康检查失败，使用降级URL');
                return fallbackURL;
            }
        } catch (error) {
            console.error('[商圈分析] 健康检查器错误:', error);
            return fallbackURL;
        }
    }
    
    /**
     * 调用Gemini Pro API生成商圈分析内容（支持多模态）
     * @param {string} prompt - 提示词
     * @param {Object} options - 可选配置
     * @param {string} imageBase64 - 图片的Base64编码（可选）
     * @returns {Promise<string>} - 生成的内容
     */
    async generateContent(prompt, options = {}, imageBase64 = null) {
        try {
            // 检查API能力
            const multiModalCheck = this.checkMultiModalSupport(!!imageBase64);
            if (!multiModalCheck.supported) {
                console.warn('[商圈分析] API能力检查失败:', multiModalCheck.reason);
                throw new MarketAPIError(
                    `${multiModalCheck.reason}。${multiModalCheck.suggestion || ''}`,
                    400,
                    { capability: 'multiModal', suggestion: multiModalCheck.suggestion }
                );
            }

            const requestConfig = {
                ...this.config,
                ...options
            };

            // 构建消息内容
            const messages = [
                {
                    role: 'system',
                    content: '你是一位资深的商圈调研分析专家，拥有超过15年的商业地产投资和市场分析经验。你精通商圈分析的各个维度，包括地理位置、人流量、竞争环境、商业业态、消费水平、发展潜力、投资风险等。你擅长提供详细、专业、可操作的商圈分析报告，并能基于数据给出精准的投资建议和经营策略。你还具备强大的图像分析能力，能够分析竞争对手的截图并提供深度的竞争分析和优化建议。'
                }
            ];

        // 构建用户消息内容
        if (imageBase64) {
            // 根据不同API使用不同的多模态格式
            if (this.currentApiKey === 'gemini-2.5-flash') {
                // haxiaiplus.cn API 可能需要特殊格式
                messages.push({
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: prompt
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:image/jpeg;base64,${imageBase64}`
                            }
                        }
                    ]
                });
            } else {
                // annyun.cn API 使用标准格式
                messages.push({
                    role: 'user',
                    content: [
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:image/jpeg;base64,${imageBase64}`,
                                detail: 'high' // 高精度分析
                            }
                        },
                        {
                            type: 'text',
                            text: prompt
                        }
                    ]
                });
            }
        } else {
            // 纯文本请求
            messages.push({
                role: 'user',
                content: prompt
            });
        }

            const requestBody = {
                model: requestConfig.model,
                messages: messages,
                temperature: requestConfig.temperature,
                max_tokens: requestConfig.max_tokens,
                stream: false
            };

            // 计算请求体大小
            const requestBodySize = JSON.stringify(requestBody).length;

            // 调试信息
            console.log('[商圈分析] API请求配置:', {
                currentAPI: this.currentApiKey,
                apiName: this.apiConfigs[this.currentApiKey].name,
                baseURL: this.config.baseURL,
                model: requestBody.model,
                messagesCount: messages.length,
                hasImage: !!imageBase64,
                imageSize: imageBase64? imageBase64.length : 0,
                requestBodySize: requestBodySize,
                requestBodySizeMB: (requestBodySize / 1024 / 1024).toFixed(2)
            });

            // 如果有图片，记录消息格式
            if (imageBase64) {
                console.log('[商圈分析] 多模态请求格式:', {
                    messageContentType: typeof messages[1].content,
                    contentStructure: Array.isArray(messages[1].content) ? 'array' : 'string',
                    contentItems: Array.isArray(messages[1].content) ? messages[1].content.length : 1
                });
            }

            // 检查请求体大小
            if (requestBodySize > 10 * 1024 * 1024) { // 10MB限制
                console.warn('[商圈分析] 请求体过大:', (requestBodySize / 1024 / 1024).toFixed(2), 'MB');
                throw new Error(`请求体过大 (${(requestBodySize / 1024 / 1024).toFixed(2)}MB)，请使用更小的图片`);
            }

            return await this.makeRequestWithRetry(requestBody);

        } catch (error) {
            console.warn('[商圈分析] API调用失败，尝试使用备用方案:', error.message);

            // 如果API调用失败，使用备用方案
            if (this.fallback) {
                console.log('[商圈分析] 使用备用API生成内容...');

                // 从prompt中提取表单数据（简单解析）
                const formData = this.extractFormDataFromPrompt(prompt);
                return await this.fallback.generateMarketAnalysis(formData);
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
            areaName: '示例商圈',
            location: '商业中心',
            areaType: '商业区',
            storeName: '我的餐厅',
            footTraffic: '中等',
            competition: '一般',
            targetCustomers: '白领',
            areaFeatures: '交通便利',
            challenges: '竞争激烈'
        };

        try {
            // 简单的正则提取（可以根据实际prompt格式优化）
            const areaNameMatch = prompt.match(/商圈名称[：:]\s*(.+)/);
            const locationMatch = prompt.match(/地理位置[：:]\s*(.+)/);
            const areaTypeMatch = prompt.match(/商圈类型[：:]\s*(.+)/);
            const storeNameMatch = prompt.match(/目标店铺[：:]\s*(.+)/);

            return {
                areaName: areaNameMatch ? areaNameMatch[1].trim() : defaultData.areaName,
                location: locationMatch ? locationMatch[1].trim() : defaultData.location,
                areaType: areaTypeMatch ? areaTypeMatch[1].trim() : defaultData.areaType,
                storeName: storeNameMatch ? storeNameMatch[1].trim() : defaultData.storeName,
                footTraffic: defaultData.footTraffic,
                competition: defaultData.competition,
                targetCustomers: defaultData.targetCustomers,
                areaFeatures: defaultData.areaFeatures,
                challenges: defaultData.challenges
            };
        } catch (error) {
            console.warn('[商圈分析] 提取表单数据失败，使用默认数据:', error);
            return defaultData;
        }
    }

    /**
     * 将图片文件转换为优化的Base64字符串
     * @param {File} imageFile - 图片文件
     * @returns {Promise<string>} - Base64编码的图片
     */
    async convertImageToBase64(imageFile) {
        return new Promise((resolve, reject) => {
            try {
                console.log('[API客户端] 开始图片压缩，原始大小:', imageFile.size);

                // 创建Canvas来转换图片格式
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();

                img.onload = () => {
                    // 计算压缩后的尺寸（限制最大宽度为1200px）
                    const maxWidth = 1200;
                    const maxHeight = 1200;
                    let { width, height } = img;

                    if (width > maxWidth || height > maxHeight) {
                        const ratio = Math.min(maxWidth / width, maxHeight / height);
                        width = Math.floor(width * ratio);
                        height = Math.floor(height * ratio);
                        console.log('[API客户端] 图片尺寸压缩:', `${img.width}x${img.height} -> ${width}x${height}`);
                    }

                    // 设置Canvas尺寸
                    canvas.width = width;
                    canvas.height = height;

                    // 绘制图片到Canvas（自动缩放）
                    ctx.drawImage(img, 0, 0, width, height);

                    // 尝试不同的压缩质量，直到满足大小要求
                    let quality = 0.6; // 降低初始质量
                    let base64 = canvas.toDataURL('image/jpeg', quality).split(',')[1];

                    // 如果Base64还是太大，进一步降低质量
                    while (base64.length > 80000 && quality > 0.3) { // 约60KB限制
                        quality -= 0.1;
                        base64 = canvas.toDataURL('image/jpeg', quality).split(',')[1];
                        console.log('[API客户端] 调整压缩质量:', quality, 'Base64大小:', base64.length);
                    }

                    console.log('[API客户端] 图片压缩完成:', {
                        originalSize: imageFile.size,
                        base64Size: base64.length,
                        quality: quality,
                        dimensions: `${width}x${height}`
                    });

                    resolve(base64);
                };

                img.onerror = () => {
                    reject(new Error('图片加载失败'));
                };

                // 读取文件
                const reader = new FileReader();
                reader.onload = (e) => {
                    img.src = e.target.result;
                };
                reader.onerror = () => {
                    reject(new Error('文件读取失败'));
                };
                reader.readAsDataURL(imageFile);

            } catch (error) {
                reject(new Error(`图片转换失败: ${error.message}`));
            }
        });
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
                console.log(`[商圈分析] API调用尝试 ${attempt}/${this.retryConfig.maxRetries}`);
                
                const response = await this.makeRequest(requestBody);
                console.log('[商圈分析] API调用成功');
                return response;
                
            } catch (error) {
                lastError = error;
                console.error(`[商圈分析] API调用失败 (尝试 ${attempt}/${this.retryConfig.maxRetries}):`, error.message);
                
                // 如果是最后一次尝试，直接抛出错误
                if (attempt === this.retryConfig.maxRetries) {
                    break;
                }
                
                // 如果是客户端错误（4xx），不重试
                if (error.status && error.status >= 400 && error.status < 500) {
                    console.log('[商圈分析] 客户端错误，不重试');
                    break;
                }
                
                // 等待后重试
                const delay = this.retryConfig.retryDelay * Math.pow(this.retryConfig.backoffMultiplier, attempt - 1);
                console.log(`[商圈分析] 等待 ${delay}ms 后重试...`);
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
                console.error('[商圈分析] API错误详情:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorData: errorData
                });
                throw new MarketAPIError(
                    `API请求失败: ${response.status} ${response.statusText}`,
                    response.status,
                    errorData
                );
            }
            
            const data = await response.json();
            
            if (!data.choices || data.choices.length === 0) {
                throw new MarketAPIError('API返回数据格式异常：没有choices字段');
            }
            
            const content = data.choices[0].message?.content;
            if (!content) {
                throw new MarketAPIError('API返回数据格式异常：没有content字段');
            }

            // 添加响应内容调试信息
            console.log('[商圈分析] API响应内容长度:', content.length, '字符');
            console.log('[商圈分析] API响应预览:', content.substring(0, 200) + '...');
            console.log('[商圈分析] API响应结尾:', '...' + content.substring(content.length - 200));

            // 检查响应是否完整（查找结束标签）
            const hasCompleteHTML = content.includes('</div>') && content.includes('综合建议');
            console.log('[商圈分析] 响应完整性检查:', hasCompleteHTML ? '✅ 完整' : '⚠️ 可能不完整');

            return content;
            
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw new MarketAPIError('API请求超时', 408);
            }
            
            if (error instanceof MarketAPIError) {
                throw error;
            }
            
            // 网络错误
            throw new MarketAPIError(`网络错误: ${error.message}`);
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
        console.log('[商圈分析] 流式输出功能暂未实现，使用普通模式');
        const content = await this.generateContent(prompt, options);
        onChunk(content);
    }
    
    /**
     * 验证API连接
     * @returns {Promise<boolean>} - 连接是否成功
     */
    async testConnection() {
        try {
            console.log('[商圈分析] 测试API连接...');
            
            const testPrompt = '请简单回复"商圈分析连接成功"';
            const response = await this.generateContent(testPrompt, {
                max_tokens: 50,
                temperature: 0
            });
            
            console.log('[商圈分析] API连接测试成功:', response);
            return true;
            
        } catch (error) {
            console.error('[商圈分析] API连接测试失败:', error);
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
        console.log('[商圈分析] API配置已更新:', this.config);
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
 * 商圈分析API错误类
 */
class MarketAPIError extends Error {
    constructor(message, status = null, data = null) {
        super(message);
        this.name = 'MarketAPIError';
        this.status = status;
        this.data = data;
    }
}

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MarketAPIClient, MarketAPIError };
}
