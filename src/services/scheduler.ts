import { scheduleJob } from 'node-schedule';
import { MonitorConfig } from '../models/MonitorConfig';
import { AliyunCrawler } from '../crawlers/aliyun';

type JobMap = Map<number, { job: any; lastRun: Date }>;

export class SchedulerService {
  private static instance: SchedulerService;
  private jobs: JobMap = new Map();

  private constructor() {}

  static getInstance(): SchedulerService {
    if (!SchedulerService.instance) {
      SchedulerService.instance = new SchedulerService();
    }
    return SchedulerService.instance;
  }

  async initMonitoringJobs() {
    const activeConfigs = await MonitorConfig.find({
      where: { isActive: true }
    });

    activeConfigs.forEach(config => {
      const cronPattern = `0 */${config.interval} * * *`;
      const job = scheduleJob(cronPattern, async () => {
        try {
          const crawler = new AliyunCrawler();
          await crawler.fetchVulnerabilities(config.keywords);
          this.updateJobStatus(config.id, new Date());
        } catch (error) {
          console.error(`[Scheduler] Job ${config.id} failed:`, error);
        }
      });

      this.jobs.set(config.id, {
        job,
        lastRun: new Date()
      });
    });
  }

  private updateJobStatus(jobId: number, lastRun: Date) {
    const job = this.jobs.get(jobId);
    if (job) {
      this.jobs.set(jobId, { ...job, lastRun });
    }
  }
}
