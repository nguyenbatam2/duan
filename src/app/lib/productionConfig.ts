// Production Configuration

export const PRODUCTION_CONFIG = {
  // API Configuration
  API: {
    BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.yourdomain.com/api/v1',
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
  },

  // Payment Configuration
  PAYMENT: {
    VNPAY_URL: process.env.NEXT_PUBLIC_VNPAY_URL || 'https://pay.vnpay.vn/vpcpay.html',
    RETURN_URL: process.env.NEXT_PUBLIC_PAYMENT_RETURN_URL || 'https://yourdomain.com/payment/return',
    TIMEOUT: 60000,
  },

  // Security Configuration
  SECURITY: {
    HTTPS_REQUIRED: true,
    CSP_ENABLED: true,
    HSTS_ENABLED: true,
    COOKIE_SECURE: true,
    COOKIE_SAMESITE: 'strict',
  },

  // Performance Configuration
  PERFORMANCE: {
    IMAGE_OPTIMIZATION: true,
    COMPRESSION_ENABLED: true,
    CACHE_ENABLED: true,
    CDN_ENABLED: true,
  },

  // Monitoring Configuration
  MONITORING: {
    ANALYTICS_ENABLED: true,
    ERROR_TRACKING_ENABLED: true,
    PERFORMANCE_MONITORING: true,
    LOG_LEVEL: 'info',
  },
};

// Environment-specific configurations
export const getEnvironmentConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  
  switch (env) {
    case 'production':
      return {
        ...PRODUCTION_CONFIG,
        API: {
          ...PRODUCTION_CONFIG.API,
          BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.yourdomain.com/api/v1',
        },
        PAYMENT: {
          ...PRODUCTION_CONFIG.PAYMENT,
          VNPAY_URL: 'https://pay.vnpay.vn/vpcpay.html',
          RETURN_URL: process.env.NEXT_PUBLIC_PAYMENT_RETURN_URL || 'https://yourdomain.com/payment/return',
        },
      };
    
    case 'staging':
      return {
        ...PRODUCTION_CONFIG,
        API: {
          ...PRODUCTION_CONFIG.API,
          BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://staging-api.yourdomain.com/api/v1',
        },
        PAYMENT: {
          ...PRODUCTION_CONFIG.PAYMENT,
          VNPAY_URL: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
          RETURN_URL: process.env.NEXT_PUBLIC_PAYMENT_RETURN_URL || 'https://staging.yourdomain.com/payment/return',
        },
      };
    
    default: // development
      return {
        ...PRODUCTION_CONFIG,
        API: {
          ...PRODUCTION_CONFIG.API,
          BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api/v1',
        },
        PAYMENT: {
          ...PRODUCTION_CONFIG.PAYMENT,
          VNPAY_URL: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
          RETURN_URL: process.env.NEXT_PUBLIC_PAYMENT_RETURN_URL || 'http://localhost:3000/payment/return',
        },
        SECURITY: {
          ...PRODUCTION_CONFIG.SECURITY,
          HTTPS_REQUIRED: false,
          COOKIE_SECURE: false,
        },
      };
  }
};

// Deployment checklist
export const DEPLOYMENT_CHECKLIST = {
  preDeployment: [
    '✅ Environment variables configured',
    '✅ API endpoints tested',
    '✅ Payment flow tested',
    '✅ SSL certificates installed',
    '✅ Database migrations completed',
    '✅ Static assets optimized',
    '✅ Error handling implemented',
    '✅ Monitoring configured',
  ],
  
  postDeployment: [
    '✅ Health check endpoints responding',
    '✅ Payment gateway connectivity verified',
    '✅ SSL certificate validation',
    '✅ Performance monitoring active',
    '✅ Error tracking configured',
    '✅ Backup systems verified',
    '✅ Security headers configured',
    '✅ CDN configuration verified',
  ],
};

// Health check endpoints
export const HEALTH_CHECK_ENDPOINTS = [
  '/api/health',
  '/api/v1/health',
  '/payment/return',
  '/checkout',
];

// Security headers configuration
export const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;",
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};
