/**
 * Vercel 无服务器函数(Serverless Function) - PDF生成
 * 使用无头浏览器(Headless Browser) Puppeteer 在服务端渲染HTML并输出PDF
 *
 * 说明：Vercel 环境需使用 @sparticuz/chromium + puppeteer-core
 */

import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

chromium.setGraphicsMode = false;

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

        const executablePath = await chromium.executablePath();

        if (!executablePath) {
            return res.status(500).json({
                success: false,
                message: '未找到Chromium可执行文件，请检查服务端环境配置'
            });
        }

        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath,
            headless: chromium.headless
        });

        const page = await browser.newPage();
        await page.emulateMediaType('screen');
        await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });

        await page.setContent(html, {
            waitUntil: ['load', 'domcontentloaded', 'networkidle0'],
            timeout: 30000
        });

        // 等待字体与样式完成加载
        await page.waitForFunction(() => document.fonts && document.fonts.status === 'loaded', { timeout: 10000 }).catch(() => {});

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
