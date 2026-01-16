/**
 * Vercel Serverless Function - PDF生成
 * 使用Puppeteer在服务端渲染HTML并输出PDF
 */

import puppeteer from 'puppeteer';

export default async function handler(req, res) {
    // 只允许POST请求
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 处理CORS（与vercel.json保持一致）
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    let browser = null;

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
        const { html, filename, options } = body;

        if (!html) {
            return res.status(400).json({ success: false, message: 'HTML内容不能为空' });
        }

        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });

        await page.setContent(html, {
            waitUntil: ['load', 'domcontentloaded', 'networkidle0'],
            timeout: 30000
        });

        // 等待字体加载
        await page.evaluate(() => document.fonts?.ready || new Promise(r => setTimeout(r, 1000)));
        await new Promise(r => setTimeout(r, 300));

        // 获取页面实际高度，确保完整渲染
        const contentHeight = await page.evaluate(() => {
            const bodyEl = document.body;
            const htmlEl = document.documentElement;
            return Math.max(
                bodyEl.scrollHeight, bodyEl.offsetHeight, bodyEl.clientHeight,
                htmlEl.scrollHeight, htmlEl.offsetHeight, htmlEl.clientHeight
            );
        });

        const totalHeight = contentHeight + 200;

        const pdfBuffer = await page.pdf({
            width: '210mm',
            height: `${totalHeight}px`,
            margin: { top: '8mm', right: '8mm', bottom: '8mm', left: '8mm' },
            printBackground: true,
            ...options
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Length', pdfBuffer.length);
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename || 'report')}.pdf"`);
        return res.status(200).send(Buffer.from(pdfBuffer));

    } catch (error) {
        console.error('[Vercel PDF] 生成失败:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'PDF生成失败'
        });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}
