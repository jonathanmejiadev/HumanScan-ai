import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { AnalysisResult } from '@/types/analysis';
import { UserProfile } from '@/types/user';
import { MODULES } from '@/constants/modules';

export const PDFService = {
  generateHistoryReport: async (results: AnalysisResult[], user: UserProfile | null) => {
    const date = new Date().toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const userName = user?.nombre || 'Paciente';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reporte Médico HumanScan</title>
        <style>
          body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            color: #1F2937;
            padding: 40px;
            line-height: 1.6;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #3B82F6;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo-area {
            color: #3B82F6;
            font-size: 24px;
            font-weight: bold;
          }
          .patient-info {
            text-align: right;
          }
          .patient-info h2 {
            margin: 0;
            color: #111827;
            font-size: 18px;
          }
          .patient-info p {
            margin: 4px 0;
            color: #4B5563;
            font-size: 14px;
          }
          .report-title {
            text-align: center;
            margin-bottom: 40px;
          }
          .report-title h1 {
            font-size: 22px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #111827;
          }
          .analysis-item {
            border: 1px solid #E5E7EB;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
            page-break-inside: avoid;
          }
          .analysis-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            border-bottom: 1px solid #F3F4F6;
            padding-bottom: 8px;
          }
          .analysis-type {
            font-weight: bold;
            color: #3B82F6;
          }
          .analysis-date {
            color: #4B5563;
            font-size: 12px;
          }
          .analysis-content {
            display: flex;
            gap: 20px;
          }
          .analysis-image {
            width: 120px;
            height: 120px;
            border-radius: 8px;
            object-fit: cover;
            background-color: #F9FAFB;
          }
          .analysis-details {
            flex: 1;
          }
          .result-label {
            font-size: 12px;
            color: #4B5563;
            text-transform: uppercase;
            margin-bottom: 4px;
          }
          .result-value {
            font-size: 15px;
            font-weight: 500;
            margin-bottom: 12px;
          }
          .risk-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .risk-Bajo { background: #DCFCE7; color: #15803D; }
          .risk-Medio { background: #FEF9C3; color: #854D0E; }
          .risk-Alto { background: #FEE2E2; color: #B91C1C; }
          .risk-Emergencia { background: #7F1D1D; color: #FFFFFF; }
          
          .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #E5E7EB;
            text-align: center;
            font-size: 12px;
            color: #4B5563;
          }
          .disclaimer {
            font-style: italic;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo-area">HumanScan AI</div>
          <div class="patient-info">
            <h2>${userName}</h2>
            <p>Edad: ${user?.edad || '--'} años | Sexo: ${user?.sexo || '--'}</p>
            <p>Fecha de Reporte: ${date}</p>
          </div>
        </div>

        <div class="report-title">
          <h1>Reporte de Historial de Análisis</h1>
        </div>

        <div class="content">
          ${results.map(item => {
      const moduleInfo = MODULES[item.scanType];
      const itemDate = new Date(item.timestamp).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      let mainTitle = '';
      let mainResult = '';
      let interpretation = '';
      let risk = (item as any).triaje_riesgo || 'N/A';

      if (item.scanType === 'medication') {
        mainTitle = 'Identificación de Medicamento';
        mainResult = (item as any).nombre_detectado;
        interpretation = (item as any).para_que_sirve;
      } else if (item.scanType === 'nutrition') {
        mainTitle = 'Análisis Nutricional';
        mainResult = (item as any).nombre_plato;
        interpretation = (item as any).analisis_breve;
      } else if (item.scanType === 'lab_results') {
        mainTitle = 'Resultados de Laboratorio';
        mainResult = (item as any).tipo_estudio;
        interpretation = (item as any).resumen_medico;
      } else {
        mainTitle = `Análisis Bio-Visual: ${moduleInfo.name}`;
        mainResult = (item as any).hallazgos_principales?.join(', ') || 'Sin hallazgos específicos';
        interpretation = (item as any).descripcion_tecnica;
      }

      return `
              <div class="analysis-item">
                <div class="analysis-header">
                  <span class="analysis-type">${mainTitle}</span>
                  <span class="analysis-date">${itemDate}</span>
                </div>
                <div class="analysis-content">
                  ${item.imageUri ? `<img src="${item.imageUri}" class="analysis-image" />` : ''}
                  <div class="analysis-details">
                    <div class="result-label">Hallazgo / Producto</div>
                    <div class="result-value">${mainResult}</div>
                    
                    <div class="result-label">Interpretación de IA</div>
                    <div class="result-value">${interpretation}</div>
                    
                    ${risk !== 'N/A' ? `
                      <div class="result-label">Nivel de Riesgo</div>
                      <div class="risk-badge risk-${risk}">${risk}</div>
                    ` : ''}
                  </div>
                </div>
              </div>
            `;
    }).join('')}
        </div>

        <div class="footer">
          <p>Este reporte ha sido generado automáticamente por HumanScan AI Engine.</p>
          <p class="disclaimer"><strong>AVISO LEGAL:</strong> Los resultados mostrados son generados por Inteligencia Artificial y tienen un propósito puramente informativo. Este documento NO sustituye un diagnóstico médico profesional. Por favor, consulte a su médico de cabecera para una evaluación formal.</p>
        </div>
      </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      console.error('Error generating or sharing PDF:', error);
      throw error;
    }
  }
};
