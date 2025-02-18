import { createClient } from 'redis';
import axios from 'axios';

class TranslationService {
  private static cache = createClient({
    url: 'redis://localhost:6379'
  });

  static async init() {
    await this.cache.connect();
  }

  static async translate(text: string, targetLang: 'en' | 'ja' | 'ko'): Promise<string> {
    const cacheKey = `trans:${targetLang}:${text}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    // 使用LibreTranslate开源方案
    const params = new URLSearchParams({ q: text, source: 'zh', target: targetLang });
    const response = await axios.post(`https://libretranslate.com/translate?${params.toString()}`);

    await this.cache.set(cacheKey, response.data.translatedText, {
      EX: 86400 // 缓存24小时
    });

    return response.data.translatedText;
  }
}

export default TranslationService;
