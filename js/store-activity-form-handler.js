/**
 * 店铺活动方案生成 - 表单处理器
 * 负责表单数据的收集、验证和处理
 */

class StoreActivityFormHandler {
    constructor() {
        this.formId = 'store-activity-form';
        this.requiredFields = [
            'storeName',
            'storeAddress', 
            'businessCategory',
            'businessHours',
            'menuItems'
        ];
        
        this.init();
    }
    
    /**
     * 初始化表单处理器
     */
    init() {
        console.log('[店铺活动-表单] 表单处理器初始化...');
        
        // 绑定表单验证事件
        this.bindValidationEvents();
        
        // 设置表单自动保存
        this.setupAutoSave();
        
        // 加载保存的表单数据
        this.loadSavedFormData();
        
        console.log('[店铺活动-表单] 表单处理器初始化完成');
    }
    
    /**
     * 绑定表单验证事件
     */
    bindValidationEvents() {
        const form = document.getElementById(this.formId);
        if (!form) return;
        
        // 为每个必填字段添加实时验证
        this.requiredFields.forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                field.addEventListener('blur', () => this.validateField(fieldName));
                field.addEventListener('input', () => this.clearFieldError(fieldName));
            }
        });
        
        // 菜品输入框特殊处理
        const menuItemsField = form.querySelector('[name="menuItems"]');
        if (menuItemsField) {
            menuItemsField.addEventListener('input', () => this.validateMenuItems());
        }
    }
    
    /**
     * 设置表单自动保存
     */
    setupAutoSave() {
        const form = document.getElementById(this.formId);
        if (!form) return;
        
        // 每30秒自动保存一次
        this.autoSaveInterval = setInterval(() => {
            this.saveFormData();
        }, 30000);
        
        // 页面卸载时保存
        window.addEventListener('beforeunload', () => {
            this.saveFormData();
        });
    }
    
    /**
     * 收集表单数据
     * @returns {Object|null} - 表单数据对象
     */
    collectFormData() {
        const form = document.getElementById(this.formId);
        if (!form) {
            console.error('[店铺活动-表单] 找不到表单元素');
            return null;
        }
        
        try {
            // 验证表单
            if (!this.validateForm()) {
                throw new Error('表单验证失败');
            }
            
            const formData = new FormData(form);
            const data = {};
            
            // 收集基本字段
            for (const [key, value] of formData.entries()) {
                data[key] = value.trim();
            }
            
            // 处理菜品数据
            data.menuItems = this.parseMenuItems(data.menuItems);
            
            // 添加时间戳
            data.timestamp = new Date().toISOString();
            data.formVersion = '1.0';
            
            console.log('[店铺活动-表单] 表单数据收集完成:', data);
            return data;
            
        } catch (error) {
            console.error('[店铺活动-表单] 收集表单数据失败:', error);
            return null;
        }
    }
    
    /**
     * 解析菜品数据
     * @param {string} menuText - 菜品文本
     * @returns {Array} - 解析后的菜品数组
     */
    parseMenuItems(menuText) {
        if (!menuText || typeof menuText !== 'string') {
            return [];
        }
        
        const lines = menuText.split('\n').filter(line => line.trim());
        const menuItems = [];
        
        lines.forEach((line, index) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return;
            
            // 尝试解析菜品名称和价格
            const match = trimmedLine.match(/^(.+?)\s+(\d+(?:\.\d+)?)[元￥]?$/);
            
            if (match) {
                const [, name, price] = match;
                menuItems.push({
                    name: name.trim(),
                    price: parseFloat(price),
                    originalText: trimmedLine,
                    lineNumber: index + 1
                });
            } else {
                // 如果无法解析价格，仍然保存菜品名称
                menuItems.push({
                    name: trimmedLine,
                    price: null,
                    originalText: trimmedLine,
                    lineNumber: index + 1,
                    parseError: true
                });
            }
        });
        
        console.log(`[店铺活动-表单] 解析了 ${menuItems.length} 个菜品`);
        return menuItems;
    }
    
    /**
     * 验证表单
     * @returns {boolean} - 验证是否通过
     */
    validateForm() {
        let isValid = true;
        
        // 验证所有必填字段
        this.requiredFields.forEach(fieldName => {
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        });
        
        // 特殊验证菜品数据
        if (!this.validateMenuItems()) {
            isValid = false;
        }
        
        return isValid;
    }
    
    /**
     * 验证单个字段
     * @param {string} fieldName - 字段名
     * @returns {boolean} - 验证是否通过
     */
    validateField(fieldName) {
        const form = document.getElementById(this.formId);
        const field = form?.querySelector(`[name="${fieldName}"]`);
        
        if (!field) return false;
        
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // 基本必填验证
        if (!value) {
            isValid = false;
            errorMessage = '此字段为必填项';
        } else {
            // 特殊字段验证
            switch (fieldName) {
                case 'storeName':
                    if (value.length < 2) {
                        isValid = false;
                        errorMessage = '店铺名称至少需要2个字符';
                    } else if (value.length > 50) {
                        isValid = false;
                        errorMessage = '店铺名称不能超过50个字符';
                    }
                    break;
                    
                case 'storeAddress':
                    if (value.length < 5) {
                        isValid = false;
                        errorMessage = '请输入完整的店铺地址';
                    }
                    break;
                    
                case 'businessCategory':
                    if (value.length < 2) {
                        isValid = false;
                        errorMessage = '请输入具体的经营品类';
                    }
                    break;
                    
                case 'businessHours':
                    // 简单的营业时间格式验证
                    const timePattern = /\d{1,2}:\d{2}.*\d{1,2}:\d{2}/;
                    if (!timePattern.test(value)) {
                        isValid = false;
                        errorMessage = '请输入正确的营业时间格式，如：10:00-22:00';
                    }
                    break;
            }
        }
        
        // 显示或清除错误信息
        if (isValid) {
            this.clearFieldError(fieldName);
        } else {
            this.showFieldError(fieldName, errorMessage);
        }
        
        return isValid;
    }
    
    /**
     * 验证菜品数据
     * @returns {boolean} - 验证是否通过
     */
    validateMenuItems() {
        const form = document.getElementById(this.formId);
        const field = form?.querySelector('[name="menuItems"]');
        
        if (!field) return false;
        
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        if (!value) {
            isValid = false;
            errorMessage = '请输入菜品信息';
        } else {
            const lines = value.split('\n').filter(line => line.trim());
            
            if (lines.length < 5) {
                isValid = false;
                errorMessage = '请至少输入5个菜品信息';
            } else if (lines.length > 100) {
                isValid = false;
                errorMessage = '菜品数量不能超过100个';
            } else {
                // 检查格式
                let validLines = 0;
                lines.forEach(line => {
                    const trimmedLine = line.trim();
                    if (trimmedLine && (trimmedLine.includes('元') || /\d+/.test(trimmedLine))) {
                        validLines++;
                    }
                });
                
                if (validLines < lines.length * 0.7) {
                    isValid = false;
                    errorMessage = '请确保大部分菜品都包含价格信息';
                }
            }
        }
        
        // 显示或清除错误信息
        if (isValid) {
            this.clearFieldError('menuItems');
        } else {
            this.showFieldError('menuItems', errorMessage);
        }
        
        return isValid;
    }
    
    /**
     * 显示字段错误
     * @param {string} fieldName - 字段名
     * @param {string} message - 错误消息
     */
    showFieldError(fieldName, message) {
        const form = document.getElementById(this.formId);
        const field = form?.querySelector(`[name="${fieldName}"]`);
        
        if (!field) return;
        
        // 添加错误样式
        field.classList.add('input-error', 'border-red-500');
        
        // 查找或创建错误消息元素
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error text-red-500 text-sm mt-1';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    /**
     * 清除字段错误
     * @param {string} fieldName - 字段名
     */
    clearFieldError(fieldName) {
        const form = document.getElementById(this.formId);
        const field = form?.querySelector(`[name="${fieldName}"]`);
        
        if (!field) return;
        
        // 移除错误样式
        field.classList.remove('input-error', 'border-red-500');
        
        // 隐藏错误消息
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
    
    /**
     * 保存表单数据到本地存储
     */
    saveFormData() {
        try {
            const form = document.getElementById(this.formId);
            if (!form) return;
            
            const formData = new FormData(form);
            const data = {};
            
            for (const [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            localStorage.setItem('storeActivityFormData', JSON.stringify(data));
            console.log('[店铺活动-表单] 表单数据已自动保存');
        } catch (error) {
            console.error('[店铺活动-表单] 保存表单数据失败:', error);
        }
    }
    
    /**
     * 加载保存的表单数据
     */
    loadSavedFormData() {
        try {
            const savedData = localStorage.getItem('storeActivityFormData');
            if (!savedData) return;
            
            const data = JSON.parse(savedData);
            const form = document.getElementById(this.formId);
            if (!form) return;
            
            // 填充表单字段
            Object.keys(data).forEach(key => {
                const field = form.querySelector(`[name="${key}"]`);
                if (field && data[key]) {
                    field.value = data[key];
                }
            });
            
            console.log('[店铺活动-表单] 已加载保存的表单数据');
        } catch (error) {
            console.error('[店铺活动-表单] 加载表单数据失败:', error);
        }
    }
    
    /**
     * 清除保存的表单数据
     */
    clearSavedFormData() {
        try {
            localStorage.removeItem('storeActivityFormData');
            console.log('[店铺活动-表单] 已清除保存的表单数据');
        } catch (error) {
            console.error('[店铺活动-表单] 清除表单数据失败:', error);
        }
    }
    
    /**
     * 重置表单
     */
    resetForm() {
        const form = document.getElementById(this.formId);
        if (form) {
            form.reset();
            
            // 清除所有错误状态
            this.requiredFields.forEach(fieldName => {
                this.clearFieldError(fieldName);
            });
            
            // 清除保存的数据
            this.clearSavedFormData();
            
            console.log('[店铺活动-表单] 表单已重置');
        }
    }
    
    /**
     * 销毁表单处理器
     */
    destroy() {
        // 清除自动保存定时器
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
        
        console.log('[店铺活动-表单] 表单处理器已销毁');
    }
}

// 确保类在全局作用域中可用
window.StoreActivityFormHandler = StoreActivityFormHandler;

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StoreActivityFormHandler;
}
