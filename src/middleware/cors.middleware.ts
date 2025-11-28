import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  private readonly allowedOrigins = ['http://localhost:5173'];

  private readonly allowedMethods = [
    'GET',
    'HEAD',
    'PUT',
    'PATCH',
    'POST',
    'DELETE',
    'OPTIONS',
  ];

  private readonly allowedHeaders = [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma',
    'Custom-Data',
  ];

  use(req: Request, res: Response, next: NextFunction): void {
    // const origin = req.headers.origin;
    const method = req.method;

    // Handle preflight requests
    if (method === 'OPTIONS') {
      this.handlePreflight(req, res);
      return;
    }

    // Set CORS headers for actual requests
    this.setCorsHeaders(req, res);
    next();
  }

  private handlePreflight(req: Request, res: Response): void {
    const origin = req.headers.origin;
    const requestMethod = req.headers['access-control-request-method'];
    // const requestHeaders = req.headers['access-control-request-headers'];

    // Check if origin is allowed
    if (origin && !this.isOriginAllowed(origin)) {
      res.status(403).json({ error: 'Origin not allowed' });
      return;
    }

    // Check if method is allowed
    if (requestMethod && !this.allowedMethods.includes(requestMethod)) {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    // Set preflight response headers
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader(
      'Access-Control-Allow-Methods',
      this.allowedMethods.join(', '),
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      this.allowedHeaders.join(', '),
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
    res.status(204).end();
  }

  private setCorsHeaders(req: Request, res: Response): void {
    const origin = req.headers.origin;

    if (origin && this.isOriginAllowed(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  private isOriginAllowed(origin: string): boolean {
    return this.allowedOrigins.includes(origin);
  }
}
