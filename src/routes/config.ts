import { Router } from 'express';
import { z } from 'zod';
import { MonitorConfig } from '../models/MonitorConfig';

const router = Router();

const ConfigSchema = z.object({
  keywords: z.array(z.string().max(50)),
  interval: z.number().min(1).max(24),
  sources: z.array(z.enum(['aliyun', 'nvd', 'redqueen'])),
  notificationEnabled: z.boolean().optional()
});

// 创建监控配置
router.post('/configs', async (req, res) => {
  try {
    const validated = ConfigSchema.parse(req.body);
    const config = MonitorConfig.create({
      ...validated,
      owner: req.user.id
    });

    await config.save();
    res.status(201).json(config);

    // 触发新任务调度
    SchedulerService.getInstance().initMonitoringJobs();

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 获取当前用户配置
router.get('/configs', async (req, res) => {
  const configs = await MonitorConfig.find({
    where: { owner: req.user.id }
  });
  res.json(configs);
});

export default router;
