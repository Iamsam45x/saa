import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    name: 'SP Associates - AI Software Solution Configurator',
    version: '0.1.0',
    endpoints: {
      projects: {
        create: 'POST /api/projects/create',
        get: 'GET /api/projects/[id]',
        update: 'PUT /api/projects/[id]',
        delete: 'DELETE /api/projects/[id]',
        list: 'GET /api/projects/user/[userId]',
      },
      ai: {
        generateSchema: 'POST /api/ai/generate-schema',
        generateCode: 'POST /api/ai/generate-code',
        regenerate: 'POST /api/ai/regenerate',
      },
      templates: {
        list: 'GET /api/templates',
        get: 'GET /api/templates/[id]',
      },
      export: {
        react: 'POST /api/export/react',
        html: 'POST /api/export/html',
        pdf: 'POST /api/export/pdf',
      },
      components: {
        registry: 'GET /api/components/registry',
      },
    },
  });
}
