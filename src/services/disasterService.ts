// Service to analyze disaster risks and provide warnings
export class DisasterService {
  // Simulate disaster monitoring APIs
  private static readonly DISASTER_TYPES = [
    'flood', 'storm', 'thunderstorm', 'heavy_rain', 'heat_wave', 'landslide', 'drought'
  ];

  private static readonly VIETNAM_REGIONS = {
    north: { lat: [20, 24], lon: [102, 108] },
    central: { lat: [14, 20], lon: [105, 110] },
    south: { lat: [8, 14], lon: [104, 110] }
  };

  // Get region based on coordinates
  private static getRegion(lat: number, lon: number): string {
    if (lat >= 20 && lat <= 24 && lon >= 102 && lon <= 108) return 'north';
    if (lat >= 14 && lat <= 20 && lon >= 105 && lon <= 110) return 'central';
    if (lat >= 8 && lat <= 14 && lon >= 104 && lon <= 110) return 'south';
    return 'unknown';
  }

  // Get seasonal risk factors
  private static getSeasonalRisks(): any {
    const now = new Date();
    const month = now.getMonth() + 1; // 1-12
    
    // Vietnam seasonal patterns
    if (month >= 5 && month <= 10) {
      // Rainy season
      return {
        flood: 70,
        storm: 60,
        thunderstorm: 80,
        heavy_rain: 85,
        landslide: 65,
        heat_wave: 30,
        drought: 10
      };
    } else {
      // Dry season
      return {
        flood: 20,
        storm: 25,
        thunderstorm: 30,
        heavy_rain: 25,
        landslide: 30,
        heat_wave: 70,
        drought: 60
      };
    }
  }

  // Generate realistic alerts based on location and season
  static async getActiveAlerts(lat: number, lon: number): Promise<any[]> {
    const region = this.getRegion(lat, lon);
    const seasonalRisks = this.getSeasonalRisks();
    const alerts = [];

    // Simulate real-time monitoring
    const now = new Date();
    const hour = now.getHours();
    
    // Higher chance of alerts during certain conditions
    const alertProbability = Math.random();
    
    if (alertProbability > 0.7) { // 30% chance of having alerts
      const alertTypes = Object.entries(seasonalRisks)
        .filter(([_, risk]) => risk > 50)
        .map(([type, _]) => type);
      
      if (alertTypes.length > 0) {
        const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        
        const alertTemplates = {
          flood: {
            title: 'Cảnh báo ngập lụt',
            description: 'Mực nước sông đang dâng cao, có nguy cơ ngập lụt tại các khu vực thấp trũng.',
            severity: seasonalRisks.flood > 70 ? 'Nguy hiểm' : 'Trung bình',
            recommendations: [
              'Di chuyển đến nơi cao hơn',
              'Chuẩn bị đồ dùng thiết yếu',
              'Theo dõi tin tức cập nhật',
              'Tránh di chuyển qua vùng ngập'
            ]
          },
          storm: {
            title: 'Cảnh báo bão',
            description: 'Có bão đang hình thành và di chuyển về phía đất liền.',
            severity: 'Nguy hiểm',
            recommendations: [
              'Gia cố nhà cửa',
              'Dự trữ thực phẩm và nước',
              'Tránh ra ngoài khi bão đổ bộ',
              'Chuẩn bị đèn pin và pin dự phòng'
            ]
          },
          heavy_rain: {
            title: 'Cảnh báo mưa lớn',
            description: 'Dự báo có mưa to đến rất to trong 6-12 giờ tới.',
            severity: 'Trung bình',
            recommendations: [
              'Hạn chế di chuyển không cần thiết',
              'Kiểm tra hệ thống thoát nước',
              'Chuẩn bị ô, áo mưa',
              'Theo dõi cảnh báo thời tiết'
            ]
          },
          heat_wave: {
            title: 'Cảnh báo nắng nóng',
            description: 'Nhiệt độ có thể lên tới 38-40°C, kéo dài nhiều ngày.',
            severity: 'Trung bình',
            recommendations: [
              'Hạn chế ra ngoài vào giữa trưa',
              'Uống nhiều nước',
              'Mặc quần áo thoáng mát',
              'Sử dụng kem chống nắng'
            ]
          }
        };

        const template = alertTemplates[randomType as keyof typeof alertTemplates];
        if (template) {
          alerts.push({
            type: randomType,
            title: template.title,
            description: template.description,
            severity: template.severity,
            startTime: now.toLocaleTimeString('vi-VN'),
            endTime: new Date(now.getTime() + 6 * 60 * 60 * 1000).toLocaleTimeString('vi-VN'),
            area: this.getAreaName(region),
            source: 'Trung tâm Dự báo Khí tượng Thủy văn',
            confidence: 75 + Math.floor(Math.random() * 20),
            recommendations: template.recommendations
          });
        }
      }
    }

    return alerts;
  }

  // Get area name based on region
  private static getAreaName(region: string): string {
    switch (region) {
      case 'north': return 'Miền Bắc';
      case 'central': return 'Miền Trung';
      case 'south': return 'Miền Nam';
      default: return 'Khu vực hiện tại';
    }
  }

  // Analyze disaster risks for the location
  static async getRiskAnalysis(lat: number, lon: number): Promise<any> {
    const region = this.getRegion(lat, lon);
    const seasonalRisks = this.getSeasonalRisks();
    
    // Calculate overall risk score
    const riskValues = Object.values(seasonalRisks);
    const overallScore = Math.round(
      riskValues.reduce((sum, risk) => sum + risk, 0) / riskValues.length
    );

    // Generate historical events (mock data)
    const historicalEvents = this.generateHistoricalEvents(region);

    return {
      location: { lat, lon, region },
      overallScore,
      factors: seasonalRisks,
      historicalEvents,
      lastUpdated: new Date().toISOString(),
      dataSource: 'Tổng cục Khí tượng Thủy văn Việt Nam'
    };
  }

  // Generate mock historical disaster events
  private static generateHistoricalEvents(region: string): any[] {
    const events = [];
    const eventTypes = [
      { type: 'flood', name: 'Lũ lụt', severity: 'Trung bình', impact: 'Nhẹ' },
      { type: 'storm', name: 'Bão số 3', severity: 'Cao', impact: 'Trung bình' },
      { type: 'heavy_rain', name: 'Mưa lớn', severity: 'Thấp', impact: 'Nhẹ' }
    ];

    // Generate 0-3 random events in the last 30 days
    const numEvents = Math.floor(Math.random() * 4);
    
    for (let i = 0; i < numEvents; i++) {
      const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const daysAgo = Math.floor(Math.random() * 30) + 1;
      const eventDate = new Date();
      eventDate.setDate(eventDate.getDate() - daysAgo);
      
      events.push({
        ...randomEvent,
        date: eventDate.toLocaleDateString('vi-VN'),
        region
      });
    }

    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Get disaster preparedness recommendations
  static getPreparednessGuide(disasterType: string): any {
    const guides = {
      flood: {
        before: [
          'Chuẩn bị kế hoạch sơ tán',
          'Dự trữ thực phẩm và nước sạch',
          'Chuẩn bị túi cứu thương',
          'Kiểm tra hệ thống thoát nước'
        ],
        during: [
          'Di chuyển đến nơi cao hơn',
          'Tránh xa dòng nước chảy',
          'Không lái xe qua vùng ngập',
          'Theo dõi thông tin cảnh báo'
        ],
        after: [
          'Kiểm tra thiệt hại',
          'Vệ sinh khử trùng',
          'Báo cáo thiệt hại cho chính quyền',
          'Hỗ trợ người bị nạn'
        ]
      },
      storm: {
        before: [
          'Gia cố cửa sổ, mái nhà',
          'Cắt tỉa cây xanh',
          'Dự trữ đồ dùng thiết yếu',
          'Sạc đầy pin các thiết bị'
        ],
        during: [
          'Ở trong nhà, tránh xa cửa sổ',
          'Không ra ngoài khi bão đổ bộ',
          'Theo dõi tin tức cập nhật',
          'Chuẩn bị sơ cứu'
        ],
        after: [
          'Kiểm tra thiệt hại cẩn thận',
          'Tránh xa dây điện đứt',
          'Dọn dẹp mảnh vỡ',
          'Báo cáo thiệt hại'
        ]
      }
    };

    return guides[disasterType as keyof typeof guides] || null;
  }
}