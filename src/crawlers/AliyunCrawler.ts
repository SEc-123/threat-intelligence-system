import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { TranslationService } from '../services/translation.service';

type CrawlerConfig = {
  keywords: string[];
  interval: number;
  proxy?: string;
};

@Injectable()
export class AliyunCrawler {
  constructor(private readonly translationService: TranslationService) {}

  async fetchVulnerabilities(config: CrawlerConfig) {
    const browser = await puppeteer.launch({
      headless: true,
      args: config.proxy ? [`--proxy-server=${config.proxy}`] : []
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });

      // Setup translation interception
      page.on('response', async (response) => {
        if (response.request().resourceType() === 'document') {
          const chineseContent = await response.text();
          const englishContent = await this.translationService.translate(
            chineseContent,
            'zh',
            'en'
          );
          this.processTranslatedContent(englishContent, config.keywords);
        }
      });

      await page.goto('https://avd.aliyun.com/high-risk/list');
      await page.waitForSelector('.vulnerability-list', { timeout: 30000 });

      // Additional crawling logic...
    } finally {
      await browser.close();
    }
  }

  private processTranslatedContent(content: string, keywords: string[]) {
    const $ = cheerio.load(content);
    const vulnerabilities: Array<Record<string, any>> = [];

    $('.vulnerability-item').each((i, el) => {
      const cveId = $(el).find('.cve-id').text().trim();
      const description = $(el).find('.description').text().trim();
      
      if (this.matchesKeywords(description, keywords)) {
        vulnerabilities.push({
          cveId,
          description,
          rawData: $(el).html()
        });
      }
    });

    return vulnerabilities;
  }

  private matchesKeywords(text: string, keywords: string[]) {
    return keywords.some(keyword =>
      new RegExp(`\\b${keyword}\\b`, 'i').test(text)
    );
  }
}
