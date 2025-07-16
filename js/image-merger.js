/**
 * 图片拼接工具类
 * 用于处理多张图片的拼接、预览和下载功能
 */
class ImageMerger {
    constructor() {
        this.imageData = [];
        this.mergedCanvas = null;
        this.settings = {
            direction: 'vertical',
            alignment: 'center',
            spacing: 0,
            quality: 1.0,
            format: 'png'
        };
        
        this.init();
    }
    
    /**
     * 初始化
     */
    init() {
        this.loadImageData();
        this.setupEventListeners();
        this.updateUI();
    }
    
    /**
     * 加载图片数据
     */
    loadImageData() {
        try {
            const storedData = localStorage.getItem('imageMergerData');
            if (storedData) {
                this.imageData = JSON.parse(storedData);
                console.log(`[图片拼接] 从localStorage加载了 ${this.imageData.length} 张图片`);
            } else {
                console.log('[图片拼接] 没有找到存储的图片数据，等待用户上传');
                this.imageData = [];
            }
        } catch (error) {
            console.error('[图片拼接] 加载图片数据失败:', error);
            this.imageData = [];
        }
    }
    
    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 设置变化监听
        const settingsElements = ['mergeDirection', 'imageAlignment', 'imageSpacing'];
        settingsElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => {
                    this.updateSettings();
                    if (this.mergedCanvas) {
                        this.generatePreview();
                    }
                });
            }
        });

        // 文件上传事件监听
        this.setupFileUploadListeners();

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 's':
                        e.preventDefault();
                        this.downloadMergedImage();
                        break;
                    case 'r':
                        e.preventDefault();
                        this.generatePreview();
                        break;
                }
            }
        });
    }

    /**
     * 设置文件上传事件监听器
     */
    setupFileUploadListeners() {
        const uploadArea = document.getElementById('uploadArea');
        const imageInput = document.getElementById('imageInput');
        const selectBtn = document.getElementById('selectImagesBtn');

        if (!uploadArea || !imageInput) return;

        // 只给选择按钮绑定点击事件，避免重复触发
        if (selectBtn) {
            selectBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止事件冒泡
                imageInput.click();
            });
        }

        // 给上传区域绑定点击事件，但排除按钮区域
        uploadArea.addEventListener('click', (e) => {
            // 如果点击的是按钮或按钮内的元素，不触发
            if (e.target.closest('#selectImagesBtn')) {
                return;
            }
            imageInput.click();
        });

        // 文件选择
        imageInput.addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files);
            // 清空input值，允许重复选择同一文件
            e.target.value = '';
        });

        // 拖拽上传
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            this.handleFileSelect(e.dataTransfer.files);
        });
    }
    
    /**
     * 处理文件选择
     */
    async handleFileSelect(files) {
        if (!files || files.length === 0) return;

        const validFiles = Array.from(files).filter(file => {
            if (!file.type.startsWith('image/')) {
                this.showMessage(`文件 ${file.name} 不是有效的图片格式`, 'warning');
                return false;
            }
            if (file.size > 10 * 1024 * 1024) { // 10MB限制
                this.showMessage(`文件 ${file.name} 超过10MB大小限制`, 'warning');
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        this.showLoading(`正在处理 ${validFiles.length} 张图片...`);

        try {
            for (const file of validFiles) {
                await this.addImageFile(file);
            }

            this.updateUI();
            this.showMessage(`成功添加 ${validFiles.length} 张图片`, 'success');

        } catch (error) {
            console.error('[图片拼接] 处理文件失败:', error);
            this.showMessage('处理图片文件失败', 'error');
        } finally {
            this.hideLoading();
        }
    }

    /**
     * 添加图片文件
     */
    addImageFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const imageData = {
                    id: Date.now() + Math.random(),
                    name: file.name,
                    data: e.target.result,
                    type: file.type,
                    size: file.size
                };

                this.imageData.push(imageData);
                console.log(`[图片拼接] 添加图片: ${file.name}`);
                resolve(imageData);
            };

            reader.onerror = () => {
                reject(new Error(`读取文件 ${file.name} 失败`));
            };

            reader.readAsDataURL(file);
        });
    }

    /**
     * 更新设置
     */
    updateSettings() {
        const directionEl = document.getElementById('mergeDirection');
        const alignmentEl = document.getElementById('imageAlignment');
        const spacingEl = document.getElementById('imageSpacing');

        if (directionEl) this.settings.direction = directionEl.value;
        if (alignmentEl) this.settings.alignment = alignmentEl.value;
        if (spacingEl) this.settings.spacing = parseInt(spacingEl.value) || 0;
    }
    
    /**
     * 更新UI显示
     */
    updateUI() {
        this.displayImageList();
        this.updateImageCount();
        
        if (this.imageData.length === 0) {
            this.showEmptyState();
        }
    }
    
    /**
     * 显示图片列表
     */
    displayImageList() {
        const imageList = document.getElementById('imageList');
        if (!imageList) return;
        
        if (this.imageData.length === 0) {
            this.showEmptyState();
            return;
        }
        
        let html = '';
        this.imageData.forEach((image, index) => {
            html += this.createImageItemHTML(image, index);
        });
        
        imageList.innerHTML = html;
    }
    
    /**
     * 创建图片项HTML
     */
    createImageItemHTML(image, index) {
        return `
            <div class="image-item" data-index="${index}">
                <img src="${image.data}" alt="${image.name}" class="image-preview" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA4MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCAzMEM0MS4xMDQ2IDMwIDQyIDI5LjEwNDYgNDIgMjhDNDIgMjYuODk1NCA0MS4xMDQ2IDI2IDQwIDI2QzM4Ljg5NTQgMjYgMzggMjYuODk1NCAzOCAyOEMzOCAyOS4xMDQ2IDM4Ljg5NTQgMzAgNDAgMzBaIiBmaWxsPSIjOUM5Qzk3Ii8+CjxwYXRoIGQ9Ik0zNCAzNkw0MCAzMEw0NiAzNkgzNFoiIGZpbGw9IiM5QzlDOTciLz4KPC9zdmc+Cg=='">
                <div class="image-info">
                    <div class="image-name">${this.escapeHtml(image.name)}</div>
                    <div class="image-size">图片 ${index + 1}</div>
                </div>
                <div class="control-buttons">
                    <button class="btn-control btn-up" onclick="imageMerger.moveImage(${index}, -1)" 
                            ${index === 0 ? 'disabled' : ''} title="上移">
                        <i class="fas fa-arrow-up"></i>
                    </button>
                    <button class="btn-control btn-down" onclick="imageMerger.moveImage(${index}, 1)" 
                            ${index === this.imageData.length - 1 ? 'disabled' : ''} title="下移">
                        <i class="fas fa-arrow-down"></i>
                    </button>
                    <button class="btn-control btn-remove" onclick="imageMerger.removeImage(${index})" title="删除">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * HTML转义
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * 显示空状态
     */
    showEmptyState() {
        const imageList = document.getElementById('imageList');
        if (!imageList) return;

        imageList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-images empty-icon"></i>
                <h5>暂无图片</h5>
                <p class="mb-3">请使用上方的上传区域添加图片</p>
                <button class="btn btn-primary" id="emptyStateSelectBtn">
                    <i class="fas fa-plus me-2"></i>
                    选择图片
                </button>
            </div>
        `;

        // 为空状态按钮绑定事件
        const emptyBtn = document.getElementById('emptyStateSelectBtn');
        if (emptyBtn) {
            emptyBtn.addEventListener('click', () => {
                const imageInput = document.getElementById('imageInput');
                if (imageInput) imageInput.click();
            });
        }
    }
    
    /**
     * 更新图片数量显示
     */
    updateImageCount() {
        const countElement = document.getElementById('imageCount');
        if (countElement) {
            countElement.textContent = this.imageData.length;
        }
    }
    
    /**
     * 移动图片位置
     */
    moveImage(index, direction) {
        const newIndex = index + direction;
        
        if (newIndex < 0 || newIndex >= this.imageData.length) {
            return;
        }
        
        // 交换位置
        [this.imageData[index], this.imageData[newIndex]] = [this.imageData[newIndex], this.imageData[index]];
        
        // 更新显示
        this.displayImageList();
        
        // 如果有预览，重新生成
        if (this.mergedCanvas) {
            this.generatePreview();
        }
        
        console.log(`[图片拼接] 移动图片: ${index} -> ${newIndex}`);
    }
    
    /**
     * 移除图片
     */
    removeImage(index) {
        if (!confirm('确定要移除这张图片吗？')) {
            return;
        }
        
        const removedImage = this.imageData.splice(index, 1)[0];
        console.log(`[图片拼接] 移除图片: ${removedImage.name}`);
        
        this.updateUI();
        
        // 如果没有图片了，隐藏预览
        if (this.imageData.length === 0) {
            this.hidePreview();
        } else if (this.mergedCanvas) {
            // 重新生成预览
            this.generatePreview();
        }
    }
    
    /**
     * 生成拼接预览
     */
    async generatePreview() {
        if (this.imageData.length === 0) {
            this.showMessage('没有可拼接的图片', 'warning');
            return;
        }
        
        if (this.imageData.length < 2) {
            this.showMessage('至少需要2张图片才能进行拼接', 'warning');
            return;
        }
        
        this.showLoading('正在生成预览...');
        
        try {
            this.updateSettings();
            
            // 加载所有图片
            const images = await this.loadAllImages();
            
            // 创建拼接画布
            this.mergedCanvas = await this.createMergedCanvas(images);
            
            // 显示预览
            this.showPreview();
            
            console.log(`[图片拼接] 预览生成成功: ${this.mergedCanvas.width}x${this.mergedCanvas.height}`);
            
        } catch (error) {
            console.error('[图片拼接] 生成预览失败:', error);
            this.showMessage('生成预览失败，请检查图片数据', 'error');
        } finally {
            this.hideLoading();
        }
    }
    
    /**
     * 加载所有图片
     */
    loadAllImages() {
        return Promise.all(this.imageData.map((imgData, index) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    console.log(`[图片拼接] 图片 ${index + 1} 加载成功: ${img.width}x${img.height}`);
                    resolve(img);
                };
                img.onerror = () => {
                    console.error(`[图片拼接] 图片 ${index + 1} 加载失败`);
                    reject(new Error(`图片 ${index + 1} 加载失败`));
                };
                img.src = imgData.data;
            });
        }));
    }
    
    /**
     * 创建拼接画布
     */
    async createMergedCanvas(images) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 设置高质量渲染
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        if (this.settings.direction === 'vertical') {
            return this.createVerticalMerge(canvas, ctx, images);
        } else {
            return this.createHorizontalMerge(canvas, ctx, images);
        }
    }
    
    /**
     * 纵向拼接
     */
    createVerticalMerge(canvas, ctx, images) {
        // 计算最大宽度和总高度
        const maxWidth = Math.max(...images.map(img => img.width));
        const totalHeight = images.reduce((sum, img) => sum + img.height, 0) + 
                           (this.settings.spacing * (images.length - 1));
        
        // 设置画布尺寸
        canvas.width = maxWidth;
        canvas.height = totalHeight;
        
        // 填充白色背景
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制图片
        let currentY = 0;
        images.forEach((img, index) => {
            let x = this.calculateAlignmentX(img.width, maxWidth);
            
            ctx.drawImage(img, x, currentY);
            currentY += img.height + this.settings.spacing;
            
            console.log(`[图片拼接] 绘制图片 ${index + 1}: (${x}, ${currentY - img.height - this.settings.spacing})`);
        });
        
        return canvas;
    }
    
    /**
     * 横向拼接
     */
    createHorizontalMerge(canvas, ctx, images) {
        // 计算总宽度和最大高度
        const totalWidth = images.reduce((sum, img) => sum + img.width, 0) + 
                          (this.settings.spacing * (images.length - 1));
        const maxHeight = Math.max(...images.map(img => img.height));
        
        // 设置画布尺寸
        canvas.width = totalWidth;
        canvas.height = maxHeight;
        
        // 填充白色背景
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制图片
        let currentX = 0;
        images.forEach((img, index) => {
            let y = this.calculateAlignmentY(img.height, maxHeight);
            
            ctx.drawImage(img, currentX, y);
            currentX += img.width + this.settings.spacing;
            
            console.log(`[图片拼接] 绘制图片 ${index + 1}: (${currentX - img.width - this.settings.spacing}, ${y})`);
        });
        
        return canvas;
    }
    
    /**
     * 计算水平对齐位置
     */
    calculateAlignmentX(imageWidth, containerWidth) {
        switch (this.settings.alignment) {
            case 'center':
                return (containerWidth - imageWidth) / 2;
            case 'right':
                return containerWidth - imageWidth;
            case 'left':
            default:
                return 0;
        }
    }
    
    /**
     * 计算垂直对齐位置
     */
    calculateAlignmentY(imageHeight, containerHeight) {
        switch (this.settings.alignment) {
            case 'center':
                return (containerHeight - imageHeight) / 2;
            case 'right': // 在横向拼接中表示底部对齐
                return containerHeight - imageHeight;
            case 'left': // 在横向拼接中表示顶部对齐
            default:
                return 0;
        }
    }
    
    /**
     * 显示预览
     */
    showPreview() {
        const previewCanvas = document.getElementById('previewCanvas');
        const emptyPreview = document.getElementById('emptyPreview');
        const downloadBtn = document.getElementById('downloadBtn');
        
        if (!previewCanvas || !this.mergedCanvas) return;
        
        // 将拼接结果复制到预览画布
        previewCanvas.width = this.mergedCanvas.width;
        previewCanvas.height = this.mergedCanvas.height;
        
        const previewCtx = previewCanvas.getContext('2d');
        previewCtx.drawImage(this.mergedCanvas, 0, 0);
        
        // 显示预览和下载按钮
        previewCanvas.style.display = 'block';
        if (emptyPreview) emptyPreview.style.display = 'none';
        if (downloadBtn) downloadBtn.style.display = 'inline-flex';
    }
    
    /**
     * 隐藏预览
     */
    hidePreview() {
        const previewCanvas = document.getElementById('previewCanvas');
        const emptyPreview = document.getElementById('emptyPreview');
        const downloadBtn = document.getElementById('downloadBtn');
        
        if (previewCanvas) previewCanvas.style.display = 'none';
        if (emptyPreview) emptyPreview.style.display = 'block';
        if (downloadBtn) downloadBtn.style.display = 'none';
        
        this.mergedCanvas = null;
    }
    
    /**
     * 下载拼接后的图片
     */
    downloadMergedImage() {
        if (!this.mergedCanvas) {
            this.showMessage('请先生成预览', 'warning');
            return;
        }
        
        try {
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            const filename = `竞争对手截图拼接_${timestamp}.${this.settings.format}`;
            
            // 创建下载链接
            const link = document.createElement('a');
            link.download = filename;
            
            if (this.settings.format === 'png') {
                link.href = this.mergedCanvas.toDataURL('image/png', 1.0);
            } else {
                link.href = this.mergedCanvas.toDataURL('image/jpeg', this.settings.quality);
            }
            
            // 触发下载
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showMessage('图片下载成功！', 'success');
            console.log(`[图片拼接] 下载成功: ${filename}`);
            
        } catch (error) {
            console.error('[图片拼接] 下载失败:', error);
            this.showMessage('下载失败，请重试', 'error');
        }
    }
    
    /**
     * 显示加载状态
     */
    showLoading(message = '正在处理...') {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            const messageEl = overlay.querySelector('h5');
            if (messageEl) messageEl.textContent = message;
            overlay.style.display = 'flex';
        }
    }
    
    /**
     * 隐藏加载状态
     */
    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }
    
    /**
     * 显示消息提示
     */
    showMessage(message, type = 'info') {
        const alertClass = {
            'success': 'alert-success',
            'error': 'alert-danger',
            'warning': 'alert-warning',
            'info': 'alert-info'
        }[type] || 'alert-info';
        
        const icon = {
            'success': 'fa-check-circle',
            'error': 'fa-exclamation-triangle',
            'warning': 'fa-exclamation-circle',
            'info': 'fa-info-circle'
        }[type] || 'fa-info-circle';
        
        // 创建临时提示
        const toast = document.createElement('div');
        toast.className = `alert ${alertClass} position-fixed`;
        toast.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 10000;
            min-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border: none;
            border-radius: 8px;
        `;
        toast.innerHTML = `
            <i class="fas ${icon} me-2"></i>
            ${message}
        `;
        
        document.body.appendChild(toast);
        
        // 3秒后自动移除
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }
    
    /**
     * 返回商圈调研页面
     */
    goBackToMarketResearch() {
        if (window.opener) {
            window.close();
        } else {
            window.location.href = 'market-research.html';
        }
    }
}

// 全局实例
let imageMerger;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    imageMerger = new ImageMerger();

    // 绑定全局函数
    window.generatePreview = () => imageMerger.generatePreview();
    window.downloadMergedImage = () => imageMerger.downloadMergedImage();
    window.goBackToMarketResearch = () => imageMerger.goBackToMarketResearch();
});
