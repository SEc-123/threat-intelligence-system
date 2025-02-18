import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import TranslationService from '../services/translation';
import type { Vulnerability } from '../models/Vulnerability';

export class AliyunCrawler {
  private static BASE_URL = 'https://avd.aliyun.com';

  async fetchVulnerabilities(keywords: string[]): Promise<Vulnerability[]> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
    });

    try {
      const page = await browser.newPage();
      await page.setRequestInterception(true);

      // 中文内容拦截翻译层
      page.on('response', async (response) => {
        if (response.request().resourceType() === 'document') {
          const chineseContent = await response.text();
          const englishContent = await TranslationService.translateChinese(chineseContent);
          return this.processData(englishContent, keywords);
        }
      });

      await page.goto(`${AliyunCrawler.BASE_URL}/high-risk/list`);
      await page.waitForSelector('.avd-table');

      return await page.evaluate(() => {
        // 表格数据提取逻辑
        const rows = Array.from(document.querySelectorAll('.avd-table tr'));
        return rows.map(row => ({
          cveId: row.querySelector('td:nth-child(2)')?.textContent?.trim(),
          cvssScore: parseFloat(row.querySelector('td:nth-child(3)')?.textContent || '0'),
          description: row.querySelector('td:nth-child(4)')?.textContent?.trim()
        }));
      });

    } catch (error) {
      console.error(`[AliyunCrawler] Fetch failed: ${error.message}`);
      return [];
    } finally {
      await browser.close();
    }
  }

  private processData(html: string, keywords: string[]) {
    const $ = cheerio.load(html);
    // 数据清洗和关键词过滤逻辑
    return $('.avd-table tr').map((i, row) => ({
      cveId: $(row).find('td:nth-child(2)').text().trim(),
      cvssScore: parseFloat($(row).find('td:nth-child(3)').text()),
      description: $(row).find('td:nth-child(4)').text().trim()
    })).get();
  }
}
