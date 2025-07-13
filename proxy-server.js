/**
 * 简单的代理服务器 - 解决CORS问题
 * 使用Node.js和Express创建本地代理
 */

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = 8080;

// 启用CORS
app.use(cors());
app.use(express.json());

// 静态文件服务
app.use(express.static(__dirname));

// API配置映射
const API_CONFIGS = {
    // Gemini 2.5 Flash Lite (haxiaiplus.cn) - 统一API
    'gemini-2.5-flash-lite-preview-06-17': {
        url: 'https://haxiaiplus.cn/v1/chat/completions',
        defaultKey: 'sk-BIChztSl1gwRjl06f5DZ3J15UMnLGgEBpiJa00VHTsQeI00N'
    },
    // Gemini Pro (annyun.cn) - 店铺活动方案模块支持
    'gemini-pro': {
        url: 'https://api.annyun.cn/v1/chat/completions',
        defaultKey: 'sk-BIChztSl1gwRjl06f5DZ3J15UMnLGgEBpiJa00VHTsQeI00N'
    }
};

// API代理路由
app.post('/api/chat/completions', async (req, res) => {
    try {
        console.log('🔄 代理API请求开始');
        console.log('📝 请求模型:', req.body?.model);
        console.log('🔑 Authorization头:', req.headers.authorization ? '已提供' : '未提供');
        console.log('📊 请求体大小:', JSON.stringify(req.body).length, '字符');

        // 根据模型确定API配置
        const model = req.body?.model;
        const apiConfig = API_CONFIGS[model];

        if (!apiConfig) {
            console.log('❌ 未知模型:', model);
            return res.status(400).json({
                error: {
                    message: `不支持的模型: ${model}`,
                    type: 'invalid_request_error'
                }
            });
        }

        // 构建请求头
        const headers = {
            'Content-Type': 'application/json'
        };

        // 添加Authorization头
        if (req.headers.authorization) {
            headers['Authorization'] = req.headers.authorization;
        } else {
            // 使用对应API的默认密钥
            headers['Authorization'] = `Bearer ${apiConfig.defaultKey}`;
        }

        console.log('🌐 发送请求到:', apiConfig.url);

        const response = await fetch(apiConfig.url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(req.body)
        });

        console.log('📡 API响应状态:', response.status, response.statusText);

        // 尝试解析响应
        let data;
        const responseText = await response.text();

        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('❌ JSON解析失败:', parseError.message);
            console.error('📄 原始响应:', responseText.substring(0, 500));
            return res.status(500).json({
                error: 'API响应解析失败',
                message: parseError.message,
                rawResponse: responseText.substring(0, 500)
            });
        }

        if (!response.ok) {
            console.error('❌ API错误:', response.status, response.statusText);
            console.error('📄 错误详情:', data);
            return res.status(response.status).json(data);
        }

        console.log('✅ API请求成功，响应长度:', JSON.stringify(data).length, '字符');
        res.json(data);

    } catch (error) {
        console.error('❌ 代理错误:', error.message);
        console.error('📋 错误堆栈:', error.stack);
        res.status(500).json({
            error: '代理服务器错误',
            message: error.message,
            stack: error.stack
        });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`🚀 代理服务器启动成功！`);
    console.log(`📱 访问地址: http://localhost:${PORT}`);
    console.log(`🧪 测试页面: http://localhost:${PORT}/test-gemini-api.html`);
    console.log(`🏠 主应用: http://localhost:${PORT}/index.html`);
});
