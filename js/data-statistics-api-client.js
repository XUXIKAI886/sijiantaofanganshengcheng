/**
 * 数据统计分析API客户端
 * 负责与AI API进行通信
 */

class DataStatisticsApiClient {
    constructor() {
        // API配置 - 使用统一的代理服务器
        this.config = {
            baseUrl: '/api/chat/completions',  // 使用本地代理
            model: 'gemini-2.5-flash-lite-preview-06-17',
            temperature: 0.8,
            max_tokens: 16384,
            timeout: 360000  // 6分钟超时
        };
        
        console.log('[数据统计API] 客户端初始化完成');
    }

    /**
     * 生成数据统计分析报告
     * @param {string} prompt - AI提示词
     * @returns {Promise<string>} - 生成的报告内容
     */
    async generateReport(prompt) {
        try {
            console.log('[数据统计API] 开始调用API生成报告');
            console.log('[数据统计API] 提示词长度:', prompt.length);

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
            console.error('[数据统计API] 生成报告失败:', error);
            throw new Error(`生成报告失败: ${error.message}`);
        }
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
            const response = await fetch(this.config.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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
                throw new Error('请求超时，请重试');
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