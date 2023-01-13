import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function generateOpenApiConfig(app: INestApplication) {
  const openApiConfig = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('CodeMania API Services')
    .setDescription(
      'This is the API Documentation that describes the REST endpoints for the CodeMania Application',
    )
    .setVersion('1.0')
    .setContact(
      'Olagunju AbdulRahman',
      'https://github.com/abdul-rahman',
      'olagunjurahman@gmail.com',
    )
    .setLicense('CodeMania', 'https://codemania.com')
    .setTermsOfService('https://codemania.com')
    .setBasePath('http://localhost:3000/api/v1')
    .build();

  const document = SwaggerModule.createDocument(app, openApiConfig);
  SwaggerModule.setup('/api/v1/doc', app, document);
}
