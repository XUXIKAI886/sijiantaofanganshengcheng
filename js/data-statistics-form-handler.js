/**
 * 数据统计分析表单处理器
 * 负责表单验证和数据收集
 */

class DataStatisticsFormHandler {
    constructor() {
        this.form = document.getElementById('data-statistics-form');
        this.requiredFields = [
            'storeName', 'storeAddress', 'businessCategory', 'businessHours',
            'exposureCount', 'visitCount', 'orderCount',
            'minOrderPrice', 'deliveryFee', 'deliveryRange'
        ];
        
        this.initializeValidation();
        console.log('[数据统计表单] 处理器初始化完成');
    }

    /**
     * 初始化表单验证
     */
    initializeValidation() {
        if (!this.form) {
            console.error('[数据统计表单] 表单元素未找到');
            return;
        }

        // 为每个输入框添加实时验证
        this.requiredFields.forEach(fieldName => {
            const field = document.getElementById(this.getFieldId(fieldName));
            if (field) {
                field.addEventListener('blur', () => this.validateField(fieldName));
                field.addEventListener('input', () => this.clearFieldError(fieldName));
            }
        });

        // 数字字段验证
        this.bindNumberFieldValidation();
    }

    /**
     * 绑定数字字段验证
     */
    bindNumberFieldValidation() {
        const numberFields = [
            'exposure-count', 'visit-count', 'order-count',
            'visit-conversion', 'order-conversion',
            'min-order-price', 'delivery-fee', 'delivery-range'
        ];

        numberFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', (e) => {
                    let value = e.target.value;
                    // 只允许数字和小数点
                    value = value.replace(/[^\d.]/g, '');
                    // 确保只有一个小数点
                    const parts = value.split('.');
                    if (parts.length > 2) {
                        value = parts[0] + '.' + parts.slice(1).join('');
                    }
                    e.target.value = value;
                });
            }
        });
    }

    /**
     * 获取字段对应的DOM元素ID
     * @param {string} fieldName - 字段名
     * @returns {string} - DOM元素ID
     */
    getFieldId(fieldName) {
        const idMapping = {
            'storeName': 'store-name',
            'storeAddress': 'store-address',
            'businessCategory': 'business-category',
            'businessHours': 'business-hours',
            'exposureCount': 'exposure-count',
            'visitCount': 'visit-count',
            'orderCount': 'order-count',
            'minOrderPrice': 'min-order-price',
            'deliveryFee': 'delivery-fee',
            'deliveryRange': 'delivery-range'
        };
        return idMapping[fieldName] || fieldName;
    }

    /**
     * 验证单个字段
     * @param {string} fieldName - 字段名
     * @returns {boolean} - 验证是否通过
     */
    validateField(fieldName) {
        const fieldId = this.getFieldId(fieldName);
        const field = document.getElementById(fieldId);
        
        if (!field) {
            console.warn(`[数据统计表单] 字段未找到: ${fieldId}`);
            return false;
        }

        const value = field.value?.trim();
        let isValid = true;
        let errorMessage = '';

        // 必填字段验证
        if (this.requiredFields.includes(fieldName) && !value) {
            isValid = false;
            errorMessage = '此字段为必填项';
        }

        // 数字字段特殊验证
        if (isValid && this.isNumberField(fieldName)) {
            const numValue = parseFloat(value);
            if (isNaN(numValue) || numValue < 0) {
                isValid = false;
                errorMessage = '请输入有效的正数';
            }

            // 特殊验证规则
            if (isValid) {
                const validationResult = this.validateNumberField(fieldName, numValue);
                if (!validationResult.valid) {
                    isValid = false;
                    errorMessage = validationResult.message;
                }
            }
        }

        // 显示或隐藏错误信息
        if (isValid) {
            this.clearFieldError(fieldName);
        } else {
            this.showFieldError(fieldName, errorMessage);
        }

        return isValid;
    }

    /**
     * 验证数字字段的特殊规则
     * @param {string} fieldName - 字段名
     * @param {number} value - 数值
     * @returns {Object} - 验证结果
     */
    validateNumberField(fieldName, value) {
        switch (fieldName) {
            case 'exposureCount':
                if (value > 1000000) {
                    return { valid: false, message: '曝光人数不应超过100万' };
                }
                break;
            case 'visitCount':
                const exposureCount = parseFloat(document.getElementById('exposure-count').value) || 0;
                if (value > exposureCount) {
                    return { valid: false, message: '入店人数不应超过曝光人数' };
                }
                break;
            case 'orderCount':
                const visitCount = parseFloat(document.getElementById('visit-count').value) || 0;
                if (value > visitCount) {
                    return { valid: false, message: '下单人数不应超过入店人数' };
                }
                break;
            case 'deliveryRange':
                // 取消配送范围限制，允许填写任何数字
                break;
        }
        return { valid: true };
    }

    /**
     * 判断是否为数字字段
     * @param {string} fieldName - 字段名
     * @returns {boolean}
     */
    isNumberField(fieldName) {
        const numberFields = [
            'exposureCount', 'visitCount', 'orderCount',
            'minOrderPrice', 'deliveryFee', 'deliveryRange'
        ];
        return numberFields.includes(fieldName);
    }

    /**
     * 显示字段错误信息
     * @param {string} fieldName - 字段名
     * @param {string} message - 错误信息
     */
    showFieldError(fieldName, message) {
        const fieldId = this.getFieldId(fieldName);
        const field = document.getElementById(fieldId);
        
        if (field) {
            // 添加错误样式
            field.classList.add('input-error', 'border-red-500');
            
            // 创建或更新错误信息元素
            let errorElement = document.getElementById(`${fieldId}-error`);
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.id = `${fieldId}-error`;
                errorElement.className = 'text-red-500 text-sm mt-1 flex items-center';
                field.parentNode.appendChild(errorElement);
            }
            
            errorElement.innerHTML = `
                <i class="fas fa-exclamation-circle mr-1"></i>
                ${message}
            `;
        }
    }

    /**
     * 清除字段错误信息
     * @param {string} fieldName - 字段名
     */
    clearFieldError(fieldName) {
        const fieldId = this.getFieldId(fieldName);
        const field = document.getElementById(fieldId);
        
        if (field) {
            // 移除错误样式
            field.classList.remove('input-error', 'border-red-500');
            
            // 移除错误信息元素
            const errorElement = document.getElementById(`${fieldId}-error`);
            if (errorElement) {
                errorElement.remove();
            }
        }
    }

    /**
     * 验证整个表单
     * @returns {boolean} - 表单是否有效
     */
    validateForm() {
        let isValid = true;

        // 验证所有必填字段
        this.requiredFields.forEach(fieldName => {
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        });

        // 验证逻辑关系
        if (isValid) {
            isValid = this.validateDataLogic();
        }

        return isValid;
    }

    /**
     * 验证数据逻辑关系
     * @returns {boolean} - 逻辑验证是否通过
     */
    validateDataLogic() {
        const exposureCount = parseFloat(document.getElementById('exposure-count').value) || 0;
        const visitCount = parseFloat(document.getElementById('visit-count').value) || 0;
        const orderCount = parseFloat(document.getElementById('order-count').value) || 0;

        // 验证数据逻辑：曝光 >= 入店 >= 下单
        if (visitCount > exposureCount) {
            this.showGlobalError('入店人数不能超过曝光人数');
            return false;
        }

        if (orderCount > visitCount) {
            this.showGlobalError('下单人数不能超过入店人数');
            return false;
        }

        return true;
    }

    /**
     * 显示全局错误信息
     * @param {string} message - 错误信息
     */
    showGlobalError(message) {
        // 创建全局错误提示
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-error fixed top-4 right-4 z-50 max-w-sm';
        errorDiv.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-exclamation-triangle mr-2"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(errorDiv);

        // 3秒后移除
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 3000);
    }

    /**
     * 获取表单数据
     * @returns {Object|null} - 表单数据对象，验证失败返回null
     */
    validateAndGetFormData() {
        if (!this.validateForm()) {
            console.warn('[数据统计表单] 表单验证失败');
            return null;
        }

        const formData = this.collectFormData();
        console.log('[数据统计表单] 表单数据收集完成:', formData);
        return formData;
    }

    /**
     * 收集表单数据
     * @returns {Object} - 表单数据对象
     */
    collectFormData() {
        const data = {};

        // 基本信息
        data.storeName = document.getElementById('store-name')?.value?.trim() || '';
        data.storeAddress = document.getElementById('store-address')?.value?.trim() || '';
        data.businessCategory = document.getElementById('business-category')?.value?.trim() || '';
        data.businessHours = document.getElementById('business-hours')?.value?.trim() || '';

        // 30天数据
        data.exposureCount = parseInt(document.getElementById('exposure-count')?.value) || 0;
        data.visitCount = parseInt(document.getElementById('visit-count')?.value) || 0;
        data.orderCount = parseInt(document.getElementById('order-count')?.value) || 0;
        data.visitConversion = parseFloat(document.getElementById('visit-conversion')?.value) || 0;
        data.orderConversion = parseFloat(document.getElementById('order-conversion')?.value) || 0;

        // 配送服务
        data.minOrderPrice = parseFloat(document.getElementById('min-order-price')?.value) || 0;
        data.deliveryFee = parseFloat(document.getElementById('delivery-fee')?.value) || 0;
        data.deliveryRange = parseFloat(document.getElementById('delivery-range')?.value) || 0;

        // 店铺权重设置
        data.idleCookingTime = document.getElementById('idle-cooking-time')?.value || '';
        data.busyCookingTime = document.getElementById('busy-cooking-time')?.value || '';
        data.greenCharity = document.getElementById('green-charity')?.value || '';
        data.selfPickup = document.getElementById('self-pickup')?.value || '';
        data.preOrder = document.getElementById('pre-order')?.value || '';
        data.onTimeGuarantee = document.getElementById('on-time-guarantee')?.value || '';
        data.foodSafety = document.getElementById('food-safety')?.value || '';

        // 计算转化率（如果没有手动输入）
        if (data.exposureCount > 0 && data.visitCount > 0 && data.visitConversion === 0) {
            data.visitConversion = parseFloat(((data.visitCount / data.exposureCount) * 100).toFixed(2));
        }

        if (data.visitCount > 0 && data.orderCount > 0 && data.orderConversion === 0) {
            data.orderConversion = parseFloat(((data.orderCount / data.visitCount) * 100).toFixed(2));
        }

        // 生成统计汇总
        data.summary = this.generateDataSummary(data);

        return data;
    }

    /**
     * 生成数据汇总
     * @param {Object} data - 表单数据
     * @returns {Object} - 数据汇总
     */
    generateDataSummary(data) {
        return {
            totalExposure: data.exposureCount,
            totalVisits: data.visitCount,
            totalOrders: data.orderCount,
            visitConversionRate: data.visitConversion,
            orderConversionRate: data.orderConversion,
            averageOrderValue: data.minOrderPrice, // 可以根据需要调整
            serviceLevel: this.calculateServiceLevel(data),
            competitiveness: this.calculateCompetitiveness(data)
        };
    }

    /**
     * 计算服务水平评分
     * @param {Object} data - 表单数据
     * @returns {number} - 服务水平评分 (0-100)
     */
    calculateServiceLevel(data) {
        let score = 0;
        
        // 配送设置评分
        if (data.minOrderPrice <= 20) score += 15;
        else if (data.minOrderPrice <= 30) score += 10;
        else if (data.minOrderPrice <= 40) score += 5;

        if (data.deliveryFee <= 3) score += 15;
        else if (data.deliveryFee <= 5) score += 10;
        else if (data.deliveryFee <= 8) score += 5;

        if (data.deliveryRange >= 5) score += 10;
        else if (data.deliveryRange >= 3) score += 5;

        // 店铺功能评分
        const features = [
            data.greenCharity, data.selfPickup, data.preOrder,
            data.onTimeGuarantee, data.foodSafety
        ];
        const enabledFeatures = features.filter(f => f === '是').length;
        score += enabledFeatures * 10;

        return Math.min(score, 100);
    }

    /**
     * 计算竞争力评分
     * @param {Object} data - 表单数据
     * @returns {number} - 竞争力评分 (0-100)
     */
    calculateCompetitiveness(data) {
        let score = 50; // 基础分

        // 转化率评分
        if (data.visitConversion >= 20) score += 20;
        else if (data.visitConversion >= 15) score += 15;
        else if (data.visitConversion >= 10) score += 10;
        else if (data.visitConversion >= 5) score += 5;

        if (data.orderConversion >= 30) score += 20;
        else if (data.orderConversion >= 25) score += 15;
        else if (data.orderConversion >= 20) score += 10;
        else if (data.orderConversion >= 15) score += 5;

        // 出餐时长评分
        if (data.idleCookingTime === '15' && data.busyCookingTime === '15') score += 10;
        else if (data.idleCookingTime === '15' || data.busyCookingTime === '15') score += 5;

        return Math.min(score, 100);
    }

    /**
     * 重置表单
     */
    resetForm() {
        if (this.form) {
            this.form.reset();
            
            // 清除所有错误信息
            this.requiredFields.forEach(fieldName => {
                this.clearFieldError(fieldName);
            });
        }
    }
}

// 导出到全局作用域
window.DataStatisticsFormHandler = DataStatisticsFormHandler;