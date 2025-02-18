import { RequestHandler } from 'express';
import xss from 'xss';

export const securityMiddleware: RequestHandler = (req, res, next) => {
  // XSS过滤
  if (req.body) {
    Object.entries(req.body).forEach(([key, value]) => {
      if (typeof value === 'string') req.body[key] = xss(value);
    });
  }
  
  // SQL注入检测
  const sqlKeywords = ['SELECT', 'INSERT', 'DELETE', 'DROP'];
  const hasSql = Object.values(req.query).some(val =>
    sqlKeywords.some(kw => String(val).toUpperCase().includes(kw))
  );
  
  if (hasSql) return res.status(400).json({ error: 'Invalid query' });
  
  next();
};
