# Chat Calling Sample
現在こちらのサンプルで実装されているUI/UXとは異なりますが、以下は活用シナリオのイメージになります。
![image](https://user-images.githubusercontent.com/4012388/140258564-06a074dd-8402-412c-8cdd-b758cd2f5055.png)

# デプロイ方法
## Before running the sample for the first time
1. Open an instance of PowerShell, Windows Terminal, Command Prompt or equivalent and navigate to the directory that you'd like to clone the sample to.
2. `git clone https://github.com/rukasakurai/chat-calling-sample.git`
3. Get the `Endpoint` and `Connection String` from the Azure portal. For more information on connection strings, see [Create an Azure Communication Resources](https://docs.microsoft.com/azure/communication-services/quickstarts/create-communication-resource)
4. Once you get the `Endpoint` and `Connection String`, add them to the **src/App.tsx** file

## Locally deploying the sample app
1. cd chat-calling-sample
2. npm install
3. npm run build
4. npm run start

## Publish to Azure
1. Right click the project and select Publish.
2. Create a new publish profile and select your app name, Azure subscription, resource group and etc.

## Issues
If you run into issues deploying the sample, please feel free to submit a GitHub issue or contact me directly
