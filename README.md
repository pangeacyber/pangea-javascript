<a href="https://pangea.cloud?utm_source=github&utm_medium=node-sdk" target="_blank" rel="noopener noreferrer">
  <img src="https://pangea-marketing.s3.us-west-2.amazonaws.com/pangea-color.svg" alt="Pangea Logo" height="40" />
</a>

<br />

[![documentation](https://img.shields.io/badge/documentation-pangea-blue?style=for-the-badge&labelColor=551B76)](https://pangea.cloud/docs/sdk/js/)
[![Slack](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white)](https://pangea.cloud/join-slack/)

## Welcome

This is the Pangea JavaScript repository.

## Pangea JavaScript Tools

This is a list of tools or useful stuff that you will found out in this repository and their links

- Pangea Node.js SDK [Click here](/packages/pangea-node-sdk)
- List of Pangea JavaScript examples per service [Click here](/examples)

## Repository structure

|- **README.md**: This readme file [Click here](/README.md)  
|- **examples**: SDK examples folder [Clik here](/examples)  
|----- **audit**: Audit service examples [Click here](/examples/audit)  
|----- **authn**: AuthN service examples [Click here](/examples/authn)  
|----- **embargo**: Embargo service examples [Click here](/examples/embargo)  
|----- **intel**: Intel services (IP, File, Domain, URL, User) examples [Click here](/examples/intel)  
|----- **react-audit-log-viewer**: React audit log viewer example [Click here](examples/react-audit-log-viewer)  
|----- **redact**: Redact service examples [Click here](/examples/redact)  
|----- **vault**: Vault service examples [Click here](/examples/vault)  
|- **packages**: Here you will found out all javascript packages (7 available now) [Click here](/packages)  
|----- **pangea-node-sdk**: Node Pangea SDK folder. Also available through `yarn add pangea-node-sdk` or `npm install pangea-node-sdk` [Click here](/packages/pangea-node-sdk)  
|--------- **README.md**: Node Pangea SDK install and usage instructions [Click here](/packages/pangea-node-sdk/README.md)  
|--------- **CHANGELOG.md**: Node SDK version changes tracking [Click here](/packages/pangea-node-sdk/CHANGELOG.md)  
|----- **react-auth**: React Auth component [Click here](/packages/react-auth/)  
|----- **react-mui-audit-log-viewer**: React Audit log viewer [Click here](/packages/react-mui-audit-log-viewer/)  
|----- **react-mui-authn**: React Authn component [Click here](/packages/react-mui-authn/)  
|----- **react-mui-branding**: React branding component [Click here](/packages/react-mui-branding/)  
|----- **react-mui-shared**: React shared components [Click here](/packages/react-mui-shared/)  
|----- **vanilla-js**: Vanilla JS SDK [Click here](/packages/vanilla-js/)

## Development Setup

When contributing to this repository, run the following commands to enable git pre-commit linting

```
% yarn install
% yarn prepare
```
