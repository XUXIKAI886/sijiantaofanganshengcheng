/**
 * 店铺活动方案生成 - 内容生成器
 * 负责调用AI API生成活动方案内容
 */

class StoreActivityContentGenerator {
    constructor(apiClient) {
        this.apiClient = apiClient;
        this.maxRetries = 3;
        this.retryDelay = 2000; // 2秒
        
        console.log('[店铺活动-内容] 内容生成器初始化完成');
    }
    
    /**
     * 生成活动方案
     * @param {Object} storeData - 店铺数据
     * @returns {Promise<Object>} - 生成的活动方案
     */
    async generateActivityPlan(storeData) {
        try {
            console.log('[店铺活动-内容] 开始生成活动方案...');
            
            // 构建提示词
            const prompt = this.buildPrompt(storeData);
            console.log('[店铺活动-内容] 提示词构建完成，长度:', prompt.length);
            
            // 调用API生成内容
            const response = await this.apiClient.generateActivityPlan(prompt);
            
            if (!response.success) {
                throw new Error('API调用失败');
            }
            
            // 处理响应内容
            const processedContent = this.processResponse(response.content);
            
            // 构建最终结果
            const result = {
                success: true,
                content: processedContent,
                rawContent: response.content,
                metadata: {
                    model: response.model,
                    api: response.api,
                    usage: response.usage,
                    timestamp: new Date().toISOString(),
                    storeInfo: {
                        name: storeData.storeName,
                        category: storeData.businessCategory,
                        menuItemsCount: storeData.menuItems?.length || 0
                    }
                }
            };
            
            console.log('[店铺活动-内容] 活动方案生成成功');
            return result;
            
        } catch (error) {
            console.error('[店铺活动-内容] 生成活动方案失败:', error);
            throw new Error(`活动方案生成失败: ${error.message}`);
        }
    }
    
    /**
     * 构建提示词
     * @param {Object} storeData - 店铺数据
     * @returns {string} - 构建的提示词
     */
    buildPrompt(storeData) {
        // 获取提示词模板
        let template = '';
        if (typeof StoreActivityPromptTemplate !== 'undefined') {
            template = StoreActivityPromptTemplate.getMainPrompt();
        } else {
            // 备用提示词
            template = this.getBackupPrompt();
        }
        
        // 处理菜品数据
        const menuItemsText = this.formatMenuItems(storeData.menuItems);
        
        // 替换模板变量
        const prompt = template
            .replace(/\{storeName\}/g, storeData.storeName)
            .replace(/\{storeAddress\}/g, storeData.storeAddress)
            .replace(/\{businessCategory\}/g, storeData.businessCategory)
            .replace(/\{businessHours\}/g, storeData.businessHours)
            .replace(/\{menuItems\}/g, menuItemsText);
        
        return prompt;
    }
    
    /**
     * 格式化菜品数据
     * @param {Array} menuItems - 菜品数组
     * @returns {string} - 格式化的菜品文本
     */
    formatMenuItems(menuItems) {
        if (!Array.isArray(menuItems) || menuItems.length === 0) {
            return '暂无菜品信息';
        }
        
        const formattedItems = menuItems.map((item, index) => {
            if (item.price !== null && !item.parseError) {
                return `${index + 1}. ${item.name} - ${item.price}元`;
            } else {
                return `${index + 1}. ${item.name}`;
            }
        });
        
        return formattedItems.join('\n');
    }
    
    /**
     * 处理API响应内容
     * @param {string} content - 原始内容
     * @returns {string} - 处理后的内容
     */
    processResponse(content) {
        if (!content || typeof content !== 'string') {
            throw new Error('API返回内容为空或格式错误');
        }
        
        let processedContent = content;
        
        // 移除AI介绍文字
        processedContent = this.removeAIIntroText(processedContent);
        
        // 清理HTML标记
        processedContent = this.cleanHTMLMarkers(processedContent);

        // 清理emoji图标
        processedContent = this.cleanEmojiIcons(processedContent);

        // 格式化内容
        processedContent = this.formatContent(processedContent);
        
        // 验证内容完整性
        this.validateContent(processedContent);
        
        return processedContent;
    }
    
    /**
     * 移除AI介绍文字
     * @param {string} content - 原始内容
     * @returns {string} - 清理后的内容
     */
    removeAIIntroText(content) {
        const introPatterns = [
            /^好的[，,]\s*作为.*?专家[，,].*?分析[。.]?\s*/is,
            /^作为.*?专家[，,].*?分析[。.]?\s*/is,
            /^我将.*?分析[。.]?\s*/is,
            /^根据.*?信息[，,].*?方案[。.]?\s*/is,
            /^基于.*?店铺.*?活动[。.]?\s*/is,
            /^好的[，,].*?活动方案[。.]?\s*/is
        ];
        
        let cleanedContent = content;
        
        for (const pattern of introPatterns) {
            cleanedContent = cleanedContent.replace(pattern, '');
        }
        
        return cleanedContent.trim();
    }
    
    /**
     * 清理HTML标记
     * @param {string} content - 内容
     * @returns {string} - 清理后的内容
     */
    cleanHTMLMarkers(content) {
        return content
            .replace(/```html\s*/gi, '')
            .replace(/```\s*/gi, '')
            .replace(/^html\s*/gi, '')
            .trim();
    }

    /**
     * 清理emoji图标
     * @param {string} content - 内容
     * @returns {string} - 清理后的内容
     */
    cleanEmojiIcons(content) {
        console.log('[店铺活动-清理] 开始清理emoji图标...');

        // 定义常见的emoji图标模式
        const emojiPatterns = [
            // 具体的emoji字符
            /🎯\s*/g,  // 目标
            /💰\s*/g,  // 金钱
            /🚚\s*/g,  // 卡车
            /🎫\s*/g,  // 票券
            /🍽️\s*/g, // 餐具
            /📊\s*/g,  // 图表
            /🔥\s*/g,  // 火焰
            /⭐\s*/g,  // 星星
            /✨\s*/g,  // 闪光
            /🎉\s*/g,  // 庆祝
            /🎁\s*/g,  // 礼物
            /💡\s*/g,  // 灯泡
            /📈\s*/g,  // 上升图表
            /📋\s*/g,  // 剪贴板
            /🏪\s*/g,  // 商店
            /🛒\s*/g,  // 购物车

            // 通用emoji范围 (Unicode范围)
            /[\u{1F600}-\u{1F64F}]\s*/gu, // 表情符号
            /[\u{1F300}-\u{1F5FF}]\s*/gu, // 符号和象形文字
            /[\u{1F680}-\u{1F6FF}]\s*/gu, // 交通和地图符号
            /[\u{1F700}-\u{1F77F}]\s*/gu, // 炼金术符号
            /[\u{1F780}-\u{1F7FF}]\s*/gu, // 几何形状扩展
            /[\u{1F800}-\u{1F8FF}]\s*/gu, // 补充箭头-C
            /[\u{1F900}-\u{1F9FF}]\s*/gu, // 补充符号和象形文字
            /[\u{1FA00}-\u{1FA6F}]\s*/gu, // 扩展-A
            /[\u{1FA70}-\u{1FAFF}]\s*/gu, // 符号和象形文字扩展-A
            /[\u{2600}-\u{26FF}]\s*/gu,   // 杂项符号
            /[\u{2700}-\u{27BF}]\s*/gu,   // 装饰符号
        ];

        // 应用所有emoji清理模式
        emojiPatterns.forEach(pattern => {
            content = content.replace(pattern, '');
        });

        // 清理可能留下的多余空格
        content = content.replace(/\s{2,}/g, ' ');
        content = content.replace(/^\s+|\s+$/gm, '');

        console.log('[店铺活动-清理] emoji图标清理完成');

        return content;
    }

    /**
     * 格式化内容
     * @param {string} content - 内容
     * @returns {string} - 格式化后的内容
     */
    formatContent(content) {
        console.log('[店铺活动-格式化] 开始格式化内容...');

        // 总是转换为HTML格式，即使已经包含一些HTML标签
        content = this.convertTextToHTML(content);

        // 处理补充说明部分的格式化
        content = this.formatSuggestions(content);

        // 添加活动方案的专用样式包装
        content = this.wrapActivitySections(content);

        console.log('[店铺活动-格式化] 内容格式化完成');

        return content;
    }

    /**
     * 为活动方案添加专用样式包装
     * @param {string} content - 内容
     * @returns {string} - 包装后的内容
     */
    wrapActivitySections(content) {
        // 定义活动类型和对应的样式
        const activityTypes = [
            {
                keywords: ['满减活动', '满减规则', '满减方案'],
                color: 'red',
                icon: 'fas fa-tags'
            },
            {
                keywords: ['减配送费', '配送费', '免配送费'],
                color: 'blue',
                icon: 'fas fa-shipping-fast'
            },
            {
                keywords: ['返券活动', '下单返券', '优惠券'],
                color: 'green',
                icon: 'fas fa-ticket-alt'
            },
            {
                keywords: ['好评返券', '好评活动', '评价返券'],
                color: 'yellow',
                icon: 'fas fa-star'
            },
            {
                keywords: ['限时秒杀', '秒杀活动', '秒杀产品'],
                color: 'orange',
                icon: 'fas fa-clock'
            },
            {
                keywords: ['套餐搭配', '单品套餐', '套餐组合', '精品套餐'],
                color: 'purple',
                icon: 'fas fa-utensils'
            }
        ];

        activityTypes.forEach(type => {
            type.keywords.forEach(keyword => {
                const regex = new RegExp(
                    `(<h[2-4][^>]*>[^<]*${keyword}[^<]*</h[2-4]>)(.*?)(?=<h[2-4]|$)`,
                    'gs'
                );

                content = content.replace(regex, (match, title, body) => {
                    return `
                        <div class="activity-section bg-gradient-to-br from-${type.color}-50 to-${type.color}-100 border-l-4 border-${type.color}-500 rounded-lg p-6 mb-6 shadow-sm">
                            <div class="flex items-center mb-4">
                                <i class="${type.icon} text-${type.color}-600 text-xl mr-3"></i>
                                ${title}
                            </div>
                            <div class="content-body ml-8 text-gray-700">
                                ${body}
                            </div>
                        </div>
                    `;
                });
            });
        });

        return content;
    }
    
    /**
     * 格式化补充说明部分
     * @param {string} content - 内容
     * @returns {string} - 格式化后的内容
     */
    formatSuggestions(content) {
        // 处理 **Suggestions 补充说明：** 部分
        const suggestionsPattern = /\*\*Suggestions\s*补充说明[：:]\*\*(.*?)(?=<\/div>|$)/is;

        content = content.replace(suggestionsPattern, (match, suggestionsContent) => {
            if (!suggestionsContent || !suggestionsContent.trim()) {
                return '';
            }

            let formattedSuggestions = suggestionsContent.trim();

            // 先清理可能存在的HTML标签
            formattedSuggestions = formattedSuggestions.replace(/<[^>]*>/g, '');

            // 按行分割内容
            const lines = formattedSuggestions.split('\n').map(line => line.trim()).filter(line => line);

            let htmlContent = '';
            let currentList = [];
            let inList = false;

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];

                // 处理 * ** 开头的小标题
                if (line.match(/^\*\s*\*\*([^*]+)\*\*[：:]?\s*/)) {
                    // 如果之前有列表，先结束列表
                    if (inList && currentList.length > 0) {
                        htmlContent += '<ul class="list-disc list-inside ml-4 space-y-2 mb-4">';
                        htmlContent += currentList.map(item => `<li class="text-gray-700">${item}</li>`).join('');
                        htmlContent += '</ul>';
                        currentList = [];
                        inList = false;
                    }

                    const title = line.replace(/^\*\s*\*\*([^*]+)\*\*[：:]?\s*/, '$1');
                    htmlContent += `<h4 class="text-lg font-semibold text-gray-800 mt-6 mb-3 flex items-center">
                        <i class="fas fa-chevron-right text-blue-500 mr-2"></i>
                        ${title}
                    </h4>`;
                }
                // 处理普通的 * 开头的列表项
                else if (line.match(/^\*\s+/)) {
                    const listItem = line.replace(/^\*\s+/, '');
                    currentList.push(listItem);
                    inList = true;
                }
                // 处理普通段落
                else if (line && !line.match(/^\*/)) {
                    // 如果之前有列表，先结束列表
                    if (inList && currentList.length > 0) {
                        htmlContent += '<ul class="list-disc list-inside ml-4 space-y-2 mb-4">';
                        htmlContent += currentList.map(item => `<li class="text-gray-700">${item}</li>`).join('');
                        htmlContent += '</ul>';
                        currentList = [];
                        inList = false;
                    }

                    htmlContent += `<p class="text-gray-700 leading-relaxed mb-3">${line}</p>`;
                }
            }

            // 处理最后剩余的列表项
            if (inList && currentList.length > 0) {
                htmlContent += '<ul class="list-disc list-inside ml-4 space-y-2 mb-4">';
                htmlContent += currentList.map(item => `<li class="text-gray-700">${item}</li>`).join('');
                htmlContent += '</ul>';
            }

            return `
                <div class="suggestions-section bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-6 mt-8 shadow-sm">
                    <h3 class="text-xl font-bold text-blue-800 mb-4 flex items-center">
                        <i class="fas fa-lightbulb text-blue-600 mr-2"></i>
                        补充说明
                    </h3>
                    <div class="suggestions-content leading-relaxed">
                        ${htmlContent}
                    </div>
                </div>
            `;
        });

        return content;
    }

    /**
     * 将纯文本转换为HTML
     * @param {string} text - 纯文本
     * @returns {string} - HTML格式
     */
    convertTextToHTML(text) {
        console.log('[店铺活动-格式化] 开始转换文本为HTML:', text.substring(0, 200) + '...');

        let html = text;

        // 1. 处理主要标题 (## 开头)
        html = html.replace(/^##\s*(.+)$/gm, '<h2 class="text-2xl font-bold text-orange-600 mt-8 mb-4 border-b-2 border-orange-200 pb-2">$1</h2>');

        // 2. 处理次级标题 (### 开头)
        html = html.replace(/^###\s*(.+)$/gm, '<h3 class="text-xl font-bold text-orange-500 mt-6 mb-3">$1</h3>');

        // 3. 处理粗体标题 (**文字:** 格式)
        html = html.replace(/\*\*([^*]+)[:：]\*\*/g, '<h4 class="text-lg font-semibold text-gray-800 mt-4 mb-2">$1:</h4>');

        // 4. 处理粗体文字 (**文字**)
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-gray-800">$1</strong>');

        // 5. 处理数字列表 (1. 2. 3. 开头)
        html = html.replace(/^(\d+)\.\s*(.+)$/gm, '<div class="numbered-item mb-2"><span class="inline-block w-6 h-6 bg-orange-500 text-white text-sm rounded-full text-center mr-2">$1</span>$2</div>');

        // 6. 处理破折号列表 (- 开头)
        html = html.replace(/^-\s*(.+)$/gm, '<li class="mb-2 ml-4">$1</li>');

        // 7. 处理星号列表 (* 开头)
        html = html.replace(/^\*\s*(.+)$/gm, '<li class="mb-2 ml-4">$1</li>');

        // 8. 包装连续的列表项
        html = html.replace(/(<li[^>]*>.*?<\/li>\s*)+/gs, '<ul class="list-disc list-inside space-y-1 mb-4">$&</ul>');

        // 9. 处理段落 (连续的非HTML行)
        const lines = html.split('\n');
        let processedLines = [];
        let inParagraph = false;

        lines.forEach(line => {
            const trimmedLine = line.trim();

            // 跳过空行
            if (!trimmedLine) {
                if (inParagraph) {
                    processedLines.push('</p>');
                    inParagraph = false;
                }
                processedLines.push('');
                return;
            }

            // 检查是否是HTML标签行
            if (trimmedLine.match(/^<[^>]+>/)) {
                if (inParagraph) {
                    processedLines.push('</p>');
                    inParagraph = false;
                }
                processedLines.push(line);
            } else {
                // 普通文本行
                if (!inParagraph) {
                    processedLines.push('<p class="mb-3 text-gray-700 leading-relaxed">');
                    inParagraph = true;
                }
                processedLines.push(trimmedLine);
            }
        });

        // 关闭最后的段落
        if (inParagraph) {
            processedLines.push('</p>');
        }

        html = processedLines.join('\n');

        // 10. 清理多余的空白和重复标签
        html = html.replace(/\n\s*\n\s*\n/g, '\n\n');
        html = html.replace(/<\/p>\s*<p[^>]*>/g, '</p>\n<p class="mb-3 text-gray-700 leading-relaxed">');

        console.log('[店铺活动-格式化] HTML转换完成:', html.substring(0, 300) + '...');

        return html;
    }
    
    /**
     * 验证内容完整性
     * @param {string} content - 内容
     */
    validateContent(content) {
        if (!content || content.length < 100) {
            throw new Error('生成的内容过短，可能不完整');
        }
        
        // 检查是否包含关键部分
        const requiredSections = ['满减', '配送', '返券', '套餐'];
        const missingsections = requiredSections.filter(section => 
            !content.includes(section)
        );
        
        if (missingsections.length > 2) {
            console.warn('[店铺活动-内容] 内容可能不完整，缺少部分:', missingsections);
        }
    }
    
    /**
     * 获取备用提示词
     * @returns {string} - 备用提示词
     */
    getBackupPrompt() {
        return `
作为美团外卖店铺活动优化专家，请根据以下店铺信息制定活动方案：

店铺名称：{storeName}
店铺地址：{storeAddress}
经营品类：{businessCategory}
营业时间：{businessHours}

菜品信息：
{menuItems}

请制定以下活动方案：

1. 满减活动：满30减1元，满50减2元，满80减3元（默认小额减免策略）
2. 减配送费活动：配送费立减1元（无门槛优惠）
3. 下单返券活动：下单成功即可获得1元优惠券，满35元可用，有效期7天
4. 好评返券活动：顾客5星好评获得25减2元优惠券，不可叠加使用
5. 限时秒杀活动：选择3-5款热门产品，原价减2元，限时抢购
6. 精品套餐搭配：设计2-3个营养均衡的套餐，禁止主食+主食等不合理搭配，套餐名称不要包含早餐、午餐、晚餐等时间限制词汇

**Suggestions 补充说明：**

* **产品分类：** 将菜品按主食类、主菜类、汤类、饮品类等分类，便于合理搭配。

* **好评激励：** 主动提醒顾客参与好评返券活动，提高店铺评分和复购率。

* **秒杀时段：** 建议在11:30-12:30和17:30-18:30用餐高峰期进行限时秒杀。

请确保活动方案具有吸引力且符合成本控制要求。请直接生成html代码 不要有任何一个多余的字
        `.trim();
    }
    
    /**
     * 重试机制
     * @param {Function} fn - 要重试的函数
     * @param {number} maxRetries - 最大重试次数
     * @returns {Promise} - 执行结果
     */
    async retryWithBackoff(fn, maxRetries = this.maxRetries) {
        let lastError;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;
                console.warn(`[店铺活动-内容] 尝试 ${attempt}/${maxRetries} 失败:`, error.message);
                
                if (attempt < maxRetries) {
                    const delay = this.retryDelay * Math.pow(2, attempt - 1);
                    console.log(`[店铺活动-内容] ${delay}ms 后重试...`);
                    await this.sleep(delay);
                }
            }
        }
        
        throw lastError;
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
     * 获取生成统计信息
     * @returns {Object} - 统计信息
     */
    getGenerationStats() {
        return {
            totalGenerations: 0,
            successfulGenerations: 0,
            failedGenerations: 0,
            averageGenerationTime: 0
        };
    }
}

// 确保类在全局作用域中可用
window.StoreActivityContentGenerator = StoreActivityContentGenerator;

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StoreActivityContentGenerator;
}
