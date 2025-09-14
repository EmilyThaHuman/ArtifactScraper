import { log } from "@artifactscraper/libs";
import { CrawlingContext } from "../../engines/Base.js";
import { Utils } from "../../Utils.js";
import { s3 } from "@artifactscraper/libs";

export class ScreenshotTransformer {
    private s3: typeof s3;

    constructor() {
        this.s3 = s3;
    }

    /**
     * Capture screenshot using CDP
     * Tips: it need more time, and we need to test it more. It will maybe released in the future.
     * @param context - Crawling context
     * @param fullPage - Whether to capture the full page
     * @returns Buffer of the screenshot
     */
    async CDPCaptureScreenshot(context: CrawlingContext, fullPage: boolean): Promise<any> {
        const screenshotOptions = fullPage ? { fullPage: true, quality: 100, type: 'jpeg' } : { quality: 100, type: 'jpeg' };
        const cdpOptions: {
            format: 'jpeg' | 'png' | 'webp';
            quality?: number;
            captureBeyondViewport?: boolean;
        } = {
            format: screenshotOptions.type as 'jpeg' | 'png' | 'webp' || 'jpeg',
        };
        if (screenshotOptions.quality) {
            cdpOptions.quality = screenshotOptions.quality;
        }
        if (screenshotOptions.fullPage) {
            cdpOptions.captureBeyondViewport = true;
        }

        let screenshot: Buffer;
        const page = (context as any).page;
        try {
            let session;
            // page.context() exists on Playwright's Page, but not Puppeteer's
            if (page.context && typeof page.context === 'function') {
                // Playwright
                session = await page.context().newCDPSession(page);
            } else if (page.target && typeof page.target === 'function') {
                // Puppeteer
                session = await page.target().createCDPSession();
            }

            if (session) {
                try {
                    if (cdpOptions.captureBeyondViewport) {
                        const { contentSize } = await session.send('Page.getLayoutMetrics');
                        const pageSize = await page.evaluate(() => {
                            const body = document.body;
                            const html = document.documentElement;
                            return {
                                width: Math.max(
                                    body.scrollWidth,
                                    html.scrollWidth,
                                    body.offsetWidth,
                                    html.offsetWidth,
                                    body.clientWidth,
                                    html.clientWidth
                                ),
                                height: Math.max(
                                    body.scrollHeight,
                                    html.scrollHeight,
                                    body.offsetHeight,
                                    html.offsetHeight,
                                    body.clientHeight,
                                    html.clientHeight
                                ),
                            }
                        });

                        await session.send('Emulation.setDeviceMetricsOverride', {
                            width: pageSize.width,
                            height: Math.max(contentSize.height, pageSize.height),
                            deviceScaleFactor: 1,
                            mobile: false,
                        });
                    }

                    const { data } = await session.send('Page.captureScreenshot', cdpOptions);
                    screenshot = Buffer.from(data, 'base64');

                    if (cdpOptions.captureBeyondViewport) {
                        await session.send('Emulation.clearDeviceMetricsOverride');
                    }
                } finally {
                    await session.detach();
                }
            } else {
                log.warning(`Could not determine browser engine for CDP. Falling back to default screenshot method.`);
                screenshot = await page.screenshot(screenshotOptions);
            }
        } catch (e) {
            log.warning(`CDP screenshot capture failed: ${e instanceof Error ? e.message : String(e)}. Falling back to default screenshot method.`);
            screenshot = await page.screenshot(screenshotOptions);
        }
        return screenshot;
    }

    public async captureAndStoreScreenshot(context: CrawlingContext, page: any, formats: string[]): Promise<string | void> {
        try {
            const jobId = context.request.userData["jobId"];
            let fileName: string | undefined;
            let screenshotOptions: any;

            if (formats.includes("screenshot@fullPage")) {
                fileName = `screenshot-fullPage-${jobId}.jpeg`;
                screenshotOptions = { fullPage: true, quality: 100, type: 'jpeg' };
            } else if (formats.includes("screenshot")) {
                fileName = `screenshot-${jobId}.jpeg`;
                screenshotOptions = { quality: 100, type: 'jpeg' };
            } else {
                return;
            }

            const screenshot = await page.screenshot(screenshotOptions);
            if (process.env.ANYCRAWL_STORAGE === 's3') {
                await this.s3.uploadImage(fileName!, screenshot);
            } else {
                const keyValueStore = await Utils.getInstance().getKeyValueStore();
                await keyValueStore.setValue(fileName!, screenshot, { contentType: `image/${screenshotOptions.type}` });
            }
            return fileName;
        } catch (error) {
            log.warning(`Screenshot capture failed: ${error instanceof Error ? error.message : String(error)}`);
            return;
        }
    }
}
