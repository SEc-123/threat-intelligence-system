# Threat Intelligence System

## Overview
This project is a threat intelligence system designed to collect, analyze, and manage vulnerability data from multiple sources.

## Features
- Vulnerability data collection from Aliyun and NVD
- Data deduplication based on CVE ID and CVSS Score
- RESTful API for querying and managing data
- Scheduled tasks for automatic data updates

## Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables (see `.env.example`)
4. Start the server: `npm run start`

## Usage
- Access the API at `http://localhost:3000/api/v1`
- Use the provided Swagger documentation for API details

## Configuration
Copy `.env.example` to `.env` and set the following variables:
- `DATABASE_URL`: Your database connection string
- `API_KEY`: Your API key for external services

## Contributing
Contributions are welcome! Please follow our [Contribution Guidelines](CONTRIBUTING.md).

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
