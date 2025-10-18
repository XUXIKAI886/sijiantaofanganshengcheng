/**
 * Vercel Serverless Function - API代理
 * 部署到 Vercel 后，会自动处理 /api/chat/completions 请求
 */

export default async function handler(req, res) {
    // 只允许POST请求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 启用CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // 处理OPTIONS预检请求
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        console.log('🔄 Vercel API代理请求开始');
        console.log('📝 请求模型:', req.body?.model);

        // API配置映射
        const API_CONFIGS = {
            'gemini-2.5-flash-lite': {
                url: 'https://jeniya.top/v1/chat/completions',
                defaultKey: 'sk-AHP64E0ntf5VEltYLSV17wTLYeV4WZ3ucJzf72u0UHXf0Hos'
            },
            'gemini-pro': {
                url: 'https://api.annyun.cn/v1/chat/completions',
                defaultKey: 'sk-AHP64E0ntf5VEltYLSV17wTLYeV4WZ3ucJzf72u0UHXf0Hos'
            }
        };

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
            headers['Authorization'] = `Bearer ${apiConfig.defaultKey}`;
        }

        console.log('🌐 转发请求到:', apiConfig.url);

        // 转发请求到实际API
        const response = await fetch(apiConfig.url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(req.body)
        });

        console.log('📡 API响应状态:', response.status);

        // 获取响应数据
        const data = await response.json();

        if (!response.ok) {
            console.error('❌ API错误:', response.status);
            return res.status(response.status).json(data);
        }

        console.log('✅ API请求成功');
        return res.status(200).json(data);

    } catch (error) {
        console.error('❌ 代理错误:', error.message);
        return res.status(500).json({
            error: '代理服务器错误',
            message: error.message
        });
    }
}
