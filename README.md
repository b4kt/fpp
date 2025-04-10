## About
An intermediary between your browser and sites, hiding real traffic behind domains

V2 Stable released - 4/9/25

## Implementation

- Custom search engines
- New tab toggle
- Fullscreen embedded default view
- Future proof with multiple protocols selectable
- Encrypted paths, ensuring no snooping server side
- Tab Disguises
- Fresh look
- Restart countdown
  
## Backend credits/License
[AGPL 3.0](https://github.com/chemicaljs/chemical)

## Default configuration
- Libcurl (epoxy support and recommended) by default for compatibility
- Port 3000 (recommend changing to 80 for forward facing)

## Considerations
- Chrome for android is not supported because it does not support shared workers
- Some firefox clients may work, still needs testing

## Self-Hosting (Best run on Ubuntu 24.04 + Node 22)
- Git clone the repository
- Go to it (cd /fpp)
- npm install
- npm update
- npm upgrade
- npm start

## Containerized hosting

- Fork repository
- Connect to PaaS (platform as a service)
- Deploy (should build itself and spit out a integrated domain)
- Connect your domains to your PaaS using cloudflare (or not), and configure firewall rules

