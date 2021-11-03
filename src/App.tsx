import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { ChatClient } from '@azure/communication-chat';
import {
  CallComposite,
  CallAdapter,
  createAzureCommunicationCallAdapter,
  ChatComposite,
  ChatAdapter,
  createAzureCommunicationChatAdapter
} from '@azure/communication-react';
import React, { useEffect, useMemo, useState } from 'react';
import {CommunicationIdentityClient } from '@azure/communication-identity'
import { unwatchFile } from 'fs';

function App(): JSX.Element {

  //DO NOT DO THIS ON CLIENT CODE. THIS SHOULD BE DONE IN TRUSTED SERVICE
  const endpointUrl = '<Azure Communication Services Resource Endpoint>';
  const connectionString = '';

  const displayName = '<Display Name>';

  const [userId, setUserId] = useState<string>();
  const [credential, setCredential] = useState<AzureCommunicationTokenCredential>();

  //Calling Variables
  //For Group Id, developers can pass any GUID they can generate
  const groupId = '8805799d-0f59-4873-a2d5-b339f26e447c';
  const [callAdapter, setCallAdapter] = useState<CallAdapter>();

  //Chat Variables
  const [threadId, setThreadId] = useState<string>();
  const [chatAdapter, setChatAdapter] = useState<ChatAdapter>();

  //DO NOT DO THIS ON CLIENT CODE. THIS SHOULD BE DONE IN TRUSTED SERVICE
  useEffect(() => {
    const createUser = async (): Promise<void> => {
      const identityClient = new CommunicationIdentityClient(connectionString);
      await identityClient.createUserAndToken(['voip', 'chat']).then( async (res) => {
        setUserId(res.user.communicationUserId);
        setCredential(new AzureCommunicationTokenCredential(res.token));
        if(credential != undefined && userId != undefined){
          let chatClient = new ChatClient(endpointUrl, credential);
          let chatThread = await chatClient.createChatThread(
            {
              topic:"Test Thread"
            },
            {
              participants: [
                {
                  id: {communicationUserId: userId},
                  displayName: displayName
                }
              ]
            }
          ).then((res) => {
            setThreadId(res.chatThread?.id)
          })
        }
      })
    }
    createUser();
  }, []);

  useEffect(() => {
    const createAdapter = async (): Promise<void> => {
      if(credential != undefined && userId != undefined && threadId != undefined){
      setChatAdapter(
        await createAzureCommunicationChatAdapter({
          endpointUrl,
          userId: { communicationUserId: userId },
          displayName,
          credential,
          threadId
        })
      );
      setCallAdapter(
        await createAzureCommunicationCallAdapter({
          userId: { communicationUserId: userId },
          displayName,
          credential,
          locator: { groupId }
        })
      );
      }
    };
    createAdapter();
  }, [credential, userId, threadId]);

  if (!!callAdapter && !!chatAdapter) {
    return (
      <>
        <ChatComposite adapter={chatAdapter} />
        <CallComposite adapter={callAdapter} />
      </>
    );
  }
  if (credential === undefined) {
    return <h3>Failed to construct credential. Provided token is malformed.</h3>;
  }
  return <h3>Initializing...</h3>;
}

export default App;
