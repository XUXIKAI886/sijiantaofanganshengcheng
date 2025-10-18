/**
 * 数据统计分析API客户端
 * 负责与AI API进行通信
 */

class DataStatisticsApiClient {
    constructor() {
        // API配置 - 动态检测环境
        this.config = {
            baseUrl: this.getAPIBaseURL(),
            apiKey: 'sk-AHP64E0ntf5VEltYLSV17wTLYeV4WZ3ucJzf72u0UHXf0Hos',
            model: 'gemini-2.5-flash-lite',
            temperature: 0.8,
            max_tokens: 16384,
            timeout: 600000  // 10分钟超时
        };

        console.log('[数据统计API] 客户端初始化完成');
        console.log('[数据统计API] 使用API地址:', this.config.baseUrl);
    }

    /**
     * 获取API基础URL - 智能检测环境并使用最佳代理方案
     * @returns {string} - 实际使用的API地址
     */
    getAPIBaseURL() {
        const hostname = window.location.hostname;
        const port = window.location.port;
        const protocol = window.location.protocol;

        // 1. 本地开发环境
        if ((hostname === 'localhost' || hostname === '127.0.0.1') && port === '8090') {
            console.log('[数据统计] 环境检测: 本地开发环境，使用本地代理');
            return 'http://localhost:8090/api/chat/completions';
        }

        // 2. Vercel/Netlify等Serverless平台
        const serverlessPlatforms = ['.vercel.app', '.netlify.app', '.netlify.com'];
        const isServerlessPlatform = serverlessPlatforms.some(domain => hostname.includes(domain));

        if (isServerlessPlatform || (protocol === 'https:' && !hostname.includes('.github.io'))) {
            console.log('[数据统计] 环境检测: Serverless平台，使用API代理');
            return '/api/chat/completions';
        }

        // 3. GitHub Pages警告
        if (hostname.includes('.github.io')) {
            console.warn('[数据统计] 环境检测: GitHub Pages，直连API（可能不稳定）');
            console.warn('[数据统计] 建议: 部署到Vercel以获得更好的稳定性');
        }

        // 4. file://协议错误提示
        if (protocol === 'file:') {
            console.error('[数据统计] 错误: 请勿直接打开HTML文件');
            console.error('[数据统计] 请启动开发服务器: npm start');
        }

        // 默认：直连API
        console.log('[数据统计] 环境检测: 直连API模式');
        return 'https://jeniya.top/v1/chat/completions';
    }

    /**
     * 生成数据统计分析报告
     * @param {string} prompt - AI提示词
     * @returns {Promise<string>} - 生成的报告内容
     */
    async generateReport(prompt) {
        console.log('[数据统计API] 开始调用API生成报告');
        console.log('[数据统计API] 提示词长度:', prompt.length);

        // 重试配置
        const maxRetries = 3;
        let lastError = null;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`[数据统计API] 第${attempt}次尝试调用API`);

                const requestBody = {
                    model: this.config.model,
                    messages: [
                        {
                            role: "system",
                            content: "你是一个专业的外卖店铺数据分析师，擅长分析店铺运营数据并提供专业的优化建议。请根据用户提供的数据进行深度分析，并生成专业的HTML格式报告。"
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    temperature: this.config.temperature,
                    max_tokens: this.config.max_tokens,
                    stream: false
                };

                console.log('[数据统计API] 请求数据:', {
                    model: requestBody.model,
                    messagesLength: requestBody.messages.length,
                    temperature: requestBody.temperature,
                    max_tokens: requestBody.max_tokens
                });

                // 发送请求
                const response = await this.makeRequest(requestBody);

                if (!response) {
                    throw new Error('API响应为空');
                }

                // 解析响应
                const content = this.parseResponse(response);

                console.log('[数据统计API] 报告生成成功，内容长度:', content.length);
                return content;

            } catch (error) {
                lastError = error;
                console.error(`[数据统计API] 第${attempt}次尝试失败:`, error.message);

                // 如果不是最后一次尝试，等待后重试
                if (attempt < maxRetries) {
                    const waitTime = attempt * 2000; // 递增等待时间：2秒、4秒
                    console.log(`[数据统计API] ${waitTime/1000}秒后进行第${attempt + 1}次重试`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                }
            }
        }

        // 所有重试都失败了
        console.error('[数据统计API] 所有重试都失败，最终错误:', lastError);
        throw new Error(`生成报告失败（已重试${maxRetries}次）: ${lastError.message}`);
    }

    /**
     * 发送HTTP请求
     * @param {Object} requestBody - 请求体
     * @returns {Promise<Object>} - 响应数据
     */
    async makeRequest(requestBody) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        try {
            const headers = {
                'Content-Type': 'application/json',
            };

            // 如果不是本地代理，添加API密钥
            if (!this.config.baseUrl.includes('localhost')) {
                headers['Authorization'] = `Bearer ${this.config.apiKey}`;
            }

            const response = await fetch(this.config.baseUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(requestBody),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            console.log('[数据统计API] HTTP响应状态:', response.status, response.statusText);

            if (!response.ok) {
                let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error?.message || errorData.message || errorMessage;
                } catch (parseError) {
                    console.warn('[数据统计API] 无法解析错误响应:', parseError);
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('[数据统计API] 响应数据结构:', {
                hasChoices: !!data.choices,
                choicesLength: data.choices?.length,
                hasUsage: !!data.usage
            });

            return data;

        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw new Error('请求超时（10分钟），请检查网络连接后重试');
            }

            if (error.message.includes('Failed to fetch')) {
                throw new Error('网络连接失败，请检查网络连接或稍后重试');
            }

            throw error;
        }
    }

    /**
     * 解析API响应
     * @param {Object} response - API响应数据
     * @returns {string} - 解析后的内容
     */
    parseResponse(response) {
        try {
            // 检查响应格式
            if (!response.choices || !Array.isArray(response.choices) || response.choices.length === 0) {
                throw new Error('API响应格式错误：缺少choices字段');
            }

            const choice = response.choices[0];
            if (!choice.message || !choice.message.content) {
                throw new Error('API响应格式错误：缺少content字段');
            }

            let content = choice.message.content.trim();

            // 移除可能的markdown代码块标记
            content = content.replace(/^```html\s*\n?/i, '');
            content = content.replace(/\n?\s*```$/i, '');
            
            // 移除其他可能的markdown标记
            content = content.replace(/^```\s*\n?/i, '');
            content = content.replace(/\n?\s*```$/i, '');

            if (!content) {
                throw new Error('API返回内容为空');
            }

            console.log('[数据统计API] 内容解析完成，最终长度:', content.length);
            return content;

        } catch (error) {
            console.error('[数据统计API] 响应解析失败:', error);
            console.error('[数据统计API] 原始响应:', response);
            throw new Error(`响应解析失败: ${error.message}`);
        }
    }

    /**
     * 检查API连接状态
     * @returns {Promise<boolean>} - 连接是否正常
     */
    async checkConnection() {
        try {
            const testPrompt = "请简单回复'连接正常'";
            const response = await this.generateReport(testPrompt);
            return response.includes('连接正常') || response.length > 0;
        } catch (error) {
            console.error('[数据统计API] 连接检查失败:', error);
            return false;
        }
    }

    /**
     * 获取API使用统计
     * @returns {Object} - API使用统计信息
     */
    getUsageStats() {
        return {
            model: this.config.model,
            baseUrl: this.config.baseUrl,
            timeout: this.config.timeout,
            maxTokens: this.config.max_tokens
        };
    }
}

// 导出到全局作用域
window.DataStatisticsApiClient = DataStatisticsApiClient;