import { Injectable } from '@nestjs/common';
import { Vulnerability } from '../models/Vulnerability';

@Injectable()
export class DataNormalizer {
  normalize(rawData: any, source: string): Partial<Vulnerability> {
    return {
      sourceSystem: source,
      rawIdentifier: { id: rawData.id, url: rawData.link },
      contentHash: this.generateHash(rawData),
      ...
    };
  }

  private generateHash(data: any): string {
    // 哈希生成逻辑
  }
}
