/**
 * 表单处理器
 * 负责表单验证、数据收集和用户交互
 */

class FormHandler {
    constructor() {
        this.form = document.getElementById('brand-store-form');
        this.validationRules = this.initValidationRules();
        this.init();
    }
    
    /**
     * 初始化表单处理器
     */
    init() {
        console.log('表单处理器初始化...');
        this.bindValidationEvents();
    }
    
    /**
     * 初始化验证规则
     */
    initValidationRules() {
        return {
            storeName: {
                required: true,
                minLength: 2,
                maxLength: 50,
                message: '店铺名称必须填写，长度在2-50个字符之间'
            },
            category: {
                required: true,
                minLength: 2,
                maxLength: 100,
                message: '请输入经营品类，长度在2-100个字符之间'
            },
            address: {
                required: false,
                maxLength: 200,
                message: '地址长度不能超过200个字符'
            },
            mainProducts: {
                required: false,
                maxLength: 200,
                message: '主营产品描述长度不能超过200个字符'
            },
            features: {
                required: false,
                maxLength: 500,
                message: '经营特色描述长度不能超过500个字符'
            }
        };
    }
    
    /**
     * 绑定验证事件
     */
    bindValidationEvents() {
        // 实时验证
        Object.keys(this.validationRules).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.addEventListener('blur', () => this.validateField(fieldName));
                field.addEventListener('input', () => this.clearFieldError(fieldName));
            }
        });
        
        // 品类输入框处理
        const categoryInput = document.getElementById('category');
        if (categoryInput) {
            categoryInput.addEventListener('input', () => {
                this.validateField('category');
            });
        }
    }
    

    
    /**
     * 验证单个字段
     */
    validateField(fieldName) {
        const field = document.getElementById(fieldName);
        const rule = this.validationRules[fieldName];
        
        if (!field || !rule) return true;
        
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // 必填验证
        if (rule.required && !value) {
            isValid = false;
            errorMessage = rule.message;
        }
        
        // 长度验证
        if (isValid && value) {
            if (rule.minLength && value.length < rule.minLength) {
                isValid = false;
                errorMessage = rule.message;
            }
            
            if (rule.maxLength && value.length > rule.maxLength) {
                isValid = false;
                errorMessage = rule.message;
            }
        }
        
        // 特殊验证
        if (isValid && fieldName === 'storeName') {
            // 店铺名称不能包含特殊字符
            const invalidChars = /[<>\"'&]/;
            if (invalidChars.test(value)) {
                isValid = false;
                errorMessage = '店铺名称不能包含特殊字符 < > " \' &';
            }
        }
        
        // 显示验证结果
        if (isValid) {
            this.showFieldSuccess(fieldName);
        } else {
            this.showFieldError(fieldName, errorMessage);
        }
        
        return isValid;
    }
    
    /**
     * 显示字段错误
     */
    showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const formGroup = field.closest('.form-group');
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        if (formGroup) {
            formGroup.classList.add('error');
            formGroup.classList.remove('success');
            formGroup.classList.add('error'); // 触发动画
        }
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }
    
    /**
     * 显示字段成功
     */
    showFieldSuccess(fieldName) {
        const field = document.getElementById(fieldName);
        const formGroup = field.closest('.form-group');
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        if (formGroup) {
            formGroup.classList.remove('error');
            formGroup.classList.add('success');
        }
        
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }
    
    /**
     * 清除字段错误
     */
    clearFieldError(fieldName) {
        const field = document.getElementById(fieldName);
        const formGroup = field.closest('.form-group');
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        if (formGroup) {
            formGroup.classList.remove('error');
        }
        
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }
    
    /**
     * 验证整个表单
     */
    validateForm() {
        let isValid = true;
        const errors = [];
        
        // 验证所有字段
        Object.keys(this.validationRules).forEach(fieldName => {
            if (!this.validateField(fieldName)) {
                isValid = false;
                errors.push(fieldName);
            }
        });
        

        
        // 滚动到第一个错误字段
        if (!isValid && errors.length > 0) {
            const firstErrorField = document.getElementById(errors[0]);
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                firstErrorField.focus();
            }
        }
        
        return isValid;
    }
    
    /**
     * 收集表单数据
     */
    collectFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        // 基础字段
        data.storeName = formData.get('storeName')?.trim() || '';
        data.address = formData.get('address')?.trim() || '';
        data.mainProducts = formData.get('mainProducts')?.trim() || '';
        data.features = formData.get('features')?.trim() || '';
        
        // 处理品类
        data.category = formData.get('category')?.trim() || '';
        
        // 处理目标客群（多选）
        const targetGroups = formData.getAll('targetGroup');
        data.targetGroup = targetGroups.length > 0 ? targetGroups.join('、') : '';
        
        // 处理价格区间
        const priceRange = document.getElementById('priceRange');
        data.priceRange = priceRange ? `${priceRange.value}元` : '';
        
        // 添加时间戳
        data.timestamp = new Date().toISOString();
        
        return data;
    }
    
    /**
     * 重置表单
     */
    resetForm() {
        this.form.reset();
        
        // 清除所有验证状态
        Object.keys(this.validationRules).forEach(fieldName => {
            this.clearFieldError(fieldName);
        });
        

        
        // 重置价格显示
        const priceValue = document.getElementById('priceValue');
        const priceRange = document.getElementById('priceRange');
        if (priceValue && priceRange) {
            priceValue.textContent = priceRange.value;
        }
    }
    
    /**
     * 填充表单数据
     */
    fillFormData(data) {
        if (!data) return;
        
        // 填充基础字段
        Object.keys(data).forEach(key => {
            const field = document.getElementById(key);
            if (field && data[key]) {
                field.value = data[key];
            }
        });
        
        // 处理特殊字段
        if (data.targetGroup) {
            const targetGroups = data.targetGroup.split('、');
            targetGroups.forEach(group => {
                const checkbox = document.querySelector(`input[name="targetGroup"][value="${group}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }
        
        // 处理价格区间
        if (data.priceRange) {
            const priceValue = data.priceRange.replace('元', '');
            const priceRange = document.getElementById('priceRange');
            const priceDisplay = document.getElementById('priceValue');
            
            if (priceRange) {
                priceRange.value = priceValue;
            }
            if (priceDisplay) {
                priceDisplay.textContent = priceValue;
            }
        }
    }
}

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormHandler;
}
